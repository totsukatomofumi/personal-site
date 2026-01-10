import { createRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NUM_SECTIONS, APP_CONTEXT as AppContext } from "../constants";
import { SectionTrigger, Text } from "./components/";

gsap.registerPlugin(ScrollTrigger);

function App() {
  // ========================== Setup ===========================
  const sectionTriggerRefs = Array.from({ length: NUM_SECTIONS }, () =>
    createRef()
  );
  const [scrollAnimations, setScrollAnimations] = useState([]);

  // ====================== Context Setup =======================
  const registerScrollAnimation = (animation, index) => {
    setScrollAnimations((prev) => [
      ...prev,
      {
        animation: animation,
        index: index,
      },
    ]);
  };

  const removeScrollAnimation = (animation) => {
    setScrollAnimations((prev) =>
      prev.filter((p) => p.animation !== animation)
    );
  };

  const contextValue = {
    registerScrollAnimation,
    removeScrollAnimation,
  };

  // =================== ScrollTriggers Setup ===================
  useGSAP(
    () => {
      scrollAnimations.forEach(({ animation, index }) => {
        const trigger = sectionTriggerRefs[index].current;

        ScrollTrigger.create({
          trigger: trigger,
          animation: animation,
          start: "top top",
          end: "bottom top",
          scrub: true,
          snap: {
            snapTo: 1,
            duration: { max: 1 },
            delay: 0,
            inertia: false,
          },
        });
      });
    },
    {
      dependencies: [scrollAnimations],
      revertOnUpdate: true,
    }
  );

  // ========================== Render ==========================
  return (
    <div>
      {/* ====================== Main ====================== */}
      <div className="fixed top-0 left-0 w-screen h-screen">
        <AppContext value={contextValue}>
          <Text className="absolute top-0 left-0 z-40 w-full h-full" />
        </AppContext>
      </div>

      {/* ================= ScrollTriggers ================= */}
      {sectionTriggerRefs.map((ref, index) => (
        <SectionTrigger key={index} ref={ref} />
      ))}
    </div>
  );
}

export default App;
