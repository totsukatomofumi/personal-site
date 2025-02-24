import { forwardRef, useEffect, useRef } from "react";
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
import NpcDialog from "./NpcDialog";

const NpcCat = forwardRef(function NpcCat(_, npcRef) {
  const npcDir = useRef(NPC_CAT_INIT_DIR);
  const isNpcIdle = useRef(true);

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
        <NpcDialog position={[0, 0.3, 0]} />
      </group>
    </>
  );
});

export default NpcCat;
