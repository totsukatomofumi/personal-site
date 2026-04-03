import { useState } from "react";
import { ImagePreview, ScrollControls, Text } from "./components";
import { APP_CONTEXT as AppContext, NUM_SECTIONS } from "../constants";

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
      src: src,
      alt: alt,
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
    setAnimationsBySection((prevAnimations) => {
      const newAnimations = [...prevAnimations];
      newAnimations[sectionIndex] = [...newAnimations[sectionIndex], animation];
      return newAnimations;
    });
  };

  const removeSectionAnimation = (animation) => {
    setAnimationsBySection((prevAnimations) => {
      const newAnimations = prevAnimations.map((animations) =>
        animations.filter((anim) => anim !== animation),
      );
      return newAnimations;
    });
  };

  contextValue.registerSectionAnimation = registerSectionAnimation;
  contextValue.removeSectionAnimation = removeSectionAnimation;

  // ========================== Render ==========================
  return (
    <AppContext value={contextValue}>
      <ImagePreview {...imagePreview} onClose={closeImagePreview} />
      <Text />
      <ScrollControls animationsBySection={animationsBySection} />
    </AppContext>
  );
}

export default App;
