# Thai Alphabet Learning App — Product Plan (Iteration 2)

## 1) Product Goals
- Deliver a modern, smooth, responsive frontend experience with lightweight native animations.
- Separate educational content from app logic via structured data + static assets.
- Teach by official Thai letter order for consonants, with clear obsolete-letter labeling.
- Track progress locally in-browser for privacy and zero-backend operation.
- Provide a dedicated revision + quiz mode without LLM calls.

---

## 2) Locked Technical Choices (Decided)

## Framework stack (chosen)
- **React 18 + TypeScript + Vite**
- **Tailwind CSS + CSS variables** for design tokens
- **Framer Motion** for native-feeling transitions (with reduced-motion fallback)
- **React Router** for app sections (Learn / Revise / Quiz)
- **Zustand** (or React context) for lightweight client state

Why this stack:
- Fast local development and build times.
- Strong component ecosystem for learning UI patterns.
- Smooth animation support with minimal complexity.
- Easy static-asset handling for audio and images.

---

## 3) MVP Scope (Frontend-Only)

### Core user journeys
1. **Learn letters in sequence**
   - User opens lesson path and studies each letter card.
   - User can hear pronunciation, view mnemonic, writing notes, and sample words.
2. **Mark learned letters**
   - User marks a letter as learned.
   - Progress persists in local storage.
3. **Revise learned letters**
   - User opens revision mode showing only learned items.
4. **Take quizzes**
   - App generates quiz questions at runtime from local content and progress data.
   - No server or LLM dependency.

### Non-goals for MVP
- User accounts/sync across devices.
- Speech recognition and writing recognition.
- Adaptive spaced repetition algorithm beyond simple heuristics.

---

## 4) Content & Asset Architecture

## Directory structure proposal
```text
/content
  /letters
    consonants.json
    vowels.json
  /lessons
    learning_path.json
  /metadata
    romanization_rules.json
/assets
  /audio/letters/*.mp3
  /images/mnemonics/*.webp
  /images/writing/*.svg
```

## Finalized letter schema (v1)

### Required fields
- `id: string` — stable slug ID (`ko_kai`)
- `glyph: string` — Thai character (`ก`)
- `name_th: string` — Thai acrophonic name (`ไก่`)
- `romanization_rtgs: string` — RTGS romanization (`ko kai`)
- `romanization_teaching: string` — learner-friendly (`gor gai`)
- `script_type: "consonant" | "vowel"`
- `consonant_class: "middle" | "high" | "low" | null`
- `official_order_index: number` — position in official Thai order
- `is_obsolete: boolean`
- `pronunciation_audio: string` — public asset path
- `mnemonic: string`
- `shape_description: string`
- `writing_steps: string[]`
- `sample_words: { th: string; rtgs: string; en?: string }[]`
- `image_asset: string`
- `tags: string[]`

### Optional fields
- `ipa?: string`
- `frequency_tier?: "core" | "common" | "extended"`
- `notes?: string`
- `tone_behavior_notes?: string`

### Example JSON entry
```json
{
  "id": "kho_khuat",
  "glyph": "ฃ",
  "name_th": "ขวด",
  "romanization_rtgs": "kho khuat",
  "romanization_teaching": "khor khuat",
  "script_type": "consonant",
  "consonant_class": "high",
  "official_order_index": 3,
  "is_obsolete": true,
  "pronunciation_audio": "/assets/audio/letters/kho_khuat.mp3",
  "mnemonic": "Associate with an old bottle shape and legacy character status.",
  "shape_description": "Like ข with additional form detail.",
  "writing_steps": ["Top stroke", "Down curve", "Inner hook"],
  "sample_words": [{ "th": "ขวด", "rtgs": "khuat", "en": "bottle" }],
  "image_asset": "/assets/images/mnemonics/bottle.webp",
  "tags": ["official-order", "obsolete"]
}
```

---

## 5) Learning Path (Updated)

### Sequencing rule
- **Primary sequence follows official Thai consonant order.**
- Initial batch explicitly starts as requested: **ก, ข, ฃ, ค, ฅ**.
- Obsolete letters remain in sequence but are visually marked and excluded from beginner mastery quotas by default.
- Vowels remain a later phase after core consonants.

### Obsolete consonants policy (MVP)
- Mark obsolete entries with `is_obsolete: true`.
- Badge in UI: `Obsolete`.
- Quiz behavior:
  - Off by default in beginner mode.
  - Optional inclusion via setting: “Include obsolete letters”.

### Class color system (initial)
- Middle class: **amber/gold**
- High class: **blue**
- Low class: **green**
- Vowels: **purple**
- Obsolete badge: **neutral gray**

(Adjust for accessibility contrast after UI prototype.)

---

## 6) UI/UX Plan

### Design system principles
- Mobile-first responsive grid.
- Card-based lesson interface.
- Motion: subtle transitions (`opacity`, `transform`, spring-like ease).
- Respect reduced motion (`prefers-reduced-motion`).

### Primary screens
1. Home / dashboard (progress summary)
2. Learning path (official order + phase grouping)
3. Letter detail card (audio + mnemonic + writing notes)
4. Revision mode
5. Quiz mode

