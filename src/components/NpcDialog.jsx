import NpcDialogIcon from "./NpcDialogIcon";
import NpcDialogBubble from "./NpcDialogBubble";
import { PositionalAudio } from "@react-three/drei";
import clickSoundUrl from "../sounds/click.mp3";
import { useRef } from "react";

function NpcDialog({
  dialogArr,
  toggleDialog,
  dialogTriggerMeshRef,
  dialogTriggerMeshScale = [2.2, 2.2],
  isDialogTriggered,
  setIsDialogTriggered,
  position,
  bubbleOffsetX,
  bubbleOffsetY,
  onTutorial,
  npcName,
}) {
  const clickSound = useRef();

  return (
    <>
      <group position={position}>
        {isDialogTriggered && (
          <NpcDialogBubble
            position={[0, 1.1, 0]}
            toggleDialog={toggleDialog}
            setIsDialogTriggered={setIsDialogTriggered}
            bubbleOffsetX={bubbleOffsetX}
            bubbleOffsetY={bubbleOffsetY}
            dialogArr={dialogArr}
            onTutorial={onTutorial}
            npcName={npcName}
            clickSound={clickSound}
          />
        )}
        <NpcDialogIcon
          position={[0, 0, 0]}
          scale={(0.8, 0.8)}
          visible={!isDialogTriggered}
        />
        <PositionalAudio
          url={clickSoundUrl}
          ref={clickSound}
          distance={10}
          loop={false}
          autoplay={false}
        />
      </group>
      {/* Dialog trigger mesh */}
      <mesh
        ref={dialogTriggerMeshRef}
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={dialogTriggerMeshScale} />
        <meshBasicMaterial color="black" />
      </mesh>
    </>
  );
}

export default NpcDialog;
