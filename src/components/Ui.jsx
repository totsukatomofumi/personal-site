import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Menu from "./Menu";
import { animateUiButton } from "../animations";
import uiStatus from "../sprites/ui-status.png";
import uiButton from "../sprites/ui-button.png";

function Ui({ isMenu, setIsMenu }) {
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

  return (
    <>
      <div className="absolute top-5 left-5 z-40 w-fit h-[80px]">
        <img src={uiStatus} alt="ui-status" className="h-full" />
      </div>

      <div className="absolute bottom-5 z-40 right-5 w-fit h-[80px]">
        <img
          ref={uiButtonRef}
          src={uiButton}
          alt="ui-button"
          className="h-full"
          onClick={handleOnClick}
        />
      </div>

      {isMenu ? <Menu setIsMenu={setIsMenu} /> : null}
    </>
  );
}

export default Ui;
