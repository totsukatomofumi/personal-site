import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { NPC_DIALOG_TRIGGER_ELAPSED_TIME } from "../constants";

const RADIUS = 10;
const STROKE_WIDTH = 5;
const CIRCUMFERENCE = Math.PI * 2 * RADIUS;
const STROKE_COLOR = "#f1f431";

function NpcDialogTriggerProgress({
  dialogTriggerElapsedTime,
  isDialogTriggered,
  isRepeatTrigger,
  dialogPos,
}) {
  const [progress, setProgress] = useState(0);
  const elapsedTime = useRef(0);

  useFrame((delta) => {
    if (elapsedTime.current < 0.1) {
      // because set state is expensive
      elapsedTime.current += delta;
      return;
    }
    elapsedTime.current = 0;

    if (isDialogTriggered) {
      setProgress(0);
      return;
    }
    if (isRepeatTrigger?.current) return;

    setProgress(
      Math.min(
        NPC_DIALOG_TRIGGER_ELAPSED_TIME,
        dialogTriggerElapsedTime.current
      ) / NPC_DIALOG_TRIGGER_ELAPSED_TIME
    );
  });

  return (
    <Html position={[0.3, dialogPos[1] + 0.4, 0]}>
      <div
        className="-rotate-90 -translate-x-1/2 translate-y-1/2"
        style={{ opacity: progress > 0 ? 1 : 0 }}
      >
        <svg width="60" height="60">
          <circle
            stroke-linecap="round"
            cx="30"
            cy="30"
            r={RADIUS}
            stroke="black"
            stroke-width={STROKE_WIDTH}
            fill="none"
          />
          <circle
            cx="30"
            cy="30"
            r={RADIUS}
            stroke={STROKE_COLOR}
            stroke-width={STROKE_WIDTH}
            fill="none"
            stroke-dasharray={CIRCUMFERENCE}
            stroke-dashoffset={CIRCUMFERENCE - CIRCUMFERENCE * progress}
          />
        </svg>
      </div>
    </Html>
  );
}

export default NpcDialogTriggerProgress;
