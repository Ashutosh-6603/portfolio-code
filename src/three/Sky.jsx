import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "./config";

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  uniform float uTime;
  varying vec3 vDir;

  void main() {
    vec3 dir = normalize(vDir);
    float h = dir.y;
    float toSun = dot(dir, uSunDir);

    // Horizon colour is strongest toward the sun and cools off to the sides/behind.
    float facing = smoothstep(-0.4, 1.0, toSun);
    vec3 horizon = mix(uMid * 1.4, uHorizon, facing);
    vec3 col = mix(horizon, uMid, smoothstep(0.0, 0.22, h));
    col = mix(col, uTop, smoothstep(0.18, 0.7, h));
    col = mix(col, uMid * 0.35, smoothstep(0.0, -0.15, h));

    // Sun disc with retro horizontal cut-outs on its lower half.
    float disc = smoothstep(0.9965, 0.9975, toSun);
    float rel = (h - uSunDir.y) * 220.0;
    float stripes = step(0.0, sin(rel * 0.9 + rel * rel * 0.004 - uTime * 0.6));
    float lower = step(h, uSunDir.y + 0.005);
    disc *= mix(1.0, stripes, lower);
    vec3 sunCol = mix(uSun * 1.6, vec3(1.6, 0.45, 0.75), smoothstep(uSunDir.y + 0.07, uSunDir.y - 0.07, h));

    float glow = pow(max(toSun, 0.0), 12.0) * 0.55 + pow(max(toSun, 0.0), 120.0) * 0.8;
    col += uHorizon * glow;
    col = mix(col, sunCol * 2.2, disc);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const SUN_DIR = new THREE.Vector3(0, 0.07, -1).normalize();

export default function Sky() {
  const group = useRef();
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(PALETTE.skyTop) },
      uMid: { value: new THREE.Color(PALETTE.skyMid) },
      uHorizon: { value: new THREE.Color(PALETTE.horizon) },
      uSun: { value: new THREE.Color(PALETTE.sun) },
      uSunDir: { value: SUN_DIR },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ camera, clock }) => {
    group.current.position.copy(camera.position);
    uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group ref={group}>
      <mesh renderOrder={-1} frustumCulled={false}>
        <sphereGeometry args={[800, 48, 24]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={THREE.BackSide}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
      <Stars radius={300} depth={80} count={2500} factor={6} saturation={0.4} fade speed={0.6} />
    </group>
  );
}
