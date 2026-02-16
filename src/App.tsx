import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { LearnPage } from './pages/LearnPage';
import { QuizPage } from './pages/QuizPage';
import { RevisePage } from './pages/RevisePage';

const navItems = [
  { to: '/learn', label: 'Learn' },
  { to: '/revise', label: 'Revise' },
  { to: '/quiz', label: 'Quiz' }
];

export function App() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6">
        <h1 className="text-xl font-semibold">Thai Alphabet Learning</h1>
        <nav className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm transition hover:border-slate-500"
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/25"
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route element={<LearnPage />} path="/" />
              <Route element={<LearnPage />} path="/learn" />
              <Route element={<RevisePage />} path="/revise" />
              <Route element={<QuizPage />} path="/quiz" />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
