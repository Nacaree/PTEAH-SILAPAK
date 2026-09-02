import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { copy, languages } from "./data/content";
import { characters, questions, sections } from "./data/quizData";
import { getPreviewRanking, getRankedResults, getWinner, isQuizComplete } from "./lib/scoring";
import { getShareUrl } from "./lib/sharing";

const STORAGE_KEY = "pteah-silapak-quiz-v2";
const baseTheme = {
  color: "#66883e",
  soft: "#fafafa",
  accent: "#b5d627",
  ink: "#2b2b2b",
};

export const optimizedAssets = {
  logo: "/assets/optimized/logo.webp",
  wordmark: "/assets/optimized/wordmark.webp",
  whiteLogo: "/assets/optimized/white-logo.webp",
  keyholes: "/assets/optimized/keyholes.webp",
  pattern: "/assets/optimized/pattern.webp",
  cover: {
    key: "/assets/optimized/cover-key.webp",
    notebook: "/assets/optimized/cover-notebook.webp",
    fortune: "/assets/optimized/cover-fortune.webp",
    greenTicket: "/assets/optimized/cover-green-ticket.webp",
    studentId: "/assets/optimized/cover-student-id.webp",
    receipt: "/assets/optimized/cover-receipt.webp",
    ticketStub: "/assets/optimized/cover-ticket-stub.webp",
    boardingPass: "/assets/optimized/cover-boarding-pass.webp",
    camera: "/assets/optimized/cover-camera.webp",
    passport: "/assets/optimized/cover-passport.webp",
  },
};

const coverPreloadSources = [
  optimizedAssets.logo,
  optimizedAssets.wordmark,
  ...Object.values(optimizedAssets.cover),
];

const pngPreloadSources = [
  "/assets/2Character_essential-06.png",
  "/assets/2Character_essential-07.png",
  "/assets/2Character_essential-08.png",
  "/assets/2Character_essential-09.png",
  "/assets/2Character_essential-10.png",
  "/assets/3Character_essential-06.png",
  "/assets/3Character_essential-07.png",
  "/assets/3Character_essential-08.png",
  "/assets/3Character_essential-09.png",
  "/assets/3Character_essential-10.png",
  "/assets/Character_essential-06.png",
  "/assets/Character_essential-07.png",
  "/assets/Character_essential-09.png",
  "/assets/Character_essential-10.png",
  "/assets/KeyCharacter_essential.png",
  "/assets/PS%20ASSEST%20UI-21.png",
  "/assets/PS%20ASSEST%20UI-22.png",
  "/assets/PS%20ASSEST%20UI-23.png",
  "/assets/PS%20ASSEST%20UI-24.png",
  "/assets/Vitou.png",
  "/assets/VitouItemCharacter_essential.png",
  "/assets/keyholes.png",
  "/assets/pslogowhite.png",
  "/assets/pteah-silapak-logo.png",
  "/assets/pteah-silapak-pattern.png",
  "/assets/pteah-silapak-wordmark.png",
];

export function getImageLoadingProps(priority = false) {
  return {
    loading: "eager",
    decoding: "async",
    fetchPriority: priority ? "high" : "auto",
  };
}

function preloadImages(sources, priority = "auto") {
  sources.forEach((src) => {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = priority;
    image.src = src;
  });
}

const darkTextThemes = new Set(["#b5d627", "#ff582e", "#feb2bf"]);

const resultPalettes = {
  anita: {
    accent: "#b5d627",
    label: "#1a4c19",
    accentText: "#1a4c19",
    labelText: "#fafafa",
    breakdownTrack: "rgba(26, 76, 25, 0.38)",
  },
  kimly: { accent: "#feb2bf", label: "#ff582e", accentText: "#2b2b2b", labelText: "#2b2b2b", breakdownTrack: "rgba(255, 88, 46, 0.34)" },
  tohla: { accent: "#ff582e", label: "#c8320d", accentText: "#fafafa", labelText: "#fafafa", breakdownTrack: "rgba(200, 50, 13, 0.34)" },
  vitou: { accent: "#febe14", label: "#f57a22", accentText: "#2b2b2b", labelText: "#2b2b2b", breakdownTrack: "rgba(245, 122, 34, 0.72)" },
  mc: { accent: "#7889ea", label: "#4550a7", accentText: "#fafafa", labelText: "#fafafa", breakdownTrack: "rgba(69, 80, 167, 0.34)" },
};

const runnerUpInnerBackgrounds = {
  anita: baseTheme.color,
  kimly: "#c94f70",
  tohla: resultPalettes.tohla.accent,
  vitou: resultPalettes.vitou.accent,
  mc: resultPalettes.mc.accent,
};

const resultBarColors = {
  anita: "#1a4c19",
  mc: "#4550a7",
  vitou: "#d99f16",
  tohla: "#c8320d",
  // Match Kimly's red-orange Traits header for a clear accent on the pink panel.
  kimly: "#ff582e",
};

function getThemeContrast(theme) {
  return theme.contrast || (darkTextThemes.has(theme.color.toLowerCase()) ? "#2b2b2b" : "#fafafa");
}

function localize(value, language) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[language] || value.en || "";
  }
  return value;
}

function BrandMark({ compact = false }) {
  if (compact) {
    return (
      <span className="brand-wordmark" aria-label="Pteah Silapak">
        <img
          src={optimizedAssets.wordmark}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </span>
    );
  }

  return (
    <img
      src={optimizedAssets.logo}
      alt="Pteah Silapak"
      className="brand-logo"
    />
  );
}

