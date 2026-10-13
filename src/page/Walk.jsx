import { lazy, Suspense, useEffect, useState } from "react";
import Hud from "../components/Hud";
import { LAST_STOP } from "../three/config";
import { walk, scrollToStop } from "../three/walk";

const World = lazy(() => import("../three/World"));

// Billboard textures are drawn on canvases, so their fonts must be loaded first.
function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const fonts = ['700 84px "Space Grotesk"', '600 30px "Space Grotesk"', '400 40px "Inter"', '500 34px "Inter"'];
    const timeout = new Promise((r) => setTimeout(r, 2500));
    Promise.race([Promise.all(fonts.map((f) => document.fonts.load(f))), timeout]).finally(() => setReady(true));
  }, []);
  return ready;
}

function detectQuality() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return coarse || window.innerWidth < 768 ? "low" : "high";
}

export default function Walk() {
  const fontsReady = useFontsReady();
  const [quality] = useState(detectQuality);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      walk.target = max > 0 ? (window.scrollY / max) * LAST_STOP : 0;
    };
    const onKey = (e) => {
      const current = Math.round(walk.target);
      if (["ArrowRight", "d", "D", "w", "W"].includes(e.key)) scrollToStop(Math.min(current + 1, LAST_STOP));
      if (["ArrowLeft", "a", "A", "s", "S"].includes(e.key)) scrollToStop(Math.max(current - 1, 0));
    };
    onScroll();
    walk.progress = walk.target;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!fontsReady) return;
    const t = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(t);
  }, [fontsReady]);

  return (
    <div className="bg-[#24123a]">
      <div className="fixed inset-0">
        {fontsReady && (
          <Suspense fallback={null}>
            <World quality={quality} />
          </Suspense>
        )}
      </div>
      <Hud />
      {/* Scroll track: one screen per stop drives the walk. */}
      <div style={{ height: `${(LAST_STOP + 1) * 110}vh` }} aria-hidden />

      <div
        className={`fixed inset-0 z-20 flex flex-col items-center justify-center bg-[#0b0818] text-white transition-opacity duration-1000 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="font-display text-2xl font-bold tracking-tight">
          Ashutosh<span className="text-cyan-300">.</span>
        </div>
        <div className="mt-4 h-[2px] w-40 overflow-hidden rounded bg-white/10">
          <div className="h-full w-1/2 animate-[loading_1.1s_ease-in-out_infinite] bg-gradient-to-r from-cyan-300 to-fuchsia-400" />
        </div>
        <p className="mt-4 text-xs tracking-[0.3em] text-white/50">LIGHTING UP THE CITY</p>
      </div>
    </div>
  );
}
