import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { BakeShadows, PerformanceMonitor } from "@react-three/drei";
import { isMobile, useMobileOrientation } from "react-device-detect";
import LoadingScreen from "./components/LoadingScreen";
import Ui from "./components/Ui";
import JoystickControls from "./components/JoystickControls";
import KeyboardControls from "./components/KeyboardControls";
import DialogControls from "./components/DialogControls";
import Scene from "./components/Scene";
import RotateScreenOverlay from "./components/RotateScreenOverlay";
import {
  DEBUG_DISABLE_CANVAS,
  DEBUG_ENABLE_CAM_ORBIT_CONTROLS,
  DYNAMIC_DPR_FACTOR,
} from "./constants";

function App() {
  const { isLandscape } = useMobileOrientation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isIntro, setIsIntro] = useState(true);
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const movementVector = useRef([0, 0]); // x, z, [-1, 1]
  const [isDialogActive, setIsDialogActive] = useState(false);
  const [toggleDialog, setToggleDialog] = useState(null); // null before use
  const [isMenu, setIsMenu] = useState(false);
  const [toggleTutorialAnim, setToggleTutorialAnim] = useState(null);
  const [dpr, setDpr] = useState(window.devicePixelRatio);

  useEffect(() => {
    if (isDialogActive) {
      // reset movement vector, i.e. player stops moving
      movementVector.current = [0, 0];
      setIsJoystickActive(false);
    }
  }, [isDialogActive]);

  useEffect(() => {
    if (isMenu) {
      movementVector.current = [0, 0];
    }
  }, [isMenu]);

  return (
    <div className="fixed top-0 left-0 w-dvw h-dvh touch-none select-none bg-black">
      <div className="relative w-full h-full">
        {isMobile && isLandscape && <RotateScreenOverlay />}
        {!DEBUG_DISABLE_CANVAS && isLoadingScreen && (
          <LoadingScreen
            isLoaded={isLoaded}
            setIsLoadingScreen={setIsLoadingScreen}
          />
        )}
        <Ui
          isMenu={isMenu}
          setIsMenu={setIsMenu}
          toggleTutorialAnim={toggleTutorialAnim}
          isDialogActive={isDialogActive}
        />
        {isDialogActive && <DialogControls setToggleDialog={setToggleDialog} />}
        {!isIntro && !DEBUG_ENABLE_CAM_ORBIT_CONTROLS && !isDialogActive && (
          <JoystickControls
            isJoystickActive={isJoystickActive}
            setIsJoystickActive={setIsJoystickActive}
            movementVector={movementVector}
          />
        )}
        {!isIntro && !isJoystickActive && (
          <KeyboardControls
            movementVector={movementVector}
            setIsMenu={setIsMenu}
            isMenu={isMenu}
            isDialogActive={isDialogActive}
          />
        )}
        {!DEBUG_DISABLE_CANVAS && (
          <Canvas shadows dpr={dpr} className="saturate-[0.8]">
            <PerformanceMonitor
              factor={1}
              onChange={({ factor }) => {
                setIsLoaded(true); // set is loaded when performance monitor is ready
                setDpr(
                  Math.max(
                    factor * DYNAMIC_DPR_FACTOR * window.devicePixelRatio,
                    0.5
                  )
                );
              }}
            />
            <Scene
              movementVector={movementVector}
              setIsDialogActive={setIsDialogActive}
              toggleDialog={toggleDialog}
              setToggleTutorialAnim={setToggleTutorialAnim}
              isIntro={isIntro}
              setIsIntro={setIsIntro}
              isLoaded={isLoaded}
            />
            <BakeShadows />
          </Canvas>
        )}
      </div>
    </div>
  );
}

export default App;