function ArtworkPlaceholder({ kind, color = "#66883e", label, large = false }) {
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
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-[2rem] border-2 border-black/10 bg-white/75 shadow-[0_12px_34px_rgba(26,76,25,0.12)] ${large ? "h-56 w-48" : "h-36 w-36"}`}
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

function PatternBand({ color, accent, className = "", exactColors = false }) {
  return (
    <div
      className={`motif-band relative h-12 w-full shrink-0 overflow-hidden ${className}`}
      style={{ "--pattern-color": color, "--pattern-accent": accent }}
      aria-hidden="true"
    >
      {exactColors ? (
        <span className="motif-mask pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <img
          src={optimizedAssets.pattern}
          alt=""
          loading="eager"
          decoding="async"
          className="motif-art pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </div>
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

export const SCREEN_TRANSITION_DURATION = 220;

export function prefersReducedMotion() {
  return typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ScreenTransition({ transitionKey, direction = "forward", children }) {
  const previousKeyRef = useRef(transitionKey);
  const previousNodeRef = useRef(children);
  const timeoutRef = useRef(null);
  const [outgoing, setOutgoing] = useState(null);

  useLayoutEffect(() => {
    if (previousKeyRef.current !== transitionKey) {
      const outgoingNode = previousNodeRef.current;
      const outgoingKey = previousKeyRef.current;

      if (prefersReducedMotion()) {
        previousKeyRef.current = transitionKey;
        previousNodeRef.current = children;
        setOutgoing(null);
        return;
      }

      setOutgoing({ key: outgoingKey, node: outgoingNode, direction });
      previousKeyRef.current = transitionKey;
      previousNodeRef.current = children;

      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setOutgoing(null);
      }, SCREEN_TRANSITION_DURATION);
      return;
    }

    previousNodeRef.current = children;
  }, [children, direction, transitionKey]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return (
    <div className="screen-transition-host" data-transitioning={Boolean(outgoing)}>
      {outgoing && (
        <div
          key={`outgoing-${outgoing.key}`}
          className={`screen-transition-layer screen-transition-layer--outgoing screen-transition-layer--exiting-${outgoing.direction}`}
          aria-hidden="true"
        >
          {outgoing.node}
        </div>
      )}
      <div
        key={`current-${transitionKey}`}
        className={`screen-transition-layer screen-transition-layer--current ${outgoing ? `screen-transition-layer--entering-${direction} screen-transition-layer--locked` : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

function Shell({
  children,
  theme = baseTheme,
  patterned = false,
  patternClassName = "",
  patternColor,
  patternAccent,
  patternExactColors = false,
  scroll = false,
  language = "en",
}) {
  return (
    <main className="min-h-[100dvh] bg-[#2b2b2b] sm:grid sm:place-items-center sm:p-6">
      <div
        lang={language === "km" ? "km" : "en"}
        className={`relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-[var(--soft)] text-[var(--ink)] shadow-2xl sm:min-h-[820px] sm:rounded-[2rem] ${language === "km" ? "font-khmer" : ""} ${scroll ? "max-h-[100dvh] overflow-y-auto sm:max-h-[calc(100dvh-3rem)]" : "sm:h-[820px]"}`}
        style={{
          "--theme": theme.color,
          "--soft": theme.soft,
          "--accent": theme.accent,
          "--accent-contrast": theme.accentContrast || theme.ink || "#2b2b2b",
          "--ink": theme.ink || "#2b2b2b",
          "--contrast": getThemeContrast(theme),
        }}
      >
        {patterned && (
          <PatternBand
            color={patternColor || theme.color}
            accent={patternAccent || theme.accent}
            exactColors={patternExactColors}
            className={patternClassName}
          />
        )}
        {children}
      </div>
    </main>
  );
}

function TopBrand({ onHome, theme = baseTheme, text }) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between rounded-b-[1.6rem] bg-[var(--theme)] px-5 text-[var(--contrast)] shadow-sm">
      <button
        type="button"
        onClick={onHome}
        className="rounded-full p-1.5 transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--contrast)]"
        aria-label={text.home}
      >
        <BrandMark compact />
      </button>
      <span className="rounded-full border border-current/30 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em]">
        {theme.number ? `${text.section} ${theme.number}` : text.quiz}
      </span>
    </div>
  );
}

