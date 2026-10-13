import * as THREE from "three";

const DISPLAY = '"Space Grotesk", "Segoe UI", system-ui, sans-serif';
const TEXT = '"Inter", "Segoe UI", system-ui, sans-serif';

function canvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")];
}

function toTexture(c, { srgb = true, repeat = false } = {}) {
  const tex = new THREE.CanvasTexture(c);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

// Deterministic PRNG so the city looks the same on every visit.
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One tile = 4 columns × 4 floors of windows. The bottom-left corner is always
// bare wall, which building roofs sample so they stay dark.
export function makeWindowTextures(seed, wall) {
  const rand = rng(seed);
  const W = 256;
  const H = 384;
  const [c, ctx] = canvas(W, H);
  const [e, ectx] = canvas(W, H);

  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, H);
  ectx.fillStyle = "#000";
  ectx.fillRect(0, 0, W, H);

  // Subtle facade panel lines.
  ctx.fillStyle = "rgba(255,255,255,0.025)";
  for (let y = 0; y < H; y += H / 4) ctx.fillRect(0, y, W, 3);

  const warm = ["#ffd59a", "#ffc67a", "#ffe7c2", "#ffb86b"];
  const cool = ["#a6ecff", "#7fd8ff", "#d6f6ff"];
  const neon = ["#ff7ad1", "#b48cff"];
  const cw = W / 4;
  const ch = H / 4;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * cw + cw * 0.18;
      const y = row * ch + ch * 0.2;
      const w = cw * 0.64;
      const h = ch * 0.55;
      ctx.fillStyle = "#0c0b18";
      ctx.fillRect(x, y, w, h);
      const r = rand();
      if (r < 0.42) {
        const pool = r < 0.3 ? warm : r < 0.39 ? cool : neon;
        const color = pool[Math.floor(rand() * pool.length)];
        const g = ectx.createLinearGradient(0, y, 0, y + h);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0.6)");
        ectx.globalAlpha = 0.55 + rand() * 0.45;
        ectx.fillStyle = g;
        ectx.fillRect(x, y, w, h);
        // Occasional blind half-drawn.
        if (rand() < 0.3) {
          ectx.globalAlpha = 1;
          ectx.fillStyle = "#000";
          ectx.fillRect(x, y, w, h * (0.2 + rand() * 0.4));
        }
        ectx.globalAlpha = 1;
      } else {
        ctx.fillStyle = "rgba(120,140,220,0.06)";
        ctx.fillRect(x, y, w * 0.5, h);
      }
    }
  }
  // Keep the bottom-left corner (sampled by roofs) as pure wall.
  ctx.fillStyle = wall;
  ctx.fillRect(0, H - 6, 6, 6);
  ectx.fillStyle = "#000";
  ectx.fillRect(0, H - 6, 6, 6);

  return { map: toTexture(c, { repeat: true }), emissiveMap: toTexture(e, { repeat: true }) };
}

export function makeGlowTexture() {
  const [c, ctx] = canvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return toTexture(c);
}

// Wet asphalt: grainy roughness with broad, faint wet patches (lower roughness = shinier).
export function makeAsphaltTextures() {
  const rand = rng(7);
  const S = 512;
  const [c, ctx] = canvas(S, S);
  const [r, rctx] = canvas(S, S);
  ctx.fillStyle = "#17151f";
  ctx.fillRect(0, 0, S, S);
  rctx.fillStyle = "#b4b4b4";
  rctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 9000; i++) {
    const v = Math.floor(18 + rand() * 30);
    ctx.fillStyle = `rgb(${v},${v - 2},${v + 6})`;
    ctx.fillRect(rand() * S, rand() * S, 2, 2);
  }
  for (let i = 0; i < 60; i++) {
    const x = rand() * S;
    const y = rand() * S;
    const rad = 60 + rand() * 140;
    const alpha = 0.08 + rand() * 0.1;
    // Draw wrapped copies so the patch tiles seamlessly.
    for (const [dx, dy] of [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]]) {
      const g = rctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, rad);
      g.addColorStop(0, `rgba(40,40,40,${alpha})`);
      g.addColorStop(1, "rgba(40,40,40,0)");
      rctx.fillStyle = g;
      rctx.fillRect(0, 0, S, S);
    }
  }
  for (let i = 0; i < 14000; i++) {
    const v = Math.floor(150 + rand() * 80);
    rctx.fillStyle = `rgb(${v},${v},${v})`;
    rctx.fillRect(rand() * S, rand() * S, 2, 2);
  }
  return {
    map: toTexture(c, { repeat: true }),
    roughnessMap: toTexture(r, { srgb: false, repeat: true }),
  };
}

