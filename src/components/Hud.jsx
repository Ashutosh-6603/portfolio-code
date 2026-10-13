import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LAST_STOP, STOPS } from "../three/config";
import { walk, scrollToStop } from "../three/walk";
import resumeData from "../data/resume";

const glass = "bg-[#0d0a1f]/55 backdrop-blur-md border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.45)]";

function StopActions({ stop }) {
  if (stop.id === "projects") {
    return (
      <div className="mt-3 flex flex-col gap-2">
        {resumeData.projects.map((p) => (
          <a
            key={p.title}
            href={p.link !== "#" ? p.link : undefined}
            target="_blank"
            rel="noreferrer"
            className={`text-sm ${p.link !== "#" ? "text-violet-300 hover:text-white" : "text-white/70"}`}
          >
            {p.title}
            {p.link !== "#" && " ↗"}
          </a>
        ))}
      </div>
    );
  }
  if (stop.id === "contact") {
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="mailto:ashutosh6603@gmail.com" className="px-3 py-1.5 rounded-full bg-pink-500/90 hover:bg-pink-400 text-white text-sm font-medium">
          Email me
        </a>
        <a href="https://www.linkedin.com/in/ashutosh-patro-1a94272a7/" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full border border-white/25 hover:bg-white/10 text-white text-sm">
          LinkedIn
        </a>
        <a href="https://github.com/Ashutosh-6603" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full border border-white/25 hover:bg-white/10 text-white text-sm">
          GitHub
        </a>
        <a href="/Ashutosh Patro.pdf" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full border border-white/25 hover:bg-white/10 text-white text-sm">
          Résumé PDF
        </a>
      </div>
    );
  }
  return null;
}

export default function Hud() {
  const [active, setActive] = useState(0);
  const [atStop, setAtStop] = useState(true);
  const hero = useRef();
  const heroContent = useRef();
  const hint = useRef();
  const bar = useRef();

  useEffect(() => {
    let raf;
    const tick = () => {
      const p = walk.progress;
      const idx = Math.round(p);
      setActive((a) => (a === idx ? a : idx));
      const near = Math.abs(p - idx) < 0.18;
      setAtStop((s) => (s === near ? s : near));
      if (hero.current) {
        const o = Math.max(0, 1 - p / 0.35);
        hero.current.style.opacity = o;
        hero.current.style.transform = `translateY(${-p * 80}px)`;
        heroContent.current.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }
      if (hint.current) hint.current.style.opacity = Math.max(0, 1 - p / 0.15);
      if (bar.current) bar.current.style.transform = `scaleX(${p / LAST_STOP})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const stop = STOPS[active];
  const showCard = atStop && active > 0;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none text-white select-none">
      {/* Top bar */}
      <header className="relative z-10 pointer-events-auto flex items-center justify-between px-5 md:px-8 py-4">
        <button onClick={() => scrollToStop(0)} className="font-display font-bold text-lg tracking-tight">
          Ashutosh<span className="text-cyan-300">.</span>
        </button>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/classic" className="hidden sm:inline px-3 py-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white">
            Classic view
          </Link>
          <Link to="/resume" className={`px-3 py-1.5 rounded-full ${glass} hover:bg-white/15`}>
            Résumé
          </Link>
        </nav>
      </header>

      {/* Intro hero */}
      <div ref={hero} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#0b0818]/85 md:from-[#0b0818]/75 via-[#0b0818]/35 md:via-[#0b0818]/25 to-transparent" />
        <div ref={heroContent} className="absolute left-5 right-5 md:right-auto md:left-12 top-[18%] md:top-[22%] max-w-xl">
          <p className="font-display text-cyan-300 tracking-[0.35em] text-xs md:text-sm mb-3">FULL STACK DEVELOPER</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] drop-shadow-[0_4px_30px_rgba(255,63,180,0.35)]">
            Hi, I&apos;m
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">Ashutosh Patro</span>
          </h1>
          <p className="mt-5 text-white/75 md:text-lg max-w-md">
            I build fast, scalable web apps with React, Node.js and GraphQL. Take a walk down my street — every billboard tells part of the story.
          </p>
          <div className="mt-7 flex gap-3">
            <button onClick={() => scrollToStop(1)} className="px-5 py-2.5 rounded-full bg-cyan-300 text-[#0d0a1f] font-semibold hover:bg-white transition-colors">
              Start walking →
            </button>
            <button onClick={() => scrollToStop(LAST_STOP)} className={`px-5 py-2.5 rounded-full ${glass} hover:bg-white/15`}>
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Stop navigation */}
      <nav className="pointer-events-auto absolute right-4 md:right-7 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {STOPS.map((s, i) => (
          <button key={s.id} onClick={() => scrollToStop(i)} className="group flex items-center justify-end gap-3" aria-label={`Go to ${s.label}`}>
            <span
              className={`text-xs font-medium tracking-wide transition-all duration-300 hidden md:block ${
                i === active ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 group-hover:opacity-80 group-hover:translate-x-0"
              }`}
            >
              {s.label}
            </span>
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === active ? 12 : 7,
                height: i === active ? 12 : 7,
                background: i === active ? s.accent : "rgba(255,255,255,0.35)",
                boxShadow: i === active ? `0 0 14px ${s.accent}` : "none",
              }}
            />
          </button>
        ))}
      </nav>

      {/* Per-stop card */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            key={stop.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35 }}
            className={`pointer-events-auto absolute left-5 md:left-8 bottom-16 md:bottom-20 rounded-2xl px-5 py-4 max-w-xs ${glass}`}
          >
            <div className="text-[11px] tracking-[0.3em] font-display" style={{ color: stop.accent }}>
              {String(active).padStart(2, "0")} / {String(LAST_STOP).padStart(2, "0")}
            </div>
            <div className="font-display text-xl font-bold mt-1">{stop.label}</div>
            <StopActions stop={stop} />
            <div className="mt-4 flex gap-2 text-xs">
              <button onClick={() => scrollToStop(active - 1)} className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10">
                ← Back
              </button>
              {active < LAST_STOP && (
                <button onClick={() => scrollToStop(active + 1)} className="px-3 py-1 rounded-full bg-white/90 text-[#0d0a1f] font-semibold hover:bg-white">
                  Keep walking →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll hint */}
      <div ref={hint} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 text-xs tracking-[0.3em]">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
          <span className="block w-1 h-2 rounded-full bg-white/80 animate-bounce" />
        </div>
        SCROLL TO WALK
      </div>

      {/* Progress */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
        <div ref={bar} className="h-full origin-left bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
