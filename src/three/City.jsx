import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { PALETTE, ROAD_END_Z, ROAD_HALF_WIDTH, SIDEWALK_WIDTH, STOPS, billboardTransform } from "./config";
import { makeAsphaltTextures, makeGlowTexture, makeNeonSignTexture, makeWindowTextures, rng } from "./textures";

const Z_START = 50;
const Z_END = ROAD_END_Z - 140;
const LENGTH = Z_START - Z_END;
const Z_MID = (Z_START + Z_END) / 2;
const CURB_X = ROAD_HALF_WIDTH + SIDEWALK_WIDTH;
const TILE_W = 8;
const TILE_H = 12;

/* ---------- Road ---------- */

function Road({ quality }) {
  const asphalt = useMemo(() => {
    const t = makeAsphaltTextures();
    t.map.repeat.set(1, LENGTH / 10);
    t.roughnessMap.repeat.set(1, LENGTH / 10);
    return t;
  }, []);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, Z_MID]} receiveShadow>
        <planeGeometry args={[ROAD_HALF_WIDTH * 2, LENGTH]} />
        {quality === "high" ? (
          <MeshReflectorMaterial
            map={asphalt.map}
            roughnessMap={asphalt.roughnessMap}
            blur={[400, 120]}
            resolution={512}
            mixBlur={1.2}
            mixStrength={1.8}
            mixContrast={1.1}
            roughness={0.85}
            metalness={0.4}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            mirror={0}
            color="#77728f"
          />
        ) : (
          <meshStandardMaterial map={asphalt.map} roughnessMap={asphalt.roughnessMap} metalness={0.5} roughness={0.5} />
        )}
      </mesh>
      <RoadMarkings />
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * (ROAD_HALF_WIDTH + SIDEWALK_WIDTH / 2), 0.09, Z_MID]} receiveShadow>
            <boxGeometry args={[SIDEWALK_WIDTH, 0.18, LENGTH]} />
            <meshStandardMaterial color="#2a2638" roughness={0.9} />
          </mesh>
          <mesh position={[side * (ROAD_HALF_WIDTH + 0.08), 0.1, Z_MID]}>
            <boxGeometry args={[0.16, 0.2, LENGTH]} />
            <meshStandardMaterial color="#5b5670" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RoadMarkings() {
  const dashes = useRef();
  const count = Math.floor(LENGTH / 6);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      o.position.set(0, 0.015, Z_START - 3 - i * 6);
      o.rotation.set(-Math.PI / 2, 0, 0);
      o.updateMatrix();
      dashes.current.setMatrixAt(i, o.matrix);
    }
    dashes.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  const crosswalk = useMemo(() => Array.from({ length: 9 }, (_, i) => -ROAD_HALF_WIDTH + 0.9 + i * 1.03), []);

  return (
    <group>
      <instancedMesh ref={dashes} args={[null, null, count]}>
        <planeGeometry args={[0.18, 3]} />
        <meshStandardMaterial color="#e9e4ff" emissive="#ffffff" emissiveIntensity={0.15} roughness={0.6} />
      </instancedMesh>
      {[-1, 1].map((side) => (
        <mesh key={side} rotation-x={-Math.PI / 2} position={[side * (ROAD_HALF_WIDTH - 0.35), 0.015, Z_MID]}>
          <planeGeometry args={[0.12, LENGTH]} />
          <meshStandardMaterial color={PALETTE.amber} emissive={PALETTE.amber} emissiveIntensity={0.25} roughness={0.6} />
        </mesh>
      ))}
      {crosswalk.map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.016, 7]}>
          <planeGeometry args={[0.6, 3.2]} />
          <meshStandardMaterial color="#e9e4ff" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Buildings ---------- */

const WALLS = ["#1b1830", "#211a2e", "#161b2c", "#251d33"];

// Scale a box's UVs to world size so one window tile maps to TILE_W × TILE_H
// units on every face; roofs sample the texture's bare corner.
function buildingGeometry(w, h, d, uOffset) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv;
  for (let face = 0; face < 6; face++) {
    for (let v = 0; v < 4; v++) {
      const i = face * 4 + v;
      if (face === 2 || face === 3) {
        uv.setXY(i, 0.005, 0.005);
        continue;
      }
      const span = face < 2 ? d : w;
      uv.setXY(i, uOffset + uv.getX(i) * (span / TILE_W), uv.getY(i) * (h / TILE_H));
    }
  }
  return g;
}

