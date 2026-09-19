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

  it("uses the compiled-in default cloud name when the env var is unset", () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const url = cloudinaryLoader(props("/images/gallery/DSC01524.jpg"));
    expect(url).toContain("https://res.cloudinary.com/hurqcssn/image/upload/");
  });
});
