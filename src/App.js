import { useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Map from "./models/Map";

function App() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <Canvas>
        <Scene />
      </Canvas>

      <div className="absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center">
        <div className="bg-black w-[1px] h-full"></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center">
        <div className="bg-black w-full h-[1px]"></div>
      </div>
    </div>
  );
}

function Scene() {
  useThree(({ camera }) => {
    camera.setFocalLength(50);
    camera.position.set(0, 10, 40);
    camera.rotation.set(THREE.MathUtils.degToRad(-10), 0, 0);
  });
  return (
    <>
      <Player />
      <Map position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      {/* <NavMesh position={[0, 1, 0]} rotation={[0, -Math.PI / 2, 0]} /> */}
      <ambientLight intensity={2} />
      <fog attach="fog" args={["white", 0, 180]} />
    </>
  );
}

function Player() {
  const [position, setPosition] = useState([0, 1, 0]);
  const [activeKeys, setActiveKeys] = useState([false, false, false, false]); // w, a, s, d

  // Move player
  useEffect(() => {
    function handleKeyDown(e) {
      if (!e.repeat) {
        switch (e.key) {
          case "w":
            setActiveKeys((prev) => [true, prev[1], prev[2], prev[3]]);
            break;
          case "a":
            setActiveKeys((prev) => [prev[0], true, prev[2], prev[3]]);
            break;
          case "s":
            setActiveKeys((prev) => [prev[0], prev[1], true, prev[3]]);
            break;
          case "d":
            setActiveKeys((prev) => [prev[0], prev[1], prev[2], true]);
            break;
          default:
        }
      }
    }

    function handleKeyUp(e) {
      switch (e.key) {
        case "w":
          setActiveKeys((prev) => [false, prev[1], prev[2], prev[3]]);
          break;
        case "a":
          setActiveKeys((prev) => [prev[0], false, prev[2], prev[3]]);
          break;
        case "s":
          setActiveKeys((prev) => [prev[0], prev[1], false, prev[3]]);
          break;
        case "d":
          setActiveKeys((prev) => [prev[0], prev[1], prev[2], false]);
          break;
        default:
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(({ camera }) => {
    function movePlayer() {
      const vStep = 0.3;
      const hStep = 0.08;

      if (activeKeys[0]) {
        setPosition((prev) => [prev[0], prev[1], prev[2] - vStep]);
      }
      if (activeKeys[1]) {
        setPosition((prev) => [prev[0] - hStep, prev[1], prev[2]]);
      }
      if (activeKeys[2]) {
        setPosition((prev) => [prev[0], prev[1], prev[2] + vStep]);
      }
      if (activeKeys[3]) {
        setPosition((prev) => [prev[0] + hStep, prev[1], prev[2]]);
      }
    }

    movePlayer();
  });

  return (
    <mesh position={position}>
      <planeGeometry args={[1, 2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default App;
