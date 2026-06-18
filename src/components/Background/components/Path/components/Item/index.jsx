import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const SPAWN_DESPAWN_ANIMATION_DURATION = 0.5; // Match with GSAP default tween duration
const SPAWN_ANIMATION_EASE = "expo.in";
const DESPAWN_ANIMATION_EASE = "expo.out"; // Despawn should be fast so items clear quickly when the path shortens, preventing visible overlap; For external use when we need to get item despawn ease

function Item({ spawn, onDespawn, children, ...props }) {
  const selfRef = useRef();
  const spawnAnimationRef = useRef();

  // ========================== Animation Setup ==========================
  useGSAP(() => {
    spawnAnimationRef.current = gsap.from(selfRef.current.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: SPAWN_DESPAWN_ANIMATION_DURATION,
      ease: SPAWN_ANIMATION_EASE,
    });
  });

  // ======================= Spawn/Despawn Control =======================
  useEffect(() => {
    if (spawn) {
      spawnAnimationRef.current.play();
    } else {
      if (spawnAnimationRef.current.progress() === 0) {
        // If despawn is triggered before spawn animation starts, the onReverseComplete callback will not be called, so we need to call onDespawn immediately
        onDespawn?.();
        return;
      }

      spawnAnimationRef.current
        .eventCallback("onReverseComplete", onDespawn)
        .reverse();
    }
  }, [spawn, onDespawn]);

  // =============================== Render ==============================
  return (
    <group {...props}>
      <group ref={selfRef}>{children}</group>;
    </group>
  );
}

Item.spawnDespawnAnimationDuration = SPAWN_DESPAWN_ANIMATION_DURATION;
Item.spawnAnimationEase = SPAWN_ANIMATION_EASE;
Item.despawnAnimationEase = DESPAWN_ANIMATION_EASE;

export default Item;
