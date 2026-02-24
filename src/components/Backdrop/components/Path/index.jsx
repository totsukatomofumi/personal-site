import { useGSAP } from "@gsap/react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { createRef, useMemo, useRef, useState } from "react";

const CHILD_GAP = 1.5; // Gap between each child

function Path({ path, speed, children }) {
  // ======================= Repeat Setup =======================
  const targetRepeat = useMemo(() => {
    return Math.floor(path.getLength() / (CHILD_GAP * (children.length ?? 1))); // Auto-calculate repeat based on path length and gap
  }, [path, children]);
  const [renderRepeat, setRenderRepeat] = useState(targetRepeat);

  if (targetRepeat > renderRepeat) setRenderRepeat(targetRepeat); // Update renderRepeat if targetRepeat increases. Note: we do not decrease renderRepeat here, it will be handled after despawn animation in frame loop

  // ====================== Children Setup ======================
  const [
    renderChildren,
    renderChildrenRefs,
    spawnDespawnAnimationTargetRefs,
    transitionAnimationTargetRefs,
  ] = useMemo(() => {
    // Repeat children based on renderRepeat
    let renderChildren = Array.from(
      { length: renderRepeat },
      () => children,
    ).flat();

    // Create group hierachy for separate animation targets
    const spawnDespawnAnimationTargetRefs = renderChildren.map(() =>
      createRef(),
    );
    renderChildren = renderChildren.map((child, index) => (
      <group
        // key={`spawnDespawn-${index}`}
        ref={spawnDespawnAnimationTargetRefs[index]}
      >
        {child}
      </group>
    ));

    const transitionAnimationTargetRefs = renderChildren.map(() => createRef());
    renderChildren = renderChildren.map((child, index) => (
      <group
        // key={`transition-${index}`}
        ref={transitionAnimationTargetRefs[index]}
      >
        {child}
      </group>
    ));

    const renderChildrenRefs = renderChildren.map(() => createRef());
    renderChildren = renderChildren.map((child, index) => (
      // Key required on outermost group for array reconciliation (renderChildren returned as array)
      <group key={index} ref={renderChildrenRefs[index]}>
        {child}
      </group>
    ));

    return [
      renderChildren,
      renderChildrenRefs,
      spawnDespawnAnimationTargetRefs,
      transitionAnimationTargetRefs,
    ];
  }, [children, renderRepeat]);

  // ==================== Spawn/Despawn Setup ===================
  const spawnDespawnAnimationsRef = useRef([]);

  useGSAP(() => {
    const duration = 1; // Duration of spawn/despawn animation
    const ease = "power2.out"; // Easing for spawn/despawn animation

    const spawnDespawnAnimations = [];

    spawnDespawnAnimationTargetRefs.forEach((ref, index) => {
      const tl = gsap.timeline({ paused: true }); // Controlled by frame loop, so start paused

      tl.fromTo(
        ref.current.scale,
        {
          x: 0,
          y: 0,
          z: 0,
        },
        {
          x: 1,
          y: 1,
          z: 1,
          duration: duration,
          ease: ease,
        },
      );

      // Preserve progress of existing animation if present
      if (spawnDespawnAnimationsRef.current[index]) {
        tl.progress(spawnDespawnAnimationsRef.current[index].progress());
      }

      spawnDespawnAnimations[index] = tl;
    });

    spawnDespawnAnimationsRef.current = spawnDespawnAnimations;
  }, [spawnDespawnAnimationTargetRefs]); // Update spawn/despawn animations when spawnDespawnAnimTargetsRefs change (new children added/removed)

  // ===================== Transition Setup =====================
  const transitionAnimationsRef = useRef([]);

  useGSAP(() => {
    if (speed === 0) return; // No movement, skip transition animation setup (prevent division by zero)

    const spawnDespawnDuration = 1; // Duration of spawn/despawn animation
    const spawnEase = "power2.out"; // Easing for spawn animation
    const despawnEase = "power2.in"; // Easing for despawn animation
    const idleDuration =
      path.getLength() / Math.abs(speed) - spawnDespawnDuration * 2; // Duration for idle phase in between

    const transitionAnimations = [];

    transitionAnimationTargetRefs.forEach((ref, index) => {
      const tl = gsap.timeline({ paused: true }); // Controlled by frame loop, so start paused

      tl.fromTo(
        ref.current.scale,
        {
          x: 0,
          y: 0,
          z: 0,
        },
        {
          x: 1,
          y: 1,
          z: 1,
          duration: spawnDespawnDuration,
          ease: spawnEase,
        },
      )
        .to({}, { duration: idleDuration }) // Idle phase
        .to(ref.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: spawnDespawnDuration,
          ease: despawnEase,
        });

      transitionAnimations[index] = tl;
    });

    transitionAnimationsRef.current = transitionAnimations;
  }, [transitionAnimationTargetRefs, path, speed]); // Update transition animations when transitionAnimationTargetsRefs, path, or speed change (to adjust idle duration)

  // ======================== Frame Loop ========================
  const cumulativeProgressRef = useRef(0); // To track current progress along the curve (first child)
  const progressGap = CHILD_GAP / path.getLength(); // Progress difference between each child based on desired gap
  const despawnStartIndex =
    Math.min(targetRepeat, renderRepeat) * (children.length ?? 1); // Index of children at which should despawn

  useFrame((_, delta) => {
    cumulativeProgressRef.current += delta * (speed / path.getLength()); // speed (Distance per second) converted to progress (0 to 1 over curve length) per second

    renderChildrenRefs.forEach((ref, index) => {
      const offsetProgress = index * progressGap;
      const cumulativeProgress = cumulativeProgressRef.current + offsetProgress;
      const progress = ((cumulativeProgress % 1) + 1) % 1; // Handle negative progress correctly, need to flip to positive range

      // Translation
      ref.current?.position.copy(path.getPointAt(progress));

      // Transition
      transitionAnimationsRef.current[index]?.progress(progress);

      // Spawn/Despawn
      if (index < despawnStartIndex) {
        // Spawn
        spawnDespawnAnimationsRef.current[index]?.play();
      } else {
        // Despawn
        spawnDespawnAnimationsRef.current[index]?.reverse();
      }
    });

    // After processing all children, check if we can reduce renderRepeat based on despawn animation progress
    if (targetRepeat < renderRepeat) {
      if (
        spawnDespawnAnimationsRef.current
          .slice(despawnStartIndex)
          .every((animation) => animation?.progress() === 0)
      )
        setRenderRepeat(targetRepeat); // Reduce renderRepeat to trigger removal of despawned children from scene
    }
  });

  // ========================== Render ==========================
  return renderChildren;
}

Path.childGap = CHILD_GAP;

export default Path;
