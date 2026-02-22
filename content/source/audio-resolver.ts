import audioSourceRaw from './audio.js?raw';
import type { LetterDraft } from './types';

const AUDIO_DATA_URI_PREFIX = 'data:audio/mpeg;base64,';
const AUDIO_KEY_ALIASES: Record<string, string> = {
  'consonant-kho-khai': 'consonant-kho-khay',
  'consonant-kho-ra-khang': 'consonant-kho-rakhang',
  'consonant-cho-chan': 'consonant-jo-jan',
  'consonant-cho-choe': 'consonant-cho-cho',
  'consonant-tho-phuthao': 'consonant-tho-phuthau',
  'consonant-to-tao': 'consonant-to-tau',
  'consonant-pho-phueng': 'consonant-pho-phing',
  'consonant-pho-samphao': 'consonant-pho-samphau',
  'consonant-ro-ruea': 'consonant-ro-ria',
  'consonant-wo-waen': 'consonant-wo-weng',
  'consonant-so-rusi': 'consonant-so-risi',
  'consonant-so-suea': 'consonant-so-sia',
  'consonant-lo-chula': 'consonant-lo-jula',
  'consonant-ho-nokhuk': 'consonant-ho-nokhu',
  'sara-ue-short': 'sara-eu-short',
  'sara-ue-long': 'sara-eu-long',
  'sara-oe-short': 'sara-eu-short',
  'sara-oe-long': 'sara-eu-long',
  'sara-uea-short': 'sara-eua-short',
  'sara-uea-long': 'sara-eua-long',
  'sara-ai-maimalai': 'sara-ay-may-malay',
  'sara-ai-maimuan': 'sara-ay-may-muan',
  'sara-ao': 'sara-au',
  'sara-o-closed-short': 'sara-aw-short',
  'sara-o-closed-long': 'sara-aw-long',
  'sara-rue': 'sara-reu-short',
  'sara-rue-long': 'sara-reu-long',
  'sara-lue': 'sara-reu-short',
  'sara-lue-long': 'sara-reu-long'
};

let cachedAudioMap: Map<string, string> | null = null;

function parseAudioMap(source: string): Map<string, string> {
  const map = new Map<string, string>();
  const entryRegex = /\[\s*'([^']+)'\s*,\s*'([^']+)'\s*\]/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(source)) !== null) {
    map.set(match[1], match[2]);
  }

  return map;
}

function getAudioMap(): Map<string, string> {
  if (!cachedAudioMap) {
    cachedAudioMap = parseAudioMap(audioSourceRaw);
  }

  return cachedAudioMap;
}

function buildAudioKey(letter: LetterDraft): string {
  const normalizedId = letter.id.replace(/_/g, '-');
  if (letter.script_type === 'consonant') {
    return `consonant-${normalizedId}`;
  }
  return normalizedId;
}

export function resolvePronunciationAudio(letter: LetterDraft): string {
  const key = buildAudioKey(letter);
  const map = getAudioMap();
  const audioBase64 = map.get(key) ?? map.get(AUDIO_KEY_ALIASES[key] ?? '');
  if (!audioBase64) {
    return letter.pronunciation_audio;
  }
  return `${AUDIO_DATA_URI_PREFIX}${audioBase64}`;
}

export function attachResolvedPronunciationAudio(letters: LetterDraft[]): LetterDraft[] {
  return letters.map((letter) => ({
    ...letter,
    pronunciation_audio: resolvePronunciationAudio(letter)
  }));
}
