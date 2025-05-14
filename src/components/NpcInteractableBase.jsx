import { forwardRef, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import NpcBase from "./NpcBase";
import NpcDialog from "./NpcDialog";
import { NPC_DIALOG_TRIGGER_ELAPSED_TIME } from "../constants";
import NpcDialogTriggerProgress from "./NpcDialogTriggerProgress";

const NpcInteractableBase = forwardRef(function NpcInteractableBase(
  {
    playerRef,
    npcSprite,
    npcDir,
    isNpcIdle,
    npcInitPos,
    npcTimePerIdleFrame,
    npcTimePerBlinkFrame,
    npcTimePerWalkFrame,
    maxNpcBlinkTimeAdvance,
    noNavMeshScale,
    dialogPos,
    dialogTriggerMeshScale,
    setIsDialogActive,
    toggleDialog,
    bubbleOffsetX,
    bubbleOffsetY,
    isFacePlayer = true,
    dialogArr,
    onTutorial,
  },
  noNavMeshRef
) {
  const selfRef = useRef();
  const dialogTriggerMeshRef = useRef();
  const dialogTriggerElapsedTime = useRef(0);
  const [isDialogTriggered, setIsDialogTriggered] = useState(null);
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
    if (!isFacePlayer) return;

    const offsetX =
      playerRef.current.self.position.x - selfRef.current.position.x;
    const offsetZ =
      playerRef.current.self.position.z - selfRef.current.position.z;

    const thresholdX = noNavMeshScale[0] / 2;
    const thresholdZ = noNavMeshScale[1] / 2;

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
  }, [isDialogTriggered, playerRef, npcDir, noNavMeshScale]);

  useEffect(() => {
    if (isDialogTriggered === null) return;

    if (isDialogTriggered) {
      setIsDialogActive(true);
    } else {
      setIsDialogActive(false);
      isRepeatTrigger.current = true;
    }
  }, [isDialogTriggered, setIsDialogActive]);

  return (
    <group ref={selfRef} position={npcInitPos}>
      <NpcBase
        ref={noNavMeshRef}
        npcDir={npcDir}
        isNpcIdle={isNpcIdle}
        npcSprite={npcSprite}
        npcTimePerIdleFrame={npcTimePerIdleFrame}
        npcTimePerBlinkFrame={npcTimePerBlinkFrame}
        npcTimePerWalkFrame={npcTimePerWalkFrame}
        maxNpcBlinkTimeAdvance={maxNpcBlinkTimeAdvance}
        noNavMeshScale={noNavMeshScale}
      />
      <NpcDialog
        toggleDialog={toggleDialog}
        dialogTriggerMeshRef={dialogTriggerMeshRef}
        dialogTriggerMeshScale={dialogTriggerMeshScale}
        setIsDialogTriggered={setIsDialogTriggered}
        isDialogTriggered={isDialogTriggered}
        position={dialogPos}
        bubbleOffsetX={bubbleOffsetX}
        bubbleOffsetY={bubbleOffsetY}
        dialogArr={dialogArr}
        onTutorial={onTutorial}
      />
      <NpcDialogTriggerProgress
        dialogTriggerElapsedTime={dialogTriggerElapsedTime}
        isDialogTriggered={isDialogTriggered}
        isRepeatTrigger={isRepeatTrigger}
        dialogPos={dialogPos}
      />
    </group>
  );
});

export default NpcInteractableBase;
