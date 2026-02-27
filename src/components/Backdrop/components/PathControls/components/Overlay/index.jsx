import { Html } from "@react-three/drei";

function Overlay({
  repeat,
  minLength,
  maxLength,
  currLength,
  numPoints,
  setNumPoints,
  speed,
  setSpeed,
  isExpand,
  onExpandToggle,
  onPathCopyToClipboard,
  ...props
}) {
  return (
    <Html {...props}>
      <div className="text-nowrap">
        {/* ====================== Info ====================== */}
        <div>{`repeat: ${repeat}`}</div>
        <div>{`minLength = ${minLength.toFixed(2)}`}</div>
        <div>{`maxLength = ${maxLength.toFixed(2)}`}</div>
        <div>{`currLength = ${currLength.toFixed(2)}`}</div>

        {/* ==================== Controls ==================== */}
        <div>
          {`numPoints: ${numPoints}`}
          <div className="flex flex-row gap-2">
            <button
              className="cursor-pointer bg-gray-500 rounded px-2"
              onClick={() => setNumPoints((prev) => Math.min(prev + 1, 10))}
            >
              +
            </button>
            <button
              className="cursor-pointer bg-gray-500 rounded px-2"
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
        <div>
          {`speed: ${speed.toFixed(2)}`}
          <div className="flex flex-row gap-2">
            <button
              className="cursor-pointer bg-gray-500 rounded px-2"
              onClick={() => setSpeed((prev) => Math.min(prev + 0.01, 1))}
            >
              +
            </button>
            <button
              className="cursor-pointer bg-gray-500 rounded px-2"
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
        {/* ===================== Utility ==================== */}
        <div>
          <button
            className="cursor-pointer bg-gray-500 rounded px-2 mt-2"
            onClick={onExpandToggle}
          >
            {isExpand ? "Revert View" : "Expand View"}
          </button>
        </div>
        <div>
          <button
            className="cursor-pointer bg-gray-500 rounded px-2 mt-2"
            onClick={onPathCopyToClipboard}
          >
            Copy Path to Clipboard
          </button>
        </div>
      </div>
    </Html>
  );
}

export default Overlay;
