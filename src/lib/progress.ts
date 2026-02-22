const STORAGE_KEY = 'thai-alphabet-progress-v1';

export type QuizLetterStat = {
  correct: number;
  wrong: number;
  lastSeenAt: string;
};

export type ProgressState = {
  learnedLetterIds: string[];
  includeObsoleteInQuiz: boolean;
  quizStatsByLetter: Record<string, QuizLetterStat>;
};

const defaultProgress: ProgressState = {
  learnedLetterIds: [],
  includeObsoleteInQuiz: false,
  quizStatsByLetter: {}
};

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadProgress(): ProgressState {
  if (!canUseStorage()) {
    return defaultProgress;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultProgress;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    const safeStats =
      parsed.quizStatsByLetter && typeof parsed.quizStatsByLetter === 'object'
        ? parsed.quizStatsByLetter
        : {};

    return {
      learnedLetterIds: Array.isArray(parsed.learnedLetterIds)
        ? parsed.learnedLetterIds.filter((item): item is string => typeof item === 'string')
        : [],
      includeObsoleteInQuiz: Boolean(parsed.includeObsoleteInQuiz),
      quizStatsByLetter: Object.fromEntries(
        Object.entries(safeStats).map(([letterId, stat]) => {
          const record = (stat ?? {}) as Partial<QuizLetterStat>;
          return [
            letterId,
            {
              correct: Number(record.correct ?? 0),
              wrong: Number(record.wrong ?? 0),
              lastSeenAt: typeof record.lastSeenAt === 'string' ? record.lastSeenAt : ''
            }
          ];
        })
      )
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: ProgressState) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isLearned(progress: ProgressState, letterId: string) {
  return progress.learnedLetterIds.includes(letterId);
}

export function markLearned(progress: ProgressState, letterId: string): ProgressState {
  if (progress.learnedLetterIds.includes(letterId)) {
    return progress;
  }

  return {
    ...progress,
    learnedLetterIds: [...progress.learnedLetterIds, letterId]
  };
}

export function toggleLearned(progress: ProgressState, letterId: string): ProgressState {
  const isAlreadyLearned = progress.learnedLetterIds.includes(letterId);

  const learnedLetterIds = isAlreadyLearned
    ? progress.learnedLetterIds.filter((id) => id !== letterId)
    : [...progress.learnedLetterIds, letterId];

  return {
    ...progress,
    learnedLetterIds
  };
}

export function recordQuizResult(
  progress: ProgressState,
  letterId: string,
  isCorrect: boolean
): ProgressState {
  const current = progress.quizStatsByLetter[letterId] ?? { correct: 0, wrong: 0, lastSeenAt: '' };
  const next: QuizLetterStat = {
    correct: current.correct + (isCorrect ? 1 : 0),
    wrong: current.wrong + (isCorrect ? 0 : 1),
    lastSeenAt: new Date().toISOString()
  };

  return {
    ...progress,
    quizStatsByLetter: {
      ...progress.quizStatsByLetter,
      [letterId]: next
    }
  };
}
