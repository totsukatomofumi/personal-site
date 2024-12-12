import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Map from "./models/Map";
import NavMesh from "./models/Navmesh";
import playerSprite from "./sprites/player.png";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function App() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen pb-[80px] ">
      <div className="relative w-full h-full">
        <Canvas>
          <Scene />
        </Canvas>
        <Joystick />
      </div>
    </div>
  );
}

function Joystick() {
  const [isActive, setIsActive] = useState(false);
  const [initTouchPos, setInitTouchPos] = useState([0, 0]);
  const [currTouchPos, setCurrTouchPos] = useState([0, 0]);
  const [touchId, setTouchId] = useState(null);
  const baseRef = useRef();
  const stickRef = useRef();

  function handleOnTouchStart(e) {
    const touch = e.changedTouches[0];

    setTouchId(touch.identifier);
    setInitTouchPos([touch.clientX, touch.clientY]);
    setCurrTouchPos([touch.clientX, touch.clientY]);

    setIsActive(true);
  }

  function handleOnTouchMove(e) {
    let touch = null;

    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        touch = e.changedTouches[i];
        break;
      }
    }

    if (touch === null) return;
    setCurrTouchPos([touch.clientX, touch.clientY]);
  }

  function handleOnTouchEnd(e) {
    setCurrTouchPos(initTouchPos);
    setIsActive(false);
  }

  // joystick fade in
  useGSAP(
    () => {
      if (baseRef.current === null) return;

      const opacity = isActive ? 1 : 0;

      const tl = gsap.timeline();

      tl.to(baseRef.current, { opacity: opacity, duration: 0.1 });
    },
    { dependencies: [isActive] }
  );

  // joystick movement animation
  useGSAP(
    () => {
      if (baseRef.current === null) return;

      const tl = gsap.timeline();

      tl.set(baseRef.current, { x: initTouchPos[0], y: initTouchPos[1] });
      tl.set(stickRef.current, { x: 0, y: 0 });
    },
    { dependencies: [baseRef, initTouchPos] }
  );

  useGSAP(
    () => {
      if (stickRef.current === null) return;

      const tl = gsap.timeline();

      tl.to(stickRef.current, {
        x: currTouchPos[0] - initTouchPos[0],
        y: currTouchPos[1] - initTouchPos[1],
        duration: 0.1,
      });
    },
    { dependencies: [stickRef, currTouchPos, initTouchPos] }
  );

  return (
    <div
      className="absolute top-0 left-0 w-full h-full z-40"
      onTouchStart={handleOnTouchStart}
      onTouchEnd={handleOnTouchEnd}
      onTouchMove={handleOnTouchMove}
    >
      <div
        ref={baseRef}
        className="absolute top-0 left-0 w-[100px] h-[100px] flex justify-center items-center translate-x-[-50px] translate-y-[-50px] opacity-0"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-black rounded-full"></div>
        <div
          ref={stickRef}
          className="w-[40px] h-[40px] opacity-50 bg-black rounded-full"
        ></div>
      </div>
    </div>
  );
}

const MAP_POS = [0, 0, 0];
const MAP_ROT = [0, -Math.PI / 2, 0];

function Scene() {
  useThree(({ gl, camera }) => {
    camera.setFocalLength(60);
    camera.position.set(0, 6, 22); // horiz x [-1, 1] vert y [6] depth z [16, 22]
    camera.rotation.set(THREE.MathUtils.degToRad(-5), 0, 0); // angle at -5
  });

  return (
    <>
      <Player />
      <Map position={MAP_POS} rotation={MAP_ROT} renderOrder={1} />

      <ambientLight intensity={2} />
      <fog attach="fog" args={["white", 0, 180]} />
    </>
  );
}