function useCityLayout() {
  return useMemo(() => {
    const rand = rng(1337);
    const buildings = [];
    const signs = [];
    const beacons = [];
    const signWords = ["CODE", "DEV", "OPEN", "REACT", "NODE", "24H", "BUILD", "SHIP"];
    const signColors = [PALETTE.magenta, PALETTE.cyan, PALETTE.amber, PALETTE.violet];

    // Leave an open plaza behind each roadside billboard.
    const plazas = STOPS.map((stop, i) => ({ side: stop.side, z: billboardTransform(i).position[2] })).filter(
      (p) => p.side !== 0
    );

    for (const side of [-1, 1]) {
      for (const row of [0, 1]) {
        let z = Z_START;
        while (z > Z_END) {
          const len = row === 0 ? 9 + rand() * 9 : 14 + rand() * 14;
          const depth = row === 0 ? 10 + rand() * 6 : 14 + rand() * 10;
          const height = row === 0 ? 12 + rand() * 34 : 34 + rand() * 60;
          const gap = row === 0 ? 0.6 + rand() * 2.4 : rand() * 4;
          const plaza = row === 0 && plazas.find((p) => p.side === side && z > p.z - 8 && z - len < p.z + 8);
          if (plaza) {
            z = plaza.z - 8;
            continue;
          }
          const front = CURB_X + 0.6 + (row === 0 ? rand() * 1.2 : 20);
          const x = side * (front + depth / 2);
          const zc = z - len / 2;
          const variant = Math.floor(rand() * WALLS.length);
          buildings.push({ x, z: zc, w: depth, h: height, d: len, variant, u: Math.floor(rand() * 4) * 0.25 });

          if (row === 0 && rand() < 0.4) {
            const word = signWords[signs.length % signWords.length];
            const signH = word.length * 1.4;
            signs.push({
              word,
              color: signColors[signs.length % signColors.length],
              position: [side * (front - 0.7), Math.min(height - signH / 2 - 1, 4 + signH / 2 + rand() * 5), z - 0.8],
            });
          }
          if (height > 40) beacons.push([x, height + 0.6, zc]);
          z -= len + gap;
        }
      }
    }
    return { buildings, signs, beacons, plazas };
  }, []);
}

function Buildings({ buildings }) {
  const variants = useMemo(
    () =>
      WALLS.map((wall, v) => {
        const { map, emissiveMap } = makeWindowTextures(100 + v, wall);
        const material = new THREE.MeshStandardMaterial({
          map,
          emissiveMap,
          emissive: new THREE.Color("#ffffff"),
          emissiveIntensity: 1.5,
          roughness: 0.75,
          metalness: 0.25,
        });
        const parts = buildings
          .filter((b) => b.variant === v)
          .map((b) => buildingGeometry(b.w, b.h, b.d, b.u).translate(b.x, b.h / 2, b.z));
        const geometry = mergeGeometries(parts);
        parts.forEach((p) => p.dispose());
        return { geometry, material };
      }),
    [buildings]
  );

  return variants.map(({ geometry, material }, i) => <mesh key={i} geometry={geometry} material={material} />);
}

function NeonSigns({ signs }) {
  const items = useMemo(
    () =>
      signs.map((s) => {
        const tex = makeNeonSignTexture(s.word, s.color);
        return { ...s, tex, height: s.word.length * 1.4 };
      }),
    [signs]
  );
  return items.map((s, i) => (
    <group key={i} position={s.position}>
      <mesh>
        <planeGeometry args={[1.4, s.height]} />
        <meshBasicMaterial map={s.tex} color={[1.8, 1.8, 1.8]} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-z={-0.06}>
        <boxGeometry args={[1.55, s.height + 0.15, 0.1]} />
        <meshStandardMaterial color="#0b0a12" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  ));
}

