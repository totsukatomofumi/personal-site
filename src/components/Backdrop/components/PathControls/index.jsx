import { createRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Handle, Overlay } from "./components";
import { Path } from "../";
import { useThree } from "@react-three/fiber";
import { Line, TransformControls } from "@react-three/drei";
import { useWindowSize } from "@uidotdev/usehooks";

function PathControls({ children }) {
  const { camera } = useThree();
  const windowSize = useWindowSize();

  // ======================== Path Setup ========================
  const [numPoints, setNumPoints] = useState(4);
  const initialPoints = useMemo(() => {
    // Find depth to fit path of target length in viewport
    const targetPathLength = (children.length ?? 1) * Path.childGap;
    let depth = camera.position.z - camera.near; // Start checking from just in front of the camera
    let isFit = false;

    while (!isFit) {
      // Calculate view width at current depth
      const distance = camera.position.z - depth;
      const minTarget = new THREE.Vector2();
      const maxTarget = new THREE.Vector2();
      camera.getViewBounds(distance, minTarget, maxTarget);
      const viewWidth = maxTarget.x - minTarget.x;

      // Check if target path length fits within view width
      if (targetPathLength < viewWidth) {
        isFit = true;
      } else {
        depth -= 1; // Move further back and check again
      }
    }

    // Generate points along a straight line at the calculated depth
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      let x = -targetPathLength / 2 + (i / (numPoints - 1)) * targetPathLength;
      if (i === 0) x = -targetPathLength / 2;
      if (i === numPoints - 1) x = targetPathLength / 2;
      const y = camera.position.y; // Keep y at camera height
      const z = depth; // Set depth to fit in view

      points.push(new THREE.Vector3(x, y, z));
    }

    return points;
  }, [children, numPoints, camera]); // Initialise points for initial path (to fit viewport)
  const [path, setPath] = useState(new THREE.CatmullRomCurve3(initialPoints));

  useEffect(
    // eslint-disable-next-line react-hooks/set-state-in-effect
    () => setPath(new THREE.CatmullRomCurve3(initialPoints)),
    [initialPoints],
  ); // Update path if initial points change (e.g. on numPoints change)

  // ====================== Controls Setup ======================
  const handleRefs = useMemo(
    () => initialPoints.map(() => createRef()),
    [initialPoints],
  );
  const [targetHandle, setTargetHandle] = useState(null);
  const [speed, setSpeed] = useState(0.04);

  // ======================= Overlay Setup ======================
  const overlayPosition = useMemo(() => {
    const z = camera.position.z - camera.near; // Place overlay just in front of the camera

    // Find top-left corner of the view at the overlay depth
    const distance = camera.position.z - z;
    const minTarget = new THREE.Vector2();
    const maxTarget = new THREE.Vector2();
    camera.getViewBounds(distance, minTarget, maxTarget);
    const x = minTarget.x;
    const y = maxTarget.y;

    return new THREE.Vector3(x, y, z);
  }, [camera, windowSize]); // Recalculate on camera or window size change
  const repeat = Math.floor(
    path.getLength() / (Path.childGap * (children.length ?? 1)),
  );
  const minLength = repeat * (children.length ?? 1) * Path.childGap;
  const maxLength = (repeat + 1) * (children.length ?? 1) * Path.childGap;
  const currLength = path.getLength();

  // ========================== Render ==========================
  return (
    <>
      {/* ===================== Handles ===================== */}
      {handleRefs.map((ref, index) => (
        <Handle
          key={index}
          ref={ref}
          initialPosition={initialPoints[index]}
          onClick={() => setTargetHandle(ref.current)}
          onPointerMissed={() => setTargetHandle(null)}
        />
      ))}

      {/* ============ Handle Transform Controls ============ */}
      {targetHandle && (
        <TransformControls
          object={targetHandle}
          mode="translate"
          onObjectChange={
            () =>
              setPath(
                new THREE.CatmullRomCurve3(
                  handleRefs.map((ref) => ref.current.position),
                ),
              ) // Update path with new points
          }
        />
      )}

      {/* =============== Curve Visualisation =============== */}
      <Line points={path.getPoints(50)} color="green" />

      {/* ======================= Path ====================== */}
      <Path path={path} speed={speed}>
        {children}
      </Path>

      {/* ===================== Overlay ===================== */}
      <Overlay
        position={overlayPosition}
        repeat={repeat}
        minLength={minLength}
        maxLength={maxLength}
        currLength={currLength}
        numPoints={numPoints}
        setNumPoints={setNumPoints}
        speed={speed}
        setSpeed={setSpeed}
      />
    </>
  );
}

export default PathControls;
