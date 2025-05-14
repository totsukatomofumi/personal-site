import uiEquipment from "../sprites/ui-equipment.png";
import { AGE, EQUIPMENT, NAME, OCCUPATION } from "../constants";
import MenuItemDescBox from "./MenuItemDescBox";

function MenuEquipment({ setItemDescBox }) {
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

      {EQUIPMENT.map((equipment, index) => (
        <div
          key={index}
          className="absolute z-50 drop-shadow-[0px_5px_2px_rgba(0,0,0,0.3)]"
          style={{
            top: equipment.position.y,
            left: equipment.position.x,
            width: equipment.scale * 58,
            height: equipment.scale * 58,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setItemDescBox(
              <MenuItemDescBox
                position={{ x: e.clientX, y: e.clientY }}
                description={equipment.description}
              />
            );
          }}
          onMouseMove={(e) => {
            e.stopPropagation();
            setItemDescBox(
              <MenuItemDescBox
                position={{ x: e.clientX, y: e.clientY }}
                description={equipment.description}
              />
            );
          }}
        >
          <img
            src={equipment.img.src}
            alt={equipment.img.alt}
            className="h-full"
          />
        </div>
      ))}
    </>
  );
}

export default MenuEquipment;