function BottomNav({ onHome, text }) {
  return (
    <div className="mt-auto flex h-12 shrink-0 items-center justify-center bg-[#66883e] text-white">
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
          : "bg-[var(--theme)] text-[var(--contrast)] shadow-[0_8px_20px_rgba(26,76,25,0.18)] hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-[var(--theme)]"
      }`}
    >
      {children}
    </button>
  );
}

function Landing({ onLanguage, notice, hasProgress, onResume, onReset, text, language }) {
  useEffect(() => {
    preloadImages([optimizedAssets.logo, optimizedAssets.wordmark, optimizedAssets.cover.key], "high");

    const preloadDecorations = () => {
      const primarySources = [optimizedAssets.logo, optimizedAssets.wordmark, optimizedAssets.cover.key];
      preloadImages(
        [...coverPreloadSources, ...pngPreloadSources].filter((src) => !primarySources.includes(src)),
      );
    };

    let scheduleId;
    let usingIdleCallback = false;
    if ("requestIdleCallback" in window) {
      usingIdleCallback = true;
      scheduleId = window.requestIdleCallback(preloadDecorations, { timeout: 700 });
    } else {
      scheduleId = window.setTimeout(preloadDecorations, 150);
    }

    return () => {
      if (usingIdleCallback && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(scheduleId);
      } else {
        window.clearTimeout(scheduleId);
      }
    };
  }, []);

  return (
    <Shell language={language}>
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-[#66883e]">
        <BrandMark />

        <div className="mt-6 flex overflow-hidden">
          {["km", "en"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onLanguage(id)}
              className={`grid min-h-12 w-[6.75rem] place-items-center px-4 text-2xl font-black tracking-[0.06em] text-white transition hover:brightness-95 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white ${id === "km" ? "bg-[#b5d627]" : "bg-[#66883e]"}`}
            >
              <span className="translate-x-[-1px] translate-y-0.5">
                {languages[id].label}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-4 min-h-5 text-center text-xs font-bold text-[#c8320d]" role="status" aria-live="polite">
          {notice}
        </p>

        {hasProgress && (
          <div className="mt-7 flex w-full max-w-xs flex-col gap-3 border-t border-[#66883e]/20 pt-7">
            <PrimaryButton onClick={onResume}>{text.resume}</PrimaryButton>
            <button type="button" onClick={onReset} className="text-xs font-bold text-black/45 underline underline-offset-4">
              {text.startAgain}
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}

function CoverAsset({ src, variant, className, imageClassName = "", priority = false }) {
  return (
    <div className={`cover-asset cover-asset--${variant} ${className}`} aria-hidden="true">
      <img
        src={src}
        alt=""
        {...getImageLoadingProps(priority)}
        className={`absolute inset-0 h-full w-full object-contain ${imageClassName}`}
      />
    </div>
  );
}

function Cover({ text, language, onEnter, onBack }) {
  return (
    <Shell theme={baseTheme} language={language}>
      <header className="cover-header relative grid h-24 shrink-0 place-items-center bg-[#66883e]">
        <button
          type="button"
          onClick={onBack}
          aria-label={text.home}
          className="grid h-14 w-28 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <img
            src={optimizedAssets.wordmark}
            alt="Pteah Silapak"
            className="cover-header-wordmark"
          />
        </button>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden text-center">
        <div className="absolute inset-x-6 top-10 z-20 flex flex-col items-center">
          <h1 className={`${language === "km" ? "max-w-[340px] text-[1.8rem] leading-[1.45]" : "max-w-[350px] text-[2.8rem] leading-[0.92]"} whitespace-pre-line font-black tracking-tight text-[#66883e]`}>
            {language === "en" ? "Find Your\nCreative Room" : text.title}
          </h1>
          <p className={`${language === "km" ? "mt-4 text-sm" : "mt-4 text-base"} font-black text-[#1a4c19]`}>
            {text.subtitle}
          </p>
        </div>

        <CoverAsset
          src={optimizedAssets.cover.key}
          variant="key"
          label="Key"
          className="left-1/2 top-[184px] z-10 h-[280px] w-[190px] -translate-x-1/2"
          imageClassName="rotate-90 scale-[1.65]"
          priority
        />

        <CoverAsset src={optimizedAssets.cover.notebook} variant="notebook" label="A N I T A" className="left-1 top-[190px] h-[132px] w-[105px] rotate-[12deg]"
        imageClassName="scale-[1.4]" />

        <CoverAsset src={optimizedAssets.cover.fortune} variant="fortune" label="FORTUNE" className="-right-4 top-[188px] h-[90px] w-[108px] rotate-[50deg]"
        imageClassName="scale-[1.65]" />

        <CoverAsset src={optimizedAssets.cover.greenTicket} variant="green-ticket" label="ANITA" className="-left-4 top-[364px] h-[64px] w-[118px] rotate-[280deg]"
        imageClassName="scale-[1.65]" />

        <CoverAsset src={optimizedAssets.cover.studentId} variant="student-id" label="STUDENT ID" className="-right-2 top-[325px] h-[122px] w-[102px] rotate-[289deg]" imageClassName="rotate-90 scale-[1.4]" 
         />

        <CoverAsset src={optimizedAssets.cover.receipt} variant="receipt" label="LUCKY STORE" className="-left-0.2 top-[433px] h-[122px] w-[98px] rotate-[26deg]"
        imageClassName="scale-[1.2]"
         />

        <CoverAsset src={optimizedAssets.cover.ticketStub} variant="ticket-stub" label="A13" className="-right-5 top-115 h-[70px] w-[128px] -rotate-[106deg]" imageClassName="scale-[1.9]" />

        <CoverAsset src={optimizedAssets.cover.boardingPass} variant="boarding-pass" label="TICKET" className="-left-5 top-[545px] h-[116px] w-[116px] -rotate-[49deg]"
        imageClassName="scale-[1.2]"
        />

        <CoverAsset src={optimizedAssets.cover.camera} variant="camera" label="●" className="-bottom-5 -left-2 h-[92px] w-[122px] -rotate-[102deg]"
        imageClassName="scale-[1.4]" />

        <CoverAsset src={optimizedAssets.cover.passport} variant="passport" label="HOUSE OF CREATIVE" className="-bottom-3 -right-2 h-[146px] w-[112px] -rotate-[12deg]" />

        <button
          type="button"
          onClick={onEnter}
          className="absolute left-1/2 top-[510px] z-30 grid min-h-16 w-48 -translate-x-1/2 place-items-center rounded-[1.75rem] bg-[#66883e] px-6 text-2xl font-black text-white shadow-[0_12px_26px_rgba(26,76,25,0.12)] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#66883e]"
        >
          {text.enter}
        </button>

      </div>
    </Shell>
  );
}

