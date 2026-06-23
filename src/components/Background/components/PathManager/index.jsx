import { useContext, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {
  APP_CONTEXT as AppContext,
  DOCUMENT_AST,
  NUM_SECTIONS,
} from "../../../../../constants";
import { Path } from "../";
import { useThree } from "@react-three/fiber";

const PATHS = DOCUMENT_AST.children.map(
  (section) =>
    section.children.filter((child) => child.type === "path").at(-1)?.path ?? // Last write wins (@path is only expected to occur once per section)
    null,
); // [path1, null, path2, ...] where null means no path in that section

const INIT_PATH = PATHS[0];
const BASE_SPEED = 0.2;

function PathManager({ children }) {
  const appContext = useContext(AppContext);
  const regress = useThree((state) => state.performance.regress);
  const [path, setPath] = useState(INIT_PATH);
  const [speed, setSpeed] = useState(BASE_SPEED);

  // ========================= Speed Animation Setup =========================
  const { registerSectionThunk, removeSectionThunk, largeViewportHeightPx } =
    appContext;

  // Update path travel speed based on scroll velocity (+ performance regression on scroll)
  useLayoutEffect(() => {
    const thunks = Array.from(
      { length: NUM_SECTIONS },
      () => () =>
        gsap.to(
          {},
          {
            onUpdate: function () {
              // Regress performance on scroll to improve performance of path animation
              regress();

              // Update speed based on scroll velocity when scrolling
              setSpeed(
                BASE_SPEED +
                  (2 * // Scale factor to increase responsiveness of speed to scroll velocity (tuned by feel)
                    (this.parent.scrollTrigger?.getVelocity() ?? 0)) / // Get scroll velocity from section ScrollTrigger, default to 0 if not available (e.g. on initial render before ScrollTrigger is created)
                    (largeViewportHeightPx || 1), // Normalize speed by window height, default to 1 to prevent division by zero (i.e. no normalization)
              );
            },

            // Reset speed to base speed when scroll snaps complete
            onComplete: () => setSpeed(BASE_SPEED),
            onReverseComplete: () => setSpeed(BASE_SPEED),
          },
        ),
    );

    // Register thunks
    thunks.forEach((thunk, index) => registerSectionThunk(thunk, index));

    return () => {
      thunks.forEach((thunk) => removeSectionThunk(thunk));
      setSpeed(BASE_SPEED); // Reset speed to base speed on unmount
    };
  }, [largeViewportHeightPx]);

  // ========================== Path Animation Setup =========================
  // Update path based on current section (if exists)
  useLayoutEffect(() => {
    let currPath = INIT_PATH;

    const thunks = PATHS.map((targetPath, sectionIndex) => {
      if (sectionIndex === 0) return null; // Skip first section as it is the initial path
      if (!targetPath) return null; // Skip sections with no path

      const currPathPoints = currPath.getSpacedPoints(100);
      const targetPathPoints = targetPath.getSpacedPoints(100);

      currPath = targetPath; // Update current path to target path for next animation

      const proxy = { alpha: 0 }; // Proxy object to animate alpha value for lerp

      return () =>
        gsap.to(proxy, {
          alpha: 1,
          ease: "none",
          onUpdate: () => {
            // Already regressed performance on scroll in speed animation, so no need to regress here

            // Lerp between current path and target path based on animated alpha value
            const lerpPathPoints = currPathPoints.map((v1, i) => {
              const v2 = targetPathPoints[i];
              return new THREE.Vector3().lerpVectors(v1, v2, proxy.alpha);
            });

            setPath(new THREE.CatmullRomCurve3(lerpPathPoints));
          },
        });
    });

    // Register thunks
    thunks.forEach((thunk, sectionIndex) => {
      thunk && registerSectionThunk(thunk, sectionIndex - 1);
    });

    // Cleanup function to remove thunks from context on unmount
    return () => {
      thunks.forEach((thunk) => {
        thunk && removeSectionThunk(thunk);
      });
    };
  }, []);

  // ================================= Render ================================
  return (
    <Path path={path} speed={speed}>
      {children}
    </Path>
  );
}

export default PathManager;
