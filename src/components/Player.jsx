import { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import playerSprite from "../sprites/player.png";
import {
  PLAYER_INIT_POS,
  PLAYER_H_SPEED,
  PLAYER_V_SPEED,
  PLAYER_INIT_DIR,
  SPRITE_HORIZ_TILES_NUM,
  SPRITE_VERT_TILES_NUM,
  SPRITE_SEQUENCES,
  SPRITE_DIAGONAL_THRESHOLD_SCALE,
  PLAYER_TIME_PER_IDLE_FRAME,
  PLAYER_TIME_PER_WALK_FRAME,
  SPRITE_WIDTH,
  SPRITE_HEIGHT,
} from "../constants";

const Player = forwardRef(function Player(
  { navMeshRef, npcNoNavMeshRefs, movementVector },
  playerRef
) {
  const selfRef = useRef();
  const playerDir = useRef(PLAYER_INIT_DIR);
  const isPlayerIdle = useRef(true);
  const raycasterRef = useRef();
  const playerSpriteMap = useLoader(THREE.TextureLoader, playerSprite);
  const playerSpriteSequence = useRef([]);
  const sequenceIndex = useRef(0);
  const tileIndex = useRef(0);
  const elapsedTime = useRef(0);
  const { camera } = useThree();

  playerSpriteMap.magFilter = THREE.NearestFilter;
  playerSpriteMap.repeat.set(
    1 / SPRITE_HORIZ_TILES_NUM,
    1 / SPRITE_VERT_TILES_NUM
  );

  function movePlayer(delta) {
    const [x, z] = movementVector.current;

    // set is idle
    isPlayerIdle.current = x === 0 && z === 0;

    if (isPlayerIdle.current) return; // if not moving, dont do anything

    // set player position
    setPlayerPosition([x, z], delta);

    // set player direction
    setPlayerDirection([x, z]);
  }

  function setPlayerPosition(movementVector, delta) {
    const [x, z] = movementVector;

    const predictionOrigin = new THREE.Vector3();
    const horizDist = x * PLAYER_H_SPEED * delta;
    const vertDist = z * PLAYER_V_SPEED * delta;

    // do prediction for horizontal movement
    predictionOrigin.copy(selfRef.current.position);
    predictionOrigin.x += horizDist;
    raycasterRef.current.ray.origin.copy(predictionOrigin);
    if (
      raycasterRef.current.intersectObject(navMeshRef.current).length > 0 &&
      raycasterRef.current.intersectObjects(
        npcNoNavMeshRefs.current
          ? npcNoNavMeshRefs.current.map((npcRef) => npcRef.current)
          : []
      ).length === 0
    ) {
      selfRef.current.position.x += horizDist;
    }

    // do prediction for vertical movement
    predictionOrigin.copy(selfRef.current.position);
    predictionOrigin.z += vertDist;
    raycasterRef.current.ray.origin.copy(predictionOrigin);
    if (
      raycasterRef.current.intersectObject(navMeshRef.current).length > 0 &&
      raycasterRef.current.intersectObjects(
        npcNoNavMeshRefs.current
          ? npcNoNavMeshRefs.current.map((npcRef) => npcRef.current)
          : []
      ).length === 0
    ) {
      selfRef.current.position.z += vertDist;
    }
  }

  function setPlayerDirection(movementVector) {
    const [x, z] = movementVector;

    const isDirUp = z < 0;
    const isDirLeft =
      x < 0 && Math.abs(x) > Math.abs(z) * SPRITE_DIAGONAL_THRESHOLD_SCALE;
    const isDirDown = z > 0;
    const isDirRight =
      x > 0 && Math.abs(x) > Math.abs(z) * SPRITE_DIAGONAL_THRESHOLD_SCALE;

    playerDir.current = [isDirUp, isDirLeft, isDirDown, isDirRight];
  }

  function setPlayerSpriteSequence() {
    const [isDirUp, isDirLeft, isDirDown, isDirRight] = playerDir.current;

    const oldSequence = playerSpriteSequence.current;

    if (isPlayerIdle.current) {
      if (isDirUp) {
        playerSpriteSequence.current = SPRITE_SEQUENCES["idleUp"];
      }
      if (isDirDown) {
        playerSpriteSequence.current = SPRITE_SEQUENCES["idleDown"];
      }
      if (isDirLeft) {
        playerSpriteSequence.current = SPRITE_SEQUENCES["idleLeft"];
      }
      if (isDirRight) {
        playerSpriteSequence.current = SPRITE_SEQUENCES["idleRight"];
      }
    } else {
      if (isDirUp) {
        playerSpriteSequence.current = SPRITE_SEQUENCES["walkUp"];
      }
      if (isDirDown) {
        playerSpriteSequence.current = SPRITE_SEQUENCES["walkDown"];
      }
      if (isDirLeft) {
        playerSpriteSequence.current = SPRITE_SEQUENCES["walkLeft"];
      }
      if (isDirRight) {
        playerSpriteSequence.current = SPRITE_SEQUENCES["walkRight"];
      }
    }

    if (oldSequence !== playerSpriteSequence.current) {
      // trigger first frame of new sequence
      elapsedTime.current = Infinity;
      // reset sequence index
      sequenceIndex.current = 0;
    }
  }

  function animatePlayer(delta) {
    setPlayerSpriteSequence(); // set player sprite sequence based on direction and movement

    elapsedTime.current += delta;
    if (
      elapsedTime.current <
      (isPlayerIdle.current
        ? PLAYER_TIME_PER_IDLE_FRAME
        : PLAYER_TIME_PER_WALK_FRAME)
    )
      return;
    elapsedTime.current = 0;

    sequenceIndex.current++;
    if (sequenceIndex.current >= playerSpriteSequence.current.length) {
      sequenceIndex.current = 0;
    }

    tileIndex.current = playerSpriteSequence.current[sequenceIndex.current];

    const offsetX =
      (tileIndex.current % SPRITE_HORIZ_TILES_NUM) / SPRITE_HORIZ_TILES_NUM;
    const offsetY =
      Math.floor(tileIndex.current / SPRITE_HORIZ_TILES_NUM) /
      SPRITE_VERT_TILES_NUM;

    selfRef.current.material.map.offset.set(offsetX, offsetY);
  }

  useFrame((state, delta, xrFrame) => {
    movePlayer(delta);
    animatePlayer(delta);
  });

  useImperativeHandle(playerRef, () => ({
    self: selfRef.current,
    raycaster: raycasterRef.current,
  }));

  return (
    <>
      <sprite
        ref={selfRef}
        position={PLAYER_INIT_POS}
        scale={[SPRITE_HEIGHT, SPRITE_WIDTH]}
      >
        <spriteMaterial map={playerSpriteMap} />
      </sprite>
      <raycaster
        ref={raycasterRef}
        ray-direction={new THREE.Vector3(0, -1, 0)}
        camera={camera}
      />
    </>
  );
});

export default Player;
