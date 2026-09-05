import { describe, expect, it } from "vitest";
import { buildSharePayload, getShareUrl } from "../app/lib/sharing";

describe("result sharing", () => {
  it("shares only the winning character", () => {
    const url = getShareUrl("anita", "https://quiz.example", "/play");

    expect(url).toBe("https://quiz.example/play?result=anita");
    expect(url).not.toContain("q1");
    expect(url).not.toContain("answers");
  });

  it("builds a rich result share payload without personal links", () => {
    const payload = buildSharePayload({
      characterName: "Anita",
      summary: "You're dependable and caring.",
      resultUrl: "https://quiz.example/play?result=anita",
    });

    expect(payload).toEqual({
      title: "Anita — Pteah Silapak",
      text: "Anita\nYou're dependable and caring.",
      url: "https://quiz.example/play?result=anita",
    });
  });
});
