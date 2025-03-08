import uiEquipment from "../sprites/ui-equipment.png";
import { AGE, OCCUPATION } from "../constants";

function MenuEquipment() {
  return (
    <>
      <div className="absolute top-[52.5px] left-[22.5px] z-50 px-1 flex flex-col justify-center items-center text-xs text-left font-synemono text-custom-off-white whitespace-pre-line leading-snug drop-shadow-[5px_5px_1px_rgba(0,0,0,0.25)]">
        <p>
          <span className="text-custom-white text-base font-bold leading-none">
            Totsuka Tomofumi
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
