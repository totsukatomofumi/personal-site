import { forwardRef, useRef } from "react";
import npcKnightSprite from "../sprites/npc-knight.png";
import NpcInteractableBase from "./NpcInteractableBase";
import {
  NPC_KNIGHT_DIALOG_ARRAY,
  NPC_KNIGHT_INIT_POS,
  NPC_KNIGHT_INIT_DIR,
  NPC_KNIGHT_TIME_PER_IDLE_FRAME,
  NPC_KNIGHT_TIME_PER_BLINK_FRAME,
  NPC_KNIGHT_TIME_PER_WALK_FRAME,
  MAX_NPC_KNIGHT_BLINK_TIME_ADVANCE,
  NPC_KNIGHT_NAME,
} from "../constants";

const NPC_KNIGHT_DIALOG_POS = [0, 1.25, 0];
const NPC_KNIGHT_NO_NAV_MESH_SCALE = [2, 3];
const NPC_KNIGHT_DIALOG_TRIGGER_MESH_SCALE = [2.2, 3.2];

const NpcKnight = forwardRef(function NpcKnight(
  { playerRef, setIsDialogActive, toggleDialog, setToggleTutorialAnim },
  noNavMeshRef
) {
  const npcDir = useRef(NPC_KNIGHT_INIT_DIR);
  const isNpcIdle = useRef(true);

  function handleTutorial() {
    setToggleTutorialAnim((prev) => (prev ? !prev : true));
  }

  return (
    <NpcInteractableBase
      ref={noNavMeshRef}
      playerRef={playerRef}
      npcName={NPC_KNIGHT_NAME}
      npcSprite={npcKnightSprite}
      npcDir={npcDir}
      isNpcIdle={isNpcIdle}
      npcInitPos={NPC_KNIGHT_INIT_POS}
      npcTimePerIdleFrame={NPC_KNIGHT_TIME_PER_IDLE_FRAME}
      npcTimePerBlinkFrame={NPC_KNIGHT_TIME_PER_BLINK_FRAME}
      npcTimePerWalkFrame={NPC_KNIGHT_TIME_PER_WALK_FRAME}
      maxNpcBlinkTimeAdvance={MAX_NPC_KNIGHT_BLINK_TIME_ADVANCE}
      noNavMeshScale={NPC_KNIGHT_NO_NAV_MESH_SCALE}
      dialogPos={NPC_KNIGHT_DIALOG_POS}
      dialogTriggerMeshScale={NPC_KNIGHT_DIALOG_TRIGGER_MESH_SCALE}
      setIsDialogActive={setIsDialogActive}
      toggleDialog={toggleDialog}
      dialogArr={NPC_KNIGHT_DIALOG_ARRAY}
      onTutorial={handleTutorial}
    />
  );
});

export default NpcKnight;
