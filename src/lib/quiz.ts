import type { LetterDraft } from '../../content/source';

export type QuizQuestion = {
  prompt: string;
  answerId: string;
  options: Array<{ id: string; label: string }>;
};

export function generateGlyphToNameQuestion(letters: LetterDraft[]): QuizQuestion | null {
  if (letters.length < 2) {
    return null;
  }

  const ordered = [...letters].sort((a, b) => a.official_order_index - b.official_order_index);
  const target = ordered[0];

  const distractors = ordered
    .filter((letter) => letter.id !== target.id)
    .slice(0, 3)
    .map((letter) => ({ id: letter.id, label: `${letter.glyph} (${letter.romanization_teaching})` }));

  const options = [
    { id: target.id, label: `${target.glyph} (${target.romanization_teaching})` },
    ...distractors
  ].sort((a, b) => a.label.localeCompare(b.label));

  return {
    prompt: `Which option matches the letter ${target.glyph}?`,
    answerId: target.id,
    options
  };
}
