import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function LoadingScreen({ isLoaded, setIsLoadingScreen }) {
  const self = useRef();
  const loadingRef = useRef();
  const firstDotRef = useRef();
  const secondDotRef = useRef();
  const thirdDotRef = useRef();

  // loading animation
  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1 });

    tl.set([firstDotRef.current, secondDotRef.current, thirdDotRef.current], {
      opacity: 0,
    });
    tl.set(firstDotRef.current, { opacity: 1 }, "+=0.1");
    tl.set(secondDotRef.current, { opacity: 1 }, "+=0.1");
    tl.set(thirdDotRef.current, { opacity: 1 }, "+=0.1");
    tl.set({}, {}, "+=0.1");
  }, {});

  // fade out loading screen
  useGSAP(
    () => {
      if (isLoaded) {
        const tl = gsap.timeline();

        tl.set(loadingRef.current, { display: "none" });
        tl.to(
          self.current,
          { opacity: 0, duration: 1.5, ease: "none" },
          "+=0.5"
        );
        tl.call(() => {
          setIsLoadingScreen(false);
        });
      }
    },
    { dependencies: [isLoaded] }
  );

  return (
    <div
      ref={self}
      className="absolute top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black"
    >
      <div ref={loadingRef} className="text-custom-white text-2xl font-vt323">
        <p>
          Loading<span ref={firstDotRef}>.</span>
          <span ref={secondDotRef}>.</span>
          <span ref={thirdDotRef}>.</span>
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
