import { SoftShadows } from "@react-three/drei";

function Lighting({ playerRef }) {
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
        color="#FFA500"
        position={[3.8, 2, -15.9]}
        intensity={40}
        castShadow
      />
      <pointLight
        color="#FFA500"
        position={[-6.25, 2, -1.6]}
        intensity={40}
        castShadow
      />
      <pointLight
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
      <pointLight
        color="#FFA500"
        position={[-5.6, 2, -12.5]}
        intensity={40}
        castShadow
      />
      <pointLight
        color="#FFA500"
        position={[0, 10, -80]}
        intensity={500}
        castShadow
      />
      <SoftShadows />
    </>
  );
}

export default Lighting;
