import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useWindowSize } from "@uidotdev/usehooks";
import { APP_CONTEXT as AppContext, NUM_SECTIONS } from "../constants";
import { ImagePreview, ScrollControls, Text } from "./components";

// ===================== Global GSAP Setup =====================
gsap.defaults({
  lazy: false, // Disable tween lazy render to avoid lazy-queue + revert race (React useGSAP lifecycle timing)
});

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  ignoreMobileResize: true, // Disable automatic refresh on mobile resize to prevent potential performance issues and layout thrashing during orientation changes or dynamic viewport adjustments (e.g. iOS Safari address bar show/hide)
});

gsap.registerPlugin(SplitText);

// ======================= App Component =======================
function App() {
  const contextValue = {};

  // ===================== Responsive Setup =====================
  const { width: windowWidthPx, height: windowHeightPx } = useWindowSize();
  const [mediumFontSizePx, setMediumFontSizePx] = useState(
    parseFloat(getComputedStyle(document.documentElement).fontSize),
  );
  const [rootEmFontSizePx, setRootEmFontSizePx] = useState(
    parseFloat(getComputedStyle(document.documentElement).fontSize),
  );

  useEffect(() => {
    const mediumFontSizeDiv = document.createElement("div");
    mediumFontSizeDiv.style.fontSize = "medium";
    mediumFontSizeDiv.style.position = "absolute";
    mediumFontSizeDiv.style.visibility = "hidden";
    mediumFontSizeDiv.textContent = "M";
    document.body.appendChild(mediumFontSizeDiv);

    const mediumFontSizeDivResizeObserverCallback = () => {
      const mediumFontSizePx = parseFloat(
        getComputedStyle(mediumFontSizeDiv).fontSize,
      );

      setMediumFontSizePx(mediumFontSizePx);
    };

    const mediumFontSizeDivResizeObserver = new ResizeObserver(
      mediumFontSizeDivResizeObserverCallback,
    );
    mediumFontSizeDivResizeObserver.observe(mediumFontSizeDiv);
    mediumFontSizeDivResizeObserverCallback();

    const rootEmFontSizeDiv = document.createElement("div");
    rootEmFontSizeDiv.style.fontSize = "1rem";
    rootEmFontSizeDiv.style.position = "absolute";
    rootEmFontSizeDiv.style.visibility = "hidden";
    rootEmFontSizeDiv.textContent = "M";
    document.body.appendChild(rootEmFontSizeDiv);

    const rootEmFontSizeDivResizeObserverCallback = () => {
      const rootEmFontSizePx = parseFloat(
        getComputedStyle(rootEmFontSizeDiv).fontSize,
      );

      setRootEmFontSizePx(rootEmFontSizePx);
    };

    const rootEmFontSizeDivResizeObserver = new ResizeObserver(
      rootEmFontSizeDivResizeObserverCallback,
    );
    rootEmFontSizeDivResizeObserver.observe(rootEmFontSizeDiv);
    rootEmFontSizeDivResizeObserverCallback();

    return () => {
      mediumFontSizeDivResizeObserver.disconnect();
      document.body.removeChild(mediumFontSizeDiv);

      rootEmFontSizeDivResizeObserver.disconnect();
      document.body.removeChild(rootEmFontSizeDiv);
    };
  }, []);

  contextValue.windowWidthPx = windowWidthPx;
  contextValue.windowHeightPx = windowHeightPx;
  contextValue.mediumFontSizePx = mediumFontSizePx;
  contextValue.rootEmFontSizePx = rootEmFontSizePx;

  // ====================== Image Preview =======================
  const [imagePreview, setImagePreview] = useState({
    open: false,
    src: null,
    alt: "",
  });

  const openImagePreview = (src, alt) => {
    setImagePreview({
      open: true,
      src,
      alt,
    });
  };

  const closeImagePreview = () => {
    setImagePreview({
      ...imagePreview,
      open: false,
    });
  };

  contextValue.openImagePreview = openImagePreview;
  contextValue.closeImagePreview = closeImagePreview;

  // ==================== Section Animations ====================
  const [animationsBySection, setAnimationsBySection] = useState(
    Array.from({ length: NUM_SECTIONS }, () => []),
  );

  const registerSectionAnimation = (animation, sectionIndex) => {
    setAnimationsBySection((prevAnimationsBySection) => {
      const newAnimationsBySection = [...prevAnimationsBySection];
      newAnimationsBySection[sectionIndex] = [
        ...newAnimationsBySection[sectionIndex],
        animation,
      ];
      return newAnimationsBySection;
    });
  };

  const removeSectionAnimation = (animation) => {
    setAnimationsBySection((prevAnimationsBySection) => {
      const newAnimationsBySection = prevAnimationsBySection.map(
        (sectionAnimations) =>
          sectionAnimations.filter(
            (sectionAnimation) => sectionAnimation !== animation,
          ),
      );
      return newAnimationsBySection;
    });
  };

  contextValue.registerSectionAnimation = registerSectionAnimation;
  contextValue.removeSectionAnimation = removeSectionAnimation;

  // ========================== Render ==========================
  return (
    <AppContext value={contextValue}>
      {/* ==================== App Core ==================== */}
      <ScrollControls
        animationsBySection={animationsBySection}
        isImagePreviewOpen={imagePreview.open}
      />
      <ImagePreview {...imagePreview} onClose={closeImagePreview} />

      {/* =================== App Content ================== */}
      <Text />
    </AppContext>
  );
}

export default App;
