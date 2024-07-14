import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Button({ iconComponent }) {
  const selfRef = useRef();
  const whiteOverlayRef = useRef();

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // scale on hover
  useGSAP(
    () => {
      gsap.to(selfRef.current, {
        scale: isHovered ? 1.1 : 1,
        duration: 0.1,
      });
    },
    { dependencies: [isHovered] }
  );

  // blip and shine on click
  useGSAP(
    () => {
      if (isClicked) {
        const tl = gsap.timeline();

        tl.to(selfRef.current, {
          scale: 1,
          duration: 0.05,
          ease: "none",
        })
          .to(selfRef.current, {
            scale: 1.1,
            duration: 0.05,
            ease: "none",
          })
          .to(
            whiteOverlayRef.current,
            {
              opacity: 1,
              duration: 0.1,
              ease: "none",
            },
            "<-0.05"
          );
      } else {
        gsap.from(whiteOverlayRef.current, {
          opacity: 1,
          duration: 0.1,
          ease: "none",
        });
      }
    },
    { dependencies: [isClicked], revertOnUpdate: true }
  );

  return (
    <button
      className="relative ml-1 mr-7 aspect-square h-[85%] bg-custom-grey-light border-4 border-custom-blue rounded-full shadow-[10px_10px_5px_rgba(0,0,0,0.1)] flex justify-center items-center z-10 
     after:content-[' '] after:block after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-full after:shadow-[inset_-10px_-25px_5px_-1px_rgba(0,0,0,0.05)]"
      ref={selfRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
    >
      {/* Icon */}
      <div className="aspect-square h-1/2 flex justify-center items-center">
        {iconComponent}
      </div>

      {/* White overlay when clicked */}
      <div
        className="absolute h-full w-full rounded-full bg-white z-50 opacity-0"
        ref={whiteOverlayRef}
      ></div>
    </button>
  );
}

export default Button;
