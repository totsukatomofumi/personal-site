import { forwardRef, useRef } from "react";
import npcCatSprite from "../sprites/npc-cat.png";
import {
  NPC_CAT_INIT_POS,
  NPC_CAT_INIT_DIR,
  NPC_CAT_TIME_PER_IDLE_FRAME,
  NPC_CAT_TIME_PER_BLINK_FRAME,
  NPC_CAT_TIME_PER_WALK_FRAME,
  MAX_NPC_CAT_BLINK_TIME_ADVANCE,
  NPC_CAT_DIALOG_ARRAY,
  NPC_CAT_NAME,
} from "../constants";
import NpcInteractableBase from "./NpcInteractableBase";
import npcCatMeowSoundUrl from "../sounds/npc-cat-meow.mp3";

const NPC_CAT_DIALOG_POS = [0, 0.7, 0];
const NPC_CAT_NO_NAV_MESH_SCALE = [2, 3];
const NPC_CAT_DIALOG_TRIGGER_MESH_SCALE = [2.2, 3.2];
const NPC_CAT_DIALOG_BUBBLE_OFFSET_X = -NPC_CAT_INIT_POS[0] * 0.5;
const NPC_CAT_DIALOG_BUBBLE_OFFSET_Y = 0.3;
const NPC_CAT_DIALOG_TRIGGER_SOUND_VOLUME = 3;

const NpcCat = forwardRef(function NpcCat(
  { playerRef, setIsDialogActive, toggleDialog },
  noNavMeshRef
) {
  const npcDir = useRef(NPC_CAT_INIT_DIR);
  const isNpcIdle = useRef(true);

  return (
    <NpcInteractableBase
      ref={noNavMeshRef}
      playerRef={playerRef}
      npcName={NPC_CAT_NAME}
      npcSprite={npcCatSprite}
      npcDir={npcDir}
      isNpcIdle={isNpcIdle}
      npcInitPos={NPC_CAT_INIT_POS}
      npcTimePerIdleFrame={NPC_CAT_TIME_PER_IDLE_FRAME}
      npcTimePerBlinkFrame={NPC_CAT_TIME_PER_BLINK_FRAME}
      npcTimePerWalkFrame={NPC_CAT_TIME_PER_WALK_FRAME}
      maxNpcBlinkTimeAdvance={MAX_NPC_CAT_BLINK_TIME_ADVANCE}
      noNavMeshScale={NPC_CAT_NO_NAV_MESH_SCALE}
      dialogPos={NPC_CAT_DIALOG_POS}
      dialogTriggerMeshScale={NPC_CAT_DIALOG_TRIGGER_MESH_SCALE}
      setIsDialogActive={setIsDialogActive}
      toggleDialog={toggleDialog}
      bubbleOffsetX={NPC_CAT_DIALOG_BUBBLE_OFFSET_X}
      bubbleOffsetY={NPC_CAT_DIALOG_BUBBLE_OFFSET_Y}
      isFacePlayer={false}
      dialogArr={NPC_CAT_DIALOG_ARRAY}
      dialogTriggerSoundUrl={npcCatMeowSoundUrl}
      dialogTriggerSoundVolume={NPC_CAT_DIALOG_TRIGGER_SOUND_VOLUME}
    />
  );
});

export default NpcCat;
