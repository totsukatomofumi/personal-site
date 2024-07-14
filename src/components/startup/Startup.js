import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ReactComponent as WarningIcon } from "../../assets/images/triangle-exclamation-solid.svg";

function Startup({ setIsStartupClicked }) {
  const continueRef = useRef();

  function handleClick() {
    setIsStartupClicked(true);
  }

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(continueRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 2,
      repeat: -1,
      yoyo: true,
      ease: "none",
    });
  });

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black flex justify-center items-center leading-relaxed"
      onClick={handleClick}
    >
      <div className="w-3/4 h-1/2 text-custom-white text-center flex flex-col justify-around items-center">
        <div className="flex justify-center items-center">
          <div className="aspect-square w-14">
            <WarningIcon className="fill-custom-yellow" />
          </div>
          <div className="ml-1 font-bold text-5xl">
            WARNING-SEVERE EPICNESS AND AWESOMENESS
          </div>
        </div>

        <div className="ml-32 mr-32 text-3xl">
          BEFORE ENTERING, PREPARE YOURSELF FOR A JOURNEY OF ADDICTING FUN,
          EPICNESS, AND ASTOUNDING CREATIVITY, ALL WHILE RETAINING EXCELLENT
          PROFESSIONALISM.
        </div>

        <div className="text-2xl">
          <div>
            Always online at <br></br>
            <a
              className="text-custom-blue-700"
              href={"https://www.nintendo.com/healthsafety/"}
            >
              https://www.nintendo.com/healthsafety/
            </a>
          </div>
        </div>

        <div className="text-3xl" ref={continueRef}>
          {/*  BLINK CLICK HERE then FADE TO BLACK then FADE
            TO MENU */}
          Click anywhere to continue.
        </div>
      </div>
    </div>
  );
}

export default Startup;
