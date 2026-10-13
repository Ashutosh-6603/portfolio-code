import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { walk, stopFocus } from "./walk";
import { STOPS, PALETTE, readingHeading } from "./config";
import { makeGlowTexture } from "./textures";

// Stride length in world units per full walk cycle.
const STRIDE = 1.5;
const damp = THREE.MathUtils.damp;

function Limb({ length, radius, material, children, pivotRef, position }) {
  return (
    <group ref={pivotRef} position={position}>
      <mesh position={[0, -length / 2, 0]} material={material} castShadow>
        <capsuleGeometry args={[radius, length - radius * 2, 6, 12]} />
      </mesh>
      <group position={[0, -length, 0]}>{children}</group>
    </group>
  );
}

export default function Character() {
  const root = useRef();
  const body = useRef();
  const head = useRef();
  const lThigh = useRef();
  const rThigh = useRef();
  const lShin = useRef();
  const rShin = useRef();
  const lArm = useRef();
  const rArm = useRef();
  const lFore = useRef();
  const rFore = useRef();
  const state = useRef({ phase: 0, amp: 0, heading: 0, lastZ: 0 });

  const m = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: "#c98d6b", roughness: 0.6 }),
      hair: new THREE.MeshStandardMaterial({ color: "#14100f", roughness: 0.8 }),
      jacket: new THREE.MeshStandardMaterial({ color: PALETTE.teal, roughness: 0.55, metalness: 0.05 }),
      jacketDark: new THREE.MeshStandardMaterial({ color: "#0a6c6b", roughness: 0.6 }),
      pants: new THREE.MeshStandardMaterial({ color: "#1d2033", roughness: 0.75 }),
      shoe: new THREE.MeshStandardMaterial({ color: "#f3f3f7", roughness: 0.4 }),
      sole: new THREE.MeshStandardMaterial({ color: "#222", roughness: 0.9 }),
      bag: new THREE.MeshStandardMaterial({ color: "#2a2340", roughness: 0.7 }),
      stripe: new THREE.MeshBasicMaterial({ color: new THREE.Color(PALETTE.magenta).multiplyScalar(3), toneMapped: false }),
    }),
    []
  );
  const shadowTex = useMemo(() => makeGlowTexture(), []);

  useFrame((_, dt) => {
    const s = state.current;
    const delta = Math.min(dt, 0.05);
    const z = walk.z;
    const dz = z - s.lastZ;
    s.lastZ = z;
    const speed = Math.abs(dz) / Math.max(delta, 1e-4);

    root.current.position.z = z;

    // Advance the gait by distance travelled so feet don't skate.
    s.phase += (Math.abs(dz) / STRIDE) * Math.PI * 2;
    s.amp = damp(s.amp, Math.min(speed / 3, 1.25), 6, delta);
    const a = s.amp;
    const p = s.phase;

    // Face the direction of travel; when standing at a billboard, turn to read it.
    let reading = 0;
    let readHeading = 0;
    STOPS.forEach((stop, i) => {
      if (!stop.side) return;
      const f = THREE.MathUtils.smoothstep(stopFocus(walk.progress, i), 0.55, 1);
      reading += f;
      readHeading += f * readingHeading(i);
    });
    const want = dz > 0.002 ? Math.PI : readHeading;
    if (Math.abs(dz) > 0.002 || a < 0.05 || reading > 0) s.heading = damp(s.heading, want, 4, delta);
    root.current.rotation.y = s.heading;

    const swing = Math.sin(p);
    lThigh.current.rotation.x = swing * 0.55 * a;
    rThigh.current.rotation.x = -swing * 0.55 * a;
    lShin.current.rotation.x = -Math.max(0, Math.sin(p - 1.3)) * 1.0 * a - 0.05;
    rShin.current.rotation.x = -Math.max(0, Math.sin(p + Math.PI - 1.3)) * 1.0 * a - 0.05;
    lArm.current.rotation.x = -swing * 0.5 * a;
    rArm.current.rotation.x = swing * 0.5 * a;
    lFore.current.rotation.x = 0.25 + Math.max(0, -swing) * 0.5 * a;
    rFore.current.rotation.x = 0.25 + Math.max(0, swing) * 0.5 * a;

    const t = performance.now() / 1000;
    const breathe = Math.sin(t * 1.8) * 0.008 * (1 - Math.min(a, 1));
    body.current.position.y = 0.98 + Math.abs(Math.cos(p)) * 0.045 * a + breathe;
    body.current.rotation.y = swing * 0.08 * a;
    body.current.rotation.z = Math.cos(p) * 0.03 * a;
    body.current.rotation.x = -0.06 * a;

    // Tilt the head up toward the board he is reading.
    head.current.rotation.x = damp(head.current.rotation.x, -reading * 0.3, 3, delta);
  });

  return (
    <group ref={root}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.02} renderOrder={1}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial map={shadowTex} color="#000" transparent opacity={0.65} depthWrite={false} />
      </mesh>

      <group ref={body} position-y={0.98}>
        {/* Hips + torso */}
        <mesh position-y={0.04} material={m.pants}>
          <capsuleGeometry args={[0.17, 0.12, 6, 12]} />
        </mesh>
        <mesh position-y={0.38} scale={[1, 1, 0.72]} material={m.jacket} castShadow>
          <capsuleGeometry args={[0.21, 0.36, 8, 16]} />
        </mesh>
        {/* Backpack */}
        <mesh position={[0, 0.4, 0.19]} material={m.bag}>
          <boxGeometry args={[0.32, 0.4, 0.14]} />
        </mesh>
        <mesh position={[0, 0.52, 0.265]} material={m.stripe}>
          <boxGeometry args={[0.22, 0.02, 0.01]} />
        </mesh>
        {/* Hood */}
        <mesh position={[0, 0.66, 0.05]} rotation-x={Math.PI / 2.4} material={m.jacketDark}>
          <torusGeometry args={[0.13, 0.05, 8, 16]} />
        </mesh>

        {/* Head */}
        <group ref={head} position-y={0.78}>
          <mesh position-y={0.06} material={m.skin}>
            <cylinderGeometry args={[0.055, 0.06, 0.1, 10]} />
          </mesh>
          <mesh position-y={0.2} scale={[1, 1.1, 1.02]} material={m.skin} castShadow>
            <sphereGeometry args={[0.13, 20, 16]} />
          </mesh>
          <mesh position={[0, 0.26, 0.015]} scale={[1.04, 0.85, 1.06]} material={m.hair}>
            <sphereGeometry args={[0.135, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          </mesh>
          {/* Ears */}
          <mesh position={[0.13, 0.2, 0]} material={m.skin}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>
          <mesh position={[-0.13, 0.2, 0]} material={m.skin}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>
          {/* Nose (front is -Z) */}
          <mesh position={[0, 0.18, -0.135]} material={m.skin}>
            <sphereGeometry args={[0.022, 8, 8]} />
          </mesh>
        </group>

        {/* Arms */}
        {[
          [-1, lArm, lFore],
          [1, rArm, rFore],
        ].map(([side, arm, fore]) => (
          <Limb key={side} pivotRef={arm} position={[side * 0.27, 0.6, 0]} length={0.32} radius={0.065} material={m.jacket}>
            <Limb pivotRef={fore} position={[0, 0, 0]} length={0.3} radius={0.055} material={m.jacket}>
              <mesh position-y={-0.03} material={m.skin}>
                <sphereGeometry args={[0.055, 10, 10]} />
              </mesh>
            </Limb>
          </Limb>
        ))}

        {/* Legs */}
        {[
          [-1, lThigh, lShin],
          [1, rThigh, rShin],
        ].map(([side, thigh, shin]) => (
          <Limb key={side} pivotRef={thigh} position={[side * 0.1, 0, 0]} length={0.45} radius={0.085} material={m.pants}>
            <Limb pivotRef={shin} position={[0, 0, 0]} length={0.45} radius={0.07} material={m.pants}>
              <mesh position={[0, -0.02, -0.05]} material={m.shoe}>
                <boxGeometry args={[0.12, 0.08, 0.26]} />
              </mesh>
              <mesh position={[0, -0.065, -0.05]} material={m.sole}>
                <boxGeometry args={[0.125, 0.02, 0.27]} />
              </mesh>
            </Limb>
          </Limb>
        ))}
      </group>
    </group>
  );
}
