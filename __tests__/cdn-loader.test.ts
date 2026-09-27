import { cloudinaryLoader } from "@/lib/cdn/cloudinary-loader";

const ORIGINAL_ENV = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

afterEach(() => {
  if (ORIGINAL_ENV === undefined) delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  else process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = ORIGINAL_ENV;
});

describe("cloudinaryLoader", () => {
  const props = (src: string, width = 640) => ({ src, width, quality: 75 });

  it("maps local /images paths to optimized Cloudinary delivery URLs", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "hurqcssn";
    const url = cloudinaryLoader(props("/images/gallery/DSC01524.jpg", 1080));
    expect(url).toBe(
      "https://res.cloudinary.com/hurqcssn/image/upload/f_auto,q_75,c_limit,w_1080/gallery/DSC01524",
    );
  });

  it("URI-encodes folders and filenames with spaces", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "hurqcssn";
    const url = cloudinaryLoader(props("/images/Blessing conference/DSC_8729.jpg"));
    expect(url).toContain("/Blessing%20conference/DSC_8729");
    expect(url).not.toContain(" ");
  });

  it("strips the file extension from the public id", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "hurqcssn";
    expect(cloudinaryLoader(props("/images/logo/logo crop.jpg"))).not.toContain(".jpg");
  });

  it("routes remote http(s) sources through Cloudinary fetch with optimization", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "hurqcssn";
    const url = cloudinaryLoader(props("https://images.unsplash.com/photo-123?w=800"));
    expect(url).toContain("https://res.cloudinary.com/hurqcssn/image/fetch/");
    expect(url).toContain(encodeURIComponent("https://images.unsplash.com/photo-123?w=800"));
  });

  it("emits a Cloudinary version segment when the source carries ?v=", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "hurqcssn";
    const url = cloudinaryLoader(props("/images/pastors/pastor mrs.jpeg?v=1790436693", 750));
    expect(url).toBe(
      "https://res.cloudinary.com/hurqcssn/image/upload/f_auto,q_75,c_limit,w_750/v1790436693/pastors/pastor%20mrs",
    );
    // The cache-buster itself must not leak into the public id.
    expect(url).not.toContain("?v=");
  });

  it("changes the URL when the version changes, so overwrites bust caches", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "hurqcssn";
    const before = cloudinaryLoader(props("/images/pastors/pastor mrs.jpeg?v=1"));
    const after = cloudinaryLoader(props("/images/pastors/pastor mrs.jpeg?v=2"));
    expect(before).not.toBe(after);
    expect(before).toContain("/v1/");
    expect(after).toContain("/v2/");
  });

  it("ignores a version query that is not numeric", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "hurqcssn";
    const url = cloudinaryLoader(props("/images/logo/logo crop.jpg?v=nope"));
    expect(url).toBe(
      "https://res.cloudinary.com/hurqcssn/image/upload/f_auto,q_75,c_limit,w_640/logo/logo%20crop",
    );
  });

  it("keeps the query string intact on remote fetch sources", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "hurqcssn";
    const url = cloudinaryLoader(props("https://images.unsplash.com/photo-123?w=800"));
    expect(url).toContain(encodeURIComponent("https://images.unsplash.com/photo-123?w=800"));
  });

  it("uses the compiled-in default cloud name when the env var is unset", () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const url = cloudinaryLoader(props("/images/gallery/DSC01524.jpg"));
    expect(url).toContain("https://res.cloudinary.com/hurqcssn/image/upload/");
  });
});
