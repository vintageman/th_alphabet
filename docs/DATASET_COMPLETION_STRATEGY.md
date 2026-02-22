# Dataset Completion Strategy (Consonants + Vowels)

## Goal
Create and maintain a complete, consistent Thai script dataset for app consumption while allowing manual media creation (images/audio).

## Strategy
1. **Canonical typed source**
   - Keep full inventories in:
     - `content/source/consonants.source.ts`
     - `content/source/vowels.source.ts`
   - Each entry must satisfy `LetterDraft` shape in `content/source/types.ts`.

2. **Generated JSON outputs for app/runtime**
   - Emit and keep in git:
     - `content/letters/consonants.json`
     - `content/letters/vowels.json`
     - `content/lessons/learning_path.json`

3. **Stable media path conventions**
   - Consonant audio: `/assets/audio/letters/<id>.mp3`
   - Vowel audio: `/assets/audio/vowels/<id>.mp3`
   - Mnemonic image: `/assets/images/mnemonics/<id>.webp`

4. **Manual media authoring phase**
   - Add image and audio files to match each referenced path.
   - Keep IDs stable; changing IDs will break existing references and progress data.

5. **Validation phase (after media is added)**
   - Validate JSON parseability.
   - Validate unique IDs and contiguous `official_order_index` within each set.
   - Validate lesson path references all existing IDs.
   - Validate every `image_asset` and `pronunciation_audio` file exists.

## Update workflow
- Update source TS entries first.
- Regenerate JSON outputs.
- Run validation checks.
- Commit both source and generated JSON together.
