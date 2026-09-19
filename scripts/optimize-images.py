"""Conservatively optimize tracked JPEG assets without changing their paths.

Usage:
  python3 scripts/optimize-images.py

Images are resized to a maximum 2400px edge and re-encoded at JPEG quality 82.
A source is replaced only when the optimized file is smaller, so rerunning this
script is safe and idempotent. Keep originals in Git history when reviewing the
visual result of a broad asset rewrite.
"""

from pathlib import Path
import os
import tempfile

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "images"
MAX_EDGE = 2400
JPEG_QUALITY = 82

processed = 0
replaced = 0
before_bytes = 0
after_bytes = 0

for path in ROOT.rglob("*"):
    if path.suffix.lower() not in {".jpg", ".jpeg"}:
        continue

    before_size = path.stat().st_size
    before_bytes += before_size
    temp_path = None

    try:
        with Image.open(path) as source:
            source.load()
            image = source.convert("RGB")
            image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)

            fd, temp_name = tempfile.mkstemp(suffix=path.suffix, dir=path.parent)
            os.close(fd)
            temp_path = Path(temp_name)
            image.save(
                temp_path,
                format="JPEG",
                quality=JPEG_QUALITY,
                optimize=True,
                progressive=True,
            )

        processed += 1
        if temp_path.stat().st_size < before_size:
            os.replace(temp_path, path)
            replaced += 1
    except Exception as error:
        print(f"SKIP {path}: {error}")
    finally:
        if temp_path and temp_path.exists():
            temp_path.unlink()

    after_bytes += path.stat().st_size

print(
    f"processed={processed} replaced={replaced} "
    f"before={before_bytes} after={after_bytes} saved={before_bytes - after_bytes}"
)
