import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getImageLoadingProps, optimizedAssets } from "../app/page";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const assetUrls = [
  optimizedAssets.logo,
  optimizedAssets.wordmark,
  optimizedAssets.whiteLogo,
  optimizedAssets.keyholes,
  optimizedAssets.pattern,
  ...Object.values(optimizedAssets.cover),
];

function localPath(url) {
  return `${projectRoot}/public${url}`;
}

describe("optimized artwork", () => {
  it("uses unique WebP files that exist in public assets", () => {
    expect(new Set(assetUrls).size).toBe(assetUrls.length);
    assetUrls.forEach((url) => {
      expect(url).toMatch(/\.webp$/);
      expect(existsSync(localPath(url))).toBe(true);
    });
  });

  it("keeps the intro artwork payload small", () => {
    const totalBytes = assetUrls.reduce((total, url) => total + statSync(localPath(url)).size, 0);
    expect(totalBytes).toBeLessThan(1.5 * 1024 * 1024);
  });

  it("uses asynchronous decoding and prioritizes the key artwork", () => {
    expect(getImageLoadingProps(true)).toEqual({
      loading: "eager",
      decoding: "async",
      fetchPriority: "high",
    });
    expect(getImageLoadingProps(false)).toEqual({
      loading: "eager",
      decoding: "async",
      fetchPriority: "auto",
    });
  });
});
