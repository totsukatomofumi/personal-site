import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { isMobile, useMobileOrientation } from "react-device-detect";
import LoadingScreen from "./components/LoadingScreen";
import Ui from "./components/Ui";
import JoystickControls from "./components/JoystickControls";
import KeyboardControls from "./components/KeyboardControls";
import Scene from "./components/Scene";

function App() {
  const { isLandscape } = useMobileOrientation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const movementVector = useRef([0, 0]); // x, z, [-1, 1]

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
          <LoadingScreen
            isLoaded={isLoaded}
            setIsLoadingScreen={setIsLoadingScreen}
          />
        ) : null}
        <Ui />
        <JoystickControls
          isJoystickActive={isJoystickActive}
          setIsJoystickActive={setIsJoystickActive}
          movementVector={movementVector}
        />
        {!isJoystickActive && (
          <KeyboardControls movementVector={movementVector} />
        )}
        <Canvas
          onCreated={() => {
            setIsLoaded(true);
          }}
        >
          <Scene movementVector={movementVector} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
