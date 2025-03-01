import { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  CAM_FOV,
  CAM_INIT_POS,
  CAM_ROT,
  MAX_CAM_TRACK_HORIZ,
  MIN_CAM_TRACK_HORIZ,
  MAX_CAM_TRACK_DEPTH,
  MIN_CAM_TRACK_DEPTH,
  MAX_CAM_HORIZ,
  MIN_CAM_HORIZ,
  MAX_CAM_DEPTH,
  MIN_CAM_DEPTH,
} from "../constants";

function Camera({ playerRef }) {
  const [toggleAnim, setToggleAnim] = useState(false);
  const { camera } = useThree();

  useEffect(() => {
    camera.setFocalLength(CAM_FOV);
    camera.position.set(...CAM_INIT_POS); // horiz x [-1, 1] vert y [6] depth z [10, 22]
    camera.rotation.set(...CAM_ROT); // angle at -5
  }, [camera]);

  useFrame(() => {
    setToggleAnim((prev) => !prev);
  });

  useGSAP(
    () => {
      if (
        playerRef.current?.self === null ||
        playerRef.current?.self === undefined
      )
        return;

      // [-4, 4]
      const playerHoriz = Math.min(
        Math.max(playerRef.current.self.position.x, MIN_CAM_TRACK_HORIZ),
        MAX_CAM_TRACK_HORIZ
      );
      // [-10, 0]
      const playerDepth = Math.min(
        Math.max(playerRef.current.self.position.z, MIN_CAM_TRACK_DEPTH),
        MAX_CAM_TRACK_DEPTH
      );

      const camHoriz =
        MIN_CAM_HORIZ +
        ((playerHoriz - MIN_CAM_TRACK_HORIZ) /
          (MAX_CAM_TRACK_HORIZ - MIN_CAM_TRACK_HORIZ)) *
          (MAX_CAM_HORIZ - MIN_CAM_HORIZ);
      const camDepth =
        MIN_CAM_DEPTH +
        ((playerDepth - MIN_CAM_TRACK_DEPTH) /
          (MAX_CAM_TRACK_DEPTH - MIN_CAM_TRACK_DEPTH)) *
          (MAX_CAM_DEPTH - MIN_CAM_DEPTH);

      gsap.to(camera.position, {
        x: camHoriz,
        z: camDepth,
        duration: 1,
      });
    },
    { dependencies: [toggleAnim] }
  );

  return null;
}

export default Camera;
