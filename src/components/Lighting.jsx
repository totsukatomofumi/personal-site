import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SoftShadows } from "@react-three/drei";

function Lighting({ playerRef }) {
  return (
    <>
      {/* Moonlight related */}
      <spotLight
        position={[0, 20, -100]}
        intensity={1000}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[0, 20, -70]}
        intensity={500}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />

      {/* Bluish night related */}
      <directionalLight color="#0a0a33" intensity={20} position={[0, 10, 0]} />
      <fog attach="fog" args={["#0a0a33", 0, 180]} />

      <SoftShadows />
    </>
  );
}

export default Lighting;
