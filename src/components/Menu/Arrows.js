import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactComponent as CaretLeft } from "../../assets/images/caret-left-solid.svg";
import { ReactComponent as CaretRight } from "../../assets/images/caret-right-solid.svg";

function Arrows() {
  const leftArrowRef = useRef();
  const leftArrowContainerRef = useRef();
  const rightArrowRef = useRef();
  const rightArrowContainerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(leftArrowRef.current, {
      x: -10,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.in",
    }).to(
      rightArrowRef.current,
      {
        x: 10,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.in",
      },
      "<"
    );

    gsap.registerPlugin(ScrollTrigger);

    // hide left arrow
    gsap.set(leftArrowContainerRef.current, {
      x: "-7rem", //left/right-12 + w-16 = 28*0.25rem = 7rem
    });

    ScrollTrigger.create({
      scroller: ".scroll-container",
      trigger: ".scroll-trigger",
      horizontal: true,
      start: "left 0%",
      end: "right 100%",
      onToggle: (self) => {
        if (self.isActive) {
          gsap.to(
            [leftArrowContainerRef.current, rightArrowContainerRef.current],
            {
              x: 0,
              duration: 0.1,
            }
          );
        } else {
          gsap.to(
            self.direction < 0
              ? leftArrowContainerRef.current
              : rightArrowContainerRef.current,
            {
              x: `${self.direction * 7}rem`, //left/right-12 + w-16 = 28*0.25rem = 7rem
              duration: 0.1,
            }
          );
        }
      },
    });
  });

  return (
    <>
      <div
        className="absolute top-1/2 -translate-y-1/2 left-12 w-16 h-fit drop-shadow-xl z-50 opacity-75"
        ref={leftArrowContainerRef}
      >
        <CaretLeft
          ref={leftArrowRef}
          overflow={"visible"}
          stroke="#001f86"
          strokeWidth={"2%"}
        />
      </div>
      <div
        className="absolute top-1/2 -translate-y-1/2 right-12 w-16 h-fit drop-shadow-xl z-50 opacity-75"
        ref={rightArrowContainerRef}
      >
        <CaretRight
          ref={rightArrowRef}
          overflow={"visible"}
          stroke="#001f86"
          strokeWidth={"2%"}
        />
      </div>
    </>
  );
}

export default Arrows;
