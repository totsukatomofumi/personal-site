import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { isMobile, useMobileOrientation } from "react-device-detect";
import Scene from "./components/Scene";
import Joystick from "./components/Joystick";
import Ui from "./components/Ui";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const { isLandscape } = useMobileOrientation();
  const isJoyStickActive = useRef(false);
  const joystickPos = useRef([0, 0]); // x, y, [0, 1]

  if (!isMobile) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen pb-[80px] touch-none ">
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-2xl font-bold">Please use a mobile device</div>
        </div>
      </div>
    );
  }

  if (isLandscape) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen pb-[80px] touch-none ">
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-2xl font-bold">Please use potrait mode</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen pb-[80px] touch-none bg-black">
      <div className="relative w-full h-full">
        {isLoadingScreen ? (
          <Loading
            isLoaded={isLoaded}
            setIsLoadingScreen={setIsLoadingScreen}
          />
        ) : null}
        <Canvas
          onCreated={() => {
            setIsLoaded(true);
          }}
        >
          <Scene
            isJoyStickActive={isJoyStickActive}
            joystickPos={joystickPos}
          />
        </Canvas>
        <Joystick
          isJoyStickActive={isJoyStickActive}
          joystickPos={joystickPos}
        />
        <Ui />
      </div>
    </div>
  );
}

function Loading({ isLoaded, setIsLoadingScreen }) {
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
    { dependencies: [isLoaded, setIsLoadingScreen] }
  );

  return (
    <div
      ref={self}
      className="absolute top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black"
    >
      <div ref={loadingRef} className="text-white text-2xl font-vt323">
        <p>
          Loading<span ref={firstDotRef}>.</span>
          <span ref={secondDotRef}>.</span>
          <span ref={thirdDotRef}>.</span>
        </p>
      </div>
    </div>
  );
}

export default App;
