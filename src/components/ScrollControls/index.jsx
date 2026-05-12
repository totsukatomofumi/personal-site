import { createRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { NUM_SECTIONS } from "../../../constants";

function ScrollControls({ animationsBySection, isImagePreviewOpen }) {
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
            preventOverlaps: true, // Prevent choppy animations after native scroll position restoration on page refresh
          },
        });

        // Aggregate all animations for the section into the timeline
        for (const animation of animations) {
          timeline.add(animation, 0);
        }
      });
    },
    {
      dependencies: [animationsBySection],
      revertOnUpdate: true,
    },
  );

  // ===================== Disabling Scroll ======================
  // Disable scrolling when image preview is open by targetting the scroller (i.e. root) element
  useEffect(() => {
    if (isImagePreviewOpen) {
      document.documentElement.style.overflowY = "hidden";
      document.documentElement.style.scrollSnapType = "none"; // Disable CSS scroll snapping to prevent potential scroll jank when closing image preview
    }
    return () => {
      document.documentElement.style.overflowY = "";
      document.documentElement.style.scrollSnapType = "";
    };
  }, [isImagePreviewOpen]);

  // ========================== Render ===========================
  return scrollTriggerRefs.map((ref, i) => (
    <div key={i} ref={ref} className="h-lvh snap-start snap-always" />
  ));
}

export default ScrollControls;
