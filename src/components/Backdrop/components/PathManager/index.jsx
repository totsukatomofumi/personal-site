import { useContext, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import {
  APP_CONTEXT as AppContext,
  DOCUMENT_JSON,
  NUM_SECTIONS,
} from "../../../../../constants";
import { Path } from "../";

// ========================= Constants =========================
// Path constants
const PATHS = DOCUMENT_JSON.children.map(
  (section) =>
    section.children.filter((child) => child.type === "path").at(-1)?.path ??
    null, // Take last occurrence of path in section, if exists, else null (@path is only expected to occur once per section)
); // e.g. [path1, null, path2, ...] where null means no path in that section
const INITIAL_PATH = PATHS[0]; // Initial path is the path of the first section (assumed to always exist, as per current document structure)

if (!INITIAL_PATH)
  throw new Error(
    "Initial path not found. Please ensure the first section contains a path.",
  );

// Speed constants
const BASE_SPEED = 0.1; // Base speed for path animation
const TRANSITION_SPEED = 2; // Speed for path animation during section transition

// ============================ Main ===========================
function PathManager({ children }) {
  const appContext = useContext(AppContext);
  const [path, setPath] = useState(INITIAL_PATH);
  const [speed, setSpeed] = useState(BASE_SPEED);

  // ================== Speed Animation Setup ==================
  useGSAP(() => {
    const animations = Array.from({ length: NUM_SECTIONS }, () => {
      const proxy = { speed: BASE_SPEED }; // Proxy object for gsap to animate speed value

      return gsap.to(proxy, {
        speed: TRANSITION_SPEED,
        ease: "none",
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        paused: true,
        onUpdate: function () {
          setSpeed(proxy.speed * (this.reversed() ? -1 : 1)); // Ramp direction depending on direction of animation, semnatically support .reverse()
        },
      });
    });

    // Register animations
    animations.forEach((animation, index) =>
      appContext.registerSectionAnimation(animation, index),
    );

    // Cleanup function to remove animations from context on unmount
    return () => {
      animations.forEach((animation) =>
        appContext.removeSectionAnimation(animation),
      );
    };
  });

  // =================== Path Animation Setup ==================
  useGSAP(() => {
    let currentPath = INITIAL_PATH;

    const animations = [];

    PATHS.forEach((targetPath, index) => {
      if (index === 0) return; // Skip initial path setup

      if (!targetPath) return; // Skip if no path in this section

      const oldPathPoints = currentPath.getSpacedPoints();
      const newPathPoints = targetPath.getSpacedPoints();

      const proxy = { alpha: 0 }; // Proxy object for gsap to animate alpha value for lerp

      const animation = gsap.to(proxy, {
        alpha: 1,
        ease: "power1.inOut",
        duration: 1, // TODO: Make longer to match reference (need to fix observer scroll to cap at a time limit and handle stopping of ongoing anim to allow lagging anims)
        paused: true,
        onUpdate: () => {
          const transitionPoints = oldPathPoints.map((v1, i) => {
            const v2 = newPathPoints[i];
            return new THREE.Vector3().lerpVectors(v1, v2, proxy.alpha);
          });

          setPath(new THREE.CatmullRomCurve3(transitionPoints));
        },
      });

      // Register and keep for cleanup
      animations.push(animation);
      appContext.registerSectionAnimation(animation, index - 1);

      currentPath = targetPath; // Update current path for next animation
    });

    // Cleanup function to remove animations from context on unmount
    return () => {
      animations.forEach((animation) => {
        appContext.removeSectionAnimation(animation);
      });
    };
  });

  // ========================== Render =========================
  return (
    <Path path={path} speed={speed}>
      {children}
    </Path>
  );
}

export default PathManager;
