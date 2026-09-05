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
    expect(await screen.findByRole("heading", { name: /Find\s+your\s+creative\s+room/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Enter" }));
    expect(await screen.findByText("Introduction")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Next/ }));
    expect(await screen.findByText(/15 questions/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Begin/ }));
    expect(await screen.findByText(/Identity & Self\s*-\s*Perception/)).toBeInTheDocument();
  });

  it("restores saved quiz progress from local storage", async () => {
    window.localStorage.setItem(
      "pteah-silapak-quiz-v2",
      JSON.stringify({
        language: "en",
        screen: "question",
        currentIndex: 0,
        answers: { q1: "q1-a" },
      }),
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("What word fits you best?")).toBeInTheDocument();
    });
    expect(screen.getByRole("radio", { name: /Reliable/ })).toBeChecked();
  });

  it("offers the complete Khmer onboarding and first question", async () => {
    render(<Home />);

    fireEvent.click(await screen.findByRole("button", { name: "KH" }));
    expect(await screen.findByText("ស្វែងរកបន្ទប់ច្នៃប្រឌិតរបស់អ្នក")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "ចូល" }));
    expect(await screen.findByText("សេចក្តីផ្តើម")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /បន្ទាប់/ }));
    fireEvent.click(screen.getByRole("button", { name: /ចាប់ផ្តើម/ }));
    expect(await screen.findByText("អត្តសញ្ញាណ និងការមើលឃើញខ្លួនឯង")).toBeInTheDocument();
  });
});
