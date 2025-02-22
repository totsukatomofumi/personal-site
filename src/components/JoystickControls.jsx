import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const MAX_JOYSTICK_POS = 50;

function JoystickControls({
  isJoystickActive,
  setIsJoystickActive,
  movementVector,
}) {
  const stickRef = useRef();
  const baseRef = useRef();
  const touchId = useRef();
  const [initTouchPos, setInitTouchPos] = useState([0, 0]);
  const [currTouchPos, setCurrTouchPos] = useState([0, 0]);

  // pass joystick position to parent
  useEffect(() => {
    let x = currTouchPos[0] - initTouchPos[0];
    let y = currTouchPos[1] - initTouchPos[1];

    x = Math.max(-MAX_JOYSTICK_POS, Math.min(MAX_JOYSTICK_POS, x));
    y = Math.max(-MAX_JOYSTICK_POS, Math.min(MAX_JOYSTICK_POS, y));

    movementVector.current = [x / MAX_JOYSTICK_POS, y / MAX_JOYSTICK_POS];
  }, [initTouchPos, currTouchPos, movementVector]);

  function handleOnTouchStart(e) {
    const touch = e.changedTouches[0];

    touchId.current = touch.identifier;
    setInitTouchPos([touch.clientX, touch.clientY]);
    setCurrTouchPos([touch.clientX, touch.clientY]);

    setIsJoystickActive(true);
  }

  function handleOnTouchMove(e) {
    let touch = null;

    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId.current) {
        touch = e.changedTouches[i];
        break;
      }
    }

    if (touch === null) return;
    setCurrTouchPos([touch.clientX, touch.clientY]);
  }

  function handleOnTouchEnd(e) {
    setCurrTouchPos(initTouchPos);
    setIsJoystickActive(false);
  }

  // joystick fade in
  useGSAP(
    () => {
      if (baseRef.current === null) return;

      const opacity = isJoystickActive ? 1 : 0;
      gsap.to(baseRef.current, { opacity: opacity, duration: 0.2 });
    },
    { dependencies: [isJoystickActive] }
  );

  // joystick movement animation
  useGSAP(
    () => {
      if (baseRef.current === null) return;

      gsap.set(baseRef.current, { x: initTouchPos[0], y: initTouchPos[1] });
      gsap.set(stickRef.current, { x: 0, y: 0 });
    },
    { dependencies: [baseRef, initTouchPos] }
  );

  useGSAP(
    () => {
      if (stickRef.current === null) return;

      gsap.to(stickRef.current, {
        x: currTouchPos[0] - initTouchPos[0],
        y: currTouchPos[1] - initTouchPos[1],
        duration: 0.1,
      });
    },
    { dependencies: [stickRef, currTouchPos, initTouchPos] }
  );

  return (
    <div
      className="absolute top-0 left-0 w-full h-full z-30"
      onTouchStart={handleOnTouchStart}
      onTouchEnd={handleOnTouchEnd}
      onTouchMove={handleOnTouchMove}
    >
      <div
        ref={baseRef}
        className="absolute top-0 left-0 w-[100px] h-[100px] flex justify-center items-center translate-x-[-50px] translate-y-[-50px] opacity-0"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-black rounded-full"></div>
        <div
          ref={stickRef}
          className="w-[40px] h-[40px] opacity-50 bg-black rounded-full"
        ></div>
      </div>
    </div>
  );
}

export default JoystickControls;