/* ---------- Billboards ---------- */

function wrapLines(ctx, text, maxW) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(ctx, text, x, y, maxW, lineH, maxLines = 99) {
  const lines = wrapLines(ctx, text, maxW);
  lines.slice(0, maxLines).forEach((l, i) => {
    let out = l;
    if (i === maxLines - 1 && lines.length > maxLines) out = `${l.replace(/[,.;:]?$/, "")}…`;
    ctx.fillText(out, x, y + i * lineH);
  });
  return y + Math.min(lines.length, maxLines) * lineH;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function background(ctx, W, H, accent) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0d0b1f");
  bg.addColorStop(1, "#160e2c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Accent bloom in a corner.
  const g = ctx.createRadialGradient(W * 0.92, H * 0.05, 0, W * 0.92, H * 0.05, W * 0.6);
  g.addColorStop(0, hexA(accent, 0.28));
  g.addColorStop(1, hexA(accent, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Fine grid.
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  // LED scanlines.
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
}

function kicker(ctx, text, x, y, accent) {
  ctx.fillStyle = accent;
  ctx.fillRect(x, y - 26, 46, 6);
  ctx.font = `600 30px ${DISPLAY}`;
  ctx.letterSpacing = "6px";
  ctx.fillText(text, x + 66, y - 14);
  ctx.letterSpacing = "0px";
}

export function makeBillboardTexture(stop) {
  const W = 1600;
  const H = 900;
  const [c, ctx] = canvas(W, H);
  // Shrink the body copy until everything fits on the board.
  for (let k = 1; k > 0.6; k -= 0.06) {
    if (drawBillboard(ctx, W, H, stop, k) <= H - 70) break;
  }
  return toTexture(c);
}

function drawBillboard(ctx, W, H, stop, k) {
  const PAD = 96;
  const { accent } = stop;
  const px = (n) => Math.round(n * k);
  background(ctx, W, H, accent);
  ctx.textBaseline = "alphabetic";

  kicker(ctx, stop.kicker, PAD, PAD + 30, accent);

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${px(96)}px ${DISPLAY}`;
  let y = drawWrapped(ctx, stop.title, PAD, PAD + 70 + px(90), W - PAD * 2, px(102), 2);

  if (stop.subtitle) {
    ctx.fillStyle = accent;
    ctx.font = `500 ${px(42)}px ${TEXT}`;
    y = drawWrapped(ctx, stop.subtitle, PAD, y + 4, W - PAD * 2, px(54), 2);
  }

  y += px(30);
  if (stop.body) {
    ctx.fillStyle = "rgba(235,232,255,0.86)";
    ctx.font = `400 ${px(47)}px ${TEXT}`;
    y = drawWrapped(ctx, stop.body, PAD, y + px(20), W - PAD * 2, px(66), 8);
  }

  if (stop.bullets) {
    ctx.font = `400 ${px(40)}px ${TEXT}`;
    for (const b of stop.bullets) {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(PAD + 9, y + px(8), 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(235,232,255,0.86)";
      y = drawWrapped(ctx, b, PAD + 40, y + px(20), W - PAD * 2 - 40, px(52), 2) + px(20);
    }
  }

  if (stop.chips) {
    ctx.font = `500 ${px(40)}px ${TEXT}`;
    let x = PAD;
    let cy = y + 10;
    for (const chip of stop.chips) {
      const w = ctx.measureText(chip).width + px(54);
      if (x + w > W - PAD) {
        x = PAD;
        cy += px(86);
      }
      roundRect(ctx, x, cy, w, px(68), px(34));
      ctx.fillStyle = hexA(accent, 0.12);
      ctx.fill();
      ctx.strokeStyle = hexA(accent, 0.7);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#f2f0ff";
      ctx.fillText(chip, x + px(27), cy + px(48));
      x += w + 18;
    }
    y = cy + px(68);
  }

  if (stop.projects) {
    const gap = 36;
    const cardW = (W - PAD * 2 - gap * 2) / 3;
    const cardH = H - y - PAD + 10;
    stop.projects.forEach((p, i) => {
      const x = PAD + i * (cardW + gap);
      roundRect(ctx, x, y, cardW, cardH, 22);
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      ctx.fill();
      ctx.strokeStyle = hexA(accent, 0.55);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.font = `700 26px ${DISPLAY}`;
      ctx.fillText(`0${i + 1}`, x + 32, y + 56);
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 42px ${DISPLAY}`;
      const ty = drawWrapped(ctx, p.title, x + 32, y + 112, cardW - 64, 50, 3);
      ctx.fillStyle = "rgba(235,232,255,0.8)";
      ctx.font = `400 33px ${TEXT}`;
      drawWrapped(ctx, p.desc.replace(/Website:.*$/, ""), x + 32, ty + 16, cardW - 64, 44, 4);
      if (p.link && p.link !== "#") {
        ctx.fillStyle = accent;
        ctx.font = `600 28px ${TEXT}`;
        ctx.fillText("Visit site ↗", x + 32, y + cardH - 34);
      }
    });
    y = H - PAD;
  }

  if (stop.stat) {
    ctx.textAlign = "right";
    ctx.fillStyle = accent;
    ctx.font = `700 260px ${DISPLAY}`;
    ctx.fillText(stop.stat.value, W - PAD, H - PAD - 40);
    ctx.fillStyle = "rgba(235,232,255,0.7)";
    ctx.font = `600 40px ${DISPLAY}`;
    ctx.letterSpacing = "10px";
    ctx.fillText(stop.stat.label, W - PAD, H - PAD + 20);
    ctx.letterSpacing = "0px";
    ctx.textAlign = "left";
  }

  return y;
}

