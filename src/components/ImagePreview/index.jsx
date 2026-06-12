import { useContext, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { APP_CONTEXT as AppContext } from "../../../constants";

function ImagePreview({ open, onClose, src, alt }) {
  const selfRef = useRef();
  const appContext = useContext(AppContext);

  // ======================== Open/Close Animation ========================
  useGSAP(
    () => {
      gsap.to(selfRef.current, {
        autoAlpha: open ? 1 : 0,
        duration: 0.15, // TailwindCSS default transition duration
      });
    },
    {
      dependencies: [open],
    },
  );

  // ======================= Responsive Scaling ======================
  const { windowWidthPx, rootEmFontSizePx } = appContext;

  const scale = Math.min(
    Math.max(
      (windowWidthPx - 37.5 * rootEmFontSizePx) /
        (96 * rootEmFontSizePx - 37.5 * rootEmFontSizePx),
      0,
    ),
    1,
  ); // Scale from 0 to 1 as window width increases from the Text document's maximum width including parent padding (36rem / 576px) to the 2xl breakpoint (96rem / 1536px)

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