function Story({ text, language, onNext, onBack, onHome }) {
  return (
    <Shell theme={baseTheme} language={language}>
      <header className="cover-header relative grid h-24 shrink-0 place-items-center bg-[#66883e]">
        <button
          type="button"
          onClick={onHome}
          aria-label={text.home}
          className="grid h-14 w-32 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <img
            src={optimizedAssets.wordmark}
            alt="Pteah Silapak"
            className="cover-header-wordmark"
          />
        </button>
      </header>
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-[7.5rem]">
        <h1 className={`${language === "km" ? "text-3xl leading-relaxed" : "text-[3.35rem] leading-none"} text-center font-black tracking-tight text-[#66883e]`}>{text.introduction}</h1>

        <div className="mt-10 overflow-hidden rounded-[1.25rem] border-2 border-[#2b2b2b] bg-white shadow-[0_7px_4px_rgba(43,43,43,0.18)]">
          <div className="flex min-h-[146px] flex-col items-center justify-center bg-[#66883e] px-6 py-3 text-center text-white">
            <p className={`${language === "km" ? "text-sm leading-7" : "text-base leading-[1.28]"} font-medium`}>
              {text.story}
            </p>
            <img
              src={optimizedAssets.whiteLogo}
              alt=""
              aria-hidden="true"
              className="my-2 h-7 w-8 object-contain"
            />
            <p className={`${language === "km" ? "text-sm leading-7" : "text-base leading-tight"} font-medium`}>
              {text.storyNote}
            </p>
          </div>

          <div className="grid h-10 place-items-center border-t-2 border-[#2b2b2b] bg-white">
            <img
              src={optimizedAssets.keyholes}
              alt=""
              aria-hidden="true"
              className="h-7 w-6 object-contain"
            />
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 items-center gap-3">
          <button type="button" onClick={onBack} className="grid min-h-12 min-w-20 place-items-center justify-self-start text-base font-black text-black/45 underline underline-offset-4">
            {text.back}
          </button>
          <button type="button" onClick={onNext} className="min-h-12 justify-self-end rounded-full bg-[#66883e] px-7 py-3 text-base font-black text-white">
            {text.next} →
          </button>
        </div>
      </div>
    </Shell>
  );
}

function Instructions({ text, language, onBegin, onBack, onHome }) {
  return (
    <Shell theme={baseTheme} language={language}>
      <header className="cover-header relative grid h-24 shrink-0 place-items-center bg-[#66883e]">
        <button
          type="button"
          onClick={onHome}
          aria-label={text.home}
          className="grid h-14 w-32 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <img
            src={optimizedAssets.wordmark}
            alt="Pteah Silapak"
            className="cover-header-wordmark"
          />
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col px-0 pb-0 pt-[clamp(4.5rem,10vh,9.5rem)]">
        <h1 className={`${language === "km" ? "text-4xl leading-relaxed" : "text-[3.35rem] leading-none"} px-4 text-center font-black tracking-tight text-[#66883e]`}>
          {text.instructionTitle}
        </h1>

        <div className="relative isolate mt-8 flex min-h-0 flex-1 flex-col">
          <div className="pointer-events-none absolute -inset-x-1 bottom-0 top-[98px] z-0 bg-[#1a4c19]" aria-hidden="true" />

          <div className="relative z-10 grid min-h-[130px] shrink-0 place-items-center rounded-t-[2.5rem] border-2 border-[#2b2b2b] bg-white px-8 pb-8 text-center text-lg font-black leading-tight text-[#1a4c19] shadow-[0_5px_3px_rgba(43,43,43,0.16)]">
            {text.instructions[0]}
          </div>

          <div className="relative z-20 -mx-0.5 -mt-8 h-[90px] w-[calc(100%+4px)] shrink-0 rounded-t-[2.5rem] border-2 border-b-0 border-[#2b2b2b] bg-[#1a4c19] shadow-[0_5px_3px_rgba(43,43,43,0.15)]" aria-hidden="true" />

          <div className="relative z-30 -mt-8 grid min-h-[112px] shrink-0 place-items-center rounded-t-[2.5rem] border-2 border-[#2b2b2b] bg-white px-6 pb-8 text-center text-2xl font-black text-[#1a4c19] shadow-[0_5px_3px_rgba(43,43,43,0.15)]">
            {text.instructions[1]}
          </div>

          <div className="relative z-40 -mx-0.5 -mt-8 flex min-h-[190px] w-[calc(100%+4px)] flex-1 flex-col items-center rounded-t-[2.5rem] border-2 border-b-0 border-[#2b2b2b] bg-[#1a4c19] px-2 pb-14 pt-4 text-white shadow-[0_5px_3px_rgba(43,43,43,0.15)]">
            <p className="text-center text-2xl font-black">{text.instructions[2]}</p>
            <button
              type="button"
              onClick={onBegin}
              className="relative mt-1 min-h-[136px] w-full max-w-[400px] flex-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label={text.begin}
            >
              <img
                src={optimizedAssets.cover.key}
                alt=""
                aria-hidden="true"
                {...getImageLoadingProps(true)}
                className="absolute inset-0 h-full w-full scale-[1.24] object-contain drop-shadow-[0_5px_2px_rgba(43,43,43,0.22)]"
              />
            </button>
            <div className="pointer-events-none relative z-10 -mt-2 mb-1 flex flex-col items-center text-center text-sm font-bold text-white/85">
              <span aria-hidden="true" className="relative -top-3 text-2xl leading-none">
                ↑
              </span>
              <span>{text.keyPrompt}</span>
            </div>
          </div>
        </div>

        <button type="button" onClick={onBack} className="absolute bottom-2 left-4 z-50 grid min-h-12 min-w-20 place-items-center text-base font-black text-white/75 underline underline-offset-4">
          {text.back}
        </button>
      </div>
    </Shell>
  );
}

