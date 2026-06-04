import { Html } from "@react-three/drei";

function Overlay({
  numItems,
  pathLength,
  minPathLength,
  maxPathLength,
  numPoints,
  setNumPoints,
  speed,
  setSpeed,
  isExpand,
  setIsExpand,
  onCopyToClipboard,
}) {
  // ============================== Render ==============================
  return (
    <Html fullscreen className="h-fit! w-fit! text-nowrap">
      {/* ========================== Info ========================== */}
      {/* Number of Items */}
      <div>{`numItems: ${numItems}`}</div>

      {/* Path Length */}
      <div>{`pathLength: ${pathLength.toFixed(2)}`}</div>

      {/* Minimum Path Length */}
      <div>{`minPathLength: ${minPathLength.toFixed(2)}`}</div>

      {/* Maximum Path Length */}
      <div>{`maxPathLength: ${maxPathLength.toFixed(2)}`}</div>

      {/* ======================== Controls ======================== */}
      {/* Number of Points */}
      <div>
        {`numPoints: ${numPoints}`}
        <div className="flex flex-row gap-2">
          <button
            className="cursor-pointer rounded bg-gray-500 px-2"
            onClick={() => setNumPoints((prev) => Math.min(prev + 1, 10))}
          >
            +
          </button>
          <button
            className="cursor-pointer rounded bg-gray-500 px-2"
            onClick={() => setNumPoints((prev) => Math.max(prev - 1, 2))}
          >
            -
          </button>
          <input
            type="range"
            min="2"
            max="10"
            step="1"
            value={numPoints}
            onChange={(e) => setNumPoints(parseInt(e.target.value))}
          />
        </div>
      </div>

      {/* Speed */}
      <div>
        {`speed: ${speed.toFixed(2)}`}
        <div className="flex flex-row gap-2">
          <button
            className="cursor-pointer rounded bg-gray-500 px-2"
            onClick={() => setSpeed((prev) => Math.min(prev + 0.01, 1))}
          >
            +
          </button>
          <button
            className="cursor-pointer rounded bg-gray-500 px-2"
            onClick={() => setSpeed((prev) => Math.max(prev - 0.01, -1))}
          >
            -
          </button>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {/* ========================= Utility ======================== */}
      {/* Expand View */}
      <div>
        <button
          className="mt-2 cursor-pointer rounded bg-gray-500 px-2"
          onClick={() => setIsExpand((prev) => !prev)}
        >
          {isExpand ? "Revert View" : "Expand View"}
        </button>
      </div>

      {/* Copy to Clipboard */}
      <div>
        <button
          className="mt-2 cursor-pointer rounded bg-gray-500 px-2"
          onClick={onCopyToClipboard}
        >
          Copy to Clipboard
        </button>
      </div>
    </Html>
  );
}

export default Overlay;
