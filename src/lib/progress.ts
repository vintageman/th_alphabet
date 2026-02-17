const STORAGE_KEY = 'thai-alphabet-progress-v1';

export type ProgressState = {
  learnedLetterIds: string[];
  includeObsoleteInQuiz: boolean;
};

const defaultProgress: ProgressState = {
  learnedLetterIds: [],
  includeObsoleteInQuiz: false
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
    return {
      learnedLetterIds: Array.isArray(parsed.learnedLetterIds)
        ? parsed.learnedLetterIds.filter((item): item is string => typeof item === 'string')
        : [],
      includeObsoleteInQuiz: Boolean(parsed.includeObsoleteInQuiz)
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
