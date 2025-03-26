import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import MenuBase from "./MenuBase";
import { animateUiButton } from "../animations";
import uiStatus from "../sprites/ui-status.png";
import uiButton from "../sprites/ui-button.png";

function Ui({ isMenu, setIsMenu, toggleTutorialAnim }) {
  const [toggleButtonAnim, setToggleButtonAnim] = useState(null);
  const uiButtonRef = useRef();

  function handleOnClick() {
    setToggleButtonAnim((prev) => (prev === null ? false : !prev));
    setTimeout(() => {
      setIsMenu(true);
    }, 100);
  }

  // button animation
  useGSAP(() => animateUiButton(uiButtonRef, toggleButtonAnim), {
    dependencies: [toggleButtonAnim],
  });

  // tutorial animation
  useGSAP(
    () => {
      if (toggleTutorialAnim === null) return;

      const tl = gsap.timeline();

      tl.to(uiButtonRef.current, {
        duration: 0.25,
        y: -30,
        ease: "power1.out",
        delay: 1,
      }).to(uiButtonRef.current, {
        duration: 0.5,
        y: 0,
        ease: "bounce.out",
      });
    },
    {
      dependencies: [toggleTutorialAnim],
    }
  );

  return (
    <>
      <div className="absolute top-5 left-5 z-40 w-fit h-[80px] md:scale-110 lg:scale-125 origin-top-left">
        <img src={uiStatus} alt="ui-status" className="h-full" />
      </div>

      <div className="absolute bottom-5 z-40 right-5 w-fit h-[80px] md:scale-110 lg:scale-125 origin-bottom-right">
        <img
          ref={uiButtonRef}
          src={uiButton}
          alt="ui-button"
          className="h-full"
          onClick={handleOnClick}
        />
      </div>

      {isMenu ? <MenuBase setIsMenu={setIsMenu} /> : null}
    </>
  );
}

export default Ui;
