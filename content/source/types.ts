export type ScriptType = 'consonant' | 'vowel';

export type ConsonantClass = 'middle' | 'high' | 'low';

export type FrequencyTier = 'core' | 'common' | 'extended';

export type SampleWord = {
  th: string;
  rtgs: string;
  en?: string;
};

export type LetterDraft = {
  id: string;
  glyph: string;
  name_th: string;
  romanization_rtgs: string;
  romanization_teaching: string;
  script_type: ScriptType;
  consonant_class: ConsonantClass | null;
  official_order_index: number;
  is_obsolete: boolean;
  pronunciation_audio: string;
  mnemonic: string;
  shape_description: string;
  writing_steps: string[];
  sample_words: SampleWord[];
  image_asset: string;
  tags: string[];
  ipa?: string;
  frequency_tier?: FrequencyTier;
  notes?: string;
  tone_behavior_notes?: string;
};
