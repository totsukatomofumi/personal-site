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
  const [position, setPosition] = useState([0, 1, 0]);
  const [activeKeys, setActiveKeys] = useState([false, false, false, false]); // w, a, s, d
  const raycasterTopLeftRef = useRef();
  const raycasterBottomLeftRef = useRef();
  const raycasterTopRightRef = useRef();
  const raycasterBottomRightRef = useRef();
  const navMeshRef = useRef();
  const raycasterDir = new THREE.Vector3(0, -1, 0);
  const [isCollisionTopLeft, setIsCollisionTopLeft] = useState(false);
  const [isCollisionBottomLeft, setIsCollisionBottomLeft] = useState(false);
  const [isCollisionTopRight, setIsCollisionTopRight] = useState(false);
  const [isCollisionBottomRight, setIsCollisionBottomRight] = useState(false);

  // Move player
  useEffect(() => {
    function handleKeyDown(e) {
      if (!e.repeat) {
        switch (e.key) {
          case "w":
            setActiveKeys((prev) => [true, prev[1], prev[2], prev[3]]);
            console.log("w");
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

    function movePlayer() {
      const vStep = 0.3;
      const hStep = 0.1;

      if (activeKeys[0] && !isCollisionTopLeft && !isCollisionTopRight) {
        setPosition((prev) => [prev[0], prev[1], prev[2] - vStep]);
      }
      if (activeKeys[1] && !isCollisionTopLeft && !isCollisionBottomLeft) {
        setPosition((prev) => [prev[0] - hStep, prev[1], prev[2]]);
      }
      if (activeKeys[2] && !isCollisionBottomLeft && !isCollisionBottomRight) {
        setPosition((prev) => [prev[0], prev[1], prev[2] + vStep]);
      }
      if (activeKeys[3] && !isCollisionTopRight && !isCollisionBottomRight) {
        setPosition((prev) => [prev[0] + hStep, prev[1], prev[2]]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    const movePlayerInterval = setInterval(movePlayer, 1000 / 60);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(movePlayerInterval);
    };
  }, [
    activeKeys,
    isCollisionTopLeft,
    isCollisionBottomLeft,
    isCollisionTopRight,
    isCollisionBottomRight,
  ]);

  // Raycast collision check
  useEffect(() => {
    const raycasterTopLeftOrigin = new THREE.Vector3(
      position[0] - playerWidth / 2,
      0,
      position[2] - 1
    );
    const raycasterBottomLeftOrigin = new THREE.Vector3(
      position[0] - playerWidth / 2,
      0,
      position[2] + 1
    );
    const raycasterTopRightOrigin = new THREE.Vector3(
      position[0] + playerWidth / 2,
      0,
      position[2] - 1
    );
    const raycasterBottomRightOrigin = new THREE.Vector3(
      position[0] + playerWidth / 2,
      0,
      position[2] + 1
    );

    raycasterTopLeftRef.current.set(raycasterTopLeftOrigin, raycasterDir);
    raycasterBottomLeftRef.current.set(raycasterBottomLeftOrigin, raycasterDir);
    raycasterTopRightRef.current.set(raycasterTopRightOrigin, raycasterDir);
    raycasterBottomRightRef.current.set(
      raycasterBottomRightOrigin,
      raycasterDir
    );

    if (
      raycasterTopLeftRef.current.intersectObject(navMeshRef.current, false)
        .length > 0
    ) {
      setIsCollisionTopLeft(false);
    } else {
      setIsCollisionTopLeft(true);
    }
    if (
      raycasterBottomLeftRef.current.intersectObject(navMeshRef.current, false)
        .length > 0
    ) {
      setIsCollisionBottomLeft(false);
    } else {
      setIsCollisionBottomLeft(true);
    }
    if (
      raycasterTopRightRef.current.intersectObject(navMeshRef.current, false)
        .length > 0
    ) {
      setIsCollisionTopRight(false);
    } else {
      setIsCollisionTopRight(true);
    }
    if (
      raycasterBottomRightRef.current.intersectObject(navMeshRef.current, false)
        .length > 0
    ) {
      setIsCollisionBottomRight(false);
    } else {
      setIsCollisionBottomRight(true);
    }
  }, [position]);

  return (
    <>
      <mesh position={position}>
        <planeGeometry args={[playerWidth, playerHeight]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <raycaster ref={raycasterTopLeftRef} />
      <raycaster ref={raycasterBottomLeftRef} />
      <raycaster ref={raycasterTopRightRef} />
      <raycaster ref={raycasterBottomRightRef} />
      <NavMesh
        ref={navMeshRef}
        position={[0, -1, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </>
  );
}

export default App;
