import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { consonantSource } from '../../content/source/consonants.source';
import { LetterStudyCard } from '../components/LetterStudyCard';
import { PrototypeCard } from '../components/PrototypeCard';
import { useProgress } from '../lib/ProgressContext';

function chooseWeightedRandom(
  letterIds: string[],
  getWeight: (letterId: string) => number,
  excludeId?: string
) {
  const filtered = letterIds.filter((id) => (letterIds.length <= 1 ? true : id !== excludeId));
  if (filtered.length === 0) {
    return null;
  }

  const weighted = filtered.map((id) => ({ id, weight: Math.max(1, getWeight(id)) }));
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) {
      return item.id;
    }
  }

  return weighted[weighted.length - 1]?.id ?? null;
}

export function FlashcardsPage() {
  const { progress, isLearned, recordFlashcardResult } = useProgress();
  const [showLearnedOnly, setShowLearnedOnly] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentLetterId, setCurrentLetterId] = useState<string | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  const orderedLetters = useMemo(
    () => [...consonantSource].sort((a, b) => a.official_order_index - b.official_order_index),
    []
  );

  const candidatePool = useMemo(() => {
    if (!showLearnedOnly) {
      return orderedLetters;
    }
    return orderedLetters.filter((letter) => isLearned(letter.id));
  }, [isLearned, orderedLetters, showLearnedOnly]);

  const letterById = useMemo(
    () => Object.fromEntries(orderedLetters.map((letter) => [letter.id, letter])),
    [orderedLetters]
  );

  const getWeight = (letterId: string) => {
    const stat = progress.flashcardStatsByLetter[letterId];
    if (!stat) {
      return 4;
    }
    const wrongBias = 1 + stat.wrong * 3;
    const correctDiscount = Math.min(stat.correct, 4);
    const hardBonus = stat.wrong > stat.correct ? 2 : 0;
    return Math.max(1, wrongBias - correctDiscount + hardBonus);
  };

  useEffect(() => {
    if (candidatePool.length === 0) {
      setCurrentLetterId(null);
      setIsFlipped(false);
      return;
    }
    const nextId = chooseWeightedRandom(
      candidatePool.map((letter) => letter.id),
      getWeight
    );
    setCurrentLetterId(nextId);
    setIsFlipped(false);
  }, [candidatePool]);

  const currentLetter = currentLetterId ? letterById[currentLetterId] : null;
  const currentStat = currentLetterId ? progress.flashcardStatsByLetter[currentLetterId] : undefined;

  const moveToNextCard = () => {
    if (candidatePool.length === 0) {
      return;
    }
    const nextId = chooseWeightedRandom(
      candidatePool.map((letter) => letter.id),
      getWeight,
      currentLetterId ?? undefined
    );
    if (!nextId) {
      return;
    }
    setCurrentLetterId(nextId);
    setIsFlipped(false);
  };

  const handleResult = (isCorrect: boolean) => {
    if (!currentLetterId) {
      return;
    }
    recordFlashcardResult(currentLetterId, isCorrect);
    moveToNextCard();
  };

  useEffect(() => {
    if (!isFlipped) {
      return;
    }
    requestAnimationFrame(() => {
      cardContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [isFlipped]);

  return (
    <div className="space-y-4">
      <PrototypeCard
        description="Flip cards, self-grade, and review with weighted random repetition."
        title="Flashcards"
      >
        <label className="mb-4 flex items-center gap-2 text-sm text-slate-300">
          <input
            checked={showLearnedOnly}
            onChange={(event) => setShowLearnedOnly(event.target.checked)}
            type="checkbox"
          />
          Show learned cards only
        </label>

        {!currentLetter ? (
          <p className="text-sm text-slate-300">
            No cards available for this filter. Uncheck <strong>Show learned cards only</strong> or mark letters as learned in Learn.
          </p>
        ) : (
          <div className="space-y-3">
            <div ref={cardContainerRef}>
              <AnimatePresence mode="wait">
              {!isFlipped ? (
                <motion.button
                  key={`front-${currentLetter.id}`}
                  animate={{ opacity: 1, rotateY: 0 }}
                  className="mx-auto flex min-h-[44rem] w-full max-w-md flex-col items-center justify-center rounded-2xl border border-slate-300 bg-white p-8 text-center text-black shadow-xl"
                  exit={{ opacity: 0, rotateY: 90 }}
                  initial={{ opacity: 0, rotateY: -90 }}
                  onClick={() => setIsFlipped(true)}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  type="button"
                >
                  <p className="mb-4 text-xs uppercase tracking-wide text-slate-500">Front</p>
                  <p className="thai-script text-[8rem] leading-none">{currentLetter.glyph}</p>
                  <p className="mt-4 text-sm text-slate-600">Tap to flip</p>
                </motion.button>
              ) : (
                <motion.div
                  key={`back-${currentLetter.id}`}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  initial={{ opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <LetterStudyCard
                    footer={
                      <div className="space-y-3">
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            className="rounded bg-classLow px-3 py-1 text-sm font-medium text-slate-900"
                            onClick={() => handleResult(true)}
                            type="button"
                          >
                            I got it
                          </button>
                          <button
                            className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white"
                            onClick={() => handleResult(false)}
                            type="button"
                          >
                            Needs work
                          </button>
                          <button
                            className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
                            onClick={() => setIsFlipped(false)}
                            type="button"
                          >
                            Flip back
                          </button>
                        </div>
                        <p className="text-center text-xs text-slate-600">
                          Correct: {currentStat?.correct ?? 0} | Wrong: {currentStat?.wrong ?? 0}
                        </p>
                      </div>
                    }
                    header={<p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Back</p>}
                    letter={currentLetter}
                  />
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </PrototypeCard>
    </div>
  );
}
