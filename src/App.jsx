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
  const [scrollAnims, setScrollAnims] = useState([]);

  // ====================== Context Setup =======================
  const registerScrollAnim = (tween, index) => {
    setScrollAnims((prev) => [
      ...prev,
      {
        tween: tween,
        index: index,
      },
    ]);
  };

  const removeScrollAnim = (tween) => {
    setScrollAnims((prev) => prev.filter((anim) => anim.tween !== tween));
  };

  const contextValue = {
    registerScrollAnim,
    removeScrollAnim,
  };

  // =================== ScrollTriggers Setup ===================
  useGSAP(
    () => {
      scrollAnims.forEach(({ tween, index }) => {
        const trigger = sectionTriggerRefs[index].current;

        ScrollTrigger.create({
          trigger: trigger,
          animation: tween,
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
      dependencies: [scrollAnims],
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
