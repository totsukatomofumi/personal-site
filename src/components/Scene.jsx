import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import Camera from "./Camera";
import Player from "./Player";
import { MAP_POS, MAP_ROT, NAVMESH_POS } from "../constants";
import Map from "../models/Map";
import NavMesh from "../models/Navmesh";

function Scene({ movementVector }) {
  const playerRef = useRef();
  const navMeshRef = useRef();

  useThree(({ gl, camera }) => {
    gl.setClearColor("white");
  });

  return (
    <>
      <Camera playerRef={playerRef} />
      <Player
        ref={playerRef}
        navMeshRef={navMeshRef}
        movementVector={movementVector}
      />
      <Map position={MAP_POS} rotation={MAP_ROT} renderOrder={1} />
      <NavMesh ref={navMeshRef} position={NAVMESH_POS} rotation={MAP_ROT} />
      <ambientLight intensity={2} />
      <fog attach="fog" args={["white", 0, 180]} />
    </>
  );
}

export default Scene;
