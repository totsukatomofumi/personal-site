import { createRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { NUM_SECTIONS } from "../../../constants";

function ScrollControls({ thunksBySection, isImagePreviewOpen }) {
  // ==================== ScrollTrigger Setup ====================
  const sectionTriggerRefs = useMemo(
    () => Array.from({ length: NUM_SECTIONS }, () => createRef()),
    [],
  );

  // Create a ScrollTrigger instance for each section to scrub the corresponding section animations based on the scroll position
  useGSAP(
    () => {
      sectionTriggerRefs.forEach((sectionTriggerRef, sectionIndex) => {
        // Create aggregation timeline with attached ScrollTrigger
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionTriggerRef.current, // Get scroll trigger element for the section
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Aggregate all animations for the section into the timeline
        for (const sectionThunk of thunksBySection[sectionIndex]) {
          timeline.add(
            sectionThunk(), // Create the tween by calling the thunk which is added to the timeline immediately
            0,
          );
        }
      });
    },
    {
      dependencies: [thunksBySection],
      revertOnUpdate: true, // Revert timelines and the child tweens created by the thunks on update
    },
  );

  // ===================== Disabling Scroll ======================
  // Disable scrolling when image preview is open by targetting the scroller (i.e. root) element
  useEffect(() => {
    if (isImagePreviewOpen) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.scrollSnapType = "none"; // Disable CSS scroll snapping to prevent potential scroll jank when closing image preview
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollSnapType = "";
    };
  }, [isImagePreviewOpen]);

  // ========================== Render ===========================
  return sectionTriggerRefs.map((ref, i) => (
    <div key={i} ref={ref} className="h-lvh snap-start snap-always" />
  ));
}

export default ScrollControls;
