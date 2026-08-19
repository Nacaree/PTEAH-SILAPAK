"use client";

import { useEffect, useMemo, useState } from "react";
import { copy, languages } from "./data/content";
import { characters, characterIds, questions, sections } from "./data/quizData";
import { getScores, getWinner, isQuizComplete } from "./lib/scoring";
import { getShareUrl } from "./lib/sharing";

const STORAGE_KEY = "pteah-silapak-quiz-v1";
const baseTheme = {
  color: "#668e3f",
  soft: "#f4f6eb",
  accent: "#aed125",
  ink: "#173d22",
};

function BrandMark({ compact = false }) {
  return (
    <div className={`flex flex-col items-center ${compact ? "gap-0" : "gap-2"}`} aria-label="Pteah Silapak">
      <div
        className={`${compact ? "h-7 w-7 text-base" : "h-24 w-24 text-5xl"} grid place-items-center rounded-[28%] border-[3px] border-current font-black`}
      >
        ⌂
      </div>
      <div className={`${compact ? "text-[8px]" : "text-xs"} font-black tracking-[0.18em]`}>PTEAH SILAPAK</div>
    </div>
  );
}

function ArtworkPlaceholder({ kind, color = "#668e3f", label, large = false }) {
  const symbols = {
    key: "⚿",
    group: "● ● ●\n ● ●",
    mirror: "◐",
    spark: "✦",
    path: "↝",
    people: "●●",
    home: "⌂",
    books: "▰",
  };

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-[2rem] border-2 border-black/10 bg-white/75 shadow-[0_12px_34px_rgba(19,41,24,0.12)] ${large ? "h-56 w-48" : "h-36 w-36"}`}
      style={{ color }}
      aria-label={`${label || kind} placeholder artwork`}
    >
      <div className="absolute -right-5 -top-7 h-24 w-24 rounded-full bg-current opacity-10" />
      <div className="absolute -bottom-8 -left-6 h-28 w-28 rotate-12 rounded-[2rem] bg-current opacity-15" />
      <span className={`relative whitespace-pre-line text-center font-black leading-none ${large ? "text-7xl" : "text-5xl"}`}>
        {symbols[kind] || "✳"}
      </span>
      {label && (
        <span className="absolute bottom-3 rounded-full bg-white/80 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-black/55">
          {label}
        </span>
      )}
    </div>
  );
}

function PatternBand({ color, accent }) {
  return (
    <div
      className="motif-band h-12 w-full shrink-0"
      style={{ "--pattern-color": color, "--pattern-accent": accent }}
      aria-hidden="true"
    />
  );
}

function ProgressDots({ active, total = 3 }) {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-label={`Step ${active + 1} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 rounded-full transition-all ${index === active ? "w-5 bg-current" : "w-1.5 bg-current opacity-25"}`}
        />
      ))}
    </div>
  );
}

function Shell({ children, theme = baseTheme, patterned = false, scroll = false }) {
  return (
    <main className="min-h-[100dvh] bg-[#706b6d] sm:grid sm:place-items-center sm:p-6">
      <div
        className={`relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-[var(--soft)] text-[var(--ink)] shadow-2xl sm:min-h-[820px] sm:rounded-[2rem] ${scroll ? "max-h-[100dvh] overflow-y-auto sm:max-h-[calc(100dvh-3rem)]" : "sm:h-[820px]"}`}
        style={{
          "--theme": theme.color,
          "--soft": theme.soft,
          "--accent": theme.accent,
          "--ink": theme.ink || "#173d22",
        }}
      >
        {patterned && <PatternBand color={theme.color} accent={theme.accent} />}
        {children}
      </div>
    </main>
  );
}

function TopBrand({ onHome, theme = baseTheme }) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between rounded-b-[1.6rem] bg-[var(--theme)] px-5 text-white shadow-sm">
      <button
        type="button"
        onClick={onHome}
        className="rounded-full p-1.5 transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Return home"
      >
        <BrandMark compact />
      </button>
      <span className="rounded-full border border-white/30 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em]">
        {theme.number ? `Section ${theme.number}` : "The quiz"}
      </span>
    </div>
  );
}

function BottomNav({ onHome }) {
  return (
    <div className="mt-auto flex h-12 shrink-0 items-center justify-center bg-[#668e3f] text-white">
      <button
        type="button"
        onClick={onHome}
        className="grid h-9 w-12 place-items-center rounded-full text-xl transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
        aria-label="Return to landing page"
      >
        ⌂
      </button>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled = false, light = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-12 rounded-full px-7 py-3 text-sm font-black tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-35 ${
        light
          ? "bg-white text-[var(--theme)] hover:bg-white/90 focus-visible:outline-white"
          : "bg-[var(--theme)] text-white shadow-[0_8px_20px_rgba(24,63,35,0.18)] hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-[var(--theme)]"
      }`}
    >
      {children}
    </button>
  );
}

