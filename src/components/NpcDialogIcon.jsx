import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import npcDialogIconSprite from "../sprites/npc-dialog-icon.png";

const SPRITE_HORIZ_TILES_NUM = 4;
const SPRITE_VERT_TILES_NUM = 1;
const TIME_PER_FRAME = 0.4;
const TIME_PER_LAST_FRAME = 0.8;

function NpcDialogIcon({ position, scale, visible = true }) {
  const spriteRef = useRef();
  const npcDialogIconSpriteMap = useLoader(
    THREE.TextureLoader,
    npcDialogIconSprite
  );
  const elapsedTime = useRef(0);
  const tileIndex = useRef(0);

  npcDialogIconSpriteMap.magFilter = THREE.NearestFilter;
  npcDialogIconSpriteMap.repeat.set(
    1 / SPRITE_HORIZ_TILES_NUM,
    1 / SPRITE_VERT_TILES_NUM
  );

  function animateIcon(delta) {
    elapsedTime.current += delta;

    if (elapsedTime.current < TIME_PER_FRAME) return;

    elapsedTime.current = 0;

    tileIndex.current =
      (tileIndex.current + 1) %
      (SPRITE_HORIZ_TILES_NUM * SPRITE_VERT_TILES_NUM);

    if (tileIndex.current === SPRITE_HORIZ_TILES_NUM - 1) {
      // add delay for last frame before reset
      elapsedTime.current = TIME_PER_FRAME - TIME_PER_LAST_FRAME;
    }

    const offsetX =
      (tileIndex.current % SPRITE_HORIZ_TILES_NUM) / SPRITE_HORIZ_TILES_NUM;
    const offsetY =
      Math.floor(tileIndex.current / SPRITE_HORIZ_TILES_NUM) /
      SPRITE_VERT_TILES_NUM;

    spriteRef.current.material.map.offset.set(offsetX, offsetY);
  }

  useFrame((state, delta, xrFrame) => {
    animateIcon(delta);
  });

  return (
    <sprite ref={spriteRef} scale={scale} position={position} visible={visible}>
      <spriteMaterial map={npcDialogIconSpriteMap} />
    </sprite>
  );
}

export default NpcDialogIcon;
