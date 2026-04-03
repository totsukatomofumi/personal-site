import { createRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NUM_SECTIONS } from "../../../constants";

gsap.registerPlugin(ScrollTrigger);

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
            scrub: true,
          },
        });

        // Aggregate all animations for the section into the timeline
        for (const animation of animations) {
          timeline.add(animation);
        }
      });
    },
    {
      dependencies: [animationsBySection],
      revertOnUpdate: true,
    },
  );

  return scrollTriggerRefs.map((ref, i) => (
    <div key={i} ref={ref} className="h-dvh snap-start snap-always" />
  ));
}

export default ScrollControls;
