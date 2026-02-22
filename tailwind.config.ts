import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        classMiddle: '#f59e0b',
        classHigh: '#3b82f6',
        classLow: '#22c55e',
        classVowel: '#a855f7',
        obsolete: '#6b7280'
      }
    }
  },
  plugins: []
} satisfies Config;
