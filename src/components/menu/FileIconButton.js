import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function FileIconButton() {
  const selfRef = useRef();
  const innnerBgRef = useRef();
  const whiteOverlayRef = useRef();

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // blink
  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    tl.to(innnerBgRef.current, {
      backgroundColor: "rgba(255,255,255,0.5)",
      repeat: 1,
      yoyo: true,
      ease: "none",
      duration: 0.25,
    });
  });

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
      className="bg-custom-blue flex items-center justify-center rounded-md"
      style={{
        clipPath: "polygon(0 0, 80% 0%, 100% 15%, 100% 100%, 0 100%)",
        aspectRatio: 3 / 4,
      }}
      ref={selfRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
    >
      <div
        className="h-[calc(100%-8px)] bg-custom-blue-light flex flex-col items-center justify-center"
        style={{
          clipPath: "polygon(0 0, 80% 0%, 100% 15%, 100% 100%, 0 100%)",
          aspectRatio: 3 / 4,
        }}
        ref={innnerBgRef}
      >
        <div className="mt-2 aspect-square w-[84%] bg-custom-white flex items-center justify-center">
          <p className="text-custom-blue font-bold text-center align-middle text-xl">
            CV
          </p>
        </div>
        <div className="mt-1 w-[84%] h-[13%] bg-custom-blue opacity-80"></div>
      </div>

      {/* White overlay when clicked */}
      <div
        className="absolute h-[calc(100%-8px)] bg-white z-50 opacity-0"
        style={{
          clipPath: "polygon(0 0, 80% 0%, 100% 15%, 100% 100%, 0 100%)",
          aspectRatio: 3 / 4,
        }}
        ref={whiteOverlayRef}
      ></div>
    </button>
  );
}

export default FileIconButton;
