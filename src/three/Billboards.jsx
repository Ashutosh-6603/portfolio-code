import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STOPS, ROAD_HALF_WIDTH, billboardTransform } from "./config";
import { walk } from "./walk";
import { makeBillboardTexture, makeGantryTexture, makeGlowTexture } from "./textures";

const metal = new THREE.MeshStandardMaterial({ color: "#1d1b28", metalness: 0.75, roughness: 0.35 });
const neonColor = (hex, k) => new THREE.Color(hex).multiplyScalar(k);

function NeonFrame({ w, h, t = 0.07, material }) {
  return (
    <group>
      <mesh position-y={h / 2} material={material}>
        <boxGeometry args={[w + t, t, t]} />
      </mesh>
      <mesh position-y={-h / 2} material={material}>
        <boxGeometry args={[w + t, t, t]} />
      </mesh>
      <mesh position-x={w / 2} material={material}>
        <boxGeometry args={[t, h + t, t]} />
      </mesh>
      <mesh position-x={-w / 2} material={material}>
        <boxGeometry args={[t, h + t, t]} />
      </mesh>
    </group>
  );
}

// Screens sit dim until the walker approaches, then "power on".
function useScreen(index, texture, accent) {
  const mats = useMemo(
    () => ({
      screen: new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
      neon: new THREE.MeshBasicMaterial({ color: neonColor(accent, 4), toneMapped: false }),
      glow: new THREE.MeshBasicMaterial({
        map: makeGlowTexture(),
        color: accent,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    }),
    [texture, accent]
  );
  const base = useMemo(() => new THREE.Color(accent), [accent]);

  useFrame(({ clock }) => {
    const d = Math.abs(walk.progress - index);
    const on = THREE.MathUtils.smoothstep(1.3 - d, 0, 0.8);
    const flicker = on < 0.98 && on > 0.05 ? (Math.sin(clock.elapsedTime * 60 + index) > 0.4 ? 0.75 : 1) : 1;
    const b = (0.3 + on * 0.62) * flicker;
    mats.screen.color.setRGB(b, b, b);
    mats.neon.color.copy(base).multiplyScalar(1.5 + on * 3.5);
    mats.glow.opacity = 0.2 + on * 0.45;
  });
  return mats;
}

function RoadsideBillboard({ index, stop }) {
  const { position, rotationY } = billboardTransform(index);
  const texture = useMemo(() => makeBillboardTexture(stop), [stop]);
  const mats = useScreen(index, texture, stop.accent);
  const W = 10.5;
  const H = W * (9 / 16);
  const lift = 3.6;
  const cy = lift + H / 2;

  return (
    <group position={position} rotation-y={rotationY}>
      {[-W / 3, W / 3].map((x) => (
        <mesh key={x} position={[x, lift / 2, -0.25]} material={metal}>
          <cylinderGeometry args={[0.16, 0.2, lift + 0.4, 12]} />
        </mesh>
      ))}
      <mesh position={[0, cy, -0.22]} material={metal}>
        <boxGeometry args={[W + 0.5, H + 0.5, 0.35]} />
      </mesh>
      <mesh position={[0, cy, -0.035]} material={mats.screen}>
        <planeGeometry args={[W, H]} />
      </mesh>
      <group position={[0, cy, -0.02]}>
        <NeonFrame w={W + 0.25} h={H + 0.25} material={mats.neon} />
      </group>
      {/* Catwalk with three flood lamps aimed up at the screen */}
      <mesh position={[0, lift - 0.12, 0.35]} material={metal}>
        <boxGeometry args={[W + 0.4, 0.08, 0.9]} />
      </mesh>
      {[-W / 3, 0, W / 3].map((x) => (
        <group key={x} position={[x, lift - 0.02, 0.6]}>
          <mesh rotation-x={-0.6} material={metal}>
            <boxGeometry args={[0.4, 0.18, 0.25]} />
          </mesh>
          <mesh position={[0, 0.03, -0.12]} rotation-x={-0.6} material={mats.neon}>
            <boxGeometry args={[0.32, 0.1, 0.02]} />
          </mesh>
        </group>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.25, 1]} material={mats.glow} renderOrder={2}>
        <planeGeometry args={[W + 4, 7]} />
      </mesh>
    </group>
  );
}

function Gantry({ index, stop }) {
  const { position } = billboardTransform(index);
  const texture = useMemo(() => makeGantryTexture(stop), [stop]);
  const mats = useScreen(index, texture, stop.accent);
  const span = ROAD_HALF_WIDTH + 1.6;
  const W = 13;
  const H = W * (560 / 2048);
  const beamY = 9.4;
  const cy = beamY - 0.6 - H / 2;

  return (
    <group position={position}>
      {[-span, span].map((x) => (
        <group key={x} position-x={x}>
          <mesh position-y={beamY / 2} material={metal}>
            <boxGeometry args={[0.5, beamY, 0.5]} />
          </mesh>
          <mesh position={[0, beamY / 2, 0.26]} material={mats.neon}>
            <boxGeometry args={[0.06, beamY - 1, 0.02]} />
          </mesh>
        </group>
      ))}
      <mesh position-y={beamY} material={metal}>
        <boxGeometry args={[span * 2 + 0.5, 0.6, 0.6]} />
      </mesh>
      {[-W / 3, W / 3].map((x) => (
        <mesh key={x} position={[x, beamY - 0.3, 0]} material={metal}>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
        </mesh>
      ))}
      <mesh position={[0, cy, -0.12]} material={metal}>
        <boxGeometry args={[W + 0.4, H + 0.4, 0.2]} />
      </mesh>
      <mesh position={[0, cy, 0]} material={mats.screen}>
        <planeGeometry args={[W, H]} />
      </mesh>
      <group position={[0, cy, 0.02]}>
        <NeonFrame w={W + 0.2} h={H + 0.2} material={mats.neon} />
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]} material={mats.glow} renderOrder={2}>
        <planeGeometry args={[span * 2, 8]} />
      </mesh>
    </group>
  );
}

export default function Billboards() {
  return STOPS.map((stop, i) =>
    stop.side === 0 ? <Gantry key={stop.id} index={i} stop={stop} /> : <RoadsideBillboard key={stop.id} index={i} stop={stop} />
  );
}
