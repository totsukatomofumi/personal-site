import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { BrowserView, isMobile, MobileView } from "react-device-detect";
import { animateUiButton } from "../animations";
import uiMenuTitle from "../sprites/ui-menu-title.png";
import uiCloseButtom from "../sprites/ui-close-button.png";
import uiNavLeftButton from "../sprites/ui-nav-left-button.png";
import uiNavRightButton from "../sprites/ui-nav-right-button.png";
import uiPipe from "../sprites/ui-pipe.png";
import MenuEquipment from "./MenuEquipment";
import MenuInventory from "./MenuInventory";
import MenuCredits from "./MenuCredits";

function MenuBase({ setIsMenu }) {
  const [pageNum, setPageNum] = useState(isMobile ? 1 : 2);
  const uiNavLeftButtonRef = useRef();
  const uiNavRightButtonRef = useRef();
  const uiCloseButtonRef = useRef();
  const [toggleUiNavLeftButtonAnim, setToggleUiNavLeftButtonAnim] =
    useState(null);
  const [toggleUiNavRightButtonAnim, setToggleUiNavRightButtonAnim] =
    useState(null);
  const [toggleUiCloseButtonAnim, setToggleUiCloseButtonAnim] = useState(null);
  const [itemDescBox, setItemDescBox] = useState(null);

  const pages = [
    <MenuEquipment setItemDescBox={setItemDescBox} />,
    <MenuInventory setItemDescBox={setItemDescBox} />,
    <MenuCredits />,
  ];
  let titles = ["Equipment", "Inventory", "Credits"];

  function handleOnClickUiNavLeftButton() {
    setToggleUiNavLeftButtonAnim((prev) => (prev === null ? false : !prev));

    if (isMobile) {
      setTimeout(() => {
        setPageNum((prev) => (prev === 1 ? 1 : prev - 1));
      }, 100);
      return;
    }

    setTimeout(() => {
      setPageNum((prev) => (prev === 2 ? 2 : prev - 1));
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

  function handleOnClickCloseItemDescBox() {
    setItemDescBox(null);
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
    <div
      className="absolute top-0 left-0 z-50 w-full h-full flex justify-center items-center"
      onClick={handleOnClickCloseItemDescBox}
    >
      <MobileView>
        <div className="relative w-fit h-[500px]">
          {pages[pageNum - 1]}
          <div className="absolute -top-[6px] left-0 z-40 w-full h-fit flex justify-center items-center">
            <div className="relative w-fit h-[30px]">
              <div className="absolute top-[2px] left-0 w-full h-full text-center align-middle text-custom-gold font-synemono font-semibold">
                {titles[pageNum - 1]}
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
      </MobileView>
      <BrowserView>
        <div
          className="relative w-fit h-[500px] flex flex-row gap-3"
          onMouseMove={handleOnClickCloseItemDescBox}
        >
          <div className="relative w-fit h-full">
            {pages[0]}
            <div className="absolute -top-[6px] left-0 z-40 w-full h-fit flex justify-center items-center">
              <div className="relative w-fit h-[30px]">
                <div className="absolute top-[2px] left-0 w-full h-full text-center align-middle text-custom-gold font-synemono font-semibold">
                  {titles[0]}
                </div>
                <img src={uiMenuTitle} alt="ui-menu-title" className="h-full" />
              </div>
            </div>
          </div>
          <div className="relative w-fit h-full">
            {pages[pageNum - 1]}
            <div className="absolute -top-[6px] left-0 z-40 w-full h-fit flex justify-center items-center">
              <div className="relative w-fit h-[30px]">
                <div className="absolute top-[2px] left-0 w-full h-full text-center align-middle text-custom-gold font-synemono font-semibold">
                  {titles[pageNum - 1]}
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
                  onClick={pageNum === 2 ? null : handleOnClickUiNavLeftButton}
                  style={{ opacity: pageNum === 2 ? 0.5 : 1 }}
                />
              </div>

              <div className="w-[50px] text-center text-custom-gold font-synemono text-sm">
                {pageNum - 1} / 2
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
          <div className="absolute top-0 left-0 -z-10 w-full h-[500px] flex justify-center items-cente">
            <div className="w-[80px] h-full flex flex-col justify-center items-center gap-60">
              <img src={uiPipe} alt="ui-pipe" className="w-full" />
              <img src={uiPipe} alt="ui-pipe" className="w-full" />
            </div>
          </div>
        </div>
      </BrowserView>
      <div
        className="absolute top-0 left-0 w-full h-full -z-50 bg-black opacity-50 "
        onClick={handleOnClickOutsideMenu}
      ></div>
      {itemDescBox}
    </div>
  );
}

export default MenuBase;
