import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import { Text, ImagePreview } from "./components/";
import { NUM_SECTIONS, APP_CONTEXT as AppContext } from "../constants";

gsap.registerPlugin(Observer);

function App() {
  // ========================== Setup ===========================
  // Section animations states
  const currentSectionIndexRef = useRef(0);
  const sectionAnimationsRef = useRef(
    Array.from({ length: NUM_SECTIONS }, () => [])
  );
  const isAnimatingRef = useRef(false);

  // Image preview state
  const [imagePreview, setImagePreview] = useState(null);

  // ====================== Context Setup =======================
  const registerSectionAnimation = (animation, index) => {
    // At the current section, we set all previous section animations to completed state
    if (index < currentSectionIndexRef.current) {
      animation.progress(1);
    }

    // Register the animation
    sectionAnimationsRef.current[index].push(animation);
  };

  const removeSectionAnimation = (animation) => {
    // Remove the animation
    sectionAnimationsRef.current.forEach((animations) => {
      const animationIndex = animations.indexOf(animation);
      if (animationIndex !== -1) {
        animations.splice(animationIndex, 1);
      }
    });
  };

  const openImagePreview = (src, alt) => {
    setImagePreview({
      src: src,
      alt: alt,
    });
  };

  const closeImagePreview = () => {
    setImagePreview(null);
  };

  const contextValue = {
    registerSectionAnimation,
    removeSectionAnimation,
    openImagePreview,
    closeImagePreview,
  };

  // ====================== Observer Setup ======================
  useGSAP(() => {
    const onUp = () => {
      const currentIndex = currentSectionIndexRef.current;
      const nextIndex = currentIndex + 1;

      if (currentIndex >= NUM_SECTIONS - 1) return; // Already at last section

      if (isAnimatingRef.current) return; // Still animating
      isAnimatingRef.current = true;

      currentSectionIndexRef.current = nextIndex; // Update section index

      const currentAnimations = sectionAnimationsRef.current[currentIndex];

      const timeoutDelay =
        Math.max(
          ...currentAnimations.map((animation) => animation.duration() * 1000)
        ) + 1000; // Add 1 second buffer

      Promise.race([
        Promise.all(
          currentAnimations.map((animation) => animation.play().then())
        ),
        new Promise(
          (resolve) => setTimeout(() => resolve(), timeoutDelay) // Fallback timeout in case animations are killed/reverted from removeSectionAnimation
        ),
      ]).then(() => {
        isAnimatingRef.current = false;
      });
    };

    const onDown = () => {
      const currentIndex = currentSectionIndexRef.current;
      const previousIndex = currentIndex - 1;

      if (currentIndex <= 0) return; // Already at first section

      if (isAnimatingRef.current) return; // Still animating
      isAnimatingRef.current = true;

      currentSectionIndexRef.current = previousIndex; // Update section index

      const previousAnimations = sectionAnimationsRef.current[previousIndex];

      const timeoutDelay =
        Math.max(
          ...previousAnimations.map((animation) => animation.duration() * 1000)
        ) + 1000; // Add 1 second buffer

      Promise.race([
        Promise.all(
          previousAnimations.map((animation) => animation.reverse().then())
        ),
        new Promise(
          (resolve) => setTimeout(() => resolve(), timeoutDelay) // Fallback timeout in case animations are killed/reverted from removeSectionAnimation
        ),
      ]).then(() => {
        isAnimatingRef.current = false;
      });
    };

    Observer.create({
      type: "wheel,touch",
      onUp,
      onDown,
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      ignore: ".deadzone",
    });
  });

  // ========================== Render ==========================
  return (
    <AppContext value={contextValue}>
      <Text className="fixed top-0 left-0 z-40 w-screen h-screen" />
      <ImagePreview
        className="deadzone"
        open={!!imagePreview}
        src={imagePreview?.src}
        alt={imagePreview?.alt}
        onClose={closeImagePreview}
      />
    </AppContext>
  );
}

export default App;
