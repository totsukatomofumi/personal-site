import { forwardRef, useEffect, useRef, useState } from "react";
import npcKnightSprite from "../sprites/npc-knight.png";
import NpcBase from "./NpcBase";
import NpcDialog from "./NpcDialog";
import {
  NPC_KNIGHT_INIT_POS,
  NPC_KNIGHT_INIT_DIR,
  NPC_KNIGHT_TIME_PER_IDLE_FRAME,
  NPC_KNIGHT_TIME_PER_BLINK_FRAME,
  NPC_KNIGHT_TIME_PER_WALK_FRAME,
  MAX_NPC_KNIGHT_BLINK_TIME_ADVANCE,
} from "../constants";
import { useFrame } from "@react-three/fiber";

const NPC_KNIGHT_NO_NAV_MESH_SCALE = [2, 2];
const NPC_KNIGHT_DIALOG_TRIGGER_MESH_SCALE = [2.2, 2.2];
const NPC_DIALOG_TRIGGER_ELAPSED_TIME = 2;

const NpcKnight = forwardRef(function NpcKnight(
  { playerRef, setIsDialogActive, toggleDialog },
  noNavMeshRef
) {
  const selfRef = useRef();
  const npcDir = useRef(NPC_KNIGHT_INIT_DIR);
  const isNpcIdle = useRef(true);
  const dialogTriggerMeshRef = useRef();
  const dialogTriggerElapsedTime = useRef(0);
  const [isDialogTriggered, setIsDialogTriggered] = useState(false);
  const isRepeatTrigger = useRef(false);

  function checkTriggerDialog(delta) {
    if (isDialogTriggered) return;
    if (!playerRef?.current?.raycaster) return;

    const { _, raycaster } = playerRef.current;

    if (raycaster.intersectObject(dialogTriggerMeshRef.current).length > 0) {
      dialogTriggerElapsedTime.current += delta;
    } else {
      isRepeatTrigger.current = false;
      dialogTriggerElapsedTime.current = 0;
    }

    if (dialogTriggerElapsedTime.current > NPC_DIALOG_TRIGGER_ELAPSED_TIME) {
      !isRepeatTrigger.current && setIsDialogTriggered(true);
      dialogTriggerElapsedTime.current = 0;
    }
  }

  useFrame((state, delta, xrFrame) => {
    checkTriggerDialog(delta);
  });

  useEffect(() => {
    if (!isDialogTriggered) return;

    const offsetX =
      playerRef.current.self.position.x - selfRef.current.position.x;
    const offsetZ =
      playerRef.current.self.position.z - selfRef.current.position.z;

    const thresholdX = NPC_KNIGHT_NO_NAV_MESH_SCALE[0] / 2;
    const thresholdZ = NPC_KNIGHT_NO_NAV_MESH_SCALE[1] / 2;

    if (offsetX > thresholdX) {
      npcDir.current = [false, false, false, true];
    }
    if (offsetX < -thresholdX) {
      npcDir.current = [false, true, false, false];
    }
    if (offsetZ > thresholdZ) {
      npcDir.current = [false, false, true, false];
    }
    if (offsetZ < -thresholdZ) {
      npcDir.current = [true, false, false, false];
    }
  }, [isDialogTriggered, playerRef, npcDir]);

  useEffect(() => {
    if (isDialogTriggered) {
      setIsDialogActive(true);
    } else {
      setIsDialogActive(false);
      isRepeatTrigger.current = true;
    }
  }, [isDialogTriggered, setIsDialogActive]);

  return (
    <group ref={selfRef} position={NPC_KNIGHT_INIT_POS}>
      <NpcBase
        ref={noNavMeshRef}
        npcDir={npcDir}
        isNpcIdle={isNpcIdle}
        npcSprite={npcKnightSprite}
        npcTimePerIdleFrame={NPC_KNIGHT_TIME_PER_IDLE_FRAME}
        npcTimePerBlinkFrame={NPC_KNIGHT_TIME_PER_BLINK_FRAME}
        npcTimePerWalkFrame={NPC_KNIGHT_TIME_PER_WALK_FRAME}
        maxNpcBlinkTimeAdvance={MAX_NPC_KNIGHT_BLINK_TIME_ADVANCE}
        noNavMeshScale={NPC_KNIGHT_NO_NAV_MESH_SCALE}
      />
      <NpcDialog
        toggleDialog={toggleDialog}
        dialogTriggerMeshRef={dialogTriggerMeshRef}
        dialogTriggerMeshScale={NPC_KNIGHT_DIALOG_TRIGGER_MESH_SCALE}
        setIsDialogTriggered={setIsDialogTriggered}
        isDialogTriggered={isDialogTriggered}
        position={[0, 1.25, 0]}
      />
    </group>
  );
});

export default NpcKnight;
