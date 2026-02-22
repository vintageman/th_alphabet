import { useMemo, useRef, useState } from 'react';
import { vowelSource } from '../../content/source/vowels.source';
import { LetterStudyCard } from '../components/LetterStudyCard';
import { PrototypeCard } from '../components/PrototypeCard';
import { useProgress } from '../lib/ProgressContext';

export function LearnVowelsPage() {
  const { isLearned, markLearned, toggleLearned } = useProgress();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionCursor, setSessionCursor] = useState(0);
  const activeCardRef = useRef<HTMLDivElement | null>(null);

  const orderedLetters = useMemo(
    () => [...vowelSource].sort((a, b) => a.official_order_index - b.official_order_index),
    []
  );

  const learnedCount = orderedLetters.filter((letter) => isLearned(letter.id)).length;
  const firstUnlearnedIndex = orderedLetters.findIndex((letter) => !isLearned(letter.id));
  const hasUnlearnedLetters = firstUnlearnedIndex !== -1;

  const safeCursor = Math.min(sessionCursor, Math.max(orderedLetters.length - 1, 0));
  const currentLetter = orderedLetters[safeCursor] ?? null;

  const scrollToCard = () => {
    requestAnimationFrame(() => {
      activeCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const startLearning = () => {
    setSessionCursor(firstUnlearnedIndex === -1 ? 0 : firstUnlearnedIndex);
    setIsSessionActive(true);
    scrollToCard();
  };

  const handleMarkCurrentAsLearned = () => {
    if (!currentLetter) {
      return;
    }

    markLearned(currentLetter.id);
    setSessionCursor((cursor) => Math.min(cursor + 1, Math.max(orderedLetters.length - 1, 0)));
  };

  const openLetterCard = (letterId: string) => {
    const nextIndex = orderedLetters.findIndex((letter) => letter.id === letterId);
    if (nextIndex === -1) {
      return;
    }
    setSessionCursor(nextIndex);
    setIsSessionActive(true);
    scrollToCard();
  };

  return (
    <div className="space-y-4">
      <PrototypeCard
        description="Vowels in this section: 18 monophthongs (9 short and 9 long), 6 diphthongs (3 short and 3 long), and 8 special vowel sounds."
        title="Learn Vowels"
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            className="rounded bg-classMiddle px-4 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={orderedLetters.length === 0}
            onClick={startLearning}
            type="button"
          >
            {hasUnlearnedLetters ? 'Start Learning' : 'Browse Cards'}
          </button>
          <span className="text-xs text-slate-400">
            {learnedCount}/{orderedLetters.length} learned
          </span>
        </div>

        {isSessionActive ? (
          currentLetter ? (
            <div ref={activeCardRef}>
              <LetterStudyCard
                className="h-full max-w-none"
                showImage={false}
                footer={
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      className="rounded bg-classLow px-3 py-1 text-sm font-medium text-slate-900"
                      onClick={handleMarkCurrentAsLearned}
                      type="button"
                    >
                      Mark learned
                    </button>
                    <button
                      className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
                      onClick={() => setSessionCursor((cursor) => Math.max(0, cursor - 1))}
                      type="button"
                    >
                      {'<- Prev'}
                    </button>
                    <button
                      className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
                      onClick={() => setSessionCursor((cursor) => Math.min(cursor + 1, orderedLetters.length - 1))}
                      type="button"
                    >
                      {'Next ->'}
                    </button>
                    <button
                      className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
                      onClick={() => setIsSessionActive(false)}
                      type="button"
                    >
                      End session
                    </button>
                  </div>
                }
                header={
                  <div className="flex items-center justify-between gap-2">
                    <button
                      className="rounded bg-slate-700 px-2 py-1 text-sm text-white disabled:opacity-50"
                      disabled={safeCursor <= 0}
                      onClick={() => setSessionCursor((cursor) => Math.max(0, cursor - 1))}
                      type="button"
                    >
                      {'<-'}
                    </button>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Card {safeCursor + 1}/{orderedLetters.length}
                    </p>
                    <button
                      className="rounded bg-slate-700 px-2 py-1 text-sm text-white disabled:opacity-50"
                      disabled={safeCursor >= orderedLetters.length - 1}
                      onClick={() => setSessionCursor((cursor) => Math.min(cursor + 1, orderedLetters.length - 1))}
                      type="button"
                    >
                      {'->'}
                    </button>
                  </div>
                }
                letter={currentLetter}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-classLow/50 bg-classLow/10 p-4 text-sm text-slate-100">
              No cards available.
            </div>
          )
        ) : (
          <p className="text-sm text-slate-300">
            Tap <strong>Start Learning</strong> or click a vowel from the list below.
          </p>
        )}
      </PrototypeCard>

      <PrototypeCard
        description="Click any row to open that card. Learned toggle is kept for progress control."
        title="Vowel list"
      >
        <ul className="space-y-2 text-sm text-slate-300">
          {orderedLetters.map((letter) => {
            const learned = isLearned(letter.id);

            return (
              <li
                key={letter.id}
                className="flex cursor-pointer flex-col gap-3 rounded-lg border border-slate-700 px-3 py-3 transition hover:border-slate-500 md:flex-row md:items-center md:justify-between"
                onClick={() => openLetterCard(letter.id)}
              >
                <div>
                  <div className="font-medium text-slate-100">
                    {letter.official_order_index}. {letter.glyph} - {letter.romanization_teaching}
                  </div>
                  <div className="text-xs text-slate-400">{letter.name_th}</div>
                </div>

                <div className="flex items-center gap-2">
                  {letter.is_obsolete ? (
                    <span className="rounded bg-obsolete px-2 py-1 text-xs text-white">Obsolete</span>
                  ) : null}
                  <button
                    className={`rounded px-3 py-1 text-xs font-medium ${
                      learned ? 'bg-classLow text-slate-900' : 'bg-slate-700 text-slate-100'
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleLearned(letter.id);
                    }}
                    type="button"
                  >
                    {learned ? 'Learned' : 'Mark learned'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </PrototypeCard>
    </div>
  );
}