function Player() {
  const playerWidth = 2;
  const playerHeight = 2;
  const playerInitPos = [0, 1, 0];
  const playerRef = useRef();

  // Move player
  const hSpeed = 4;
  const vSpeed = 11;
  const activeKeys = useRef([false, false, false, false]); // w, a, s, d
  const playerDir = useRef([true, false, false, false]); // up, left, down, right
  const isPlayerMoving = useRef(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!e.repeat) {
        switch (e.key) {
          case "w":
            activeKeys.current[0] = true;
            break;
          case "a":
            activeKeys.current[1] = true;
            break;
          case "s":
            activeKeys.current[2] = true;
            break;
          case "d":
            activeKeys.current[3] = true;
            break;
          default:
        }
      }
    }

    function handleKeyUp(e) {
      switch (e.key) {
        case "w":
          activeKeys.current[0] = false;
          break;
        case "a":
          activeKeys.current[1] = false;
          break;
        case "s":
          activeKeys.current[2] = false;
          break;
        case "d":
          activeKeys.current[3] = false;
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
    const [w, a, s, d] = activeKeys.current;

    if (w) {
      const distance = vSpeed * delta;

      // do prediction
      const predictionOrigin = new THREE.Vector3();
      predictionOrigin.copy(playerRef.current.position);
      predictionOrigin.z -= distance;
      raycasterRef.current.ray.origin.copy(predictionOrigin);

      if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
        playerRef.current.position.z -= distance;
      }
    }
    if (a) {
      const distance = hSpeed * delta;

      // do prediction
      const predictionOrigin = new THREE.Vector3();
      predictionOrigin.copy(playerRef.current.position);
      predictionOrigin.x -= distance;
      raycasterRef.current.ray.origin.copy(predictionOrigin);

      if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
        playerRef.current.position.x -= distance;
      }
    }
    if (s) {
      const distance = vSpeed * delta;

      // do prediction
      const predictionOrigin = new THREE.Vector3();
      predictionOrigin.copy(playerRef.current.position);
      predictionOrigin.z += distance;
      raycasterRef.current.ray.origin.copy(predictionOrigin);

      if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
        playerRef.current.position.z += distance;
      }
    }
    if (d) {
      const distance = hSpeed * delta;

      // do prediction
      const predictionOrigin = new THREE.Vector3();
      predictionOrigin.copy(playerRef.current.position);
      predictionOrigin.x += distance;
      raycasterRef.current.ray.origin.copy(predictionOrigin);

      if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
        playerRef.current.position.x += distance;
      }
    }

    if (w || a || s || d) {
      isPlayerMoving.current = true;
      playerDir.current = [w, a, s, d];
    } else {
      isPlayerMoving.current = false;
    }
  }

  useFrame((state, delta, xrFrame) => {
    movePlayer(delta);
  });

  // Sprite animations
  const playerSpriteMap = useLoader(THREE.TextureLoader, playerSprite);
  const tilesHoriz = 4;
  const tilesVert = 8;
  playerSpriteMap.magFilter = THREE.NearestFilter;
  playerSpriteMap.repeat.set(1 / tilesHoriz, 1 / tilesVert);

  const tileIndex = useRef(0);
  const elapsedTime = useRef(0);
  const idleLeft = [0, 1];
  const idleUp = [4, 5];
  const idleRight = [8, 9];
  const idleDown = [12, 13];
  const walkLeft = [16, 17, 18, 19];
  const walkUp = [20, 21, 22, 23];
  const walkRight = [24, 25, 26, 27];
  const walkDown = [28, 29, 30, 31];
  const timePerFrame = 0.1;

  function animatePlayerSprite(delta) {
    elapsedTime.current += delta;

    if (elapsedTime.current < timePerFrame) return;

    elapsedTime.current = 0;

    const [isDirUp, isDirLeft, isDirDown, isDirRight] = playerDir.current;

    if (isPlayerMoving.current) {
      if (isDirLeft) {
        if (tileIndex.current === walkLeft[0]) {
          tileIndex.current = walkLeft[1];
        } else if (tileIndex.current === walkLeft[1]) {
          tileIndex.current = walkLeft[2];
        } else if (tileIndex.current === walkLeft[2]) {
          tileIndex.current = walkLeft[3];
        } else if (tileIndex.current === walkLeft[3]) {
          tileIndex.current = walkLeft[0];
        } else {
          tileIndex.current = walkLeft[0];
        }
      } else if (isDirRight) {
        if (tileIndex.current === walkRight[0]) {
          tileIndex.current = walkRight[1];
        } else if (tileIndex.current === walkRight[1]) {
          tileIndex.current = walkRight[2];
        } else if (tileIndex.current === walkRight[2]) {
          tileIndex.current = walkRight[3];
        } else if (tileIndex.current === walkRight[3]) {
          tileIndex.current = walkRight[0];
        } else {
          tileIndex.current = walkRight[0];
        }
      } else {
        if (isDirUp) {
          if (tileIndex.current === walkUp[0]) {
            tileIndex.current = walkUp[1];
          } else if (tileIndex.current === walkUp[1]) {
            tileIndex.current = walkUp[2];
          } else if (tileIndex.current === walkUp[2]) {
            tileIndex.current = walkUp[3];
          } else if (tileIndex.current === walkUp[3]) {
            tileIndex.current = walkUp[0];
          } else {
            tileIndex.current = walkUp[0];
          }
        } else if (isDirDown) {
          if (tileIndex.current === walkDown[0]) {
            tileIndex.current = walkDown[1];
          } else if (tileIndex.current === walkDown[1]) {
            tileIndex.current = walkDown[2];
          } else if (tileIndex.current === walkDown[2]) {
            tileIndex.current = walkDown[3];
          } else if (tileIndex.current === walkDown[3]) {
            tileIndex.current = walkDown[0];
          } else {
            tileIndex.current = walkDown[0];
          }
        }
      }
    } else {
      if (isDirLeft) {
        if (tileIndex.current === idleLeft[0]) {
          tileIndex.current = idleLeft[1];
        } else if (tileIndex.current === idleLeft[1]) {
          tileIndex.current = idleLeft[0];
        } else {
          tileIndex.current = idleLeft[0];
        }
      } else if (isDirRight) {
        if (tileIndex.current === idleRight[0]) {
          tileIndex.current = idleRight[1];
        } else if (tileIndex.current === idleRight[1]) {
          tileIndex.current = idleRight[0];
        } else {
          tileIndex.current = idleRight[0];
        }
      } else if (isDirUp) {
        if (tileIndex.current === idleUp[0]) {
          tileIndex.current = idleUp[1];
        } else if (tileIndex.current === idleUp[1]) {
          tileIndex.current = idleUp[0];
        } else {
          tileIndex.current = idleUp[0];
        }
      } else if (isDirDown) {
        if (tileIndex.current === idleDown[0]) {
          tileIndex.current = idleDown[1];
        } else if (tileIndex.current === idleDown[1]) {
          tileIndex.current = idleDown[0];
        } else {
          tileIndex.current = idleDown[0];
        }
      }
    }

    const offsetX = (tileIndex.current % tilesHoriz) / tilesHoriz;
    const offsetY = Math.floor(tileIndex.current / tilesHoriz) / tilesVert;

    playerRef.current.material.map.offset.set(offsetX, offsetY);
  }

  useFrame((state, delta, xrFrame) => {
    animatePlayerSprite(delta);
  });

  // Navmesh collision
  const raycasterDir = new THREE.Vector3(0, -1, 0);
  const navMeshPos = [MAP_POS[0], MAP_POS[1] - 1, MAP_POS[2]];
  const raycasterRef = useRef();
  const navMeshRef = useRef();

  return (
    <>
      <sprite
        ref={playerRef}
        position={playerInitPos}
        scale={[playerHeight, playerWidth]}
      >
        <spriteMaterial map={playerSpriteMap} />
      </sprite>
      <raycaster ref={raycasterRef} ray-direction={raycasterDir} />
      <NavMesh ref={navMeshRef} position={navMeshPos} rotation={MAP_ROT} />
    </>
  );
}

export default App;
