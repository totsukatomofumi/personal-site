import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import staticBackground from "../../assets/images/tex1_128x128_94107e9822b8aafc_0.png";
import staticOverlay from "../../assets/images/background.png";

function Box({ setBoxWidth }) {
  const isResize = useWindowSize(); // use to listen resize
  const selfRef = useRef();
  const backgroundRef = useRef();
  const overlayRef = useRef();
  const midlayRef = useRef();
  const outlineAnimatedRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  // scale on hover
  useGSAP(
    () => {
      if (isHovered) {
        gsap.to(outlineAnimatedRef.current, {
          opacity: 1,
          duration: 0.1,
        });
      } else {
        gsap.fromTo(
          outlineAnimatedRef.current,
          { opacity: 1 },
          {
            scaleX: 0.9,
            scaleY: 0.95,
            opacity: 0,
            duration: 0.5,
          }
        );
      }
    },
    { dependencies: [isHovered], revertOnUpdate: true }
  );

  // tell Body component the width of the box for centering
  useEffect(() => {
    setBoxWidth(selfRef.current.offsetWidth);
  }, [isResize]);

  // animation on box static overlay and midlay
  useGSAP(() => {
    gsap.to(overlayRef.current, {
      y: "-50%",
      duration: 40,
      ease: "none",
      repeat: -1,
      yoyo: false,
    });

    gsap.to(midlayRef.current, {
      y: "-50%",
      duration: 10,
      ease: "none",
      repeat: -1,
      yoyo: false,
    });

    function getRandomPos() {
      gsap.set(backgroundRef.current, {
        x: `-${Math.random() * 66}%`,
        y: `-${Math.random() * 66}%`,
      });
    }

    gsap.ticker.add(getRandomPos);
  });

  return (
    <div
      className="relative aspect-[1.85/1] h-full rounded-3xl overflow-hidden bg-custom-white z-0"
      ref={selfRef}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div
        className="absolute top-0 left-0 z-50 h-full w-full rounded-3xl border-4 border-custom-blue pacity-0 shadow-[0_0_60px_rgba(71,212,255,0.3)]"
        ref={outlineAnimatedRef}
      ></div>
      <div className="absolute top-0 left-0 z-40 h-full w-full rounded-3xl border-4 border-custom-grey"></div>
      <div
        className="absolute top-0 left-0 -z-50 h-[300%] w-[300%] opacity-35"
        ref={backgroundRef}
        style={{
          backgroundImage: `url(${staticBackground})`,
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
        }} // Set the background image
      ></div>
      <div
        className="absolute top-0 left-0 z-30 h-[200%] w-full opacity-60"
        ref={overlayRef}
        style={{
          backgroundImage: `url(${staticOverlay})`,
          backgroundRepeat: "repeatY",
        }} // Set the background image
      ></div>

      <div
        className="absolute top-0 left-0 z-20 h-[400%] w-full opacity-95 flex flex-col justify-around"
        ref={midlayRef}
      >
        <div className="w-full h-10 bg-custom-white blur-md"></div>
        <div className="w-full h-10 bg-custom-black blur-2xl"></div>
        <div className="w-full h-10 bg-custom-white blur-md"></div>
        <div className="w-full h-10 bg-custom-white blur-md"></div>
        <div className="w-full h-10 bg-custom-white blur-md"></div>
        <div className="w-full h-10 bg-custom-black blur-2xl"></div>
        <div className="w-full h-10 bg-custom-white blur-md"></div>
        <div className="w-full h-10 bg-custom-white blur-md"></div>
      </div>
    </div>
  );
}

export default Box;
