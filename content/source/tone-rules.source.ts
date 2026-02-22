export type ToneValue = 'mid' | 'low' | 'falling' | 'high' | 'rising';

type DeadSyllableLowClass = {
  short_vowel: ToneValue;
  long_vowel: ToneValue;
};

type ToneRuleSet = {
  description: string;
  no_tone_mark: {
    live_syllable: ToneValue;
    dead_syllable: ToneValue | DeadSyllableLowClass;
  };
  tone_marks: {
    mai_ek: ToneValue | null;
    mai_tho: ToneValue | null;
    mai_tri: ToneValue | null;
    mai_chattawa: ToneValue | null;
  };
};

export type ToneRulesSource = {
  tone_rules: {
    mid_class: ToneRuleSet;
    high_class: ToneRuleSet;
    low_class: ToneRuleSet;
  };
  syllable_definitions: {
    live_syllable: string;
    dead_syllable: string;
    long_vowel_examples: string[];
    short_vowel_examples: string[];
  };
};

export const toneRulesSource: ToneRulesSource = {
  tone_rules: {
    mid_class: {
      description: 'Mid-class consonants (ก จ ด ต บ ป อ ฏ)',
      no_tone_mark: {
        live_syllable: 'mid',
        dead_syllable: 'low'
      },
      tone_marks: {
        mai_ek: 'low',
        mai_tho: 'falling',
        mai_tri: 'high',
        mai_chattawa: 'rising'
      }
    },
    high_class: {
      description: 'High-class consonants (ข ฉ ฐ ถ ผ ฝ ศ ษ ส ห)',
      no_tone_mark: {
        live_syllable: 'rising',
        dead_syllable: 'low'
      },
      tone_marks: {
        mai_ek: 'low',
        mai_tho: 'falling',
        mai_tri: null,
        mai_chattawa: null
      }
    },
    low_class: {
      description: 'Low-class consonants (ค ช ซ ฌ ญ ฑ ฒ ณ ท ธ น พ ฟ ภ ม ย ร ล ว ฬ ฮ ง)',
      no_tone_mark: {
        live_syllable: 'mid',
        dead_syllable: {
          short_vowel: 'high',
          long_vowel: 'falling'
        }
      },
      tone_marks: {
        mai_ek: 'falling',
        mai_tho: 'high',
        mai_tri: null,
        mai_chattawa: null
      }
    }
  },
  syllable_definitions: {
    live_syllable: 'Long vowel OR ends in น ม ง ย ว',
    dead_syllable: 'Short vowel OR ends in ก ด บ',
    long_vowel_examples: ['า', 'ี', 'ื', 'ู', 'เ-', 'แ-', 'โ-', '-อ', 'เ-ีย'],
    short_vowel_examples: ['ะ', 'ิ', 'ึ', 'ุ', 'เ-ะ', 'แ-ะ', 'โ-ะ', 'เ-อะ', 'เ-ียะ']
  }
};
