import type { LetterDraft, ToneLabel } from './types';

const ALL_TONES: ToneLabel[] = ['mid', 'low', 'falling', 'high', 'rising'];

// Place per-letter overrides here when needed.
const TONE_OVERRIDES: Record<string, ToneLabel[]> = {};

function normalizeTones(tones: ToneLabel[] | undefined): ToneLabel[] {
  if (!tones || tones.length === 0) {
    return [...ALL_TONES];
  }
  return Array.from(new Set(tones));
}

export function attachResolvedTones(letters: LetterDraft[]): LetterDraft[] {
  return letters.map((letter) => ({
    ...letter,
    tones: normalizeTones(letter.tones ?? TONE_OVERRIDES[letter.id])
  }));
}
