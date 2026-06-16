import {
  Children,
  createRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Line, TransformControls } from "@react-three/drei";
import { Path } from "../";
import { Handle, Overlay } from "./components";

function PathControls({ children }) {
  const childrenArr = useMemo(() => Children.toArray(children), [children]);
  const camera = useThree((state) => state.camera);

  // ============================ Path Setup ============================
  const [path, setPath] = useState(null);
  const [numPoints, setNumPoints] = useState(4);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const initialPoints = useMemo(() => {
    // If path not initialized, create the initial points in a line in front of the camera that fit in the viewport based on numPoints
    if (!path) {
      // Find distance to origin from camera to fit path of target length in viewport
      const targetPathLength = childrenArr.length * Path.gap;

      let distance = camera.near + 0.1 / 2; // Start checking from just in front of the camera (account for handle size of 0.1)
      let isFit = false;

      while (!isFit && distance < camera.far) {
        const target = new THREE.Vector2();
        camera.getViewSize(distance, target);

        if (targetPathLength < target.x) {
          isFit = true;
        } else {
          distance = Math.round(distance + 1);
        }
      }

      // Get unit vector from camera to origin (assume scene is centered at origin)
      const cameraToOriginDir = new THREE.Vector3()
        .subVectors(new THREE.Vector3(0, 0, 0), camera.position)
        .normalize();

      // Get unit vector of initial path
      const targetPathDir = new THREE.Vector3()
        .crossVectors(cameraToOriginDir, camera.up)
        .normalize();

      // Get equally spaced points along the target path at distance from camera that fit in the viewport
      const initialPoints = [];

      for (let i = 0; i < numPoints; i++) {
        const point = new THREE.Vector3().addVectors(
          new THREE.Vector3().addVectors(
            camera.position,
            new THREE.Vector3().addScaledVector(cameraToOriginDir, distance),
          ),
          new THREE.Vector3().addScaledVector(
            targetPathDir,
            ((i - (numPoints - 1) / 2) / (numPoints - 1)) * targetPathLength,
          ),
        );

        initialPoints.push(point);
      }

      return initialPoints;
    } else {
      // If path already initialized, just return the points based on numPoints on existing path
      return path.getSpacedPoints(numPoints - 1);
    }
  }, [camera, numPoints]);

  // Initialize path on first render and whenever initial points change (e.g. on numPoints change)
  useLayoutEffect(
    // eslint-disable-next-line react-hooks/set-state-in-effect
    () => setPath(new THREE.CatmullRomCurve3(initialPoints)),
    [initialPoints],
  );

  // ========================== Controls Setup ==========================
  const handleRefs = useMemo(
    () => initialPoints.map(() => createRef()),
    [initialPoints],
  );
  const [targetHandle, setTargetHandle] = useState(null);
  const [speed, setSpeed] = useState(0.04);

  // ============================ Info Setup ============================
  const {
    numItems, // Current number of items spawned on the path
    pathLength, // Current length of the path
    minPathLength, // Minimum length of the path before reducing the number of repeats of children
    maxPathLength, // Maximum length of the path before increasing the number of repeats of children
  } = useMemo(() => {
    const currRepeat =
      path && childrenArr.length > 0
        ? Math.floor(path.getLength() / Path.gap / childrenArr.length)
        : 0;

    return {
      numItems: currRepeat * childrenArr.length,
      pathLength: path ? path.getLength() : 0,
      minPathLength: currRepeat * childrenArr.length * Path.gap,
      maxPathLength: (currRepeat + 1) * childrenArr.length * Path.gap,
    };
  }, [path, childrenArr]);

  // =========================== Utility Setup ==========================
  // Expand utility to zoom in by moving camera forward, and zoom out by moving camera backward
  const [isExpand, setIsExpand] = useState(false);
  const cameraPosition = useMemo(() => camera.position.clone(), [camera]);
  const expandedCameraPosition = useMemo(() => {
    // Get unit vector from camera to origin (assume scene is centered at origin)
    const cameraToOriginDir = new THREE.Vector3()
      .subVectors(new THREE.Vector3(0, 0, 0), cameraPosition)
      .normalize();

    // Move camera backward from the origin
    return new THREE.Vector3().addVectors(
      cameraPosition,
      new THREE.Vector3().addScaledVector(cameraToOriginDir, -1),
    );
  }, [cameraPosition]);

  useEffect(() => {
    if (isExpand) {
      camera.position.copy(expandedCameraPosition);
    } else {
      camera.position.copy(cameraPosition);
    }
  }, [isExpand]);

  // Copy to clipboard utility to copy current path points as array of Vector3 objects
  const onCopyToClipboard = () => {
    const newClipText = `new THREE.CatmullRomCurve3([\n${handleRefs
      .map((ref) => {
        const { x, y, z } = ref.current.position;
        return `new THREE.Vector3(${x}, ${y}, ${z})`;
      })
      .join(",\n")}\n])`;

    navigator.clipboard.writeText(newClipText);
  };

  // ============================== Render ==============================
  return (
    <>
      {/* ========================== Path ========================== */}
      <Path path={path} speed={speed}>
        {children}
      </Path>

      {path && (
        <Line points={path.getSpacedPoints(100)} color="green" lineWidth={2} />
      )}

      {/* ========================== Core ========================== */}
      {handleRefs.map((ref, index) => (
        <Handle
          key={index}
          ref={ref}
          position={initialPoints[index]}
          onClick={() => setTargetHandle(ref.current)}
          onPointerMissed={() => setTargetHandle(null)}
        />
      ))}

      {targetHandle && (
        <TransformControls
          mode="translate"
          object={targetHandle}
          onObjectChange={
            () =>
              setPath(
                new THREE.CatmullRomCurve3(
                  handleRefs.map((ref) => ref.current.position),
                ),
              ) // Create new path with updated handle positions
          }
        />
      )}

      {/* ========================= Overlay ======================== */}
      <Overlay
        numItems={numItems}
        pathLength={pathLength}
        minPathLength={minPathLength}
        maxPathLength={maxPathLength}
        numPoints={numPoints}
        setNumPoints={setNumPoints}
        speed={speed}
        setSpeed={setSpeed}
        isExpand={isExpand}
        setIsExpand={setIsExpand}
        onCopyToClipboard={onCopyToClipboard}
      />
    </>
  );
}

export default PathControls;