function SectionIntro({ section, text, language, onContinue, onBack, onHome }) {
  const sectionTitle = localize(section.title, language);
  const displayTitle = language === "en" ? sectionTitle.replace(" & ", "\n&\n") : sectionTitle;

  return (
    <Shell theme={section} language={language}>
      <header className="shrink-0">
        <PatternBand color={section.patternMotif || "#66883e"} accent={section.patternBackground || section.color} exactColors className="h-[clamp(7rem,17dvh,9rem)]" />
        <div className="cover-header relative grid h-14 place-items-center" style={{ backgroundColor: section.headerColor || "#66883e" }}>
          <button
            type="button"
            onClick={onHome}
            aria-label={text.home}
            className="grid h-12 w-28 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <img
            src={optimizedAssets.wordmark}
              alt="Pteah Silapak"
              className="cover-header-wordmark h-10 w-24"
            />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col pt-[clamp(3rem,9dvh,5rem)] text-center">
        <div className="relative z-10 grid min-h-[74px] shrink-0 place-items-center rounded-t-[2.5rem] border-2 border-b-0 border-[var(--theme)] bg-[#fafafa] px-5 text-[1.35rem] font-bold uppercase text-[var(--theme)]">
          {text.section} {section.number}
        </div>

        <section className="relative -mt-px flex min-h-0 flex-1 flex-col bg-[var(--theme)] px-6 pb-5 pt-5 text-[var(--contrast)]">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <h1 className={`${language === "km" ? "max-w-[350px] text-[1.8rem] leading-[1.55]" : "max-w-[360px] whitespace-pre-line text-[2.15rem] uppercase leading-[1.28]"} font-black tracking-tight`}>
              {displayTitle}
            </h1>
            <p className={`${language === "km" ? "mt-4 max-w-[350px] text-base leading-8" : "mt-3 max-w-xs text-base italic"} font-medium`}>
              {localize(section.subtitle, language)}
            </p>
          </div>

          <div className="flex w-full items-center justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="min-h-12 px-3 text-sm font-black underline decoration-current/45 underline-offset-4"
            >
              {text.back}
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="min-h-12 rounded-full bg-[#fafafa] px-7 py-3 text-sm font-black tracking-wide text-[var(--theme)] shadow-[0_8px_20px_rgba(43,43,43,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {text.enterSection} →
            </button>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function QuestionScreen({ question, index, section, answer, text, language, onAnswer, onNext, onBack, onHome }) {
  const sectionPosition = index - section.start + 1;
  const sectionTotal = section.end - section.start + 1;
  const isBlueSection = section.id === "belonging";
  const progressPercent = Math.min(100, Math.max(0, ((index + 1) / questions.length) * 100));

  return (
    <Shell theme={section} language={language}>
      <PatternBand color={section.patternMotif || section.color} accent={section.patternBackground || "#66883e"} exactColors className="h-[clamp(3.5rem,9dvh,5rem)]" />

      <div className="flex min-h-0 flex-1 flex-col bg-[var(--theme)] px-5 pb-4 pt-4 text-[var(--contrast)]">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] opacity-80">
          <span>{sectionPosition}/{sectionTotal} {text.inSection}</span>
          <span>{index + 1}/15</span>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full"
          style={{ backgroundColor: isBlueSection ? "rgba(26, 30, 70, 0.46)" : "rgba(250, 250, 250, 0.25)" }}
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: isBlueSection ? "#7889EA" : "var(--accent)",
            }}
          />
        </div>

        <fieldset className="mt-3 flex min-h-0 flex-1 flex-col">
          <legend className={`${language === "km" ? "text-[1.15rem] leading-[1.65]" : "text-[1.55rem] leading-[1.08]"} mx-auto block max-w-[370px] px-2 text-center font-black tracking-tight`}>
            {localize(question.prompt, language)}
          </legend>
          <div className="mt-[clamp(0.5rem,2dvh,1.25rem)] flex flex-col items-center gap-[clamp(0.5rem,1.8dvh,1rem)] pb-2">
            {question.options.map((option, optionIndex) => {
              const selected = answer === option.id;
              return (
                <label
                  key={option.id}
                  className={`group flex min-h-[54px] w-fit cursor-pointer items-start gap-2 rounded-md px-3 py-3 text-left text-base font-medium leading-snug focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-white ${language === "km" ? "min-w-[240px] max-w-[94%]" : "min-w-[180px] max-w-[88%]"} ${
                    selected
                      ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_4px_0_rgba(43,43,43,0.18)]"
                      : "bg-[#fafafa] text-[#2b2b2b]"
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
                  <span className="shrink-0 font-medium">
                    {String.fromCharCode(65 + optionIndex)}.
                  </span>
                  <span className={`break-words ${language === "km" ? "leading-6" : ""}`}>{localize(option.text, language)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-3 flex items-center justify-between gap-3">
          <button type="button" onClick={onBack} className="min-h-11 rounded-full px-4 text-sm font-black underline decoration-current/45 underline-offset-4">
            {text.back}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!answer}
            className="min-h-12 rounded-full bg-[#fafafa] px-7 py-3 text-sm font-black tracking-wide text-[var(--theme)] shadow-[0_8px_20px_rgba(43,43,43,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            {index === questions.length - 1 ? text.meetMatch : `${text.next} →`}
          </button>
        </div>
      </div>

      <footer className="grid h-[clamp(4.5rem,10dvh,5.5rem)] shrink-0 place-items-center text-white" style={{ backgroundColor: section.headerColor || "#66883e" }}>
        <button
          type="button"
          onClick={onHome}
          className="grid h-14 w-14 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={text.home}
        >
          <img src={optimizedAssets.whiteLogo} alt="" aria-hidden="true" className="h-11 w-11 object-contain" loading="eager" decoding="async" />
        </button>
      </footer>
    </Shell>
  );
}

function ResultScreen({ winner, ranking, text, language, onRetake, onHome, onShare, copied, shared }) {
  const topMatch = ranking?.[0];
  const secondMatch = ranking?.[1];
  const runnerUp = secondMatch ? characters[secondMatch.characterId] : null;
  const palette = resultPalettes[winner.id] || resultPalettes.anita;
  const resultTheme = {
    ...baseTheme,
    color: palette.accent,
    accent: palette.accent,
    soft: "#fafafa",
    ink: "#2b2b2b",
    contrast: "#fafafa",
  };
  const resultAccentText = palette.accentText;
  const resultLabelColor = palette.label;
  const resultLabelText = palette.labelText;
  const breakdownTrack = palette.breakdownTrack || `${resultLabelColor}45`;

  return (
    <Shell
      theme={resultTheme}
      patterned
      patternColor={baseTheme.accent}
      patternAccent={baseTheme.color}
      patternExactColors
      patternClassName="h-[clamp(5rem,12dvh,6rem)] rounded-b-[2.5rem]"
      scroll
      language={language}
    >
      <div className="flex flex-col items-center px-6 pb-10 pt-8 text-center text-[#1a4c19]">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-55">{text.resultEyebrow}</p>
        <h1 className={`${language === "km" ? "text-4xl leading-relaxed" : "text-5xl"} mt-2 font-black tracking-tight`} style={{ color: resultTheme.accent }}>{localize(winner.name, language)}</h1>
        <p className={`${language === "km" ? "leading-7" : "uppercase tracking-[0.12em]"} mt-1 text-sm font-black opacity-80`}>{localize(winner.archetype, language)}</p>
        {topMatch && (
          <div
            className="mt-4 rounded-full px-5 py-2 text-lg font-black shadow-sm"
            style={{ backgroundColor: resultTheme.accent, color: resultAccentText }}
          >
            {topMatch.percentage.toFixed(1)}% {text.match}
          </div>
        )}

        <div
          className="relative my-7 flex h-[26rem] w-full items-center justify-center"
          style={{ color: resultTheme.accent }}
          aria-label={`${localize(winner.name, language)} portrait`}
        >
          <span
            className="pointer-events-none absolute h-72 w-56 rotate-[-8deg] rounded-[48%_52%_46%_54%] opacity-25"
            style={{ backgroundColor: resultTheme.accent }}
            aria-hidden="true"
          />
          {winner.image ? (
            <img
              src={winner.image}
              alt={localize(winner.name, language)}
              loading="eager"
              decoding="async"
              className={`relative z-10 h-full w-auto max-w-[92%] object-contain ${winner.id === "tohla" ? "scale-[1.2]" : "scale-[1.25]"}`}
            />
          ) : (
            <span className="text-8xl font-black">{winner.mark}</span>
          )}
        </div>

        <p className={`${language === "km" ? "leading-9" : "leading-tight"} max-w-sm text-xl font-black text-[#1a4c19]`}>{localize(winner.summary, language)}</p>

        {runnerUp && (
          <div
            className="mt-8 flex w-full items-center gap-4 rounded-none border-2 border-[#0b210b] p-4 text-left shadow-sm"
            style={{ backgroundColor: resultTheme.accent, color: resultAccentText }}
          >
            <div
              className="grid h-14 w-14 shrink-0 place-items-center rounded-none text-2xl font-black text-[#fafafa]"
              style={{ backgroundColor: runnerUpInnerBackgrounds[runnerUp.id] || baseTheme.color }}
              aria-hidden="true"
            >
              {runnerUp.image ? (
                <img
                  src={runnerUp.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-12 w-12 object-contain"
                />
              ) : runnerUp.mark}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-65">{text.secondMatch}</p>
              <p className="mt-1 text-lg font-black">{localize(runnerUp.name, language)}</p>
              <p className={`${language === "km" ? "leading-5" : ""} text-xs font-bold opacity-70`}>{localize(runnerUp.archetype, language)}</p>
            </div>
            <span className="text-lg font-black">
              {secondMatch.percentage.toFixed(1)}%
            </span>
          </div>
        )}

        <h2 className="mt-8 w-full text-left text-sm font-black uppercase tracking-[0.14em] text-[#1a4c19]">{text.moreInfo}</h2>
        <div className="mt-3 grid w-full gap-3 text-left">
          <div className="grid grid-cols-[6.5rem_1fr] overflow-hidden border-2 border-[#0b210b] shadow-sm" style={{ backgroundColor: resultTheme.accent, color: resultAccentText }}>
            <p className="flex items-center px-3 py-4 text-[10px] font-black uppercase tracking-[0.12em]" style={{ backgroundColor: resultLabelColor, color: resultLabelText }}>{text.strength}</p>
            <p className="p-4 text-sm font-semibold leading-relaxed">{localize(winner.strength, language)}</p>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] overflow-hidden border-2 border-[#0b210b] shadow-sm" style={{ backgroundColor: resultTheme.accent, color: resultAccentText }}>
            <p className="flex items-center px-3 py-4 text-[10px] font-black uppercase tracking-[0.12em]" style={{ backgroundColor: resultLabelColor, color: resultLabelText }}>{text.challenge}</p>
            <p className="p-4 text-sm font-semibold leading-relaxed">{localize(winner.challenge, language)}</p>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] overflow-hidden border-2 border-[#0b210b] shadow-sm" style={{ backgroundColor: resultTheme.accent, color: resultAccentText }}>
            <p className="flex items-center px-3 py-4 text-[10px] font-black uppercase tracking-[0.12em]" style={{ backgroundColor: resultLabelColor, color: resultLabelText }}>{text.hiddenFear}</p>
            <p className="p-4 text-sm font-semibold leading-relaxed">{localize(winner.hiddenFear, language)}</p>
          </div>
          <div className="overflow-hidden border-2 border-[#0b210b] shadow-sm" style={{ backgroundColor: resultTheme.accent, color: resultAccentText }}>
            <p className="px-3 py-3 text-[10px] font-black uppercase tracking-[0.18em]" style={{ backgroundColor: resultLabelColor, color: resultLabelText }}>{text.traits}</p>
            <p className="p-4 text-sm font-semibold leading-relaxed">{localize(winner.traits, language)}</p>
          </div>
        </div>

        {ranking && !shared && (
          <div
            className="mt-8 w-full rounded-none border-[3px] border-[#1a1a1a] p-5 text-left shadow-sm"
            style={{ backgroundColor: resultTheme.accent, color: resultAccentText }}
          >
            <h2 className="text-base font-black uppercase tracking-[0.16em]">{text.fullBreakdown}</h2>
            <div className="mt-4 grid gap-3">
              {ranking.map((match) => (
                <div key={match.characterId} className="grid grid-cols-[18px_62px_1fr_48px] items-center gap-2 text-sm font-bold">
                  <span style={{ color: resultAccentText, opacity: 0.85 }}>{match.rank}</span>
                  <span>{localize(characters[match.characterId].name, language)}</span>
                  <div className="h-3 overflow-hidden rounded-full" style={{ backgroundColor: breakdownTrack }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${match.percentage}%`,
                        minWidth: match.percentage > 0 ? "0.65rem" : "0",
                        backgroundColor: resultBarColors[match.characterId] || characters[match.characterId].color,
                      }}
                    />
                  </div>
                  <span className="text-right" style={{ color: resultAccentText, opacity: 0.95 }}>{match.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {shared && (
          <p className="mt-7 rounded-full px-5 py-2 text-xs font-bold shadow-sm" style={{ backgroundColor: resultTheme.accent, color: resultAccentText }}>{text.sharedResult}</p>
        )}

        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <PrimaryButton onClick={onShare}>{copied ? text.copied : text.share}</PrimaryButton>
          <button type="button" onClick={onRetake} className="min-h-12 rounded-full border-2 border-[#1a4c19]/25 bg-white px-5 text-sm font-black text-[#1a4c19] transition hover:border-[#1a4c19]/50">
            {text.retake}
          </button>
        </div>
        <button type="button" onClick={onHome} className="mt-5 text-xs font-black text-[#66883e] underline underline-offset-4">{text.backHome}</button>
        <SocialLinks text={text} />
      </div>
    </Shell>
  );
}

function getSection(index) {
  return sections.find((section) => index >= section.start && index <= section.end) || sections[0];
}

const socialLinks = {
  instagram: "https://www.instagram.com/pteahsilapak?igsi=MTdsYWQydGY3Z3hxbQ==",
  facebook: "https://www.facebook.com/share/19bXDDxrB1/?mibextid=wwXIfr",
};

function SocialLinks({ text }) {
  return (
    <section className="-mx-6 mt-10 flex flex-col items-center gap-5 bg-transparent px-6 py-8 text-center text-[#1a4c19]" aria-labelledby="social-links-title">
      <h2 id="social-links-title" className="text-2xl font-black tracking-tight">{text.followJourney}</h2>
      <div className="flex items-center gap-4">
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noreferrer"
          aria-label="Follow Pteah Silapak on Instagram"
          className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-md transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a4c19]"
        >
          <SiInstagram className="h-10 w-10 text-white" aria-hidden="true" />
        </a>
        <a
          href={socialLinks.facebook}
          target="_blank"
          rel="noreferrer"
          aria-label="Follow Pteah Silapak on Facebook"
          className="grid h-16 w-16 place-items-center rounded-2xl bg-[#1877f2] shadow-md transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a4c19]"
        >
          <SiFacebook className="h-10 w-10 text-white" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
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
  const [previewCharacterId, setPreviewCharacterId] = useState(null);
  const [previewRunnerUpId, setPreviewRunnerUpId] = useState(null);

  const text = copy[language] && Object.keys(copy[language]).length ? copy[language] : copy.en;
  const currentQuestion = questions[currentIndex];
  const currentSection = getSection(currentIndex);
  const complete = isQuizComplete(answers);
  const ranking = useMemo(() => getRankedResults(answers), [answers]);
  const previewRanking = useMemo(
    () => (previewCharacterId ? getPreviewRanking(previewCharacterId, questions, previewRunnerUpId) : null),
    [previewCharacterId, previewRunnerUpId],
  );
  const resultId = previewCharacterId || sharedResultId || ranking[0].characterId;
  const [transitionDirection, setTransitionDirection] = useState("forward");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (import.meta.env.DEV) {
      const previewId = params.get("preview");
      if (previewId && characters[previewId]) {
        const requestedRunnerUpId = params.get("runnerup") || params.get("runnerUp");
        const runnerUpId = requestedRunnerUpId && requestedRunnerUpId !== previewId && characters[requestedRunnerUpId]
          ? requestedRunnerUpId
          : null;
        setPreviewCharacterId(previewId);
        setPreviewRunnerUpId(runnerUpId);
        setScreen("result");
        setHydrated(true);
        return;
      }
    }

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
    if (!hydrated || sharedResultId || previewCharacterId) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ language, answers, currentIndex, screen }),
    );
  }, [answers, currentIndex, hydrated, language, previewCharacterId, screen, sharedResultId]);

  function navigate(nextScreen, direction = "forward") {
    setTransitionDirection(direction);
    setScreen(nextScreen);
  }

  function selectLanguage(id) {
    if (!languages[id].available) {
      setNotice(text.comingSoon);
      return;
    }
    setLanguage(id);
    setNotice("");
    navigate("cover", "forward");
  }

  function chooseAnswer(questionId, optionId) {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  }

  function beginQuiz() {
    setCurrentIndex(0);
    navigate("section", "forward");
  }

  function nextQuestion() {
    if (!answers[currentQuestion.id]) return;
    if (currentIndex === questions.length - 1) {
      if (complete) {
        navigate("result", "forward");
        const finalResult = getWinner(answers);
        window.history.replaceState({}, "", `${window.location.pathname}?result=${finalResult.winnerId}`);
      }
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextSection = getSection(nextIndex);
    setCurrentIndex(nextIndex);
    navigate(nextSection.id !== currentSection.id ? "section" : "question", "forward");
  }

  function previousQuestion() {
    if (currentIndex === currentSection.start) {
      navigate("section", "back");
      return;
    }
    setCurrentIndex((index) => Math.max(0, index - 1));
    navigate("question", "back");
  }

  function backFromSection() {
    if (currentSection.number === 1) {
      navigate("instructions", "back");
      return;
    }
    setCurrentIndex(currentSection.start - 1);
    navigate("question", "back");
  }

  function goHome() {
    setSharedResultId(null);
    setPreviewCharacterId(null);
    setPreviewRunnerUpId(null);
    window.history.replaceState({}, "", window.location.pathname);
    navigate("landing", "back");
  }

  function resetQuiz(destination = "cover", direction = "forward") {
    setAnswers({});
    setCurrentIndex(0);
    setSharedResultId(null);
    setPreviewCharacterId(null);
    setPreviewRunnerUpId(null);
    setCopied(false);
    window.localStorage.removeItem(STORAGE_KEY);
    window.history.replaceState({}, "", window.location.pathname);
    navigate(destination, direction);
  }

  function resumeQuiz() {
    if (complete) {
      navigate("result", "forward");
      return;
    }
    const firstUnanswered = questions.findIndex((question) => !answers[question.id]);
    const resumeIndex = firstUnanswered >= 0 ? firstUnanswered : currentIndex;
    setCurrentIndex(resumeIndex);
    navigate("question", "forward");
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
        <div className="grid flex-1 place-items-center text-[#66883e]">
          <BrandMark />
        </div>
      </Shell>
    );
  }

  const transitionKey = [
    screen,
    screen === "question" ? currentIndex : "",
    screen === "section" ? currentSection.id : "",
    screen === "result" ? resultId : "",
  ].join(":");

  let screenContent;
  if (screen === "cover") {
    screenContent = <Cover text={text} language={language} onEnter={() => navigate("story", "forward")} onBack={goHome} />;
  } else if (screen === "story") {
    screenContent = <Story text={text} language={language} onNext={() => navigate("instructions", "forward")} onBack={() => navigate("cover", "back")} onHome={goHome} />;
  } else if (screen === "instructions") {
    screenContent = <Instructions text={text} language={language} onBegin={beginQuiz} onBack={() => navigate("story", "back")} onHome={goHome} />;
  } else if (screen === "section") {
    screenContent = <SectionIntro section={currentSection} text={text} language={language} onContinue={() => navigate("question", "forward")} onBack={backFromSection} onHome={goHome} />;
  } else if (screen === "question") {
    screenContent = (
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
  } else if (screen === "result") {
    screenContent = (
      <ResultScreen
        winner={characters[resultId]}
        ranking={previewCharacterId ? previewRanking : sharedResultId ? null : ranking}
        text={text}
        language={language}
        onRetake={() => resetQuiz("cover", "back")}
        onHome={goHome}
        onShare={shareResult}
        copied={copied}
        shared={Boolean(sharedResultId)}
      />
    );
  } else {
    screenContent = (
      <Landing
        onLanguage={selectLanguage}
        notice={notice}
        hasProgress={Object.keys(answers).length > 0}
        onResume={resumeQuiz}
        onReset={() => resetQuiz("cover", "forward")}
        text={text}
        language={language}
      />
    );
  }

  return (
    <ScreenTransition transitionKey={transitionKey} direction={transitionDirection}>
      {screenContent}
    </ScreenTransition>
  );
}
