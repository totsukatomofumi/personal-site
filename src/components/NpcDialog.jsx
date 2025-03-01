import NpcDialogIcon from "./NpcDialogIcon";
import NpcDialogBubble from "./NpcDialogBubble";

function NpcDialog({
  toggleDialog,
  dialogTriggerMeshRef,
  dialogTriggerMeshScale = [2.2, 2.2],
  isDialogTriggered,
  setIsDialogTriggered,
  position,
}) {
  return (
    <>
      <group position={position}>
        {isDialogTriggered ? (
          <NpcDialogBubble
            position={[0, 1.1, 0]}
            toggleDialog={toggleDialog}
            setIsDialogTriggered={setIsDialogTriggered}
          />
        ) : (
          <NpcDialogIcon position={[0, 0, 0]} scale={(0.8, 0.8)} />
        )}
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