### Micro-interactions
- Slide transition between letters.
- Progress ring animation on lesson completion.
- Gentle feedback animation for quiz correctness.

---

## 7) Local Progress Tracking Strategy

Use browser storage:
- `localStorage` for MVP simplicity.
- Data model:
  - `learnedLetterIds: string[]`
  - `quizStatsByLetter: Record<string, { correct: number; wrong: number; lastSeenAt: string }>`
  - `lessonProgress: Record<lessonId, { completed: boolean; updatedAt: string }>`
  - `quizSettings: { includeObsolete: boolean }`

Future upgrade path:
- Move to IndexedDB for richer offline data and larger history.

---

## 8) Quiz Strategy (No LLM)

**Decision: Generate questions in real time from deterministic templates.**

Why real-time generation is best here:
- Lightweight and dynamic based on current learned set.
- Avoid stale pre-generated banks.
- Easy to control difficulty via weighted selection.

### Quiz template types
1. **Glyph → name** (What is `ก`?)
2. **Name → glyph** (Which glyph is `ko kai`?)
3. **Audio → glyph** (Play sound, choose letter)
4. **Class identification** (Is this high/middle/low?)
5. **Mnemonic match** (Which image/hint matches this letter?)

### Runtime generation algorithm (MVP)
- Build candidate pool from `learnedLetterIds`.
- Filter out obsolete letters unless `includeObsolete = true`.
- Sample target letter with weight favoring previously incorrect items.
- Select quiz template compatible with available assets.
- Generate distractors from same class and nearby official-order neighbors.
- Validate uniqueness and randomness constraints.

---

## 9) Real Dataset Generation Plan (Concrete, No CSV)

## Source-of-truth workflow
1. Maintain canonical source files directly in-repo as TypeScript modules:
   - `content/source/consonants.source.ts`
   - `content/source/vowels.source.ts`
2. Author data as typed objects matching `LetterDraft` (close to schema v1), including `is_obsolete`.
3. Use a script (`scripts/build-dataset.ts`) to:
   - Import source modules and merge records.
   - Auto-fill derived fields (asset paths, tags, default frequency tier).
   - Validate required fields and enum values.
   - Enforce unique `id`, `glyph`, and `official_order_index`.
   - Emit normalized `content/letters/consonants.json` and `content/letters/vowels.json`.
4. Run a second script (`scripts/validate-assets.ts`) to verify referenced image/audio files exist.
5. Commit generated JSON plus a build report (`reports/dataset-build.json`).

## Why this is better than CSV for this project
- Easier to keep strict typing and editor autocomplete.
- Better code review diffs for nested fields (e.g., `sample_words`, `writing_steps`).
- Lets us generate consistent defaults without brittle spreadsheet formulas.

## Quality gates before merge
- Schema validation passes.
- No missing audio/image references.
- Official order indices contiguous for consonants.
- Obsolete entries explicitly marked and surfaced in report.
- Build output deterministic across runs.

---

## 10) Engineering Plan (Iteration order)

1. Scaffold app shell + routing + responsive layout.
2. Implement content loader for local JSON + assets.
3. Build letter card UI with audio + mnemonic display + obsolete badge.
4. Implement progress state + persistence.
5. Build learning path progression logic (official order).
6. Build revision screen from learned letters.
7. Build runtime quiz engine + UI (obsolete toggle).
8. Add dataset build/validation scripts.
9. Polish motion, accessibility, and performance.

---

## 11) TODO List (Actionable)

## A. Product/Data
- [x] Choose framework stack.
- [x] Lock consonant sequencing policy to official order.
- [x] Define obsolete-letter handling policy.
- [x] Finalize dataset schema v1.
- [ ] Create TypeScript source modules for consonants/vowels.
- [ ] Add first consonants in official order: ก, ข, ฃ, ค, ฅ.

## B. Frontend Foundation
- [ ] Scaffold React + Vite + TypeScript project.
- [ ] Set up design tokens and class color mapping.
- [ ] Create responsive layout components.

## C. Learning Experience
- [ ] Implement letter detail card and media player.
- [ ] Implement “mark as learned” action.
- [ ] Implement lesson progression indicators.
- [ ] Implement obsolete badge + explanatory tooltip.

## D. Revision & Quiz
- [ ] Implement revision list filtered by learned letters.
- [ ] Implement deterministic runtime quiz generator.
- [ ] Add score tracking and per-letter weak-spot tracking.
- [ ] Add toggle to include/exclude obsolete letters.

## E. Quality
- [ ] Accessibility pass (contrast, keyboard, ARIA labels).
- [ ] Add reduced-motion support.
- [ ] Add tests for quiz generation and storage adapters.
- [ ] Add tests for dataset schema and asset path validation.

---

## 12) Next immediate deliverables
1. Write `schema/letter.schema.json` from v1 fields.
2. Seed first five official-order consonants (ก, ข, ฃ, ค, ฅ) with `is_obsolete` set correctly.
3. Add dataset build/validation scripts and sample CI check command.
4. Seed `content/source` modules directly (no CSV import step).
