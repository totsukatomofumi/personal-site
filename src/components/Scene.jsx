import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import Camera from "./Camera";
import Player from "./Player";
import { MAP_POS, MAP_ROT, NAVMESH_POS } from "../constants";
import Map from "../models/Map";
import NavMesh from "../models/Navmesh";
import NpcKnight from "./NpcKnight";
import NpcCat from "./NpcCat";

function Scene({ movementVector }) {
  const playerRef = useRef();
  const npcKnightRef = useRef();
  const npcCatRef = useRef();
  const navMeshRef = useRef();
  const npcRefs = useRef([npcKnightRef, npcCatRef]);

  useThree(({ gl, camera }) => {
    gl.setClearColor("white");
  });

  return (
    <>
      <Camera playerRef={playerRef} />
      <Player
        ref={playerRef}
        navMeshRef={navMeshRef}
        npcRefs={npcRefs}
        movementVector={movementVector}
      />
      <NpcKnight ref={npcKnightRef} />
      <NpcCat ref={npcCatRef} />
      <Map position={MAP_POS} rotation={MAP_ROT} renderOrder={1} />
      <NavMesh ref={navMeshRef} position={NAVMESH_POS} rotation={MAP_ROT} />
      <ambientLight intensity={2} />
      <fog attach="fog" args={["white", 0, 180]} />
    </>
  );
}

export default Scene;