function Landing({ onLanguage, notice, hasProgress, onResume, onReset }) {
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-[#668e3f]">
        <BrandMark />
        <p className="mt-6 max-w-56 text-center text-sm font-semibold text-black/50">
          A house for art, questions, and the people we are becoming.
        </p>

        <div className="mt-14 flex rounded-full border border-[#668e3f]/30 bg-white p-1 shadow-sm">
          {Object.entries(languages).map(([id, language]) => (
            <button
              key={id}
              type="button"
              onClick={() => onLanguage(id)}
              aria-disabled={!language.available}
              className={`min-w-20 rounded-full px-5 py-2.5 text-xs font-black tracking-[0.12em] transition focus-visible:outline-2 focus-visible:outline-[#668e3f] ${
                language.available ? "bg-[#668e3f] text-white hover:bg-[#567c34]" : "text-[#668e3f] hover:bg-[#eef4e7]"
              }`}
            >
              {language.label}
              {!language.available && <span className="ml-1 text-[8px] opacity-65">SOON</span>}
            </button>
          ))}
        </div>

        <p className="mt-4 min-h-5 text-center text-xs font-bold text-[#d9471b]" role="status" aria-live="polite">
          {notice}
        </p>

        {hasProgress && (
          <div className="mt-7 flex w-full max-w-xs flex-col gap-3 border-t border-[#668e3f]/20 pt-7">
            <PrimaryButton onClick={onResume}>Continue where you left off</PrimaryButton>
            <button type="button" onClick={onReset} className="text-xs font-bold text-black/45 underline underline-offset-4">
              Start fresh
            </button>
          </div>
        )}
      </div>
      <div className="h-2 bg-[#aed125]" />
    </Shell>
  );
}

