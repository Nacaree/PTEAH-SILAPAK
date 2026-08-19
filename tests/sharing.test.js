import { describe, expect, it } from "vitest";
import { getShareUrl } from "../app/lib/sharing";

describe("result sharing", () => {
  it("shares only the winning character", () => {
    const url = getShareUrl("anita", "https://quiz.example", "/play");

    expect(url).toBe("https://quiz.example/play?result=anita");
    expect(url).not.toContain("q1");
    expect(url).not.toContain("answers");
  });
});
