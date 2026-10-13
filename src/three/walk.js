import { LAST_STOP, stopZ } from "./config";

// Shared, mutable walk state. Written by the scroll listener and the render loop,
// read every frame by the scene; kept outside React to avoid re-rendering at 60fps.
export const walk = {
  target: 0, // scroll progress in "stops" (0 … LAST_STOP)
  progress: 0, // smoothed progress
  z: 0,
  speed: 0,
};

const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// The walker eases into and out of each stop, so he lingers in front of each billboard.
export function progressToZ(p) {
  const clamped = Math.min(Math.max(p, 0), LAST_STOP);
  const i = Math.min(Math.floor(clamped), LAST_STOP - 1);
  const t = clamped - i;
  const eased = t * 0.35 + smootherstep(t) * 0.65;
  return stopZ(i) + (stopZ(i + 1) - stopZ(i)) * eased;
}

// How strongly the walker is "at" stop i (1 when standing at it, 0 between stops).
export function stopFocus(p, i) {
  const d = Math.abs(p - i);
  return d >= 0.5 ? 0 : Math.cos((d / 0.5) * Math.PI) * 0.5 + 0.5;
}

export function scrollToStop(i) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: (i / LAST_STOP) * max, behavior: "smooth" });
}
