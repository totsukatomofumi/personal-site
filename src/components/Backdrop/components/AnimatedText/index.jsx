import { useGSAP } from "@gsap/react";
import { Text } from "@react-three/drei";
import { useMediaQuery } from "@uidotdev/usehooks";
import gsap from "gsap";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function AnimatedText({ children, ...props }) {
  const textRef = useRef();

  // ======================= Responsive Colors =======================
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const textColor = useMemo(() => {
    return getComputedStyle(document.body).color;
  }, [isDark]);
  const textOutlineColor = useMemo(() => {
    return getComputedStyle(document.body).backgroundColor;
  }, [isDark]);

  // ======================== Float Animation ========================
  useGSAP(() => {
    gsap.to(textRef.current.position, {
      y: 0.2,
      duration: 10,
      ease: "back.inOut(4)",
      yoyo: true,
      repeat: -1,
    });
  });

  // ======================== Pulse Animation ========================
  useGSAP(() => {
    const animatePulse = () => {
      const [minScale, maxScale] = [0.9, 1.1];
      const scaleX = minScale + Math.random() * (maxScale - minScale);
      const scaleY = minScale + Math.random() * (maxScale - minScale);

      const [minDuration, maxDuration] = [2, 4];
      const duration =
        minDuration + Math.random() * (maxDuration - minDuration);

      gsap.to(textRef.current.scale, {
        x: scaleX,
        y: scaleY,
        duration: duration,
        ease: "none",
        onComplete: () => {
          animatePulse();
        },
      });
    };

    animatePulse();
  });

  // ======================== Rotate Animation =======================
  useGSAP(() => {
    const animateRotate = () => {
      const [minAngle, maxAngle] = [-5, 5];
      const rotateZ = minAngle + Math.random() * (maxAngle - minAngle);

      const [minDuration, maxDuration] = [2, 4];
      const duration =
        minDuration + Math.random() * (maxDuration - minDuration);

      gsap.to(textRef.current.rotation, {
        z: THREE.MathUtils.degToRad(rotateZ),
        duration: duration,
        ease: "sine.inOut",
        onComplete: () => {
          animateRotate();
        },
      });
    };

    animateRotate();
  });

  // ============================= Render ============================
  return (
    <group {...props}>
      <Text
        ref={textRef}
        color={textColor}
        outlineWidth={0.01}
        outlineColor={textOutlineColor}
      >
        {children}
      </Text>
    </group>
  );
}

export default AnimatedText;
