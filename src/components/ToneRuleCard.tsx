import { toneRulesSource, type ToneValue } from '../../content/source/tone-rules.source';

function formatTone(tone: ToneValue) {
  if (tone === 'mid') {
    return 'Mid';
  }
  if (tone === 'low') {
    return 'Low';
  }
  if (tone === 'falling') {
    return 'Falling';
  }
  if (tone === 'high') {
    return 'High';
  }
  return 'Rising';
}

export function ToneRuleCard({
  consonantClass,
  className
}: {
  consonantClass: 'middle' | 'high' | 'low' | null;
  className?: string;
}) {
  if (!consonantClass) {
    return null;
  }

  const key = consonantClass === 'middle' ? 'mid_class' : consonantClass === 'high' ? 'high_class' : 'low_class';
  const rules = toneRulesSource.tone_rules[key];
  const toneMarkRows = [
    { mark: '่', label: 'mai ek', tone: rules.tone_marks.mai_ek },
    { mark: '้', label: 'mai tho', tone: rules.tone_marks.mai_tho },
    { mark: '๊', label: 'mai tri', tone: rules.tone_marks.mai_tri },
    { mark: '๋', label: 'mai chattawa', tone: rules.tone_marks.mai_chattawa }
  ].filter((row) => row.tone !== null);

  const deadSyllable = rules.no_tone_mark.dead_syllable;

  return (
    <div
      className={`flex h-full w-full max-w-md flex-col rounded-2xl border border-slate-300 bg-white p-5 text-black shadow-xl ${
        className ?? ''
      }`}
    >
      <h4 className="text-lg font-semibold">
        {consonantClass === 'middle' ? 'Middle' : consonantClass === 'high' ? 'High' : 'Low'}-Class Tone Rules
      </h4>
      <p className="mt-1 text-sm text-slate-600">{rules.description}</p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-sm font-semibold text-slate-700">No Tone Mark</p>
        <ul className="mt-1 space-y-1 text-sm text-slate-600">
          <li>Live syllable - {formatTone(rules.no_tone_mark.live_syllable)}</li>
          {typeof deadSyllable === 'string' ? (
            <li>Dead syllable - {formatTone(deadSyllable)}</li>
          ) : (
            <>
              <li>Dead syllable (short vowel) - {formatTone(deadSyllable.short_vowel)}</li>
              <li>Dead syllable (long vowel) - {formatTone(deadSyllable.long_vowel)}</li>
            </>
          )}
        </ul>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-sm font-semibold text-slate-700">With Tone Marks</p>
        <ul className="mt-1 space-y-1 text-sm text-slate-600">
          {toneMarkRows.map((row) => (
            <li key={`${key}-${row.label}`} className="flex items-center gap-2">
              <span className="thai-script inline-block w-8 text-center text-2xl leading-none">{row.mark}</span>
              <span>({row.label}) - {row.tone ? formatTone(row.tone) : ''}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-sm font-semibold text-slate-700">Syllable Definitions</p>
        <ul className="mt-1 space-y-1 text-sm text-slate-600">
          <li>Live: {toneRulesSource.syllable_definitions.live_syllable}</li>
          <li>Dead: {toneRulesSource.syllable_definitions.dead_syllable}</li>
        </ul>
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Long vowel examples</p>
          <div className="thai-script mt-1 flex flex-wrap gap-2 text-2xl leading-none text-slate-800">
            {toneRulesSource.syllable_definitions.long_vowel_examples.map((vowel) => (
              <span key={`long-${vowel}`} className="rounded bg-slate-200 px-2 py-1">
                {vowel}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Short vowel examples</p>
          <div className="thai-script mt-1 flex flex-wrap gap-2 text-2xl leading-none text-slate-800">
            {toneRulesSource.syllable_definitions.short_vowel_examples.map((vowel) => (
              <span key={`short-${vowel}`} className="rounded bg-slate-200 px-2 py-1">
                {vowel}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
