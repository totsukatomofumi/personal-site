import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import moment from "moment";
import { animateUiButton } from "../animations";
import uiMenuBase from "../sprites/ui-menu-base.png";
import uiMenuTitle from "../sprites/ui-menu-title.png";
import uiCloseButtom from "../sprites/ui-close-button.png";
import uiNavLeftButton from "../sprites/ui-nav-left-button.png";
import uiNavRightButton from "../sprites/ui-nav-right-button.png";
import uiEquipmentChar from "../sprites/ui-equipment-char.png";
import uiEquipmentSlots from "../sprites/ui-equipment-slots.png";
import uiEquipmentSlotsLink from "../sprites/ui-equipment-slots-link.png";
import uiInventory from "../sprites/ui-inventory.png";

function Menu({ setIsMenu }) {
  const [pageNum, setPageNum] = useState(1);

  // level age calculation
  const age = moment().diff("2000-12-15", "years");
  const occupation = "Undergraduate";

  const equipmentPage = (
    <>
      <div className="absolute top-[50px] left-[32.5px] z-50 flex flex-col justify-center items-center font-vt323 text-left text-custom-off-white whitespace-pre-line leading-tight drop-shadow-sm">
        <p>
          <span className="text-custom-white text-xl leading-none">
            Totsuka Tomofumi
          </span>
          {`\n`}
          {occupation}
          <span className="text-custom-gold">{`\nLevel: `}</span>
          {age}
        </p>
      </div>

      <div className="relative z-0 w-fit h-full">
        <img src={uiMenuBase} alt="ui-equipment" className="h-full" />
        <img
          src={uiEquipmentChar}
          alt="ui-equipment-char"
          className="absolute top-0 left-0 z-40 h-full"
        />
        <img
          src={uiEquipmentSlots}
          alt="ui-equipment-slots"
          className="absolute top-0 left-0 z- 50 h-full"
        />
        <img
          src={uiEquipmentSlotsLink}
          alt="ui-equipment-slots-link"
          className="absolute top-0 left-0 z-50 h-full"
        />
      </div>
    </>
  );

  const inventoryPage = (
    <>
      <img src={uiInventory} alt="ui-inventory" className="h-full" />
    </>
  );

  const creditsPage = (
    <>
      <img src={uiMenuBase} alt="ui-menu-base" className="h-full" />
    </>
  );

  const pages = [equipmentPage, inventoryPage, creditsPage];
  const titles = ["Equipment", "Inventory", "Credits"];

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

  function handleOnClick() {
    setIsMenu(false);
  }

  function handleOnClickUiCloseButton() {
    setToggleUiCloseButtonAnim((prev) => (prev === null ? false : !prev));
    setTimeout(() => {
      setIsMenu(false);
    }, 100);
  }

  // button animations
  const uiNavLeftButtonRef = useRef();
  const uiNavRightButtonRef = useRef();
  const uiCloseButtonRef = useRef();
  const [toggleUiNavLeftButtonAnim, setToggleUiNavLeftButtonAnim] =
    useState(null);
  const [toggleUiNavRightButtonAnim, setToggleUiNavRightButtonAnim] =
    useState(null);
  const [toggleUiCloseButtonAnim, setToggleUiCloseButtonAnim] = useState(null);

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
        {pages[pageNum - 1]}

        <div className="absolute -top-[6px] left-0 z-40 w-full h-fit flex justify-center items-center">
          <div className="relative w-fit h-[30px]">
            <div className="absolute top-0 left-0 w-full h-full text-center text-custom-gold font-vt323 font-semibold text-xl">
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

          <div className="w-[50px] text-center text-custom-gold font-vt323">
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
        onClick={handleOnClick}
      ></div>
    </div>
  );
}

export default Menu;
