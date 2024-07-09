import { useState } from "react";
import Grid from "./Grid";
import Box from "./Box";
import Arrows from "./Arrows";

function Body() {
  const [boxWidth, setBoxWidth] = useState(0);
  const numBoxesCentered = 4; // TODO: change on resize
  const horizontalMargin = `calc((100vw - (${boxWidth}px + 0.75rem) * ${numBoxesCentered} - 0.75rem) / 2)`;

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full overflow-x-scroll scroll-container no-scrollbar">
        <div
          className="absolute bottom-8 w-fit h-[calc(100%-2rem-6rem)]"
          style={{
            paddingLeft: horizontalMargin,
            paddingRight: horizontalMargin,
          }}
        >
          <Grid boxComponent={<Box setBoxWidth={setBoxWidth} />} />
        </div>
      </div>

      <Arrows />
    </div>
  );
}

export default Body;
