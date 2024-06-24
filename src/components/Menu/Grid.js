import { useRef, useState } from "react";
import placeholder from "../../assets/images/tex1_128x96_1cb50192dde67d02_2.png";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Box() {
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

  return (
    <div
      className="relative h-48 w-[22rem] rounded-2xl bg-custom-white shadow-lg"
      ref={selfRef}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div
        className="rounded-2xl h-full w-full bg-contain bg-center opacity-10"
        style={{ backgroundImage: `url(${placeholder})` }}
      ></div>

      <div
        className="absolute top-0 h-full w-full rounded-2xl border-4 border-custom-blue z-50 opacity-0 blur-[1px] shadow-md"
        ref={outlineAnimatedRef}
      ></div>
      <div className="absolute top-0 h-full w-full rounded-2xl border-4 border-custom-grey"></div>
    </div>
  );
}

function Grid() {
  return (
    <div className="scroll-trigger grid grid-rows-3 grid-flow-col auto-cols-min gap-4">
      {Array(21).fill(<Box />)}
    </div>
  );
}

export default Grid;
