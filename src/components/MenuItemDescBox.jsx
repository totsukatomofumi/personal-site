import { useEffect, useRef, useState } from "react";
import {
  MENU_ITEM_DESC_BOX_DEFAULT_HEIGHT,
  MENU_ITEM_DESC_BOX_DEFAULT_WIDTH,
  MENU_ITEM_DESC_BOX_EDGE_PADDING,
} from "../constants";

function MenuItemDescBox({ position, description }) {
  const selfRef = useRef();
  const [boxWidth, setBoxWidth] = useState(MENU_ITEM_DESC_BOX_DEFAULT_WIDTH);
  const [boxHeight, setBoxHeight] = useState(MENU_ITEM_DESC_BOX_DEFAULT_HEIGHT);
  const [toggleVerticalResize, setToggleVerticalResize] = useState(false); // toggle vertical resize after fit-content
  const divider = (
    <div className="w-full h-[1px] my-2 bg-custom-gold opacity-30" />
  );
  const isRenderRightSide =
    position.x < document.documentElement.clientWidth / 2;

  useEffect(() => {
    if (isRenderRightSide) {
      setBoxWidth(
        Math.min(
          document.documentElement.clientWidth -
            position.x -
            MENU_ITEM_DESC_BOX_EDGE_PADDING,
          MENU_ITEM_DESC_BOX_DEFAULT_WIDTH
        )
      );
    } else {
      setBoxWidth(
        Math.min(
          position.x - MENU_ITEM_DESC_BOX_EDGE_PADDING,
          MENU_ITEM_DESC_BOX_DEFAULT_WIDTH
        )
      );
    }
  }, [selfRef, position, isRenderRightSide]);

  useEffect(() => {
    setBoxHeight(MENU_ITEM_DESC_BOX_DEFAULT_HEIGHT);
    setToggleVerticalResize((prev) => !prev);
  }, [selfRef, position]);

  useEffect(() => {
    if (boxHeight !== MENU_ITEM_DESC_BOX_DEFAULT_HEIGHT) return;

    if (
      selfRef.current.offsetHeight + position.y >
      document.documentElement.clientHeight - MENU_ITEM_DESC_BOX_EDGE_PADDING
    ) {
      setBoxHeight(
        document.documentElement.clientHeight -
          position.y -
          MENU_ITEM_DESC_BOX_EDGE_PADDING
      );
      return;
    }
  }, [selfRef, toggleVerticalResize]);

  return (
    <div
      ref={selfRef}
      className="fixed z-50 p-2 bg-black border-[1px] border-custom-gold bg-opacity-70 font-synemono text-custom-off-white overflow-y-auto overflow-x-hidden"
      style={
        isRenderRightSide
          ? {
              top: position.y,
              left: position.x,
              width: boxWidth,
              height: boxHeight,
            }
          : {
              top: position.y,
              right: document.documentElement.clientWidth - position.x,
              width: boxWidth,
              height: boxHeight,
            }
      }
      onClick={(e) => e.stopPropagation()}
    >
      {/* corner icon */}
      <div
        className="absolute top-[2px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-custom-gold"
        style={
          isRenderRightSide
            ? { left: -1, rotate: "-45deg" }
            : { right: -1, rotate: "45deg" }
        }
      />

      {/* title */}
      <p className="text-center text-custom-white font-semibold">
        {description["name"]}
      </p>
      {/* attributes */}
      {description["attributes"] && divider}
      {description["attributes"] &&
        description["attributes"].map((attr, key) => {
          return (
            <div className="text-sm" key={key}>
              <p>
                <span className="text-custom-gold">{attr[0]}</span>
                {attr[1]}
              </p>
            </div>
          );
        })}
      {/* desc */}
      {divider}
      <div className="text-xs">
        {description["description"].map((desc, index) => {
          return (
            <div key={index}>
              <p>{desc}</p>
              {index !== description["description"].length - 1 && <br />}
            </div>
          );
        })}
      </div>
      {/* additional */}
      {description["additional"] && divider}
      {description["additional"] && (
        <div className="text-xs">
          <p className="text-custom-gold">{description["additional"][0]}</p>
          {description["additional"][1].map((add, key) => {
            return <p key={key}>{add}</p>;
          })}
        </div>
      )}
      {/* link */}
      {description["link"] && divider}
      {description["link"] && (
        <a href={description["link"][1]} target="_blank" rel="noreferrer">
          <p className="text-xs text-custom-gold underline">
            {description["link"][0]}
          </p>
        </a>
      )}
    </div>
  );
}

export default MenuItemDescBox;
