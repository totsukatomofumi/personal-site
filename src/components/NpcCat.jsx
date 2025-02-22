import { useEffect, useRef } from "react";
import npcCatSprite from "../sprites/npc-cat.png";
import NpcBase from "./NpcBase";
import {
  NPC_CAT_INIT_POS,
  NPC_CAT_INIT_DIR,
  NPC_CAT_TIME_PER_IDLE_FRAME,
  NPC_CAT_TIME_PER_BLINK_FRAME,
  NPC_CAT_TIME_PER_WALK_FRAME,
  MAX_NPC_CAT_BLINK_TIME_ADVANCE,
} from "../constants";

function NpcCat() {
  const npcRef = useRef();
  const npcDir = useRef(NPC_CAT_INIT_DIR);
  const isNpcIdle = useRef(true);
  // to differ animation interval from other NPCs

  useEffect(() => {
    if (!npcRef.current) return;

    npcRef.current.position.set(...NPC_CAT_INIT_POS);
  }, [npcRef]);

  return (
    <>
      <group ref={npcRef}>
        <NpcBase
          npcDir={npcDir}
          isNpcIdle={isNpcIdle}
          npcSprite={npcCatSprite}
          npcTimePerIdleFrame={NPC_CAT_TIME_PER_IDLE_FRAME}
          npcTimePerBlinkFrame={NPC_CAT_TIME_PER_BLINK_FRAME}
          npcTimePerWalkFrame={NPC_CAT_TIME_PER_WALK_FRAME}
          maxNpcBlinkTimeAdvance={MAX_NPC_CAT_BLINK_TIME_ADVANCE}
        />
      </group>
    </>
  );
}

export default NpcCat;
