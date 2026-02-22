import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas';
import type { LetterDraft } from '../../content/source';

function getConsonantClassColor(consonantClass: 'middle' | 'high' | 'low' | null) {
  if (consonantClass === 'middle') {
    return 'text-classMiddle';
  }
  if (consonantClass === 'high') {
    return 'text-classHigh';
  }
  if (consonantClass === 'low') {
    return 'text-classLow';
  }
  return 'text-slate-900';
}

export function LetterStudyCard({
  letter,
  header,
  footer,
  className,
  showImage = true
}: {
  letter: LetterDraft;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  showImage?: boolean;
}) {
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [showTraceGuide, setShowTraceGuide] = useState(true);
  const [guideLayout, setGuideLayout] = useState<'single' | 'grid-3x3'>('single');
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  useEffect(() => {
    if (!isPracticeOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isPracticeOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia('(max-width: 768px)');
    const apply = () => setIsMobileViewport(media.matches);
    apply();
    media.addEventListener('change', apply);

    return () => {
      media.removeEventListener('change', apply);
    };
  }, []);

  return (
    <>
      <div
        className={`mx-auto w-full max-w-md space-y-5 rounded-2xl border border-slate-300 bg-white p-5 text-center text-black shadow-xl ${
          className ?? ''
        }`}
      >
        {header}

        {showImage ? (
          <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img alt={`Mnemonic for ${letter.glyph}`} className="h-full w-full object-contain" src={letter.image_asset} />
          </div>
        ) : null}

        <div className="space-y-1">
          <h3 className={`thai-script text-[5rem] font-semibold leading-none ${getConsonantClassColor(letter.consonant_class)}`}>
            {letter.glyph}
          </h3>
          <p className="text-4xl font-semibold leading-tight">{letter.romanization_teaching}</p>
          <p className="thai-script text-3xl leading-tight text-slate-700">{letter.name_th}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left">
          <p className="text-sm font-semibold text-slate-700">Sample words</p>
          <ul className="mt-1 space-y-1 text-sm text-slate-600">
            {letter.sample_words.map((word, index) => (
              <li key={`${letter.id}-sample-${index}`}>
                <span className="thai-script">{word.th}</span> - {word.rtgs} - {word.en ?? '-'}
              </li>
            ))}
          </ul>
        </div>

        <audio className="w-full" controls preload="none" src={letter.pronunciation_audio} />

        <button
          className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
          onClick={() => setIsPracticeOpen(true)}
          type="button"
        >
          Practice writing
        </button>

        {letter.is_obsolete ? <div className="rounded bg-obsolete px-2 py-1 text-sm text-white">Obsolete</div> : null}

        {footer}
      </div>

      {isPracticeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3">
          <div className="flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-100 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Handwriting practice</p>
                <p className="thai-script text-4xl leading-none">{letter.glyph}</p>
              </div>
              <button
                aria-label="Close practice canvas"
                className="rounded bg-slate-700 px-3 py-1 text-lg text-white"
                onClick={() => setIsPracticeOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="min-h-0 flex-1 rounded-xl border border-slate-700 bg-white">
              <div className="relative h-full w-full">
                {showTraceGuide ? (
                  <div className="pointer-events-none absolute inset-0 z-0">
                    <svg className="h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1000 1000">
                      {guideLayout === 'single' ? (
                        <text
                          dominantBaseline="middle"
                          fill="transparent"
                          fontFamily="'TH Sarabun New','Sarabun','Noto Sans Thai',sans-serif"
                          fontSize={isMobileViewport ? 760 : 520}
                          opacity="0.45"
                          stroke="#94a3b8"
                          strokeDasharray="8 8"
                          strokeWidth="2"
                          textAnchor="middle"
                          x="500"
                          y={isMobileViewport ? 560 : 540}
                        >
                          {letter.glyph}
                        </text>
                      ) : (
                        <>
                          <line stroke="#cbd5e1" strokeWidth="2" x1="333.33" x2="333.33" y1="0" y2="1000" />
                          <line stroke="#cbd5e1" strokeWidth="2" x1="666.66" x2="666.66" y1="0" y2="1000" />
                          <line stroke="#cbd5e1" strokeWidth="2" x1="0" x2="1000" y1="333.33" y2="333.33" />
                          <line stroke="#cbd5e1" strokeWidth="2" x1="0" x2="1000" y1="666.66" y2="666.66" />
                          {[166.66, 500, 833.33].map((x) =>
                            [176, 509.33, 842.66].map((y) => (
                              <text
                                key={`guide-${x}-${y}`}
                                dominantBaseline="middle"
                                fill="transparent"
                                fontFamily="'TH Sarabun New','Sarabun','Noto Sans Thai',sans-serif"
                                fontSize="175"
                                opacity="0.45"
                                stroke="#94a3b8"
                                strokeDasharray="8 8"
                                strokeWidth="2"
                                textAnchor="middle"
                                x={x}
                                y={y}
                              >
                                {letter.glyph}
                              </text>
                            ))
                          )}
                        </>
                      )}
                    </svg>
                  </div>
                ) : null}
                <ReactSketchCanvas
                  canvasColor="transparent"
                  className="relative z-10 h-full w-full"
                  ref={canvasRef}
                  strokeColor="#111827"
                  strokeWidth={5}
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button
                className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
                onClick={() => setShowTraceGuide((value) => !value)}
                type="button"
              >
                {showTraceGuide ? 'Hide guide' : 'Show guide'}
              </button>
              <button
                className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
                onClick={() =>
                  setGuideLayout((value) => (value === 'single' ? 'grid-3x3' : 'single'))
                }
                type="button"
              >
                {guideLayout === 'single' ? 'Guide: 1x1' : 'Guide: 3x3'}
              </button>
              <button
                className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
                onClick={() => canvasRef.current?.undo()}
                type="button"
              >
                Undo
              </button>
              <button
                className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
                onClick={() => canvasRef.current?.clearCanvas()}
                type="button"
              >
                Clear
              </button>
              <button
                className="rounded bg-classLow px-3 py-1 text-sm font-medium text-slate-900"
                onClick={() => setIsPracticeOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
