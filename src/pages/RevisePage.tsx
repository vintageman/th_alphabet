import { consonantSource } from '../../content/source/consonants.source';
import { PrototypeCard } from '../components/PrototypeCard';
import { useProgress } from '../lib/ProgressContext';

export function RevisePage() {
  const { progress } = useProgress();

  const learnedLetters = consonantSource.filter((letter) =>
    progress.learnedLetterIds.includes(letter.id)
  );

  return (
    <div className="space-y-4">
      <PrototypeCard description="Review letters already marked as learned." title="Revise">
        {learnedLetters.length === 0 ? (
          <p className="text-sm text-slate-300">No learned letters yet. Go to Learn and mark some first.</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-300">
            {learnedLetters.map((letter) => (
              <li
                key={letter.id}
                className="flex items-center justify-between rounded-lg border border-slate-700 px-3 py-2"
              >
                <span>
                  {letter.glyph} — {letter.romanization_teaching} ({letter.name_th})
                </span>
                {letter.is_obsolete ? (
                  <span className="rounded bg-obsolete px-2 py-1 text-xs text-white">Obsolete</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </PrototypeCard>
    </div>
  );
}
