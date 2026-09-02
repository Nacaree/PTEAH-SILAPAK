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

function getTiePriority(answers, tiedIds, questionList) {
  const priority = [];

  for (let index = Math.min(13, questionList.length - 1); index >= 0; index -= 1) {
    const question = questionList[index];
    const selected = question.options.find((option) => option.id === answers[question.id]);
    if (
      selected &&
      tiedIds.includes(selected.characterId) &&
      !priority.includes(selected.characterId)
    ) {
      priority.push(selected.characterId);
    }
  }

  tiedIds.forEach((id) => {
    if (!priority.includes(id)) priority.push(id);
  });

  return priority;
}

export function getRankedResults(answers, questionList = questions) {
  const scores = getScores(answers, questionList);
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const groupedByScore = new Map();

  characterIds.forEach((id) => {
    const score = scores[id];
    const group = groupedByScore.get(score) || [];
    group.push(id);
    groupedByScore.set(score, group);
  });

  const orderedIds = [...groupedByScore.keys()]
    .sort((a, b) => b - a)
    .flatMap((score) => getTiePriority(answers, groupedByScore.get(score), questionList));

  return orderedIds.map((characterId, index) => ({
    characterId,
    rank: index + 1,
    score: scores[characterId],
    percentage: total ? Math.round((scores[characterId] / total) * 1000) / 10 : 0,
  }));
}

export function getWinner(answers, questionList = questions) {
  const ranking = getRankedResults(answers, questionList);
  return {
    winnerId: ranking[0].characterId,
    runnerUpId: ranking[1].characterId,
    scores: Object.fromEntries(ranking.map((result) => [result.characterId, result.score])),
    ranking,
  };
}

export function getPreviewAnswers(characterId, questionList = questions) {
  return Object.fromEntries(
    questionList.flatMap((question) => {
      const option = question.options.find((item) => item.characterId === characterId);
      return option ? [[question.id, option.id]] : [];
    }),
  );
}

export function getPreviewRanking(characterId, questionList = questions, runnerUpId = null) {
  const ranking = getRankedResults(getPreviewAnswers(characterId, questionList), questionList);
  if (!runnerUpId || runnerUpId === characterId || !characterIds.includes(runnerUpId)) {
    return ranking;
  }

  const runnerUpIndex = ranking.findIndex((result) => result.characterId === runnerUpId);
  if (runnerUpIndex < 1) return ranking;

  const reordered = [
    ranking[0],
    ranking[runnerUpIndex],
    ...ranking.slice(1, runnerUpIndex),
    ...ranking.slice(runnerUpIndex + 1),
  ];

  return reordered.map((result, index) => ({ ...result, rank: index + 1 }));
}

export function isQuizComplete(answers, questionList = questions) {
  return questionList.every((question) => Boolean(answers[question.id]));
}
