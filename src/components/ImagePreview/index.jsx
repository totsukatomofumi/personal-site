import { useContext, useEffect, useRef } from "react";
import { APP_CONTEXT as AppContext } from "../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function ImagePreview({ src, alt, className }) {
  const appContext = useContext(AppContext);
  const selfRef = useRef();
  const closeButtonRef = useRef();

  // Enable/Disable background scrolling whether preview is open/close (mount/unmount)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // GSAP Animations
  useGSAP((_, contextSafe) => {
    const duration = 0.15;

    gsap.from(selfRef.current, {
      opacity: 0,
      duration: duration,
    });

    const onClose = contextSafe(() => {
      gsap.to(selfRef.current, {
        opacity: 0,
        duration: duration,
        onComplete: () => {
          appContext.closeImagePreview();
        },
      });
    });

    selfRef.current.addEventListener(
      "click",
      (e) => e.target === selfRef.current && onClose()
    ); // Close preview when clicking on backdrop
    closeButtonRef.current.addEventListener("click", onClose); // Close preview when clicking on close button

    return () => {
      selfRef.current.removeEventListener("click", onClose);
      closeButtonRef.current.removeEventListener("click", onClose);
    };
  });

  return (
    <dialog
      ref={selfRef}
      open
      className={`fixed top-0 left-0 z-50 w-screen h-screen bg-transparent backdrop-blur-xs backdrop-brightness-75 flex justify-center items-center p-6 ${
        className || ""
      }`}
      onScroll={(e) => console.log(e)}
    >
      <img src={src} alt={alt} />
      <div className="absolute top-3 right-3 z-50">
        <button
          className="w-12 h-12 flex hover:border-b-2 active:border-b-6 transition-[border] cursor-pointer"
          ref={closeButtonRef}
        >
          <FontAwesomeIcon icon={faXmark} size="lg" className="m-auto" />
        </button>
      </div>
    </dialog>
  );
}

export default ImagePreview;