// Wide sign hung on the gantries that span the road (intro and finale).
export function makeGantryTexture(stop) {
  const W = 2048;
  const H = 560;
  const [c, ctx] = canvas(W, H);
  background(ctx, W, H, stop.accent);
  ctx.textAlign = "center";

  ctx.fillStyle = stop.accent;
  ctx.font = `600 40px ${DISPLAY}`;
  ctx.letterSpacing = "14px";
  ctx.fillText(stop.kicker, W / 2, 120);

  ctx.fillStyle = "#ffffff";
  ctx.letterSpacing = "8px";
  let size = 168;
  ctx.font = `700 ${size}px ${DISPLAY}`;
  while (ctx.measureText(stop.title).width > W - 220 && size > 80) {
    size -= 6;
    ctx.font = `700 ${size}px ${DISPLAY}`;
  }
  ctx.shadowColor = stop.accent;
  ctx.shadowBlur = 40;
  ctx.fillText(stop.title, W / 2, 320);
  ctx.shadowBlur = 0;
  ctx.letterSpacing = "4px";

  ctx.fillStyle = "rgba(235,232,255,0.85)";
  ctx.font = `500 52px ${TEXT}`;
  ctx.fillText(stop.subtitle, W / 2, 440);
  return toTexture(c);
}

// Small vertical neon sign texts hung on building facades.
export function makeNeonSignTexture(text, color) {
  const W = 128;
  const H = 128 * text.length;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = "#08070f";
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 92px ${DISPLAY}`;
  ctx.shadowColor = color;
  ctx.shadowBlur = 24;
  ctx.fillStyle = color;
  [...text].forEach((ch, i) => ctx.fillText(ch, W / 2, 64 + i * 128));
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.6;
  ctx.font = `700 84px ${DISPLAY}`;
  [...text].forEach((ch, i) => ctx.fillText(ch, W / 2, 64 + i * 128));
  return toTexture(c);
}
