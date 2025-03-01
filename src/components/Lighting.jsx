import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SoftShadows } from "@react-three/drei";

function Lighting() {
  const lampRef = useRef();
  const lampAnimElapsedTime = useRef(0);
  const tavernARef = useRef();
  const tavernBRef = useRef();
  const tavernAnimElapsedTime = useRef(0);

  function animateLamp(delta) {
    lampAnimElapsedTime.current += delta;

    if (lampAnimElapsedTime.current < 0.1) return;

    lampAnimElapsedTime.current = 0;

    lampRef.current.intensity = Math.random() * 5 + 15;
  }

  function animateTavern(delta) {
    tavernAnimElapsedTime.current += delta;

    if (tavernAnimElapsedTime.current < 3) return;

    tavernAnimElapsedTime.current = 0;

    tavernARef.current.intensity = Math.random() * 5 + 35;
    tavernBRef.current.intensity = Math.random() * 5 + 35;
  }

  useFrame((_, delta) => {
    animateLamp(delta);
    animateTavern(delta);
  });

  return (
    <>
      {/* Moonlight related */}
      <spotLight
        position={[0, 20, -105]}
        intensity={1000}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[0, 20, -70]}
        intensity={500}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />

      {/* Bluish night related */}
      <directionalLight color="#0a0a33" intensity={20} position={[0, 10, 0]} />
      <fog attach="fog" args={["#0a0a33", 0, 180]} />

      {/* Street lights related */}
      <pointLight
        ref={tavernARef}
        color="#FFA500"
        position={[3.8, 2, -15.9]}
        intensity={40}
        castShadow
      />
      <pointLight
        ref={tavernBRef}
        color="#FFA500"
        position={[-6.25, 2, -1.6]}
        intensity={40}
        castShadow
      />
      {/* lamp */}
      <pointLight
        ref={lampRef}
        color="#FFA500"
        position={[-0.15, 2.65, -22.3]}
        intensity={20}
        castShadow
      />
      <pointLight
        color="#FFA500"
        position={[6.4, 2, 4.7]}
        intensity={40}
        castShadow
      />
      <SoftShadows />
    </>
  );
}

export default Lighting;
