import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useWindowSize } from "@uidotdev/usehooks";

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

  // ======================= Responsive Image Sizing ======================
  const [rootEm, setRootEm] = useState(16);
  const { width } = useWindowSize();

  useEffect(() => {
    const rootEmDiv = document.createElement("div");
    rootEmDiv.style.fontSize = "1rem";
    rootEmDiv.style.position = "absolute";
    rootEmDiv.style.visibility = "hidden";

    document.body.appendChild(rootEmDiv);

    let requestId;

    const callback = () => {
      const rootEmFontSize = parseFloat(getComputedStyle(rootEmDiv).fontSize);

      setRootEm(rootEmFontSize);

      requestId = requestAnimationFrame(callback);
    };

    requestId = requestAnimationFrame(callback);

    return () => {
      cancelAnimationFrame(requestId);
      document.body.removeChild(rootEmDiv);
    };
  }, []);

  const scale = Math.min(
    Math.max((width - 37.5 * rootEm) / (96 * rootEm - 37.5 * rootEm), 0),
    1,
  );

  // =============================== Render ===============================
  return (
    <dialog
      ref={selfRef}
      open={open}
      className="invisible fixed top-0 left-0 z-50 flex h-dvh w-full items-center justify-center bg-transparent opacity-0 backdrop-blur-xs backdrop-brightness-50"
      style={{
        paddingInline: `calc(${scale} * (15vw - 1.5rem) + 1.5rem)`,
        paddingBlock: `calc(${scale} * (15vh - 1.5rem) + 1.5rem)`,
      }}
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
      <img className="max-h-full max-w-full" src={src} alt={alt} />
    </dialog>
  );
}

export default ImagePreview;
