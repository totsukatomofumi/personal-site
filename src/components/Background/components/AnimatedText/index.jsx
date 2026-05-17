import { useContext, useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useMediaQuery } from "@uidotdev/usehooks";
import { APP_CONTEXT as AppContext } from "../../../../../constants";

function AnimatedText({ children, ...props }) {
  const textRef = useRef();

  // ======================= Responsive Setup =======================
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");

  const textColor = useMemo(() => {
    const el = document.createElement("div");
    el.style.color = "CanvasText";
    el.style.position = "absolute";
    el.style.visibility = "hidden";

    document.body.appendChild(el);

    const textColor = getComputedStyle(el).color;
    document.body.removeChild(el);

    return textColor;
  }, [isDark]);

  const textOutlineColor = useMemo(() => {
    const el = document.createElement("div");
    el.style.color = "Canvas";
    el.style.position = "absolute";
    el.style.visibility = "hidden";

    document.body.appendChild(el);

    const textOutlineColor = getComputedStyle(el).color;
    document.body.removeChild(el);

    return textOutlineColor;
  }, [isDark]);

  const camera = useThree((state) => state.camera);
  const { windowHeightPx } = useContext(AppContext);

  const textOutlineWidth = useMemo(() => {
    const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    const target = new THREE.Vector2();

    camera.getViewSize(distance, target);

    const textOutlineWidth = target.y / windowHeightPx; // Set Text outlineWidth as the world units corresponding to 1px on screen at origin depth from camera

    return textOutlineWidth;
  }, [camera, windowHeightPx]);

  // ===================== Idle Animation Setup =====================
  useGSAP(() => {
    // ========================== Float ==========================
    gsap.to(textRef.current.position, {
      y: 0.2,
      duration: 10,
      ease: "back.inOut(4)",
      yoyo: true,
      repeat: -1,
    });

    // ========================== Pulse ==========================
    const [minDuration, maxDuration] = [2, 4];
    const [minScale, maxScale] = [0.9, 1.1];

    const scaleXTo = gsap.quickTo(textRef.current.scale, "x", {
      ease: "power1.inOut",
      onComplete: () => {
        const scaleX = minScale + Math.random() * (maxScale - minScale);

        const duration =
          minDuration + Math.random() * (maxDuration - minDuration);

        scaleXTo.tween.duration(duration);
        scaleXTo(scaleX);
      },
    });

    const scaleYTo = gsap.quickTo(textRef.current.scale, "y", {
      ease: "power1.inOut",
      onComplete: () => {
        const scaleY = minScale + Math.random() * (maxScale - minScale);

        const duration =
          minDuration + Math.random() * (maxDuration - minDuration);

        scaleYTo.tween.duration(duration);
        scaleYTo(scaleY);
      },
    });

    scaleXTo(textRef.current.scale.x);
    scaleYTo(textRef.current.scale.y);

    // ========================== Shake ==========================
    const [minAngle, maxAngle] = [-5, 5];

    const rotationZTo = gsap.quickTo(textRef.current.rotation, "z", {
      ease: "power1.inOut",
      onComplete: () => {
        const rotationZ = THREE.MathUtils.degToRad(
          minAngle + Math.random() * (maxAngle - minAngle),
        );

        const duration =
          minDuration + Math.random() * (maxDuration - minDuration);

        rotationZTo.tween.duration(duration);
        rotationZTo(rotationZ);
      },
    });

    rotationZTo(textRef.current.rotation.z);
  });

  // ============================= Render ============================
  return (
    <group {...props}>
      <Text
        ref={textRef}
        color={textColor}
        outlineWidth={textOutlineWidth}
        outlineColor={textOutlineColor}
      >
        {children}
      </Text>
    </group>
  );
}

export default AnimatedText;
