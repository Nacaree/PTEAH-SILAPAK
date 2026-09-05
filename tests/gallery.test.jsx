import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "../app/page";
import { copy } from "../app/data/content";
import { characters, questions } from "../app/data/quizData";
import { getRankedResults } from "../app/lib/scoring";

const storageKey = "pteah-silapak-quiz-v2";
const answers = Object.fromEntries(questions.map((question, index) => [
  question.id,
  question.options.find((option) => option.characterId === (index < 9 ? "anita" : "kimly")).id,
]));

function saveResult(language = "en", savedScreen = "result") {
  window.localStorage.setItem(storageKey, JSON.stringify({
    language, screen: savedScreen, currentIndex: 14, answers,
  }));
}

async function openGallery(language = "en") {
  fireEvent.click(await screen.findByRole("button", { name: copy[language].meetCharacters }));
  return screen.findByRole("tablist", { name: copy[language].characterNavigation });
}

describe("character gallery", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each(["en", "km"])("shows every full profile in %s with the completed ranking", async (language) => {
    saveResult(language);
    render(<Home />);
    const tabs = within(await openGallery(language)).getAllByRole("tab");
    const ranking = getRankedResults(answers);

    expect(tabs).toHaveLength(5);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { level: 1, name: copy[language].galleryTitle })).toHaveFocus();

    ranking.forEach((match, index) => {
      const character = characters[match.characterId];
      expect(tabs[index]).toHaveTextContent(character.name[language]);
      expect(tabs[index]).toHaveTextContent(`${match.percentage.toFixed(1)}%`);
      fireEvent.click(tabs[index]);

      const panel = screen.getByRole("tabpanel");
      expect(tabs[index]).toHaveAttribute("aria-selected", "true");
      expect(tabs[index]).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-labelledby", tabs[index].id);
      expect(within(panel).getByRole("heading", { name: character.name[language] })).toBeInTheDocument();
      expect(within(panel).getByRole("img", { name: character.name[language] })).toHaveAttribute("src", character.image);
      ["archetype", "summary", "strength", "challenge", "hiddenFear", "traits"].forEach((field) => {
        expect(panel).toHaveTextContent(character[field][language]);
      });
    });
    expect(JSON.parse(window.localStorage.getItem(storageKey))).toEqual({ language, screen: "result", currentIndex: 14, answers });
  });

  it("opens from the final quiz answer and preserves the winner, answers, and share URL after browsing", async () => {
    saveResult("en", "question");
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...window.navigator, clipboard: { writeText } });
    render(<Home />);
    fireEvent.click(await screen.findByRole("button", { name: copy.en.meetMatch }));
    expect(window.location.search).toBe("?result=anita");

    const tablist = await openGallery();
    fireEvent.click(within(tablist).getByRole("tab", { name: /Kimly/ }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent(characters.kimly.traits.en);
    expect(window.location.search).toBe("?result=anita");

    fireEvent.click(screen.getByRole("button", { name: copy.en.backToResult }));
    expect(screen.getByRole("heading", { level: 1, name: "Anita" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: copy.en.meetCharacters })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: copy.en.share }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Anita"));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining(`${window.location.origin}/?result=anita`));
    expect(JSON.parse(window.localStorage.getItem(storageKey)).answers).toEqual(answers);

    await openGallery();
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("Anita");
  });

  it("lets shared-link visitors browse without exposing scores from a saved quiz", async () => {
    saveResult();
    const saved = window.localStorage.getItem(storageKey);
    window.history.replaceState({}, "", "/?result=vitou");
    render(<Home />);
    const tablist = await openGallery();
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs).toHaveLength(5);
    expect(tabs[0]).toHaveTextContent("Vitou");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tablist).not.toHaveTextContent("%");

    fireEvent.click(tabs[1]);
    expect(screen.getByRole("tabpanel")).not.toHaveTextContent("%");
    fireEvent.click(screen.getByRole("button", { name: copy.en.backToSharedResult }));
    expect(screen.getByRole("heading", { level: 1, name: "Vitou" })).toBeInTheDocument();
    expect(screen.getByText(copy.en.sharedResult)).toBeInTheDocument();
    expect(window.location.search).toBe("?result=vitou");
    expect(window.localStorage.getItem(storageKey)).toBe(saved);
  });

  it("supports roving focus, arrow wraparound, Home, and End without screen transitions", async () => {
    saveResult();
    render(<Home />);
    const tabs = within(await openGallery()).getAllByRole("tab");
    const panel = screen.getByRole("tabpanel");
    const currentLayer = panel.closest(".screen-transition-layer--current");
    tabs[0].focus();

    const steps = [[0, "ArrowLeft", 4], [4, "ArrowRight", 0], [0, "End", 4], [4, "Home", 0], [0, "ArrowRight", 1]];
    for (const [from, key, to] of steps) {
      fireEvent.keyDown(tabs[from], { key });
      expect(tabs[to]).toHaveFocus();
      expect(tabs[to]).toHaveAttribute("aria-selected", "true");
      expect(tabs[to]).toHaveAttribute("tabindex", "0");
      expect(tabs.filter((tab) => tab.tabIndex === 0)).toHaveLength(1);
      expect(screen.getByRole("tabpanel").closest(".screen-transition-layer--current")).toBe(currentLayer);
    }
  });

  it("uses forward and reverse transitions only when entering and leaving the gallery", async () => {
    window.matchMedia.mockReturnValue({ matches: false });
    saveResult();
    render(<Home />);
    const tabs = within(await openGallery()).getAllByRole("tab");
    expect(document.querySelector(".screen-transition-layer--entering-forward")).toBeInTheDocument();
    expect(document.querySelector(".screen-transition-layer--outgoing")).toHaveAttribute("inert");
    await waitFor(() => expect(document.querySelector(".screen-transition-layer--outgoing")).not.toBeInTheDocument());
    fireEvent.click(tabs[1]);
    expect(document.querySelector(".screen-transition-layer--outgoing")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: copy.en.backToResult }));
    expect(document.querySelector(".screen-transition-layer--entering-back")).toBeInTheDocument();
  });

  it("returns home and retakes the quiz without carrying over the browsed character", async () => {
    saveResult();
    render(<Home />);
    fireEvent.click(within(await openGallery()).getByRole("tab", { name: /Kimly/ }));
    fireEvent.click(screen.getByRole("button", { name: copy.en.backToResult }));
    fireEvent.click(screen.getByRole("button", { name: copy.en.backHome }));
    expect(screen.queryByRole("button", { name: copy.en.meetCharacters })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: copy.en.resume }));
    await openGallery();
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("Anita");
    fireEvent.click(screen.getByRole("button", { name: copy.en.backToResult }));
    fireEvent.click(screen.getByRole("button", { name: copy.en.retake }));
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(storageKey)).answers).toEqual({});
    expect(window.location.search).toBe("");
  });

  it("returns to the result on reload instead of persisting gallery selection", async () => {
    saveResult();
    const { unmount } = render(<Home />);
    fireEvent.click(within(await openGallery()).getByRole("tab", { name: /Kimly/ }));
    unmount();
    render(<Home />);
    expect(await screen.findByRole("heading", { level: 1, name: "Anita" })).toBeInTheDocument();
    await openGallery();
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("Anita");
  });

  it("shares the result through the native share sheet when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share });
    saveResult();
    render(<Home />);
    fireEvent.click(await screen.findByRole("button", { name: copy.en.share }));

    await waitFor(() => expect(share).toHaveBeenCalledWith({
      title: "Anita — Pteah Silapak",
      text: expect.stringContaining("Anita"),
      url: `${window.location.origin}/?result=anita`,
    }));
    expect(share.mock.calls[0][0].text).not.toContain("Instagram");
    expect(screen.getByRole("button", { name: copy.en.shared })).toBeInTheDocument();
  });

  it("falls back to a prompt when native sharing and clipboard access are unavailable", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    const prompt = vi.spyOn(window, "prompt").mockReturnValue("");
    saveResult();
    render(<Home />);
    fireEvent.click(await screen.findByRole("button", { name: copy.en.share }));

    await waitFor(() => expect(prompt).toHaveBeenCalledWith(copy.en.copyPrompt, expect.stringContaining("?result=anita")));
  });
});
