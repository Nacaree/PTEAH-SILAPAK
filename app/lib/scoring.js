import { characterIds, questions } from "../data/quizData";

export function getScores(answers, questionList = questions) {
  const scores = Object.fromEntries(characterIds.map((id) => [id, 0]));

  questionList.forEach((question) => {
    const selectedId = answers[question.id];
    const selected = question.options.find((option) => option.id === selectedId);
    if (selected && Object.hasOwn(scores, selected.characterId)) {
      scores[selected.characterId] += 1;
    }
  });

  return scores;
}

export function getWinner(answers, questionList = questions) {
  const scores = getScores(answers, questionList);
  const highest = Math.max(...Object.values(scores));
  const tied = characterIds.filter((id) => scores[id] === highest);

  if (tied.length === 1) return { winnerId: tied[0], scores };

  for (let index = Math.min(13, questionList.length - 1); index >= 0; index -= 1) {
    const question = questionList[index];
    const selected = question.options.find((option) => option.id === answers[question.id]);
    if (selected && tied.includes(selected.characterId)) {
      return { winnerId: selected.characterId, scores };
    }
  }

  return { winnerId: tied[0], scores };
}

export function isQuizComplete(answers, questionList = questions) {
  return questionList.every((question) => Boolean(answers[question.id]));
}
