import { createRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NUM_SECTIONS } from "../../../constants";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  ignoreMobileResize: true, // Disable automatic refresh on mobile resize to prevent potential performance issues and layout thrashing during orientation changes or dynamic viewport adjustments (e.g. iOS Safari address bar show/hide)
});

function ScrollControls({ animationsBySection }) {
  // ==================== ScrollTrigger Setup ====================
  const scrollTriggerRefs = useMemo(
    () => Array.from({ length: NUM_SECTIONS }, () => createRef()),
    [],
  );

  // Create a ScrollTrigger instance for each section to scrub the corresponding section animations based on the scroll position
  useGSAP(
    () => {
      animationsBySection.forEach((animations, index) => {
        // Get scroll trigger element for the section
        const trigger = scrollTriggerRefs[index].current;

        // Create aggregation timeline with attached ScrollTrigger
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: "top top",
            end: "bottom top",
            scrub: 0.15, // Reduce choppiness with smoothing (150ms, TailwindCSS default transition duration)
            snap: 1, // Fallback snapping if CSS scroll snapping fails for any reason (e.g. iOS Safari snapping issues)
            preventOverlaps: true, // Prevent choppy animations after native scroll position restoration on page refresh
          },
        });

        // Aggregate all animations for the section into the timeline
        for (const animation of animations) {
          timeline.add(animation, 0);
        }
      });

      // Refresh ScrollTrigger instances after adding all section animations (important for preventing potential rendering issues on initial load)
      ScrollTrigger.refresh(true);
    },
    {
      dependencies: [animationsBySection],
      revertOnUpdate: true,
    },
  );

  // ========================== Render ===========================
  return scrollTriggerRefs.map((ref, i) => (
    <div key={i} ref={ref} className="h-lvh snap-start snap-always" />
  ));
}

export default ScrollControls;
