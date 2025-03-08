import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { animateUiButton } from "../animations";
import uiMenuTitle from "../sprites/ui-menu-title.png";
import uiCloseButtom from "../sprites/ui-close-button.png";
import uiNavLeftButton from "../sprites/ui-nav-left-button.png";
import uiNavRightButton from "../sprites/ui-nav-right-button.png";
import MenuEquipment from "./MenuEquipment";
import MenuInventory from "./MenuInventory";
import MenuCredits from "./MenuCredits";

const PAGES = [<MenuEquipment />, <MenuInventory />, <MenuCredits />];
const TITLES = ["Equipment", "Inventory", "Credits"];

function MenuBase({ setIsMenu }) {
  const [pageNum, setPageNum] = useState(1);
  const uiNavLeftButtonRef = useRef();
  const uiNavRightButtonRef = useRef();
  const uiCloseButtonRef = useRef();
  const [toggleUiNavLeftButtonAnim, setToggleUiNavLeftButtonAnim] =
    useState(null);
  const [toggleUiNavRightButtonAnim, setToggleUiNavRightButtonAnim] =
    useState(null);
  const [toggleUiCloseButtonAnim, setToggleUiCloseButtonAnim] = useState(null);

  function handleOnClickUiNavLeftButton() {
    setToggleUiNavLeftButtonAnim((prev) => (prev === null ? false : !prev));
    setTimeout(() => {
      setPageNum((prev) => (prev === 1 ? 1 : prev - 1));
    }, 100);
  }

  function handleOnClickUiNavRightButton() {
    setToggleUiNavRightButtonAnim((prev) => (prev === null ? false : !prev));
    setTimeout(() => {
      setPageNum((prev) => (prev === 3 ? 3 : prev + 1));
    }, 100);
  }

  function handleOnClickOutsideMenu() {
    setIsMenu(false);
  }

  function handleOnClickUiCloseButton() {
    setToggleUiCloseButtonAnim((prev) => (prev === null ? false : !prev));
    setTimeout(() => {
      setIsMenu(false);
    }, 100);
  }

  useGSAP(
    () => animateUiButton(uiNavLeftButtonRef, toggleUiNavLeftButtonAnim, 0.8),
    {
      dependencies: [toggleUiNavLeftButtonAnim],
    }
  );

  useGSAP(
    () => animateUiButton(uiNavRightButtonRef, toggleUiNavRightButtonAnim, 0.8),
    {
      dependencies: [toggleUiNavRightButtonAnim],
    }
  );

  useGSAP(
    () => animateUiButton(uiCloseButtonRef, toggleUiCloseButtonAnim, 0.8),
    {
      dependencies: [toggleUiCloseButtonAnim],
    }
  );

  return (
    <div className="absolute top-0 left-0 z-50 w-full h-full flex justify-center items-center">
      <div className="relative w-fit h-[500px]">
        {PAGES[pageNum - 1]}
        <div className="absolute -top-[6px] left-0 z-40 w-full h-fit flex justify-center items-center">
          <div className="relative w-fit h-[30px]">
            <div className="absolute top-[2px] left-0 w-full h-full text-center align-middle text-custom-gold font-synemono font-semibold">
              {TITLES[pageNum - 1]}
            </div>
            <img src={uiMenuTitle} alt="ui-menu-title" className="h-full" />
          </div>
        </div>

        <div className="absolute -top-[10px] -right-[10px] z-50 w-fit h-[40px]">
          <img
            ref={uiCloseButtonRef}
            src={uiCloseButtom}
            alt="ui-close-button"
            className="h-full"
            onClick={handleOnClickUiCloseButton}
          />
        </div>

        <div className="absolute bottom-[30px] w-full h-[30px] flex flex-row justify-center items-center">
          <div className="w-fit h-full">
            <img
              ref={uiNavLeftButtonRef}
              src={uiNavLeftButton}
              alt="ui-nav-left-button"
              className="h-full"
              onClick={pageNum === 1 ? null : handleOnClickUiNavLeftButton}
              style={{ opacity: pageNum === 1 ? 0.5 : 1 }}
            />
          </div>

          <div className="w-[50px] text-center text-custom-gold font-synemono text-sm">
            {pageNum} / 3
          </div>

          <div className="w-fit h-full">
            <img
              ref={uiNavRightButtonRef}
              src={uiNavRightButton}
              alt="ui-nav-right-button"
              className="h-full"
              onClick={pageNum === 3 ? null : handleOnClickUiNavRightButton}
              style={{ opacity: pageNum === 3 ? 0.5 : 1 }}
            />
          </div>
        </div>
      </div>
      <div
        className="absolute top-0 left-0 w-full h-full -z-50 bg-black opacity-50"
        onClick={handleOnClickOutsideMenu}
      ></div>
    </div>
  );
}

export default MenuBase;
