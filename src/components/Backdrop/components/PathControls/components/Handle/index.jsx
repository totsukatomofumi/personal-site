import { Box, Html } from "@react-three/drei";
import { useEffect, useState } from "react";

function Handle({ ref, initialPosition, ...props }) {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => setPosition(ref.current.position), [ref]);

  // ========================== Render ==========================
  return (
    <group ref={ref} position={initialPosition} {...props}>
      {/* =============== Handle Info Overlay =============== */}
      <Html position={[0.2, 0.2, 0]}>
        <div className="text-nowrap pointer-events-none">
          <div>{`x = ${position.x.toFixed(2)}`}</div>
          <div>{`y = ${position.y.toFixed(2)}`}</div>
          <div>{`z = ${position.z.toFixed(2)}`}</div>
        </div>
      </Html>

      {/* ==================== Handle Box ==================== */}
      <Box args={[0.1, 0.1, 0.1]} material-color="red" />
    </group>
  );
}

export default Handle;
