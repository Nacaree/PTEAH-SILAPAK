import { describe, expect, it } from "vitest";
import { characterIds, questions, sections } from "../app/data/quizData";

describe("quiz data", () => {
  it("has the agreed 5, 3, 4, 2, 1 section structure", () => {
    const counts = sections.map(
      (section) => questions.filter((question) => question.sectionId === section.id).length,
    );

    expect(counts).toEqual([5, 3, 4, 2, 1]);
    expect(questions).toHaveLength(15);
  });

  it("maps every question to each character exactly once", () => {
    questions.forEach((question) => {
      expect(question.options).toHaveLength(5);
      expect(question.options.map((option) => option.characterId).sort()).toEqual(
        [...characterIds].sort(),
      );
    });
  });

  it("uses unique question and answer identifiers", () => {
    const questionIds = questions.map((question) => question.id);
    const answerIds = questions.flatMap((question) => question.options.map((option) => option.id));

    expect(new Set(questionIds).size).toBe(questionIds.length);
    expect(new Set(answerIds).size).toBe(answerIds.length);
  });

  it("includes complete English and Khmer content for every section and question", () => {
    sections.forEach((section) => {
      expect(section.title.en).toBeTruthy();
      expect(section.title.km).toBeTruthy();
      expect(section.subtitle.en).toBeTruthy();
      expect(section.subtitle.km).toBeTruthy();
    });

    questions.forEach((question) => {
      expect(question.prompt.en).toBeTruthy();
      expect(question.prompt.km).toBeTruthy();
      question.options.forEach((option) => {
        expect(option.text.en).toBeTruthy();
        expect(option.text.km).toBeTruthy();
      });
    });
  });
});
