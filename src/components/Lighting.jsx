import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CASTLE_LIGHT_BRIGHTNESS_SCALE,
  DEBUG_ENABLE_AMBIENT_LIGHT,
  LAMP_LIGHT_COLOR,
  MOON_LIGHT_BRIGHTNESS_SCALE,
  NIGHT_SKY_COLOR,
  TAVERN_LIGHT_COLOR,
  TOWN_LIGHT_BRIGHTNESS_SCALE,
} from "../constants";

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

    lampRef.current.intensity =
      TOWN_LIGHT_BRIGHTNESS_SCALE * (Math.random() * 10 + 10);
  }

  function animateTavern(delta) {
    tavernAnimElapsedTime.current += delta;

    if (tavernAnimElapsedTime.current < 2) return;

    tavernAnimElapsedTime.current = 0;

    tavernARef.current.intensity =
      TOWN_LIGHT_BRIGHTNESS_SCALE * (Math.random() * 10 + 50);
    tavernBRef.current.intensity =
      TOWN_LIGHT_BRIGHTNESS_SCALE * (Math.random() * 10 + 50);
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
        intensity={MOON_LIGHT_BRIGHTNESS_SCALE * 1000}
        distance={70}
        castShadow
      />
      <spotLight
        position={[0, 20, -70]}
        intensity={MOON_LIGHT_BRIGHTNESS_SCALE * 500}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />
      {/* Fantasy night related */}
      <directionalLight
        color={NIGHT_SKY_COLOR}
        intensity={10}
        position={[0, 10, 0]}
      />
      <fog attach="fog" args={[NIGHT_SKY_COLOR, 0, 180]} />

      {/* Street lights related */}
      {/* tavern lights */}
      <pointLight
        ref={tavernARef}
        color={TAVERN_LIGHT_COLOR}
        position={[3.8, 2, -15.9]}
        intensity={TOWN_LIGHT_BRIGHTNESS_SCALE * 60}
        castShadow
      />
      <pointLight
        ref={tavernBRef}
        color={TAVERN_LIGHT_COLOR}
        position={[-6.25, 2, -1.67]}
        intensity={TOWN_LIGHT_BRIGHTNESS_SCALE * 60}
        castShadow
      />
      <pointLight
        color={TAVERN_LIGHT_COLOR}
        position={[6.4, 2, 4.7]}
        intensity={TOWN_LIGHT_BRIGHTNESS_SCALE * 60}
        castShadow
      />
      <pointLight
        color={TAVERN_LIGHT_COLOR}
        position={[2.2, 2, -43.2]}
        intensity={TOWN_LIGHT_BRIGHTNESS_SCALE * 60}
        castShadow
      />
      {/* lamp */}
      <pointLight
        ref={lampRef}
        color={LAMP_LIGHT_COLOR}
        position={[-0.15, 2.65, -22.3]}
        intensity={TOWN_LIGHT_BRIGHTNESS_SCALE * 20}
        distance={5}
        castShadow
      />
      {/* castle light up */}
      <pointLight
        position={[0, 12.5, -95]}
        intensity={CASTLE_LIGHT_BRIGHTNESS_SCALE * 300}
        distance={30}
        castShadow
      />
      {/* DEBUG */}
      {DEBUG_ENABLE_AMBIENT_LIGHT && (
        <ambientLight intensity={1} color={"white"} />
      )}
    </>
  );
}

export default Lighting;
