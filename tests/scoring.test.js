import { describe, expect, it } from "vitest";
import { characterIds, questions } from "../app/data/quizData";
import { getScores, getWinner, isQuizComplete } from "../app/lib/scoring";

function answerFor(characterId, question) {
  return question.options.find((option) => option.characterId === characterId).id;
}

describe("character scoring", () => {
  it("gives one point to the character attached to each answer", () => {
    const answers = {
      q1: answerFor("vitou", questions[0]),
      q2: answerFor("anita", questions[1]),
    };

    expect(getScores(answers)).toMatchObject({ vitou: 1, anita: 1, tohla: 0, kimly: 0, mc: 0 });
  });

  it("replaces the previous point when an answer changes", () => {
    const before = { q1: answerFor("vitou", questions[0]) };
    const after = { q1: answerFor("tohla", questions[0]) };

    expect(getScores(before).vitou).toBe(1);
    expect(getScores(after)).toMatchObject({ vitou: 0, tohla: 1 });
  });

  it("returns a clear highest-scoring character", () => {
    const answers = Object.fromEntries(
      questions.map((question) => [question.id, answerFor("vitou", question)]),
    );

    expect(getWinner(answers).winnerId).toBe("vitou");
    expect(isQuizComplete(answers)).toBe(true);
  });

  it("breaks a tie by scanning question 14 backward and ignoring question 15", () => {
    const answers = Object.fromEntries(
      questions.map((question, index) => [
        question.id,
        answerFor(characterIds[index % characterIds.length], question),
      ]),
    );

    expect(getScores(answers)).toEqual({ vitou: 3, anita: 3, tohla: 3, kimly: 3, mc: 3 });
    expect(getWinner(answers).winnerId).toBe("kimly");
  });
});
