import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Home from "../app/page";

describe("quiz flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  it("moves through the English onboarding into section one", async () => {
    render(<Home />);

    fireEvent.click(await screen.findByRole("button", { name: "ENG" }));
    expect(await screen.findByText("Who will live here?")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Enter" }));
    expect(await screen.findByText("Introduction")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Next/ }));
    expect(await screen.findByText("15 questions")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Begin/ }));
    expect(await screen.findByText("Identity & Self-Perception")).toBeInTheDocument();
  });

  it("restores saved quiz progress from local storage", async () => {
    window.localStorage.setItem(
      "pteah-silapak-quiz-v1",
      JSON.stringify({
        language: "en",
        screen: "question",
        currentIndex: 0,
        answers: { q1: "q1-a" },
      }),
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("What word would people close to you use to describe you?")).toBeInTheDocument();
    });
    expect(screen.getByRole("radio", { name: "Curious" })).toBeChecked();
  });
});
