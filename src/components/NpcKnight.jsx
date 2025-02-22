import { forwardRef, useEffect, useRef } from "react";
import npcKnightSprite from "../sprites/npc-knight.png";
import NpcBase from "./NpcBase";
import {
  NPC_KNIGHT_INIT_POS,
  NPC_KNIGHT_INIT_DIR,
  NPC_KNIGHT_TIME_PER_IDLE_FRAME,
  NPC_KNIGHT_TIME_PER_BLINK_FRAME,
  NPC_KNIGHT_TIME_PER_WALK_FRAME,
  MAX_NPC_KNIGHT_BLINK_TIME_ADVANCE,
} from "../constants";

const NpcKnight = forwardRef(function NpcKnight(_, npcRef) {
  const npcDir = useRef(NPC_KNIGHT_INIT_DIR);
  const isNpcIdle = useRef(true);

  useEffect(() => {
    if (!npcRef.current) return;

    npcRef.current.position.set(...NPC_KNIGHT_INIT_POS);
  }, [npcRef]);

  return (
    <>
      <group ref={npcRef}>
        <NpcBase
          npcDir={npcDir}
          isNpcIdle={isNpcIdle}
          npcSprite={npcKnightSprite}
          npcTimePerIdleFrame={NPC_KNIGHT_TIME_PER_IDLE_FRAME}
          npcTimePerBlinkFrame={NPC_KNIGHT_TIME_PER_BLINK_FRAME}
          npcTimePerWalkFrame={NPC_KNIGHT_TIME_PER_WALK_FRAME}
          maxNpcBlinkTimeAdvance={MAX_NPC_KNIGHT_BLINK_TIME_ADVANCE}
        />
      </group>
    </>
  );
});

export default NpcKnight;
