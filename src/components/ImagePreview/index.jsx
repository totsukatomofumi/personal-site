import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function ImagePreview({ open, onClose, src, alt, className }) {
  const selfRef = useRef();

  useGSAP(
    () => {
      const duration = 0.15; // TailwindCSS transition duration

      console.log("ImagePreview open:", open);

      switch (open) {
        case true:
          gsap.to(selfRef.current, {
            autoAlpha: 1,
            duration: duration,
          });
          break;
        case false:
          gsap.to(selfRef.current, {
            autoAlpha: 0,
            duration: duration,
          });
          break;
        default:
          break;
      }
    },
    {
      dependencies: [open],
    }
  );

  return (
    <dialog
      ref={selfRef}
      open={open}
      className={`invisible fixed top-0 left-0 z-50 w-screen h-screen bg-transparent backdrop-blur-xs backdrop-brightness-75 flex justify-center items-center p-6 ${
        className || ""
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <img src={src} alt={alt} />
      <div className="absolute top-3 right-3 z-50">
        <button
          className="w-12 h-12 flex hover:border-b-2 active:border-b-6 transition-[border] cursor-pointer"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} size="lg" className="m-auto" />
        </button>
      </div>
    </dialog>
  );
}

export default ImagePreview;
