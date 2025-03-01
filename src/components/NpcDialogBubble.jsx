import { useEffect, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";
import {
  NPC_DIALOG_TEXT_TIME_PER_CHAR,
  NPC_KNIGHT_DIALOG_TUTORIAL_INDEX,
} from "../constants";
import npcDialogBubbleBackground from "../sprites/npc-dialog-bubble.png";
import npcDialogBubbleTail from "../sprites/npc-dialog-bubble-tail.png";
import npcDialogDownwardArrow from "../sprites/npc-dialog-downward-arrow.png";

gsap.registerPlugin(TextPlugin);

const TEST_DIALOG_ARR = [
  "I've led men into battles uglier than a starving wolf, and I've watched too many fools think they were invincible.",
  "So tell me, Traveler—are you here to prove something, or are you here to survive?",
  "Meow.",
];

const NPC_DIALOG_BUBBLE_TAIL_OFFSET_X_SCALE = 50;

function NpcDialogBubble({
  position,
  dialogArr = TEST_DIALOG_ARR,
  toggleDialog,
  setIsDialogTriggered,
  bubbleOffsetX = 0,
  bubbleOffsetY = 0,
  onTutorial = () => {},
}) {
  const selfRef = useRef();
  const textRef = useRef();
  const iconRef = useRef();
  const [areRefsReady, setAreRefsReady] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [isDialogBubbleAnimationFinished, setIsDialogBubbleAnimationFinished] =
    useState(false);
  const [isDialogTextAnimationFinished, setIsDialogTextAnimationFinished] =
    useState(false);

  // ref of div wrapped in Html component is not ready on first render
  useEffect(() => {
    const waitForRef = async () => {
      if (selfRef.current && textRef.current && iconRef.current) {
        setAreRefsReady(true);
      } else {
        requestAnimationFrame(waitForRef);
      }
    };

    waitForRef();
  }, []);

  function handleDialogNext() {
    setDialogIndex((prev) => (prev + 1) % dialogArr.length);
    setIsDialogBubbleAnimationFinished(false);
    setIsDialogTextAnimationFinished(false);
  }

  function handleDialogFastForward() {
    setIsDialogTextAnimationFinished(true);
  }

  function handleDialogEnd() {
    setIsDialogTriggered(false);
  }

  useEffect(() => {
    if (toggleDialog === null) return;
    if (!isDialogBubbleAnimationFinished) return;

    if (isDialogTextAnimationFinished) {
      if (dialogIndex === dialogArr.length - 1) {
        handleDialogEnd();
      } else {
        handleDialogNext();
      }
    } else {
      handleDialogFastForward();
    }
  }, [toggleDialog]);

  // dialog appear anim
  useGSAP(
    () => {
      if (!areRefsReady) return;

      const text = dialogArr[dialogIndex];

      const dialogIconTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        paused: true,
      });

      dialogIconTl.to(iconRef.current, {
        y: 5,
        duration: 0.5,
      });

      const tl = gsap.timeline({ paused: true });

      tl.fromTo(
        selfRef.current,
        {
          opacity: 0,
          scale: 0,
          x: -bubbleOffsetX * NPC_DIALOG_BUBBLE_TAIL_OFFSET_X_SCALE,
          y: 100,
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.5,
          delay: 0.5,
          ease: "power4.out",
        }
      ).call(() => {
        setIsDialogBubbleAnimationFinished(true);
      });

      tl.to(textRef.current, {
        text: text,
        duration: text.length * NPC_DIALOG_TEXT_TIME_PER_CHAR,
        ease: "none",
      })
        .to(iconRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "power4.out",
        })
        .call(() => {
          setIsDialogTextAnimationFinished(true);
          dialogIconTl.play();
        });

      if (isDialogTextAnimationFinished) {
        tl.play(tl.endTime());
        dialogIconTl.play();
      } else {
        tl.play();
      }
    },
    {
      dependencies: [areRefsReady, dialogIndex, isDialogTextAnimationFinished],
      revertOnUpdate: true,
    }
  );

  useEffect(() => {
    if (dialogIndex === NPC_KNIGHT_DIALOG_TUTORIAL_INDEX) {
      onTutorial();
    }
  }, [dialogIndex]);

  return (
    <>
      <Html
        position={[
          position[0] + bubbleOffsetX,
          position[1] + bubbleOffsetY,
          position[2],
        ]}
        sprite
        center
        distanceFactor={15}
        zIndexRange={[0, 0]}
      >
        <div ref={selfRef} className="w-[320px] h-[320px] opacity-0 scale-0">
          <div className="absolute top-[89px] left-0 w-[90%] h-[30%] pl-5 flex justify-center items-center">
            <div
              ref={textRef}
              className="text-sm text-left w-full h-[90%] py-1 text-custom-dark-brown font-synemono"
              style={{
                height:
                  dialogArr[dialogIndex].length > 100
                    ? "90%"
                    : dialogArr[dialogIndex].length > 66
                    ? "70%"
                    : dialogArr[dialogIndex].length > 50
                    ? "50%"
                    : "30%",
              }}
            ></div>
          </div>
          <div
            ref={iconRef}
            className="absolute bottom-[45%] right-[5%] w-[22px] h-[23px] opacity-0"
          >
            <img
              src={npcDialogDownwardArrow}
              alt="npc-dialog-downward-arrow"
              className="h-full aspect-square"
            />
          </div>
          <div className="absolute top-0 left-0 -z-50 w-full h-full opacity-85">
            <img
              src={npcDialogBubbleBackground}
              alt="npc-dialog-bubble"
              className="h-full aspect-square"
            />
          </div>
          <div
            className="absolute top-0 left-0 -z-50 w-full h-full opacity-85"
            style={{
              transform: `translateX(${
                -bubbleOffsetX * NPC_DIALOG_BUBBLE_TAIL_OFFSET_X_SCALE
              }px)`,
            }}
          >
            <img
              src={npcDialogBubbleTail}
              alt="npc-dialog-bubble-tail"
              className="h-full aspect-square"
            />
          </div>
        </div>
      </Html>
    </>
  );
}

export default NpcDialogBubble;
