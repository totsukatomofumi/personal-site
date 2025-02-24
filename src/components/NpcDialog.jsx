import NpcDialogIcon from "./NpcDialogIcon";

function NpcDialog({ position }) {
  return (
    <group position={position}>
      <NpcDialogIcon position={[0, 0, 0]} scale={(0.8, 0.8)} />
    </group>
  );
}

export default NpcDialog;
