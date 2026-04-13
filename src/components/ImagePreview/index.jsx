import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function ImagePreview({ open, onClose, src, alt }) {
  const selfRef = useRef();

  // ======================== Open/Close Animation ========================
  useGSAP(
    () => {
      const duration = 0.15; // TailwindCSS default transition duration

      if (open) {
        gsap.to(selfRef.current, {
          autoAlpha: 1,
          duration: duration,
        });
      } else {
        gsap.to(selfRef.current, {
          autoAlpha: 0,
          duration: duration,
        });
      }
    },
    {
      dependencies: [open],
    },
  );

  // =============================== Render ===============================
  return (
    <dialog
      ref={selfRef}
      open={open}
      className="invisible fixed top-0 left-0 z-50 flex h-dvh w-full items-center justify-center bg-transparent p-6 opacity-0 backdrop-blur-xs backdrop-brightness-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ======================== Close Button ====================== */}
      <div className="absolute top-3 right-3 z-50">
        <button
          className="flex h-12 w-12 cursor-pointer transition-[border] hover:border-b-2 active:border-b-6"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} size="lg" className="m-auto" />
        </button>
      </div>

      {/* =========================== Image =========================== */}
      <img
        className="max-h-full max-w-full lg:max-h-[70%] lg:max-w-[70%]"
        src={src}
        alt={alt}
      />
    </dialog>
  );
}

export default ImagePreview;
