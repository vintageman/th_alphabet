import { useMemo, useState } from 'react';
import { consonantSource } from '../../content/source/consonants.source';
import { PrototypeCard } from '../components/PrototypeCard';
import { useProgress } from '../lib/ProgressContext';
import { generateGlyphToNameQuestion } from '../lib/quiz';

export function QuizPage() {
  const { progress, recordQuizResult, setIncludeObsoleteInQuiz } = useProgress();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const candidatePool = useMemo(() => {
    const learned = consonantSource.filter((letter) => progress.learnedLetterIds.includes(letter.id));
    const basePool = learned.length >= 2 ? learned : consonantSource;

    return basePool.filter((letter) =>
      progress.includeObsoleteInQuiz ? true : !letter.is_obsolete
    );
  }, [progress.includeObsoleteInQuiz, progress.learnedLetterIds]);

  const question = useMemo(
    () => generateGlyphToNameQuestion(candidatePool, questionIndex),
    [candidatePool, questionIndex]
  );

  const totalAnswered = useMemo(
    () =>
      Object.values(progress.quizStatsByLetter).reduce((sum, stat) => sum + stat.correct + stat.wrong, 0),
    [progress.quizStatsByLetter]
  );

  const currentStat = question ? progress.quizStatsByLetter[question.answerId] : undefined;

  const handleSelectOption = (optionId: string) => {
    if (!question || selectedOption) {
      return;
    }

    const correct = optionId === question.answerId;
    setSelectedOption(optionId);
    recordQuizResult(question.answerId, correct);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setQuestionIndex((index) => index + 1);
  };

  return (
    <div className="space-y-4">
      <PrototypeCard
        description="Deterministic runtime quiz from local learned progress (no LLM)."
        title="Quiz"
      >
        <label className="mb-4 flex items-center gap-2 text-sm text-slate-300">
          <input
            checked={progress.includeObsoleteInQuiz}
            onChange={(event) => setIncludeObsoleteInQuiz(event.target.checked)}
            type="checkbox"
          />
          Include obsolete letters
        </label>

        <p className="mb-3 text-xs text-slate-400">Tracked answers: {totalAnswered}</p>

        {!question ? (
          <p className="text-sm text-slate-300">Not enough letters to generate a quiz yet.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-100">{question.prompt}</p>
            <div className="grid gap-2 md:grid-cols-2">
              {question.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrect = selectedOption ? option.id === question.answerId : false;

                return (
                  <button
                    key={option.id}
                    className={`rounded border px-3 py-2 text-left text-sm transition ${
                      !selectedOption
                        ? 'border-slate-700 hover:border-slate-500'
                        : isCorrect
                          ? 'border-classLow bg-classLow/20'
                          : isSelected
                            ? 'border-red-500 bg-red-500/20'
                            : 'border-slate-700 opacity-60'
                    }`}
                    disabled={Boolean(selectedOption)}
                    onClick={() => handleSelectOption(option.id)}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {selectedOption ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  This letter stats — correct: {currentStat?.correct ?? 0}, wrong: {currentStat?.wrong ?? 0}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded bg-classMiddle px-3 py-1 text-xs font-semibold text-slate-900"
                    onClick={handleNextQuestion}
                    type="button"
                  >
                    Next question
                  </button>
                  <button
                    className="rounded bg-slate-700 px-3 py-1 text-xs text-slate-100"
                    onClick={() => setSelectedOption(null)}
                    type="button"
                  >
                    Retry same question
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </PrototypeCard>
    </div>
  );
}
