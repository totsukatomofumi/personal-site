import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";

const Z_AXIS_MAX = 10;
const Z_AXIS_MIN = -25;
const X_AXIS_MAX = 5;
const X_AXIS_MIN = -5;
const Y_AXIS_MAX = 10;
const Y_AXIS_MIN = 0;
const TIME_PER_FRAME = 0.01;
const PARTICLE_COUNT = 50;

function Dust() {
  const particlesRef = useRef();
  const arrayRef = useRef(new Float32Array(3 * PARTICLE_COUNT));
  const elapsedTimeAnim = useRef(0);

  function initializeParticles() {
    const particles = arrayRef.current;
    for (let i = 0; i < particles.length; i += 3) {
      particles[i] = Math.random() * (X_AXIS_MAX - X_AXIS_MIN) + X_AXIS_MIN;
      particles[i + 1] = Math.random() * (Y_AXIS_MAX - Y_AXIS_MIN) + Y_AXIS_MIN;
      particles[i + 2] = Math.random() * (Z_AXIS_MAX - Z_AXIS_MIN) + Z_AXIS_MIN;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  }

  function animateParticles(delta) {
    elapsedTimeAnim.current += delta;
    if (elapsedTimeAnim.current < TIME_PER_FRAME) return;
    elapsedTimeAnim.current = 0;

    const particles = arrayRef.current;

    for (let i = 0; i < particles.length; i += 3) {
      particles[i] += Math.random() * 0.01;
      particles[i + 1] +=
        Math.random() *
        0.005 *
        Math.sin(Date.now() * 0.001 + (i * Math.PI) / 2);

      if (particles[i] > X_AXIS_MAX) {
        particles[i] = X_AXIS_MIN;
        particles[i + 1] =
          Math.random() * (Y_AXIS_MAX - Y_AXIS_MIN) + Y_AXIS_MIN;
        particles[i + 2] =
          Math.random() * (Z_AXIS_MAX - Z_AXIS_MIN) + Z_AXIS_MIN;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  }

  useEffect(() => {
    initializeParticles();
  }, []);

  useFrame((_, delta) => {
    animateParticles(delta);
  });

  return (
    <points ref={particlesRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={arrayRef.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#9E9C9A" transparent opacity={0.7} />
    </points>
  );
}

export default Dust;