function Beacons({ beacons }) {
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color("#ff2a3a"), toneMapped: false }),
    []
  );
  useFrame(({ clock }) => {
    const on = Math.sin(clock.elapsedTime * 2.2) > 0.3;
    material.color.setRGB(on ? 6 : 0.4, on ? 0.4 : 0.03, on ? 0.6 : 0.05);
  });
  return beacons.map((p, i) => (
    <mesh key={i} position={p} material={material}>
      <sphereGeometry args={[0.35, 8, 8]} />
    </mesh>
  ));
}

/* ---------- Street lamps ---------- */

const LAMP_SPACING = 17;

const gantries = STOPS.map((stop, i) => (stop.side === 0 ? billboardTransform(i).position[2] : null)).filter(
  (z) => z !== null
);

function StreetLamps({ plazas }) {
  const lamps = useMemo(() => {
    const out = [];
    for (const side of [-1, 1]) {
      for (let z = Z_START - (side > 0 ? LAMP_SPACING / 2 : 0); z > Z_END; z -= LAMP_SPACING) {
        // Keep lamps from standing in front of billboards and gantries.
        const blocksBoard = plazas.some((p) => p.side === side && Math.abs(p.z - z) < 7.5);
        const blocksGantry = gantries.some((gz) => z > gz - 4 && z < gz + 12);
        if (!blocksBoard && !blocksGantry) out.push({ side, z });
      }
    }
    return out;
  }, [plazas]);

  const pole = useRef();
  const arm = useRef();
  const head = useRef();
  const bulb = useRef();
  const pool = useRef();
  const glow = useMemo(() => makeGlowTexture(), []);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    lamps.forEach(({ side, z }, i) => {
      const x = side * (ROAD_HALF_WIDTH + 0.7);
      o.rotation.set(0, 0, 0);
      o.position.set(x, 3.3, z);
      o.updateMatrix();
      pole.current.setMatrixAt(i, o.matrix);

      o.position.set(x - side * 0.85, 6.55, z);
      o.updateMatrix();
      arm.current.setMatrixAt(i, o.matrix);

      o.position.set(x - side * 1.7, 6.45, z);
      o.updateMatrix();
      head.current.setMatrixAt(i, o.matrix);
      o.position.set(x - side * 1.7, 6.34, z);
      o.updateMatrix();
      bulb.current.setMatrixAt(i, o.matrix);

      o.position.set(x - side * 1.9, 0.02, z);
      o.rotation.set(-Math.PI / 2, 0, 0);
      o.updateMatrix();
      pool.current.setMatrixAt(i, o.matrix);
    });
    [pole, arm, head, bulb, pool].forEach((r) => (r.current.instanceMatrix.needsUpdate = true));
  }, [lamps]);

  const n = lamps.length;
  return (
    <group>
      <instancedMesh ref={pole} args={[null, null, n]}>
        <cylinderGeometry args={[0.07, 0.11, 6.6, 8]} />
        <meshStandardMaterial color="#2c2a3a" metalness={0.7} roughness={0.35} />
      </instancedMesh>
      <instancedMesh ref={arm} args={[null, null, n]}>
        <boxGeometry args={[1.8, 0.08, 0.08]} />
        <meshStandardMaterial color="#2c2a3a" metalness={0.7} roughness={0.35} />
      </instancedMesh>
      <instancedMesh ref={head} args={[null, null, n]}>
        <boxGeometry args={[0.7, 0.14, 0.32]} />
        <meshStandardMaterial color="#1c1a26" metalness={0.6} roughness={0.4} />
      </instancedMesh>
      <instancedMesh ref={bulb} args={[null, null, n]}>
        <boxGeometry args={[0.6, 0.06, 0.24]} />
        <meshBasicMaterial color={[6, 4.2, 2.6]} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={pool} args={[null, null, n]} renderOrder={2}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial
          map={glow}
          color="#ffb070"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}

export default function City({ quality }) {
  const { buildings, signs, beacons, plazas } = useCityLayout();
  return (
    <group>
      <Road quality={quality} />
      <Buildings buildings={buildings} />
      <NeonSigns signs={signs} />
      <Beacons beacons={beacons} />
      <StreetLamps plazas={plazas} />
    </group>
  );
}
