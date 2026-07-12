import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
