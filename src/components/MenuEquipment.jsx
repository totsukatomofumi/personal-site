import uiEquipment from "../sprites/ui-equipment.png";
import nusSword from "../sprites/nus-sword.png";
import rsChestplate from "../sprites/rs-chestplate.png";
import {
  AGE,
  NAME,
  NUS_SWORD_DESC,
  OCCUPATION,
  RS_CHESTPLATE_DESC,
} from "../constants";
import MenuItemDescBox from "./MenuItemDescBox";

function MenuEquipment({ setItemDescBox }) {
  function handleOnClickNusSword(e) {
    e.stopPropagation();
    setItemDescBox(
      <MenuItemDescBox
        position={{ x: e.clientX, y: e.clientY }}
        description={NUS_SWORD_DESC}
      />
    );
  }

  function handleOnClickRsChestplate(e) {
    e.stopPropagation();
    setItemDescBox(
      <MenuItemDescBox
        position={{ x: e.clientX, y: e.clientY }}
        description={RS_CHESTPLATE_DESC}
      />
    );
  }

  return (
    <>
      <div className="absolute top-[50px] left-[22.5px] z-50 px-1 text-xs text-left font-synemono text-custom-off-white whitespace-pre-line leading-snug">
        <p className="text-custom-white text-base font-bold leading-tight">
          {NAME}
        </p>
        <p>{OCCUPATION}</p>
        <p className="text-custom-gold">
          Level: <span className="text-custom-off-white">{AGE}</span>
        </p>
      </div>

      <div className="relative z-0 w-fit h-full">
        <img src={uiEquipment} alt="ui-equipment" className="h-full" />
      </div>
      <div
        className="absolute top-[130px] left-[25px] z-50 w-[60px] h-[60px] flex justify-center items-center"
        onClick={handleOnClickNusSword}
      >
        <img src={nusSword} alt="nus-sword" className="h-full" />
      </div>
      <div
        className="absolute top-[235px] right-[25px] z-50 w-[60px] h-[60px] flex justify-center items-center"
        onClick={handleOnClickRsChestplate}
      >
        <img src={rsChestplate} alt="rs-chestplate" className="h-full" />
      </div>
      {/* <MenuItemDescBox position={{ x: 25, y: 20 }} /> */}
    </>
  );
}

export default MenuEquipment;
