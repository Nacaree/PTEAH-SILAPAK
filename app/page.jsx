import { useEffect, useMemo, useState } from "react";
import { copy, languages } from "./data/content";
import { characters, questions, sections } from "./data/quizData";
import { getRankedResults, getWinner, isQuizComplete } from "./lib/scoring";
import { getShareUrl } from "./lib/sharing";

const STORAGE_KEY = "pteah-silapak-quiz-v2";
const baseTheme = {
  color: "#668e3f",
  soft: "#f4f6eb",
  accent: "#aed125",
  ink: "#173d22",
};

function localize(value, language) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[language] || value.en || "";
  }
  return value;
}

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

function Shell({ children, theme = baseTheme, patterned = false, scroll = false, language = "en" }) {
  return (
    <main className="min-h-[100dvh] bg-[#706b6d] sm:grid sm:place-items-center sm:p-6">
      <div
        lang={language === "km" ? "km" : "en"}
        className={`relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-[var(--soft)] text-[var(--ink)] shadow-2xl sm:min-h-[820px] sm:rounded-[2rem] ${language === "km" ? "font-khmer" : ""} ${scroll ? "max-h-[100dvh] overflow-y-auto sm:max-h-[calc(100dvh-3rem)]" : "sm:h-[820px]"}`}
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

function TopBrand({ onHome, theme = baseTheme, text }) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between rounded-b-[1.6rem] bg-[var(--theme)] px-5 text-white shadow-sm">
      <button
        type="button"
        onClick={onHome}
        className="rounded-full p-1.5 transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={text.home}
      >
        <BrandMark compact />
      </button>
      <span className="rounded-full border border-white/30 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em]">
        {theme.number ? `${text.section} ${theme.number}` : text.quiz}
      </span>
    </div>
  );
}

