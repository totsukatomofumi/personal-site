import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function RotateScreenOverlay() {
  const textRef = useRef();

  // blinking animation
  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(textRef.current, { opacity: 0, duration: 1, ease: "none" });
  }, {});

  return (
    <div className="absolute top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black">
      <div ref={textRef} className="text-custom-white text-2xl font-vt323">
        <p>
          Please rotate your device to portrait mode{" "}
          <i className="fa-solid fa-mobile-screen-button"></i>.
        </p>
      </div>
    </div>
  );
}

export default RotateScreenOverlay;
