import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import Camera from "./Camera";
import Player from "./Player";
import {
  DEBUG_CAM_ORBIT_CONTROLS_TARGET,
  DEBUG_ENABLE_CAM_ORBIT_CONTROLS,
  MAP_POS,
  MAP_ROT,
  NAVMESH_POS,
  NIGHT_SKY_COLOR,
} from "../constants";
import Map from "../models/Map";
import NavMesh from "../models/Navmesh";
import NpcKnight from "./NpcKnight";
import NpcCat from "./NpcCat";
import Lighting from "./Lighting";
import Postprocessing from "./Postprocessing";
import Dust from "./Dust";
import { Cloud, Clouds, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Glowing from "../models/Glowing";

function Scene({
  movementVector,
  setIsDialogActive,
  toggleDialog,
  setToggleTutorialAnim,
  isIntro,
  setIsIntro,
  isLoaded,
}) {
  const playerRef = useRef();
  const npcKnightNoNavMeshRef = useRef();
  const npcCatNoNavMeshRef = useRef();
  const navMeshRef = useRef();
  const npcNoNavMeshRefs = useRef([npcKnightNoNavMeshRef, npcCatNoNavMeshRef]);

  useThree(({ gl }) => {
    gl.setClearColor(NIGHT_SKY_COLOR);
  });

  return (
    <>
      {DEBUG_ENABLE_CAM_ORBIT_CONTROLS ? (
        <>
          <OrbitControls target={DEBUG_CAM_ORBIT_CONTROLS_TARGET} />
          <mesh position={DEBUG_CAM_ORBIT_CONTROLS_TARGET}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="red" />
          </mesh>
        </>
      ) : (
        <Camera playerRef={playerRef} />
      )}
      <Player
        ref={playerRef}
        navMeshRef={navMeshRef}
        npcNoNavMeshRefs={npcNoNavMeshRefs}
        movementVector={movementVector}
        isIntro={isIntro}
        setIsIntro={setIsIntro}
        isLoaded={isLoaded}
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
      <Glowing position={MAP_POS} rotation={MAP_ROT} />
      <NavMesh ref={navMeshRef} position={NAVMESH_POS} rotation={MAP_ROT} />
      <Lighting />
      {/* <Postprocessing /> */}
      <Dust />
      <Clouds material={THREE.MeshBasicMaterial} position={[0, 0, -42]}>
        <Cloud
          seed={1}
          segments={50}
          bounds={[10, 0, 53]}
          growth={2}
          opacity={0.05}
          speed={-0.3}
        />
      </Clouds>
    </>
  );
}

export default Scene;
