import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { isMobile, useMobileOrientation } from "react-device-detect";
import LoadingScreen from "./components/LoadingScreen";
import Ui from "./components/Ui";
import JoystickControls from "./components/JoystickControls";
import KeyboardControls from "./components/KeyboardControls";
import DialogControls from "./components/DialogControls";
import Scene from "./components/Scene";
import { AdaptiveDpr, BakeShadows } from "@react-three/drei";
import { DEBUG_DISABLE_CANVAS, SCREEN_BOTTOM_PADDING } from "./constants";

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
    <div
      className="fixed top-0 left-0 w-screen h-screen touch-none select-none bg-black"
      style={{ paddingBottom: SCREEN_BOTTOM_PADDING }}
    >
      <div className="relative w-full h-full">
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
        />
        {isDialogActive ? (
          <DialogControls setToggleDialog={setToggleDialog} />
        ) : (
          !isIntro && (
            <>
              <JoystickControls
                isJoystickActive={isJoystickActive}
                setIsJoystickActive={setIsJoystickActive}
                movementVector={movementVector}
              />
              {!isJoystickActive && !isMenu && (
                <KeyboardControls movementVector={movementVector} />
              )}
            </>
          )
        )}
        {!DEBUG_DISABLE_CANVAS && (
          <Canvas
            shadows
            onCreated={() => {
              setIsLoaded(true);
            }}
          >
            <Scene
              movementVector={movementVector}
              setIsDialogActive={setIsDialogActive}
              toggleDialog={toggleDialog}
              setToggleTutorialAnim={setToggleTutorialAnim}
              isIntro={isIntro}
              setIsIntro={setIsIntro}
            />
            <AdaptiveDpr pixelated />
            <BakeShadows />
          </Canvas>
        )}
      </div>
    </div>
  );
}

export default App;
