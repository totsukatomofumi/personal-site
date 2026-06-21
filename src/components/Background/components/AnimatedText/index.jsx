import { useContext, useMemo, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import { APP_CONTEXT as AppContext } from "../../../../../constants";

function AnimatedText({ children, ...props }) {
  const textRef = useRef();

  // ======================= Responsive Setup =======================
  const {
    largeViewportHeightPx,
    canvasTextColor,
    canvasColor,
    rootEmFontSizePx,
  } = useContext(AppContext);

  const camera = useThree((state) => state.camera);

  const textOutlineWidth = useMemo(() => {
    const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    const target = new THREE.Vector2();

    camera.getViewSize(distance, target);

    const textOutlineWidth =
      (target.y / largeViewportHeightPx) * 0.0625 * rootEmFontSizePx; // Set Text outlineWidth as the world units corresponding to 1px on screen at origin depth from camera

    return textOutlineWidth;
  }, [camera, largeViewportHeightPx, rootEmFontSizePx]);

  // ============================= Render ============================
  return (
    <group {...props}>
      <Float>
        <Text
          ref={textRef}
          font="/Mochiy_Pop_One/MochiyPopOne-Regular.ttf"
          color={canvasTextColor}
          outlineWidth={textOutlineWidth}
          outlineColor={canvasColor}
        >
          {children}
        </Text>
      </Float>
    </group>
  );
}

export default AnimatedText;
