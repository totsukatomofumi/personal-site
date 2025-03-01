import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import Camera from "./Camera";
import Player from "./Player";
import { MAP_POS, MAP_ROT, NAVMESH_POS } from "../constants";
import Map from "../models/Map";
import NavMesh from "../models/Navmesh";
import NpcKnight from "./NpcKnight";
import NpcCat from "./NpcCat";

function Scene({
  movementVector,
  setIsDialogActive,
  toggleDialog,
  setToggleTutorialAnim,
  isIntro,
  setIsIntro,
}) {
  const playerRef = useRef();
  const npcKnightNoNavMeshRef = useRef();
  const npcCatNoNavMeshRef = useRef();
  const navMeshRef = useRef();
  const npcNoNavMeshRefs = useRef([npcKnightNoNavMeshRef, npcCatNoNavMeshRef]);

  useThree(({ gl }) => {
    gl.setClearColor("white");
  });

  return (
    <>
      <Camera playerRef={playerRef} />
      <Player
        ref={playerRef}
        navMeshRef={navMeshRef}
        npcNoNavMeshRefs={npcNoNavMeshRefs}
        movementVector={movementVector}
        isIntro={isIntro}
        setIsIntro={setIsIntro}
      />
      <NpcKnight
        ref={npcKnightNoNavMeshRef}
        playerRef={playerRef}
        setIsDialogActive={setIsDialogActive}
        toggleDialog={toggleDialog}
        setToggleTutorialAnim={setToggleTutorialAnim}
      />
      <NpcCat
        ref={npcCatNoNavMeshRef}
        playerRef={playerRef}
        setIsDialogActive={setIsDialogActive}
        toggleDialog={toggleDialog}
      />
      <Map position={MAP_POS} rotation={MAP_ROT} renderOrder={1} />
      <NavMesh ref={navMeshRef} position={NAVMESH_POS} rotation={MAP_ROT} />
      <ambientLight intensity={2} />
      <fog attach="fog" args={["white", 0, 180]} />
    </>
  );
}

export default Scene;
