import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import {
  DUST_X_AXIS_MAX,
  DUST_X_AXIS_MIN,
  DUST_Y_AXIS_MAX,
  DUST_Y_AXIS_MIN,
  DUST_Z_AXIS_MAX,
  DUST_Z_AXIS_MIN,
  DUST_PARTICLE_COUNT,
  DUST_TIME_PER_ANIM_FRAME,
  DUST_COLOR,
} from "../constants";

const BUFFER_ATTRIBUTE_ITEM_SIZE = 3;

function Dust() {
  const particlesRef = useRef();
  const arrayRef = useRef(
    new Float32Array(BUFFER_ATTRIBUTE_ITEM_SIZE * DUST_PARTICLE_COUNT)
  );
  const elapsedTimeAnim = useRef(0);

  function initializeParticles() {
    const particles = arrayRef.current;
    for (let i = 0; i < particles.length; i += 3) {
      particles[i] =
        Math.random() * (DUST_X_AXIS_MAX - DUST_X_AXIS_MIN) + DUST_X_AXIS_MIN;
      particles[i + 1] =
        Math.random() * (DUST_Y_AXIS_MAX - DUST_Y_AXIS_MIN) + DUST_Y_AXIS_MIN;
      particles[i + 2] =
        Math.random() * (DUST_Z_AXIS_MAX - DUST_Z_AXIS_MIN) + DUST_Z_AXIS_MIN;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  }

  function animateParticles(delta) {
    elapsedTimeAnim.current += delta;
    if (elapsedTimeAnim.current < DUST_TIME_PER_ANIM_FRAME) return;
    elapsedTimeAnim.current = 0;

    const particles = arrayRef.current;

    for (let i = 0; i < particles.length; i += 3) {
      particles[i] += Math.random() * 0.02;
      particles[i + 1] +=
        Math.random() *
        0.005 *
        Math.sin(Date.now() * 0.001 + (i * Math.PI) / 2);

      if (particles[i] > DUST_X_AXIS_MAX) {
        particles[i] = DUST_X_AXIS_MIN;
        particles[i + 1] =
          Math.random() * (DUST_Y_AXIS_MAX - DUST_Y_AXIS_MIN) + DUST_Y_AXIS_MIN;
        particles[i + 2] =
          Math.random() * (DUST_Z_AXIS_MAX - DUST_Z_AXIS_MIN) + DUST_Z_AXIS_MIN;
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
          count={DUST_PARTICLE_COUNT}
          array={arrayRef.current}
          itemSize={BUFFER_ATTRIBUTE_ITEM_SIZE}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={DUST_COLOR} transparent opacity={0.7} />
    </points>
  );
}

export default Dust;
