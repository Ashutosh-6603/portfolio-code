import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import Sky from "./Sky";
import City from "./City";
import Billboards from "./Billboards";
import Character from "./Character";
import { PALETTE, STOPS, billboardTransform, stopZ } from "./config";
import { walk, progressToZ, stopFocus } from "./walk";

const damp = THREE.MathUtils.damp;
const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const tmpFocus = new THREE.Vector3();

// Moves the walker along the road and keeps the camera framed on him, turning
// toward whichever billboard he is standing in front of.
function Rig() {
  const look = useRef(new THREE.Vector3(0, 2, -10));
  const sun = useRef();
  const followers = useRef();

  const boards = useMemo(
    () =>
      STOPS.map((stop, i) => {
        const { position } = billboardTransform(i);
        const center = new THREE.Vector3(position[0], stop.side === 0 ? 7.2 : 4.8, position[2]);
        // Over-the-shoulder vantage: behind the walker, on the line from the board through him.
        const walker = new THREE.Vector3(0, 0, stopZ(i));
        const away = walker.clone().sub(center).setY(0).normalize();
        const view = walker.addScaledVector(away, 7).setY(3.3);
        return { side: stop.side, center, view };
      }),
    []
  );

  useFrame(({ camera, pointer }, dt) => {
    const delta = Math.min(dt, 0.05);
    // Ease toward the scroll target, but never faster than a brisk walk.
    const maxStep = 1.5 * delta;
    const step = damp(walk.progress, walk.target, 2.4, delta) - walk.progress;
    walk.progress += THREE.MathUtils.clamp(step, -maxStep, maxStep);
    if (Math.abs(walk.progress - walk.target) < 1e-4) walk.progress = walk.target;
    walk.z = progressToZ(walk.progress);
    const z = walk.z;

    // Default chase framing.
    tmpPos.set(0, 2.5, z + 6.4);
    tmpLook.set(0, 2.0, z - 10);

    boards.forEach((b, i) => {
      const f = stopFocus(walk.progress, i);
      if (!f) return;
      if (b.side === 0) {
        tmpPos.y += 0.5 * f;
        tmpLook.lerp(b.center, f * 0.45);
      } else {
        tmpPos.lerp(b.view, f);
        tmpLook.lerp(b.center, f);
      }
    });

    // Wide establishing shot at the very start of the road.
    const intro = 1 - THREE.MathUtils.smoothstep(walk.progress, 0, 0.5);
    tmpPos.lerp(tmpFocus.set(-1.2, 4.2, z + 15), intro);
    tmpLook.lerp(tmpFocus.set(-5.5, 4.6, z - 30), intro * 0.8);

    // Gentle mouse parallax.
    tmpPos.x += pointer.x * 0.7;
    tmpPos.y += pointer.y * 0.35;

    camera.position.x = damp(camera.position.x, tmpPos.x, 3, delta);
    camera.position.y = damp(camera.position.y, tmpPos.y, 3, delta);
    camera.position.z = damp(camera.position.z, tmpPos.z, 10, delta);
    look.current.x = damp(look.current.x, tmpLook.x, 3, delta);
    look.current.y = damp(look.current.y, tmpLook.y, 3, delta);
    look.current.z = damp(look.current.z, tmpLook.z, 10, delta);
    camera.lookAt(look.current);

    // Widen the lens on portrait screens so billboards still fit across.
    const fov = camera.aspect < 1 ? 50 + (1 - camera.aspect) * 36 : 50;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // Keep the shadow-casting sun and ambient particles centred on the walker.
    sun.current.position.set(0, 14, z - 30);
    sun.current.target.position.set(0, 0, z);
    sun.current.target.updateMatrixWorld();
    followers.current.position.z = z;
  });

  return (
    <>
      <directionalLight
        ref={sun}
        color="#ff9c70"
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-bias={-0.0005}
      />
      <group ref={followers}>
        <pointLight position={[0, 3, 4]} color="#7f8cff" intensity={6} distance={12} decay={1.6} />
        <pointLight position={[-2.5, 1.5, -1.5]} color={PALETTE.magenta} intensity={4} distance={7} decay={1.8} />
        <Sparkles count={120} scale={[14, 7, 30]} position={[0, 3.5, -6]} size={2.2} speed={0.25} opacity={0.6} color="#ffd2a8" />
      </group>
    </>
  );
}

export default function World({ quality = "high" }) {
  const high = quality === "high";
  return (
    <Canvas
      shadows
      dpr={high ? [1, 1.75] : [1, 1.25]}
      camera={{ fov: 50, near: 0.1, far: 1600, position: [-1.2, 4.2, 15] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={[PALETTE.fog]} />
      <fogExp2 attach="fog" args={[PALETTE.fog, 0.0115]} />
      <hemisphereLight args={["#6d5bd8", "#140b1e", 0.9]} />
      <ambientLight intensity={0.15} />

      <Sky />
      <City quality={quality} />
      <Billboards />
      <Character />
      <Rig />

      <EffectComposer multisampling={high ? 4 : 0} disableNormalPass>
        <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.9} luminanceSmoothing={0.25} radius={0.75} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.22} darkness={0.78} />
        <Noise opacity={0.035} premultiply />
      </EffectComposer>
    </Canvas>
  );
}
