import { useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Box, Html } from "@react-three/drei";

function Handle({ ref, ...props }) {
  // ======================== Info Setup ========================
  const [position, setPosition] = useState(() => new THREE.Vector3());

  useFrame(() => {
    const target = new THREE.Vector3();
    ref.current.getWorldPosition(target);
    setPosition(target);
  });

  // ========================== Render ==========================
  return (
    <group ref={ref} {...props}>
      {/* =============== Handle Info Overlay =============== */}
      <Html position={[0.1, 0, 0]} className="pointer-events-none text-nowrap">
        <div>{`x: ${position.x.toFixed(2)}`}</div>
        <div>{`y: ${position.y.toFixed(2)}`}</div>
        <div>{`z: ${position.z.toFixed(2)}`}</div>
      </Html>

      {/* ==================== Handle Box ==================== */}
      <Box args={[0.1, 0.1, 0.1]} material-color="red" />
    </group>
  );
}

export default Handle;
