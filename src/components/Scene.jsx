import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import Camera from "./Camera";
import Player from "./Player";
import { MAP_POS, MAP_ROT, NAVMESH_POS } from "../constants";
import Map from "../models/Map";
import NavMesh from "../models/Navmesh";
import NpcKnight from "./NpcKnight";
import NpcCat from "./NpcCat";
import Lighting from "./Lighting";
import Postprocessing from "./Postprocessing";
import Dust from "./Dust";
import { Cloud, Clouds } from "@react-three/drei";
import * as THREE from "three";

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
    gl.setClearColor("#2C0B4B");
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
      <Lighting />
      <Postprocessing />
      <Dust />
      <Clouds material={THREE.MeshBasicMaterial} position={[0, -2, -50]}>
        <Cloud
          seed={1}
          segments={50}
          bounds={[8, 0, 100]}
          opacity={0.2}
          speed={-0.2}
        />
      </Clouds>
    </>
  );
}

export default Scene;
