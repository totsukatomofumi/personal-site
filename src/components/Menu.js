import Grid from "./Grid";
import Footer from "./Footer";
import overallBackground from "../assets/images/background.png";
import { ReactComponent as CaretLeft } from "../assets/images/caret-left-solid.svg";
import { ReactComponent as CaretRight } from "../assets/images/caret-right-solid.svg";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

function Menu() {
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
    }).to(
      rightArrowRef.current,
      {
        x: 10,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
      },
      "<"
    );

    gsap.registerPlugin(ScrollTrigger);

    // hide left arrow
    gsap.set(leftArrowContainerRef.current, {
      x: -136,
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
              x: self.direction * 136, //mx-16 + w-16 + left/right-2
              duration: 0.1,
            }
          );
        }
      },
    });
  });

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-end">
      {/* Grid */}
      <div className="scroll-container relative w-full h-fit overflow-x-scroll overflow-y-visible no-scrollbar">
        <div className="w-fit h-fit px-[calc((100vw-(4*23rem-1rem))/2)] py-10">
          <Grid />
        </div>
      </div>

      {/* Arrow Icons */}
      <div
        className="absolute left-2 bottom-[28%] mx-16 my-10 w-16 h-[calc(13rem*3-1rem)] flex items-center drop-shadow-xl z-50 opacity-75"
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
        className="absolute right-2 bottom-[28%] mx-16 my-10 w-16 h-[calc(13rem*3-1rem)] flex items-center drop-shadow-xl z-50 opacity-75"
        ref={rightArrowContainerRef}
      >
        <CaretRight
          ref={rightArrowRef}
          overflow={"visible"}
          stroke="#001f86"
          strokeWidth={"2%"}
        />
      </div>

      {/* Footer */}
      <div className="relative w-full h-[28%] -z-30">
        <Footer />
      </div>

      {/* Background */}
      <>
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat-y -z-40 blur-[1px] opacity-50"
          style={{ backgroundImage: `url(${overallBackground})` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white -z-50"></div>
        <div className="absolute left-[40%] w-[20%] h-screen bg-custom-white -z-40 blur-3xl"></div>
      </>
    </div>
  );
}

export default Menu;
