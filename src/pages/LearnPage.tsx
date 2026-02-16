import { consonantSource } from '../../content/source/consonants.source';
import { PrototypeCard } from '../components/PrototypeCard';
import { useProgress } from '../lib/ProgressContext';

export function LearnPage() {
  const { isLearned, toggleLearned } = useProgress();

  return (
    <div className="space-y-4">
      <PrototypeCard
        description="Prototype learning route with official-order seed data and local progress."
        title="Learn"
      >
        <ul className="space-y-2 text-sm text-slate-300">
          {consonantSource.map((letter) => {
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
