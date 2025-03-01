import { forwardRef, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  SPRITE_HORIZ_TILES_NUM,
  SPRITE_VERT_TILES_NUM,
  SPRITE_SEQUENCES,
  SPRITE_WIDTH,
  SPRITE_HEIGHT,
} from "../constants";
import SpriteShadow from "./SpriteShadow";

const NpcBase = forwardRef(function NpcBase(
  {
    npcDir,
    isNpcIdle,
    npcSprite,
    npcTimePerIdleFrame,
    npcTimePerBlinkFrame,
    npcTimePerWalkFrame,
    maxNpcBlinkTimeAdvance,
    noNavMeshScale = [2, 2],
  },
  noNavMeshRef
) {
  const spriteRef = useRef();
  const isNpcBlinking = useRef(false);
  const npcSpriteMap = useLoader(THREE.TextureLoader, npcSprite);
  const npcSpriteSequence = useRef([]);
  const sequenceIndex = useRef(0);
  const tileIndex = useRef(0);
  const elapsedTime = useRef(0);

  npcSpriteMap.magFilter = THREE.NearestFilter;
  npcSpriteMap.repeat.set(
    1 / SPRITE_HORIZ_TILES_NUM,
    1 / SPRITE_VERT_TILES_NUM
  );

  function setNpcSpriteSequence() {
    const [isDirUp, isDirLeft, isDirDown, isDirRight] = npcDir.current;

    const oldSequence = npcSpriteSequence.current;

    if (isNpcIdle.current) {
      if (isDirUp) {
        npcSpriteSequence.current = SPRITE_SEQUENCES["idleUp"];
      }
      if (isDirDown) {
        npcSpriteSequence.current = SPRITE_SEQUENCES["idleDown"];
      }
      if (isDirLeft) {
        npcSpriteSequence.current = SPRITE_SEQUENCES["idleLeft"];
      }
      if (isDirRight) {
        npcSpriteSequence.current = SPRITE_SEQUENCES["idleRight"];
      }
    } else {
      if (isDirUp) {
        npcSpriteSequence.current = SPRITE_SEQUENCES["walkUp"];
      }
      if (isDirDown) {
        npcSpriteSequence.current = SPRITE_SEQUENCES["walkDown"];
      }
      if (isDirLeft) {
        npcSpriteSequence.current = SPRITE_SEQUENCES["walkLeft"];
      }
      if (isDirRight) {
        npcSpriteSequence.current = SPRITE_SEQUENCES["walkRight"];
      }
    }

    if (oldSequence !== npcSpriteSequence.current) {
      // trigger first frame of new sequence
      elapsedTime.current = Infinity;
      // reset sequence index
      sequenceIndex.current = 0;
    }
  }

  function animateNpc(delta) {
    setNpcSpriteSequence(); // set player sprite sequence based on direction and movement

    elapsedTime.current += delta;
    if (
      elapsedTime.current <
      (isNpcIdle.current
        ? isNpcBlinking.current
          ? npcTimePerBlinkFrame
          : npcTimePerIdleFrame
        : npcTimePerWalkFrame)
    )
      return;
    isNpcBlinking.current = false;
    elapsedTime.current = 0;

    sequenceIndex.current++;
    if (sequenceIndex.current >= npcSpriteSequence.current.length) {
      sequenceIndex.current = 0;
    }

    if (isNpcIdle.current && sequenceIndex.current === 1) {
      // signal blinking
      isNpcBlinking.current = true;
    }

    if (isNpcIdle.current && sequenceIndex.current === 0) {
      // add random advance to next blink
      elapsedTime.current = Math.random() * maxNpcBlinkTimeAdvance;
    }

    tileIndex.current = npcSpriteSequence.current[sequenceIndex.current];

    const offsetX =
      (tileIndex.current % SPRITE_HORIZ_TILES_NUM) / SPRITE_HORIZ_TILES_NUM;
    const offsetY =
      Math.floor(tileIndex.current / SPRITE_HORIZ_TILES_NUM) /
      SPRITE_VERT_TILES_NUM;

    spriteRef.current.material.map.offset.set(offsetX, offsetY);
  }

  useFrame((state, delta, xrFrame) => {
    animateNpc(delta);
  });

  return (
    <>
      <sprite ref={spriteRef} scale={[SPRITE_HEIGHT, SPRITE_WIDTH]} castShadow>
        <spriteMaterial map={npcSpriteMap} />
      </sprite>
      {/* No nav mesh */}
      <mesh
        ref={noNavMeshRef}
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={noNavMeshScale} />
        <meshBasicMaterial color="black" />
      </mesh>
      <SpriteShadow />
    </>
  );
});

export default NpcBase;
