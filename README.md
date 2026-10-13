# Ashutosh Patro — Portfolio

A 3D, scroll-driven portfolio: a character walks down a neon city street at dusk, stopping at billboards that each tell part of the résumé.

```bash
npm install
npm run dev
```

## Routes

- `/` — the 3D walk (React Three Fiber)
- `/classic` — the original single-page portfolio
- `/resume` — the résumé page

## How the street works

- **Content** comes from `src/data/resume.js`; `src/three/config.js` maps it onto the stops (billboards) along the road.
- **Scrolling** sets a target position in `src/three/walk.js`; the walker eases toward it and lingers at each stop.
- `src/three/World.jsx` — canvas, lighting, camera rig, post-processing (bloom, vignette, grain)
- `src/three/City.jsx` — wet reflective road, buildings with lit windows, street lamps, neon signs
- `src/three/Billboards.jsx` — roadside billboards and the gantries that span the road
- `src/three/Character.jsx` — the procedural walking character
- `src/three/textures.js` — every texture is drawn on a canvas at runtime, so there are no image assets
- `src/components/Hud.jsx` — HTML overlay: hero, stop navigation, links, progress bar

Keyboard: `W`/`S` or arrow keys step between stops. Touch devices and small screens get a lighter render path (no road reflections, lower pixel ratio).
