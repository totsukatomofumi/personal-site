import { useState } from "react";
import { ImagePreview, ScrollControls, Text } from "./components";
import { APP_CONTEXT as AppContext, NUM_SECTIONS } from "../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

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
