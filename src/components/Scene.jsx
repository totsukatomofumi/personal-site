import { forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Map from "../models/Map";
import NavMesh from "../models/Navmesh";
import playerSprite from "../sprites/player.png";

const MAP_POS = [0, 0, 0];
const MAP_ROT = [0, -Math.PI / 2, 0];
const CAM_VERT = 6;
const CAM_ROT = -5;
const MAX_CAM_DEPTH = 22;
const MIN_CAM_DEPTH = 10;
const MAX_CAM_HORIZ = 1;
const MIN_CAM_HORIZ = -1;

function Scene({ isJoyStickActive, joystickPos, activeKeys }) {
  const playerRef = useRef();

  useThree(({ gl, camera }) => {
    gl.setClearColor("white");
    camera.setFocalLength(60);
    camera.position.set(0, CAM_VERT, MAX_CAM_DEPTH); // horiz x [-1, 1] vert y [6] depth z [10, 22]
    camera.rotation.set(THREE.MathUtils.degToRad(CAM_ROT), 0, 0); // angle at -5
  });

  return (
    <>
      <Camera playerRef={playerRef} />
      <Player
        ref={playerRef}
        isJoyStickActive={isJoyStickActive}
        joystickPos={joystickPos}
        activeKeys={activeKeys}
      />
      <Map position={MAP_POS} rotation={MAP_ROT} renderOrder={1} />

      <ambientLight intensity={2} />
      <fog attach="fog" args={["white", 0, 180]} />
    </>
  );
}

function Camera({ playerRef }) {
  const maxHoriz = 4;
  const minDepth = -12;
  const maxDepth = 0;
  const [toggleAnim, setToggleAnim] = useState(false);
  const cameraRef = useRef();

  useThree(({ camera }) => {
    cameraRef.current = camera;
  });

  useFrame(() => {
    setToggleAnim((prev) => !prev);
  });

  useGSAP(
    () => {
      if (playerRef.current === null || playerRef.current === undefined) return;

      const tl = gsap.timeline();

      // [-4, 4]
      const playerHoriz =
        Math.abs(playerRef.current.position.x) > maxHoriz
          ? Math.sign(playerRef.current.position.x) * maxHoriz
          : playerRef.current.position.x;

      // [-10, 0]
      const playerDepth =
        playerRef.current.position.z < maxDepth
          ? playerRef.current.position.z > minDepth
            ? playerRef.current.position.z
            : minDepth
          : maxDepth;

      const camHoriz = (playerHoriz / maxHoriz) * MAX_CAM_HORIZ;
      const camDepth =
        MAX_CAM_DEPTH +
        (playerDepth / (maxDepth - minDepth)) * (MAX_CAM_DEPTH - MIN_CAM_DEPTH);

      tl.to(cameraRef.current.position, {
        x: camHoriz,
        z: camDepth,
        duration: 1,
      });
    },
    { dependencies: [cameraRef, toggleAnim] }
  );

  return null;
}

const Player = forwardRef(function Player(
  { joystickPos, isJoyStickActive, activeKeys },
  playerRef
) {
  const playerWidth = 2;
  const playerHeight = 2;
  const playerInitPos = [0, 1, 0];

  // Move player
  const hSpeed = 4;
  const vSpeed = 11;
  const playerDir = useRef([true, false, false, false]); // up, left, down, right
  const isPlayerMoving = useRef(false);

  // joystick

  // per frame
  function movePlayerKeyboard(delta) {
    if (isJoyStickActive.current) {
      return;
    }
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

  function movePlayerJoystick(delta) {
    if (!isJoyStickActive.current) {
      return;
    }

    const [x, y] = joystickPos.current;
    const vDist = y * vSpeed * delta;
    const hDist = x * hSpeed * delta;

    const predictionOrigin = new THREE.Vector3();
    predictionOrigin.copy(playerRef.current.position);
    predictionOrigin.x += hDist;
    raycasterRef.current.ray.origin.copy(predictionOrigin);

    if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
      playerRef.current.position.x += hDist;
    }

    predictionOrigin.copy(playerRef.current.position);
    predictionOrigin.z += vDist;
    raycasterRef.current.ray.origin.copy(predictionOrigin);

    if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
      playerRef.current.position.z += vDist;
    }

    const diagThreshold = 0.4;

    if (x !== 0 || y !== 0) {
      isPlayerMoving.current = true;
      playerDir.current = [
        y < 0,
        Math.abs(y) < 0.2 ? x < 0 : x < -diagThreshold,
        y > 0,
        Math.abs(y) < 0.2 ? x > 0 : x > diagThreshold,
      ];
    } else {
      isPlayerMoving.current = false;
    }
  }

  useFrame((state, delta, xrFrame) => {
    movePlayerKeyboard(delta);
    movePlayerJoystick(delta);
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
});

export default Scene;