function BottomNav({ onHome, text }) {
  return (
    <div className="mt-auto flex h-12 shrink-0 items-center justify-center bg-[#668e3f] text-white">
      <button
        type="button"
        onClick={onHome}
        className="grid h-9 w-12 place-items-center rounded-full text-xl transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
        aria-label={text.home}
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

function Landing({ onLanguage, notice, hasProgress, onResume, onReset, text, language }) {
  return (
    <Shell language={language}>
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-[#668e3f]">
        <BrandMark />
        <p className="mt-6 max-w-56 text-center text-sm font-semibold text-black/50">
          {text.landingTagline}
        </p>

        <div className="mt-14 flex rounded-full border border-[#668e3f]/30 bg-white p-1 shadow-sm">
          {Object.entries(languages).map(([id, languageOption]) => (
            <button
              key={id}
              type="button"
              onClick={() => onLanguage(id)}
              aria-pressed={language === id}
              className={`min-w-20 rounded-full px-5 py-2.5 text-xs font-black tracking-[0.12em] transition focus-visible:outline-2 focus-visible:outline-[#668e3f] ${
                language === id ? "bg-[#668e3f] text-white" : "text-[#668e3f] hover:bg-[#eef4e7]"
              }`}
            >
              {languageOption.label}
            </button>
          ))}
        </div>

        <p className="mt-4 min-h-5 text-center text-xs font-bold text-[#d9471b]" role="status" aria-live="polite">
          {notice}
        </p>

        {hasProgress && (
          <div className="mt-7 flex w-full max-w-xs flex-col gap-3 border-t border-[#668e3f]/20 pt-7">
            <PrimaryButton onClick={onResume}>{text.resume}</PrimaryButton>
            <button type="button" onClick={onReset} className="text-xs font-bold text-black/45 underline underline-offset-4">
              {text.startAgain}
            </button>
          </div>
        )}
      </div>
      <div className="h-2 bg-[#aed125]" />
    </Shell>
  );
}

function Cover({ text, language, onEnter, onBack }) {
  return (
    <Shell theme={baseTheme} patterned language={language}>
      <TopBrand onHome={onBack} text={text} />
      <div className="relative flex flex-1 flex-col items-center px-8 pb-7 pt-9 text-center">
        <div className="absolute left-5 top-32 rotate-[-12deg] text-5xl opacity-70" aria-hidden="true">▤</div>
        <div className="absolute bottom-24 right-5 rotate-12 text-5xl opacity-70" aria-hidden="true">▰</div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#668e3f]/60">{text.invitation}</p>
        <h1 className={`${language === "km" ? "text-3xl leading-[1.35]" : "text-4xl leading-[0.95]"} mt-3 font-black tracking-tight text-[#668e3f]`}>{text.title}</h1>
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

function Story({ text, language, onNext, onBack, onHome }) {
  return (
    <Shell theme={baseTheme} patterned language={language}>
      <TopBrand onHome={onHome} text={text} />
      <div className="flex flex-1 flex-col px-7 pb-6 pt-8">
        <div className="text-5xl text-[#668e3f]" aria-hidden="true">⚿</div>
        <h1 className={`${language === "km" ? "text-3xl leading-relaxed" : "text-4xl"} mt-3 font-black tracking-tight text-[#668e3f]`}>{text.introduction}</h1>
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

function Instructions({ text, language, onBegin, onBack, onHome }) {
  return (
    <Shell theme={baseTheme} patterned language={language}>
      <TopBrand onHome={onHome} text={text} />
      <div className="flex flex-1 flex-col justify-center px-6 py-8">
        <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.22em] text-[#668e3f]/60">{text.beforeYouEnter}</p>
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

function SectionIntro({ section, text, language, onContinue, onBack, onHome }) {
  return (
    <Shell theme={section} patterned language={language}>
      <TopBrand onHome={onHome} theme={section} text={text} />
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 py-9 text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] opacity-60">{text.section} {section.number}</p>
        <div className="my-8">
          <ArtworkPlaceholder kind={section.art} color={section.color} label="temporary character" />
        </div>
        <h1 className={`${language === "km" ? "text-3xl leading-[1.45]" : "text-4xl uppercase leading-[0.92]"} max-w-xs font-black tracking-tight`}>{localize(section.title, language)}</h1>
        <p className={`${language === "km" ? "leading-7" : ""} mt-4 max-w-72 text-sm font-semibold opacity-65`}>{localize(section.subtitle, language)}</p>
        <div className="mt-10 flex w-full max-w-xs items-center justify-between gap-3">
          <button type="button" onClick={onBack} className="px-3 py-2 text-xs font-black underline decoration-current/30 underline-offset-4">
            {text.back}
          </button>
          <PrimaryButton onClick={onContinue}>{text.enterSection} →</PrimaryButton>
        </div>
      </div>
      <BottomNav onHome={onHome} text={text} />
    </Shell>
  );
}

function QuestionScreen({ question, index, section, answer, text, language, onAnswer, onNext, onBack, onHome }) {
  const sectionPosition = index - section.start + 1;
  const sectionTotal = section.end - section.start + 1;

  return (
    <Shell theme={section} patterned language={language}>
      <TopBrand onHome={onHome} theme={section} text={text} />
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-4 pt-5">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] opacity-60">
          <span>{sectionPosition}/{sectionTotal} {text.inSection}</span>
          <span>{index + 1}/15</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10" aria-hidden="true">
          <div className="h-full rounded-full bg-[var(--theme)] transition-all duration-300" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>

        <fieldset className="mt-5 min-h-0 flex-1">
          <legend className={`${language === "km" ? "text-[1.15rem] leading-[1.65]" : "text-[1.45rem] leading-[1.04]"} mx-auto block max-w-[370px] px-2 text-center font-black tracking-tight`}>
            {localize(question.prompt, language)}
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
                  <span className={`${language === "km" ? "leading-6" : ""} pt-0.5`}>{localize(option.text, language)}</span>
                  {selected && <span className="ml-auto pt-0.5 text-xs" aria-label={text.selected}>✓</span>}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button type="button" onClick={onBack} className="min-h-11 rounded-full px-4 text-xs font-black underline decoration-current/30 underline-offset-4">
            ← {text.back}
          </button>
          <PrimaryButton onClick={onNext} disabled={!answer}>
            {index === questions.length - 1 ? text.meetMatch : `${text.next} →`}
          </PrimaryButton>
        </div>
      </div>
      <BottomNav onHome={onHome} text={text} />
    </Shell>
  );
}

function ResultScreen({ winner, ranking, text, language, onRetake, onHome, onShare, copied, shared }) {
  const topMatch = ranking?.[0];
  const secondMatch = ranking?.[1];
  const runnerUp = secondMatch ? characters[secondMatch.characterId] : null;

  return (
    <Shell theme={{ ...baseTheme, color: winner.color }} patterned scroll language={language}>
      <TopBrand onHome={onHome} theme={{ ...baseTheme, color: winner.color }} text={text} />
      <div className="flex flex-col items-center px-6 pb-10 pt-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-55">{text.resultEyebrow}</p>
        <h1 className={`${language === "km" ? "text-4xl leading-relaxed" : "text-5xl"} mt-2 font-black tracking-tight`} style={{ color: winner.color }}>{localize(winner.name, language)}</h1>
        <p className={`${language === "km" ? "leading-7" : "uppercase tracking-[0.12em]"} mt-1 text-sm font-black opacity-55`}>{localize(winner.archetype, language)}</p>
        {topMatch && (
          <div
            className="mt-4 rounded-full px-5 py-2 text-lg font-black text-white shadow-sm"
            style={{ backgroundColor: winner.color }}
          >
            {topMatch.percentage.toFixed(1)}% {text.match}
          </div>
        )}

        <div className="my-7">
          <div
            className="relative grid h-44 w-44 place-items-center overflow-hidden rounded-[2.8rem] border-4 bg-white shadow-[0_18px_45px_rgba(20,31,23,0.16)]"
            style={{ borderColor: winner.color, color: winner.color }}
            aria-label={`${localize(winner.name, language)} portrait`}
          >
            <span className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-current opacity-15" />
            <span className="absolute -bottom-10 -left-5 h-32 w-32 rotate-12 rounded-[2.5rem] bg-current opacity-10" />
            <span className="relative text-7xl font-black">{winner.mark}</span>
            <span className="absolute bottom-3 text-[9px] font-black uppercase tracking-[0.18em]">portrait later</span>
          </div>
        </div>

        <p className={`${language === "km" ? "leading-9" : "leading-tight"} max-w-sm text-xl font-black`}>{localize(winner.summary, language)}</p>

        {runnerUp && (
          <div className="mt-8 flex w-full items-center gap-4 rounded-2xl border-2 border-black/8 bg-white p-4 text-left shadow-sm">
            <div
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl font-black text-white"
              style={{ backgroundColor: runnerUp.color }}
              aria-hidden="true"
            >
              {runnerUp.mark}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">{text.secondMatch}</p>
              <p className="mt-1 text-lg font-black" style={{ color: runnerUp.color }}>{localize(runnerUp.name, language)}</p>
              <p className={`${language === "km" ? "leading-5" : ""} text-xs font-bold text-black/45`}>{localize(runnerUp.archetype, language)}</p>
            </div>
            <span className="text-lg font-black" style={{ color: runnerUp.color }}>
              {secondMatch.percentage.toFixed(1)}%
            </span>
          </div>
        )}

        <h2 className="mt-8 w-full text-left text-sm font-black uppercase tracking-[0.14em]">{text.moreInfo}</h2>
        <div className="mt-3 grid w-full gap-3 text-left">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: winner.color }}>{text.strength}</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-black/65">{localize(winner.strength, language)}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: winner.color }}>{text.challenge}</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-black/65">{localize(winner.challenge, language)}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: winner.color }}>{text.hiddenFear}</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-black/65">{localize(winner.hiddenFear, language)}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: winner.color }}>{text.traits}</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-black/65">{localize(winner.traits, language)}</p>
          </div>
        </div>

        {ranking && !shared && (
          <div className="mt-8 w-full rounded-2xl bg-white p-5 text-left shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.14em]">{text.fullBreakdown}</h2>
            <div className="mt-4 grid gap-3">
              {ranking.map((match) => (
                <div key={match.characterId} className="grid grid-cols-[18px_62px_1fr_48px] items-center gap-2 text-xs font-bold">
                  <span className="text-black/35">{match.rank}</span>
                  <span>{localize(characters[match.characterId].name, language)}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-black/8">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${match.percentage}%`, backgroundColor: characters[match.characterId].color }}
                    />
                  </div>
                  <span className="text-right text-black/45">{match.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {shared && (
          <p className="mt-7 rounded-full bg-white px-5 py-2 text-xs font-bold text-black/50 shadow-sm">{text.sharedResult}</p>
        )}

        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <PrimaryButton onClick={onShare}>{copied ? text.copied : text.share}</PrimaryButton>
          <button type="button" onClick={onRetake} className="min-h-12 rounded-full border-2 border-black/15 bg-white px-5 text-sm font-black transition hover:border-black/30">
            {text.retake}
          </button>
        </div>
        <button type="button" onClick={onHome} className="mt-5 text-xs font-black text-black/45 underline underline-offset-4">{text.backHome}</button>
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
  const ranking = useMemo(() => getRankedResults(answers), [answers]);
  const resultId = sharedResultId || ranking[0].characterId;

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
        setLanguage(languages[saved.language]?.available ? saved.language : "en");
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
    document.documentElement.lang = language === "km" ? "km" : "en";
  }, [language]);

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
      window.prompt(text.copyPrompt, url);
    }
  }

  if (!hydrated) {
    return (
      <Shell language={language}>
        <div className="grid flex-1 place-items-center text-[#668e3f]">
          <div className="animate-pulse"><BrandMark /></div>
        </div>
      </Shell>
    );
  }

  if (screen === "cover") return <Cover text={text} language={language} onEnter={() => setScreen("story")} onBack={goHome} />;
  if (screen === "story") return <Story text={text} language={language} onNext={() => setScreen("instructions")} onBack={() => setScreen("cover")} onHome={goHome} />;
  if (screen === "instructions") return <Instructions text={text} language={language} onBegin={beginQuiz} onBack={() => setScreen("story")} onHome={goHome} />;
  if (screen === "section") return <SectionIntro section={currentSection} text={text} language={language} onContinue={() => setScreen("question")} onBack={backFromSection} onHome={goHome} />;
  if (screen === "question") {
    return (
      <QuestionScreen
        question={currentQuestion}
        index={currentIndex}
        section={currentSection}
        text={text}
        language={language}
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
        ranking={sharedResultId ? null : ranking}
        text={text}
        language={language}
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
      text={text}
      language={language}
    />
  );
}
