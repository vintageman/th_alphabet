import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  isLearned as isLearnedFromState,
  loadProgress,
  saveProgress,
  toggleLearned as toggleLearnedFromState,
  type ProgressState
} from './progress';

type ProgressContextValue = {
  progress: ProgressState;
  toggleLearned: (letterId: string) => void;
  setIncludeObsoleteInQuiz: (enabled: boolean) => void;
  isLearned: (letterId: string) => boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  const value = useMemo<ProgressContextValue>(() => {
    return {
      progress,
      toggleLearned: (letterId: string) => {
        setProgress((current) => {
          const next = toggleLearnedFromState(current, letterId);
          saveProgress(next);
          return next;
        });
      },
      setIncludeObsoleteInQuiz: (enabled: boolean) => {
        setProgress((current) => {
          const next = { ...current, includeObsoleteInQuiz: enabled };
          saveProgress(next);
          return next;
        });
      },
      isLearned: (letterId: string) => isLearnedFromState(progress, letterId)
    };
  }, [progress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