function Cover({ text, onEnter, onBack }) {
  return (
    <Shell theme={baseTheme} patterned>
      <TopBrand onHome={onBack} />
      <div className="relative flex flex-1 flex-col items-center px-8 pb-7 pt-9 text-center">
        <div className="absolute left-5 top-32 rotate-[-12deg] text-5xl opacity-70" aria-hidden="true">▤</div>
        <div className="absolute bottom-24 right-5 rotate-12 text-5xl opacity-70" aria-hidden="true">▰</div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#668e3f]/60">An invitation</p>
        <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-tight text-[#668e3f]">{text.title}</h1>
        <p className="mt-3 text-xs font-bold text-black/45">{text.subtitle}</p>
        <div className="my-auto py-7">
          <ArtworkPlaceholder kind="key" color="#668e3f" label="key artwork" large />
        </div>
        <PrimaryButton onClick={onEnter}>{text.enter}</PrimaryButton>
        <div className="mt-8 text-[#668e3f]"><ProgressDots active={0} /></div>
      </div>
    </Shell>
  );
}

function Story({ text, onNext, onBack, onHome }) {
  return (
    <Shell theme={baseTheme} patterned>
      <TopBrand onHome={onHome} />
      <div className="flex flex-1 flex-col px-7 pb-6 pt-8">
        <div className="text-5xl text-[#668e3f]" aria-hidden="true">⚿</div>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#668e3f]">{text.introduction}</h1>
        <div className="mt-4 rounded-2xl bg-[#668e3f] p-5 text-sm font-semibold leading-relaxed text-white shadow-lg">
          <p>{text.story}</p>
          <p className="mt-3 text-xs text-white/75">{text.storyNote}</p>
        </div>
        <div className="my-auto flex justify-center py-7">
          <ArtworkPlaceholder kind="group" color="#668e3f" label="five housemates" large />
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <button type="button" onClick={onBack} className="justify-self-start text-xs font-black text-black/45 underline underline-offset-4">
            {text.back}
          </button>
          <div className="text-[#668e3f]"><ProgressDots active={1} /></div>
          <button type="button" onClick={onNext} className="justify-self-end rounded-full bg-[#668e3f] px-5 py-2 text-xs font-black text-white">
            {text.next} →
          </button>
        </div>
      </div>
    </Shell>
  );
}

function Instructions({ text, onBegin, onBack, onHome }) {
  return (
    <Shell theme={baseTheme} patterned>
      <TopBrand onHome={onHome} />
      <div className="flex flex-1 flex-col justify-center px-6 py-8">
        <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.22em] text-[#668e3f]/60">Before you enter</p>
        <div className="overflow-hidden rounded-[2rem] border-2 border-[#195a2a] bg-white shadow-[0_18px_44px_rgba(24,63,35,0.14)]">
          {text.instructions.map((instruction, index) => (
            <div
              key={instruction}
              className={`grid min-h-24 place-items-center px-6 text-center font-black uppercase tracking-wide ${
                index === 1 ? "bg-[#195a2a] text-white" : index === 2 ? "bg-[#0f4f20] text-white" : "text-[#195a2a]"
              } ${index > 0 ? "border-t-2 border-[#195a2a]" : ""}`}
            >
              <span className={index === 0 ? "max-w-56 text-sm" : "text-lg"}>{instruction}</span>
            </div>
          ))}
          <div className="bg-[#0f4f20] px-7 pb-8 pt-4">
            <button
              type="button"
              onClick={onBegin}
              className="group flex min-h-16 w-full items-center rounded-full bg-white px-3 text-[#195a2a] transition hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#195a2a] text-white">●</span>
              <span className="h-2 flex-1 bg-[#195a2a]" />
              <span className="pr-4 text-sm font-black">{text.begin} →</span>
            </button>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center">
          <button type="button" onClick={onBack} className="justify-self-start text-xs font-black text-black/45 underline underline-offset-4">
            {text.back}
          </button>
          <div className="text-[#668e3f]"><ProgressDots active={2} /></div>
        </div>
      </div>
    </Shell>
  );
}

function SectionIntro({ section, onContinue, onBack, onHome }) {
  return (
    <Shell theme={section} patterned>
      <TopBrand onHome={onHome} theme={section} />
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 py-9 text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] opacity-60">Section {section.number}</p>
        <div className="my-8">
          <ArtworkPlaceholder kind={section.art} color={section.color} label="temporary character" />
        </div>
        <h1 className="max-w-xs text-4xl font-black uppercase leading-[0.92] tracking-tight">{section.title}</h1>
        <p className="mt-4 max-w-64 text-sm font-semibold opacity-65">{section.subtitle}</p>
        <div className="mt-10 flex w-full max-w-xs items-center justify-between gap-3">
          <button type="button" onClick={onBack} className="px-3 py-2 text-xs font-black underline decoration-current/30 underline-offset-4">
            Back
          </button>
          <PrimaryButton onClick={onContinue}>Enter section →</PrimaryButton>
        </div>
      </div>
      <BottomNav onHome={onHome} />
    </Shell>
  );
}

