import uiInventory from "../sprites/ui-inventory.png";
import { INVENTORY } from "../constants";
import MenuItemDescBox from "./MenuItemDescBox";

function MenuInventory({ setItemDescBox }) {
  return (
    <>
      <div className="relative z-0 w-fit h-full">
        <img src={uiInventory} alt="ui-inventory" className="h-full" />
      </div>

      {INVENTORY.map((inventory, index) => (
        <div
          key={index}
          className="absolute z-50 drop-shadow-[0px_5px_2px_rgba(0,0,0,0.3)]"
          style={{
            top: inventory.position.y,
            left: inventory.position.x,
            width: inventory.scale * 58,
            height: inventory.scale * 58,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setItemDescBox(
              <MenuItemDescBox
                position={{ x: e.clientX, y: e.clientY }}
                description={inventory.description}
              />
            );
          }}
          onMouseMove={(e) => {
            e.stopPropagation();
            setItemDescBox(
              <MenuItemDescBox
                position={{ x: e.clientX, y: e.clientY }}
                description={inventory.description}
              />
            );
          }}
        >
          <img
            src={inventory.img.src}
            alt={inventory.img.alt}
            className="h-full"
          />
        </div>
      ))}
    </>
  );
}

export default MenuInventory;
