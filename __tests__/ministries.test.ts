import { generateStaticParams, generateMetadata } from "@/app/ministries/[slug]/page";
import { ministries } from "@/data/ministries";

describe("ministry slug handling", () => {
  it("generates one static route for every ministry", () => {
    expect(generateStaticParams()).toEqual(
      ministries.map((ministry) => ({ slug: ministry.id }))
    );
  });

  it("builds metadata for a known ministry", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "yofic" }),
    });
    expect(metadata.title).toBe("YOFIC");
    expect(metadata.description).toContain("Youth of Faith in Christ");
  });

  it("returns empty metadata for an unknown slug", async () => {
    await expect(
      generateMetadata({ params: Promise.resolve({ slug: "does-not-exist" }) })
    ).resolves.toEqual({});
  });
});
