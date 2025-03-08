import uiEquipment from "../sprites/ui-equipment.png";
import nusSword from "../sprites/nus-sword.png";
import rsChestplate from "../sprites/rs-chestplate.png";
import { AGE, NAME, OCCUPATION } from "../constants";
import MenuItemDescBox from "./MenuItemDescBox";

function MenuEquipment({ setItemDescBox }) {
  function handleOnClickNusSword(e) {
    e.stopPropagation();
    setItemDescBox(
      <MenuItemDescBox position={{ x: e.clientX, y: e.clientY }} />
    );
  }

  function handleOnClickRsChestplate(e) {
    e.stopPropagation();
    setItemDescBox(
      <MenuItemDescBox position={{ x: e.clientX, y: e.clientY }} />
    );
  }

function MenuEquipment() {
  return (
    <>
      <div className="absolute top-[52.5px] left-[22.5px] z-50 px-1 flex flex-col justify-center items-center text-xs text-left font-synemono text-custom-off-white whitespace-pre-line leading-snug">
        <p>
          <span className="text-custom-white text-base font-bold leading-none">
            {NAME}
          </span>
          {`\n`}
          {OCCUPATION}
          <span className="text-custom-gold">{`\nLevel: `}</span>
          {AGE}
        </p>
      </div>

      <div className="relative z-0 w-fit h-full">
        <img src={uiEquipment} alt="ui-equipment" className="h-full" />
      </div>
    </>
  );
}

export default MenuEquipment;