function QuestionScreen({ question, index, section, answer, onAnswer, onNext, onBack, onHome }) {
  const sectionPosition = index - section.start + 1;
  const sectionTotal = section.end - section.start + 1;

  return (
    <Shell theme={section} patterned>
      <TopBrand onHome={onHome} theme={section} />
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-4 pt-5">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] opacity-60">
          <span>{sectionPosition}/{sectionTotal} in section</span>
          <span>{index + 1}/15</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10" aria-hidden="true">
          <div className="h-full rounded-full bg-[var(--theme)] transition-all duration-300" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>

        <fieldset className="mt-5 min-h-0 flex-1">
          <legend className="mx-auto block max-w-[350px] px-2 text-center text-[1.45rem] font-black leading-[1.04] tracking-tight">
            {question.prompt}
          </legend>
          <div className="mt-5 grid gap-2.5">
            {question.options.map((option, optionIndex) => {
              const selected = answer === option.id;
              return (
                <label
                  key={option.id}
                  className={`group flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 text-[13px] font-semibold leading-snug shadow-sm transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--theme)] ${
                    selected
                      ? "border-[var(--theme)] bg-[var(--theme)] text-white shadow-md"
                      : "border-black/10 bg-white text-black/75 hover:-translate-y-0.5 hover:border-[var(--theme)]"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={selected}
                    onChange={() => onAnswer(question.id, option.id)}
                    className="sr-only"
                  />
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-black ${selected ? "bg-white text-[var(--theme)]" : "bg-[var(--soft)] text-[var(--theme)]"}`}>
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span className="pt-0.5">{option.text}</span>
                  {selected && <span className="ml-auto pt-0.5 text-xs" aria-label="Selected">✓</span>}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button type="button" onClick={onBack} className="min-h-11 rounded-full px-4 text-xs font-black underline decoration-current/30 underline-offset-4">
            ← Back
          </button>
          <PrimaryButton onClick={onNext} disabled={!answer}>
            {index === questions.length - 1 ? "Meet my match" : "Next →"}
          </PrimaryButton>
        </div>
      </div>
      <BottomNav onHome={onHome} />
    </Shell>
  );
}

function ResultScreen({ winner, scores, onRetake, onHome, onShare, copied, shared }) {
  const total = scores ? Object.values(scores).reduce((sum, score) => sum + score, 0) : 0;

  return (
    <Shell theme={{ ...baseTheme, color: winner.color }} patterned scroll>
      <TopBrand onHome={onHome} theme={{ ...baseTheme, color: winner.color }} />
      <div className="flex flex-col items-center px-6 pb-10 pt-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-55">Your closest match is</p>
        <h1 className="mt-2 text-5xl font-black tracking-tight" style={{ color: winner.color }}>{winner.name}</h1>
        <p className="mt-1 text-sm font-black uppercase tracking-[0.12em] opacity-55">{winner.archetype}</p>

        <div className="my-7">
          <div
            className="relative grid h-44 w-44 place-items-center overflow-hidden rounded-[2.8rem] border-4 bg-white shadow-[0_18px_45px_rgba(20,31,23,0.16)]"
            style={{ borderColor: winner.color, color: winner.color }}
            aria-label={`${winner.name} temporary portrait`}
          >
            <span className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-current opacity-15" />
            <span className="absolute -bottom-10 -left-5 h-32 w-32 rotate-12 rounded-[2.5rem] bg-current opacity-10" />
            <span className="relative text-7xl font-black">{winner.mark}</span>
            <span className="absolute bottom-3 text-[9px] font-black uppercase tracking-[0.18em]">portrait later</span>
          </div>
        </div>

        <p className="max-w-sm text-xl font-black leading-tight">{winner.summary}</p>
        <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-black/60">{winner.description}</p>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {winner.strengths.map((strength) => (
            <span key={strength} className="rounded-full px-4 py-2 text-xs font-black text-white" style={{ backgroundColor: winner.color }}>
              {strength}
            </span>
          ))}
        </div>

        <div className="mt-8 grid w-full gap-3 text-left">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: winner.color }}>A tender spot</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-black/65">{winner.vulnerability}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: winner.color }}>How you connect</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-black/65">{winner.connection}</p>
          </div>
        </div>

        {scores && !shared && (
          <div className="mt-8 w-full rounded-2xl bg-white p-5 text-left shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.14em]">Your house mix</h2>
            <div className="mt-4 grid gap-3">
              {characterIds.map((id) => (
                <div key={id} className="grid grid-cols-[62px_1fr_25px] items-center gap-2 text-xs font-bold">
                  <span>{characters[id].name}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-black/8">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${total ? (scores[id] / total) * 100 : 0}%`, backgroundColor: characters[id].color }}
                    />
                  </div>
                  <span className="text-right text-black/45">{scores[id]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {shared && (
          <p className="mt-7 rounded-full bg-white px-5 py-2 text-xs font-bold text-black/50 shadow-sm">A friend shared this character with you.</p>
        )}

        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <PrimaryButton onClick={onShare}>{copied ? "Link copied ✓" : "Copy result link"}</PrimaryButton>
          <button type="button" onClick={onRetake} className="min-h-12 rounded-full border-2 border-black/15 bg-white px-5 text-sm font-black transition hover:border-black/30">
            Take the quiz
          </button>
        </div>
        <button type="button" onClick={onHome} className="mt-5 text-xs font-black text-black/45 underline underline-offset-4">Back home</button>
      </div>
    </Shell>
  );
}

function getSection(index) {
  return sections.find((section) => index >= section.start && index <= section.end) || sections[0];
}

export default function Home() {
  const [screen, setScreen] = useState("landing");
  const [language, setLanguage] = useState("en");
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [sharedResultId, setSharedResultId] = useState(null);

  const text = copy[language] && Object.keys(copy[language]).length ? copy[language] : copy.en;
  const currentQuestion = questions[currentIndex];
  const currentSection = getSection(currentIndex);
  const complete = isQuizComplete(answers);
  const result = useMemo(() => getWinner(answers), [answers]);
  const resultId = sharedResultId || result.winnerId;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("result");
    if (sharedId && characters[sharedId]) {
      setSharedResultId(sharedId);
      setScreen("result");
      setHydrated(true);
      return;
    }

    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      if (saved) {
        setLanguage(saved.language === "km" ? "en" : saved.language || "en");
        setAnswers(saved.answers || {});
        setCurrentIndex(Number.isInteger(saved.currentIndex) ? saved.currentIndex : 0);
        setScreen(saved.screen || "landing");
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || sharedResultId) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ language, answers, currentIndex, screen }),
    );
  }, [answers, currentIndex, hydrated, language, screen, sharedResultId]);

  function selectLanguage(id) {
    if (!languages[id].available) {
      setNotice(text.comingSoon);
      return;
    }
    setLanguage(id);
    setNotice("");
    setScreen("cover");
  }

  function chooseAnswer(questionId, optionId) {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  }

  function beginQuiz() {
    setCurrentIndex(0);
    setScreen("section");
  }

  function nextQuestion() {
    if (!answers[currentQuestion.id]) return;
    if (currentIndex === questions.length - 1) {
      if (complete) {
        setScreen("result");
        const finalResult = getWinner(answers);
        window.history.replaceState({}, "", `${window.location.pathname}?result=${finalResult.winnerId}`);
      }
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextSection = getSection(nextIndex);
    setCurrentIndex(nextIndex);
    setScreen(nextSection.id !== currentSection.id ? "section" : "question");
  }

  function previousQuestion() {
    if (currentIndex === currentSection.start) {
      setScreen("section");
      return;
    }
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function backFromSection() {
    if (currentSection.number === 1) {
      setScreen("instructions");
      return;
    }
    setCurrentIndex(currentSection.start - 1);
    setScreen("question");
  }

  function goHome() {
    setSharedResultId(null);
    window.history.replaceState({}, "", window.location.pathname);
    setScreen("landing");
  }

  function resetQuiz(destination = "cover") {
    setAnswers({});
    setCurrentIndex(0);
    setSharedResultId(null);
    setCopied(false);
    window.localStorage.removeItem(STORAGE_KEY);
    window.history.replaceState({}, "", window.location.pathname);
    setScreen(destination);
  }

  function resumeQuiz() {
    if (complete) {
      setScreen("result");
      return;
    }
    const firstUnanswered = questions.findIndex((question) => !answers[question.id]);
    const resumeIndex = firstUnanswered >= 0 ? firstUnanswered : currentIndex;
    setCurrentIndex(resumeIndex);
    setScreen("question");
  }

  async function shareResult() {
    const url = getShareUrl(resultId, window.location.origin, window.location.pathname);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy this result link:", url);
    }
  }

  if (!hydrated) {
    return (
      <Shell>
        <div className="grid flex-1 place-items-center text-[#668e3f]">
          <div className="animate-pulse"><BrandMark /></div>
        </div>
      </Shell>
    );
  }

  if (screen === "cover") return <Cover text={text} onEnter={() => setScreen("story")} onBack={goHome} />;
  if (screen === "story") return <Story text={text} onNext={() => setScreen("instructions")} onBack={() => setScreen("cover")} onHome={goHome} />;
  if (screen === "instructions") return <Instructions text={text} onBegin={beginQuiz} onBack={() => setScreen("story")} onHome={goHome} />;
  if (screen === "section") return <SectionIntro section={currentSection} onContinue={() => setScreen("question")} onBack={backFromSection} onHome={goHome} />;
  if (screen === "question") {
    return (
      <QuestionScreen
        question={currentQuestion}
        index={currentIndex}
        section={currentSection}
        answer={answers[currentQuestion.id]}
        onAnswer={chooseAnswer}
        onNext={nextQuestion}
        onBack={previousQuestion}
        onHome={goHome}
      />
    );
  }
  if (screen === "result") {
    return (
      <ResultScreen
        winner={characters[resultId]}
        scores={sharedResultId ? null : getScores(answers)}
        onRetake={() => resetQuiz("cover")}
        onHome={goHome}
        onShare={shareResult}
        copied={copied}
        shared={Boolean(sharedResultId)}
      />
    );
  }

  return (
    <Landing
      onLanguage={selectLanguage}
      notice={notice}
      hasProgress={Object.keys(answers).length > 0}
      onResume={resumeQuiz}
      onReset={() => resetQuiz("cover")}
    />
  );
}
