# Thai Alphabet Learning App (Prototype v0.1.0)

A frontend prototype for learning the Thai alphabet with official-order sequencing, obsolete-letter marking, local progress tracking, and lightweight deterministic quizzes.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- React Router

## Current prototype features
- Seeded official-order consonants: **ก, ข, ฃ, ค, ฅ**.
- Obsolete letters are marked (ฃ, ฅ).
- Learn page includes a **Start Learning** button that jumps into the next unlearned card in official order and persists state in browser `localStorage`.
- Revise page shows learned letters.
- Quiz page generates deterministic glyph matching questions with optional obsolete inclusion, tracked results, and a next-question flow.

## Run instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown by Vite (usually `http://localhost:5173`).

## Additional scripts
- Type-check:
  ```bash
  npm run typecheck
  ```
- Build production bundle:
  ```bash
  npm run build
  ```
- Preview production build:
  ```bash
  npm run preview
  ```

## Data source modules
- `content/source/consonants.source.ts`
- `content/source/vowels.source.ts`
- `content/source/types.ts`

These typed source modules are the canonical authored data for upcoming dataset build scripts.


## Generated dataset JSON
- `content/letters/consonants.json`
- `content/letters/vowels.json`
- `content/lessons/learning_path.json`

These files are ready for manual asset population. You can now add image/audio files at the referenced `image_asset` and `pronunciation_audio` paths.
