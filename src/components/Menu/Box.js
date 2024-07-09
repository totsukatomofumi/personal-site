import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Box({ setBoxWidth }) {
  const isResize = useWindowSize(); // use to listen resize
  const selfRef = useRef();
  const outlineAnimatedRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  // scale on hover
  useGSAP(
    () => {
      if (isHovered) {
        gsap.to(outlineAnimatedRef.current, {
          opacity: 1,
          duration: 0.1,
        });
      } else {
        gsap.fromTo(
          outlineAnimatedRef.current,
          { opacity: 1 },
          {
            scaleX: 0.9,
            scaleY: 0.95,
            opacity: 0,
            duration: 0.5,
          }
        );
      }
    },
    { dependencies: [isHovered], revertOnUpdate: true }
  );

  // tell Body component the width of the box for centering
  useEffect(() => {
    setBoxWidth(selfRef.current.offsetWidth);
  }, [isResize]);

  return (
    <div
      className="relative aspect-[1.85/1] h-full rounded-3xl bg-black"
      ref={selfRef}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div
        className="absolute top-0 left-0 h-full w-full rounded-3xl border-4 border-custom-blue z-10 opacity-0 shadow-[0_0_60px_rgba(71,212,255,0.3)]"
        ref={outlineAnimatedRef}
      ></div>
      <div className="absolute top-0 left-0 h-full w-full rounded-3xl border-4 border-custom-grey"></div>
    </div>
  );
}

export default Box;
