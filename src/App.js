import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Map from "./models/Map";
import NavMesh from "./models/Navmesh";

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

      <ambientLight intensity={2} />
      <fog attach="fog" args={["white", 0, 180]} />
    </>
  );
}

function Player() {
  const playerWidth = 1;
  const playerHeight = 2;
  const playerInitPos = [0, 1, 0];
  const playerRef = useRef();
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

  // per frame
  function movePlayer(delta) {
    const hSpeed = 4;
    const vSpeed = 10;
    const [w, a, s, d] = activeKeys;
    if (w) {
      playerRef.current.position.z -= vSpeed * delta;
    }
    if (a) {
      playerRef.current.position.x -= hSpeed * delta;
    }
    if (s) {
      playerRef.current.position.z += vSpeed * delta;
    }
    if (d) {
      playerRef.current.position.x += hSpeed * delta;
    }
  }

  useFrame((state, delta, xrFrame) => {
    movePlayer(delta);
  });

  return (
    <>
      <mesh ref={playerRef} position={playerInitPos}>
        <planeGeometry args={[playerWidth, playerHeight]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
}

export default App;
