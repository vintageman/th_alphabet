import { useMemo, useState } from 'react';
import { consonantSource } from '../../content/source/consonants.source';
import { PrototypeCard } from '../components/PrototypeCard';
import { useProgress } from '../lib/ProgressContext';

export function LearnPage() {
  const { isLearned, markLearned, toggleLearned } = useProgress();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionCursor, setSessionCursor] = useState(0);

  const orderedLetters = useMemo(
    () => [...consonantSource].sort((a, b) => a.official_order_index - b.official_order_index),
    []
  );

  const unlearnedLetters = orderedLetters.filter((letter) => !isLearned(letter.id));
  const hasUnlearnedLetters = unlearnedLetters.length > 0;

  const safeCursor = Math.min(sessionCursor, Math.max(unlearnedLetters.length - 1, 0));
  const currentLetter = hasUnlearnedLetters ? unlearnedLetters[safeCursor] : null;

  const startLearning = () => {
    setSessionCursor(0);
    setIsSessionActive(true);
  };

  const handleMarkCurrentAsLearned = () => {
    if (!currentLetter) {
      return;
    }

    markLearned(currentLetter.id);

    if (safeCursor >= unlearnedLetters.length - 1) {
      setSessionCursor(0);
    }
  };

  return (
    <div className="space-y-4">
      <PrototypeCard
        description="Start from the first unlearned letter and continue in official order."
        title="Learn"
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            className="rounded bg-classMiddle px-4 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!hasUnlearnedLetters}
            onClick={startLearning}
            type="button"
          >
            {hasUnlearnedLetters ? 'Start Learning' : 'All seeded letters learned'}
          </button>
          <span className="text-xs text-slate-400">
            {orderedLetters.length - unlearnedLetters.length}/{orderedLetters.length} learned
          </span>
        </div>

        {isSessionActive ? (
          currentLetter ? (
            <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Current card</p>
                  <h3 className="text-xl font-semibold text-slate-100">
                    {currentLetter.official_order_index}. {currentLetter.glyph} —{' '}
                    {currentLetter.romanization_teaching}
                  </h3>
                  <p className="text-sm text-slate-300">{currentLetter.name_th}</p>
                </div>
                {currentLetter.is_obsolete ? (
                  <span className="rounded bg-obsolete px-2 py-1 text-xs text-white">Obsolete</span>
                ) : null}
              </div>

              <p className="text-sm text-slate-300">{currentLetter.mnemonic}</p>

              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded bg-classLow px-3 py-1 text-xs font-medium text-slate-900"
                  onClick={handleMarkCurrentAsLearned}
                  type="button"
                >
                  Mark learned & next
                </button>
                <button
                  className="rounded bg-slate-700 px-3 py-1 text-xs text-slate-100"
                  onClick={() => setSessionCursor((cursor) => Math.min(cursor + 1, Math.max(unlearnedLetters.length - 1, 0)))}
                  type="button"
                >
                  Skip for now
                </button>
                <button
                  className="rounded bg-slate-700 px-3 py-1 text-xs text-slate-100"
                  onClick={() => setIsSessionActive(false)}
                  type="button"
                >
                  End session
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-classLow/50 bg-classLow/10 p-4 text-sm text-slate-100">
              Nice work — all currently seeded letters are marked learned.
            </div>
          )
        ) : (
          <p className="text-sm text-slate-300">
            Tap <strong>Start Learning</strong> to continue from your first unlearned letter.
          </p>
        )}
      </PrototypeCard>

      <PrototypeCard
        description="Seeded official-order letters (manual toggle kept for prototype debugging)."
        title="Letter list"
      >
        <ul className="space-y-2 text-sm text-slate-300">
          {orderedLetters.map((letter) => {
            const learned = isLearned(letter.id);

            return (
              <li
                key={letter.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-700 px-3 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-medium text-slate-100">
                    {letter.official_order_index}. {letter.glyph} — {letter.romanization_teaching}
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
                    onClick={() => toggleLearned(letter.id)}
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
