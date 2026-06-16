import {
  Children,
  createRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Item } from "./components";

const GAP = 1.5;

function Path({ path, speed, children }) {
  // ========================== Children Setup ==========================
  // Transform children to array for easier manipulation
  const childrenArr = useMemo(
    () => Children.toArray(children).reverse(), // Reverse to maintain readable order on path (LTR)
    [children],
  );

  // Calculate how many times we need to repeat the children to fill the path
  const targetRepeat = useMemo(() => {
    return path && childrenArr.length > 0
      ? Math.floor(path.getLength() / GAP / childrenArr.length)
      : 0;
  }, [path, childrenArr]);

  // Create the target children to stage for rendering
  const targetChildren = useMemo(() => {
    return Array.from({ length: targetRepeat }, () => childrenArr).flat();
  }, [childrenArr, targetRepeat]);

  // ========================== Children Render =========================
  const [renderChildren, setRenderChildren] = useState([]); // { ref, element, spawn, onDespawn }

  useEffect(() => {
    // Create the intermediate state of render children, despawning those that are not in the target children anymore
    const intermediateRenderChildren = renderChildren.map((props, index) => {
      const renderChild = props.element;
      const targetChild = targetChildren[index];

      if (
        !targetChild || // No target child at this index, so this render child should despawn
        targetChild.key == null || // If either child has no key, we consider them different and this render child should despawn
        renderChild.key == null ||
        targetChild.key !== renderChild.key // Keys don't match, so this render child should despawn
      ) {
        let onDespawn;
        let rejectOnDespawnPromise;
        let onDespawnPromise = new Promise((resolve, reject) => {
          onDespawn = resolve;
          rejectOnDespawnPromise = reject;
        });

        return {
          ...props,
          spawn: false,
          onDespawn,
          onDespawnPromise,
          rejectOnDespawnPromise,
        };
      } else {
        return { ...props, spawn: true };
      }
    }); // { ref, element, spawn, onDespawn, onDespawnPromise, rejectOnDespawnPromise } where onDespawnPromise and rejectOnDespawnPromise are for this block specific internal use only

    // Wait for all despawning children to finish before we commit the target children to render
    let isStale = false;

    Promise.all(
      intermediateRenderChildren
        .map(({ onDespawnPromise }) => onDespawnPromise)
        .filter(Boolean),
    )
      .then(() => {
        if (isStale) return; // To guard for the case where target children changes after the promises resolve but before the then() is called

        setRenderChildren(
          // Create the new state of render children
          targetChildren.map((targetChild) => ({
            ref: createRef(), // Create new refs for new render children for GSAP animations
            element: targetChild,
            spawn: true,
            onDespawn: null,
          })),
        );
      })
      .catch(() => {
        // If any of the onDespawnPromises is rejected, target children to commit to render is stale
      });

    // Set the intermediate render children
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRenderChildren(
      intermediateRenderChildren.map(({ ref, element, spawn, onDespawn }) => ({
        ref,
        element,
        spawn,
        onDespawn,
      })),
    );

    return () => {
      // If target children changes before the intermediate render children finish despawning, we need to reject all onDespawn promises and set isStale flag to avoid setting stale state
      intermediateRenderChildren.forEach(({ rejectOnDespawnPromise }) => {
        rejectOnDespawnPromise?.();
      });

      isStale = true;
    };
  }, [targetChildren]);

  // ========================== Animaton Setup ==========================
  const animationRef = useRef(null); // To access the current animation instance (e.g. for timeScale changes on speed change)
  const progressRef = useRef(9999); // Progress normalized to animation cycle to restore playhead position on rerenders to avoid animation resets on rerenders; High starting progress well past the initial cycle where items are still entering view

  // Create staggered animations for translation and transition along path at base speed
  useGSAP(
    () => {
      if (!path || !renderChildren.length) return; // No animation if there is no path to animate on or no children to animate

      const tl = gsap.timeline();
      const targets = renderChildren.map(({ ref }) => ref.current);
      const duration = path.getLength();
      const ease = "none";
      const stagger = { each: GAP, repeat: -1 };

      // Translate items along path with stagger for maintaining gap
      tl.to(targets, {
        duration,
        ease,
        stagger: {
          ...stagger,
          onUpdate: function () {
            const target = this.targets()[0]; // Get singular target from the stagger

            if (!target) return;

            // Update target position along path controlled by progress of the tween
            target.position.copy(path.getPointAt(this.progress()));
          },
        },
      });

      // Transition items in and out with stagger on enter and leave with idle phase in middle
      tl.to(
        targets.map((target) => target.scale),
        {
          duration,
          ease,
          keyframes: [
            {
              x: 1,
              y: 1,
              z: 1,
              duration: Item.spawnDespawnAnimationDuration,
              ease: Item.spawnAnimationEase,
            },
            {
              x: 1,
              y: 1,
              z: 1,
              duration: duration - 2 * Item.spawnDespawnAnimationDuration,
            },
            {
              x: 0,
              y: 0,
              z: 0,
              duration: Item.spawnDespawnAnimationDuration,
              ease: Item.despawnAnimationEase,
            },
          ],
          stagger,
        },
        0,
      );

      // Restore playhead position and timeScale on rerenders to avoid animation resets
      tl.time(progressRef.current * duration); // Do not use tl.progress() as it is not progress normalized to current animation cycle;
      tl.timeScale(speed);

      // Store animation instance for access (e.g. for timeScale changes on speed change)
      animationRef.current = tl;

      return () => {
        // Store the current playhead position to restore on next run
        progressRef.current = duration ? tl.time() / duration : 0; // Do not use tl.progress() as it is not progress normalized to current animation cycle
      };
    },
    {
      revertOnUpdate: true,
      dependencies: [
        renderChildren, // Target new refs from new render children
        path, // Update transition zone on path change (as path length may change)
      ],
    },
  );

  // Update timeScale of the animation to reflect speed changes
  useLayoutEffect(() => {
    animationRef.current?.timeScale(speed);
  }, [speed]);

  // ============================== Render ==============================
  return renderChildren.map(({ ref, element, spawn, onDespawn }, index) => (
    <Item key={index} ref={ref} spawn={spawn} onDespawn={onDespawn} scale={0}>
      {element}
    </Item>
  ));
}

Path.gap = GAP;

export default Path;
