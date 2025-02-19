import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const MAX_JOYSTICK_POS = 50;

function Joystick({ isJoyStickActive, joystickPos }) {
  const [isActive, setIsActive] = useState(false);
  const [initTouchPos, setInitTouchPos] = useState([0, 0]);
  const [currTouchPos, setCurrTouchPos] = useState([0, 0]);
  const [touchId, setTouchId] = useState(null);
  const baseRef = useRef();
  const stickRef = useRef();

  // pass joystick position to parent
  useEffect(() => {
    isJoyStickActive.current = isActive;

    let x = currTouchPos[0] - initTouchPos[0];
    let y = currTouchPos[1] - initTouchPos[1];

    if (x > MAX_JOYSTICK_POS) x = MAX_JOYSTICK_POS;
    if (x < -MAX_JOYSTICK_POS) x = -MAX_JOYSTICK_POS;
    if (y > MAX_JOYSTICK_POS) y = MAX_JOYSTICK_POS;
    if (y < -MAX_JOYSTICK_POS) y = -MAX_JOYSTICK_POS;

    joystickPos.current = [x / MAX_JOYSTICK_POS, y / MAX_JOYSTICK_POS];
  }, [isActive, initTouchPos, currTouchPos, isJoyStickActive, joystickPos]);

  function handleOnTouchStart(e) {
    const touch = e.changedTouches[0];

    setTouchId(touch.identifier);
    setInitTouchPos([touch.clientX, touch.clientY]);
    setCurrTouchPos([touch.clientX, touch.clientY]);

    setIsActive(true);
  }

  function handleOnTouchMove(e) {
    let touch = null;

    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        touch = e.changedTouches[i];
        break;
      }
    }

    if (touch === null) return;
    setCurrTouchPos([touch.clientX, touch.clientY]);
  }

  function handleOnTouchEnd(e) {
    setCurrTouchPos(initTouchPos);
    setIsActive(false);
  }

  // joystick fade in
  useGSAP(
    () => {
      if (baseRef.current === null) return;

      const opacity = isActive ? 1 : 0;

      const tl = gsap.timeline();

      tl.to(baseRef.current, { opacity: opacity, duration: 0.2 });
    },
    { dependencies: [isActive] }
  );

  // joystick movement animation
  useGSAP(
    () => {
      if (baseRef.current === null) return;

      const tl = gsap.timeline();

      tl.set(baseRef.current, { x: initTouchPos[0], y: initTouchPos[1] });
      tl.set(stickRef.current, { x: 0, y: 0 });
    },
    { dependencies: [baseRef, initTouchPos] }
  );

  useGSAP(
    () => {
      if (stickRef.current === null) return;

      const tl = gsap.timeline();

      tl.to(stickRef.current, {
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

export default Joystick;
