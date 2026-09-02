import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  prefersReducedMotion,
  SCREEN_TRANSITION_DURATION,
  ScreenTransition,
} from "../app/page";

function stage(key, direction = "forward") {
  return (
    <ScreenTransition transitionKey={key} direction={direction}>
      <div data-testid="screen-content">{key}</div>
    </ScreenTransition>
  );
}

describe("screen transitions", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("slides forward and removes the outgoing page after the transition", () => {
    vi.useFakeTimers();
    const { rerender } = render(stage("landing"));

    rerender(stage("cover", "forward"));

    expect(document.querySelector(".screen-transition-layer--exiting-forward")).toBeInTheDocument();
    expect(document.querySelector(".screen-transition-layer--entering-forward")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(SCREEN_TRANSITION_DURATION);
    });

    expect(document.querySelector(".screen-transition-layer--outgoing")).not.toBeInTheDocument();
  });

  it("uses the reverse slide direction when navigating back", () => {
    const { rerender } = render(stage("cover"));

    rerender(stage("landing", "back"));

    expect(document.querySelector(".screen-transition-layer--exiting-back")).toBeInTheDocument();
    expect(document.querySelector(".screen-transition-layer--entering-back")).toBeInTheDocument();
  });

  it("does not create transition layers when reduced motion is preferred", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
    expect(prefersReducedMotion()).toBe(true);

    const { rerender } = render(stage("question:0"));
    rerender(stage("question:1", "forward"));

    expect(document.querySelector(".screen-transition-layer--outgoing")).not.toBeInTheDocument();
  });
});
