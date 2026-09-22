import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BackSide, Color, MathUtils } from 'three';

const vertex = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragment = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 uColor;
  uniform float uHover;
  void main() {
    vec3 n = normalize(vNormal);
    float light = max(dot(n, normalize(vec3(-0.6, 0.7, 0.8))), 0.0);
    float rim = pow(1.0 - max(n.z, 0.0), 3.0);
    float wave = sin(vPosition.y * 32.0 + sin(vPosition.x * 10.0) * 1.2 + sin(vPosition.z * 14.0));
    float detail = sin(vPosition.x * 140.0 + vPosition.y * 81.0) * sin(vPosition.z * 100.0);
    vec3 base = mix(vec3(0.023, 0.021, 0.045), uColor, light * 0.64);
    base += wave * 0.016 * light + detail * 0.015 * light;
    base += vec3(0.94, 0.63, 0.38) * rim * 0.9;
    base += uHover * rim * 0.19;
    gl_FragColor = vec4(base, 1.0);
  }
`;
const atmosphereFragment = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float rim = pow(1.0 - abs(normalize(vNormal).z), 3.0);
    gl_FragColor = vec4(0.62, 0.35, 0.95, rim * 0.13);
  }
`;
function seeded(seed) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}
function ParticleRing({ mobile }) {
  const positions = useMemo(() => {
    const random = seeded(28);
    const count = mobile ? 1500 : 3300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 1.53 + random() * 0.7;
      positions.set([Math.cos(angle) * radius, (random() - 0.5) * 0.016, Math.sin(angle) * radius], i * 3);
    }
    return positions;
  }, [mobile]);
  return <group rotation={[0.18, 0, -0.25]}>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#e4b787" size={0.009} transparent opacity={0.72} depthWrite={false} /></points>
    {[1.48, 1.63, 2.3].map((r, i) => <mesh key={r} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.0025, 3, mobile ? 96 : 160]} /><meshBasicMaterial color={i === 2 ? '#9985b4' : '#e4b787'} transparent opacity={i === 2 ? 0.3 : 0.45} /></mesh>)}
  </group>;
}
function Stars({ mobile }) {
  const positions = useMemo(() => {
    const random = seeded(76);
    return Float32Array.from({ length: (mobile ? 180 : 420) * 3 }, (_, i) => i % 3 === 2 ? -3 - random() * 4 : (random() - 0.5) * 13);
  }, [mobile]);
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#bdadcf" size={0.014} transparent opacity={0.65} sizeAttenuation depthWrite={false} /></points>;
}
function World({ moving, orientation, selection, drag, mobile }) {
  const world = useRef(null);
  const sphere = useRef(null);
  const moon = useRef(null);
  const [hover, setHover] = useState(false);
  const invalidate = useThree(s => s.invalidate);
  const colors = useMemo(() => ['#aa83ce', '#69aaa9', '#ca846e'].map(c => new Color(c)), []);
  const uniforms = useMemo(() => ({ uColor: { value: colors[selection] }, uHover: { value: 0 } }), [colors]);
  useEffect(() => { uniforms.uColor.value = colors[selection]; uniforms.uHover.value = hover ? 1 : 0; invalidate(); }, [selection, hover, uniforms, colors, invalidate]);
  useEffect(() => { invalidate(); }, [orientation, drag, moving, invalidate]);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.04);
    const scroll = moving ? Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1) : 0;
    const goalX = 0.36 + drag.y + scroll * 0.22;
    const goalY = orientation + drag.x;
    world.current.rotation.x = moving ? MathUtils.damp(world.current.rotation.x, goalX, 4, dt) : goalX;
    world.current.rotation.y = moving ? MathUtils.damp(world.current.rotation.y, goalY, 4, dt) : goalY;
    if (moving) {
      sphere.current.rotation.y += dt * 0.065;
      moon.current.rotation.y += dt * 0.13;
      world.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.045;
    }
  });
  return <>
    <Stars mobile={mobile} />
    <group ref={world} rotation={[0.36, 0, -0.14]}>
      <mesh ref={sphere} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <sphereGeometry args={[1.08, mobile ? 48 : 64, mobile ? 32 : 48]} />
        <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
      </mesh>
      <mesh scale={1.075}><sphereGeometry args={[1.08, 32, 24]} /><shaderMaterial vertexShader={vertex} fragmentShader={atmosphereFragment} transparent side={BackSide} blending={AdditiveBlending} depthWrite={false} /></mesh>
      <ParticleRing mobile={mobile} />
      <group ref={moon}>
        <mesh position={[2.23, 0.35, 0.9]}><sphereGeometry args={[0.09, 16, 12]} /><meshBasicMaterial color="#e4b787" /></mesh>
        <mesh position={[-1.95, 0.45, -0.9]}><sphereGeometry args={[0.045, 12, 8]} /><meshBasicMaterial color="#c2b2e9" /></mesh>
      </group>
    </group>
  </>;
}
function ContextGuard({ onFailure, onReady }) {
  const gl = useThree(s => s.gl);
  const callbacks = useRef({ onFailure, onReady });
  callbacks.current = { onFailure, onReady };
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = e => { e.preventDefault(); callbacks.current.onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);
    const id = requestAnimationFrame(() => callbacks.current.onReady());
    return () => { cancelAnimationFrame(id); canvas.removeEventListener('webglcontextlost', lost); };
  }, [gl]);
  return null;
}
export default function OrbitalScene({ moving, orientation, selection, onReady, onFailure }) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const start = useRef(null);
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const finish = () => { start.current = null; };
  return <div className="canvas-wrap" aria-hidden="true"
    onPointerDown={e => {
      if (e.button !== 0) return;
      start.current = { x: e.clientX, y: e.clientY, drag };
      e.currentTarget.setPointerCapture(e.pointerId);
    }}
    onPointerMove={e => {
      if (!start.current) return;
      setDrag({ x: start.current.drag.x + (e.clientX - start.current.x) * 0.007, y: MathUtils.clamp(start.current.drag.y + (e.clientY - start.current.y) * 0.003, -0.5, 0.5) });
    }} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}>
    <Canvas camera={{ position: [0, 0, 6.3], fov: 45 }} dpr={[1, mobile ? 1.25 : 1.5]} frameloop={moving ? 'always' : 'demand'}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'low-power' }} fallback={null}>
      <ContextGuard onReady={onReady} onFailure={onFailure} />
      <World moving={moving} orientation={orientation} selection={selection} drag={drag} mobile={mobile} />
    </Canvas>
  </div>;
}
