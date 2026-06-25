import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useMediaQuery, useWindowSize } from "@uidotdev/usehooks";
import { Analytics } from "@vercel/analytics/react";
import { APP_CONTEXT as AppContext, NUM_SECTIONS } from "../constants";
import { Background, ImagePreview, ScrollControls, Text } from "./components";

// ===================== Global GSAP Setup =====================
gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  ignoreMobileResize: true, // Disable automatic refresh on mobile resize to prevent potential performance issues and layout thrashing during orientation changes or dynamic viewport adjustments (e.g. iOS Safari address bar show/hide)
});

// ======================= App Component =======================
function App() {
  const contextValue = {};

  // ===================== Responsive Setup =====================
  const { width: dynamicViewportWidthPx, height: dynamicViewportHeightPx } =
    useWindowSize();
  const [largeViewportHeightPx, setLargeViewportHeightPx] = useState(
    dynamicViewportHeightPx,
  );

  useEffect(() => {
    const largeViewportHeightDiv = document.createElement("div");
    largeViewportHeightDiv.style.position = "absolute";
    largeViewportHeightDiv.style.visibility = "hidden";
    largeViewportHeightDiv.style.width = 0;
    largeViewportHeightDiv.style.height = "100lvh";
    document.body.appendChild(largeViewportHeightDiv);

    const largeViewportHeightDivResizeObserverCallback = () => {
      const largeViewportHeightPx = parseFloat(
        getComputedStyle(largeViewportHeightDiv).height,
      );

      setLargeViewportHeightPx(largeViewportHeightPx);
    };

    const largeViewportHeightDivResizeObserver = new ResizeObserver(
      largeViewportHeightDivResizeObserverCallback,
    );
    largeViewportHeightDivResizeObserver.observe(largeViewportHeightDiv);
    largeViewportHeightDivResizeObserverCallback();

    return () => {
      largeViewportHeightDivResizeObserver.disconnect();
      document.body.removeChild(largeViewportHeightDiv);
    };
  }, []);

  contextValue.dynamicViewportWidthPx = dynamicViewportWidthPx;
  contextValue.largeViewportHeightPx = largeViewportHeightPx;

  const [rootEmFontSizePx, setRootEmFontSizePx] = useState(
    parseFloat(getComputedStyle(document.documentElement).fontSize),
  );

  useEffect(() => {
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
      rootEmFontSizeDivResizeObserver.disconnect();
      document.body.removeChild(rootEmFontSizeDiv);
    };
  }, []);

  contextValue.rootEmFontSizePx = rootEmFontSizePx;

  const isDark = useMediaQuery("(prefers-color-scheme: dark)");

  const canvasTextColor = useMemo(() => {
    const el = document.createElement("div");
    el.style.color = "CanvasText";
    el.style.position = "absolute";
    el.style.visibility = "hidden";

    document.body.appendChild(el);

    const canvasTextColor = getComputedStyle(el).color;
    document.body.removeChild(el);

    return canvasTextColor;
  }, [isDark]);

  const canvasColor = useMemo(() => {
    const el = document.createElement("div");
    el.style.color = "Canvas";
    el.style.position = "absolute";
    el.style.visibility = "hidden";

    document.body.appendChild(el);

    const canvasColor = getComputedStyle(el).color;
    document.body.removeChild(el);

    return canvasColor;
  }, [isDark]);

  contextValue.canvasTextColor = canvasTextColor;
  contextValue.canvasColor = canvasColor;

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

  // ===================== Scroll Animations ====================
  const [thunksBySection, setThunksBySection] = useState(
    Array.from({ length: NUM_SECTIONS }, () => []),
  ); // Thunks are delayed calls to create animations that are to be executed in ScrollControls when added to its respective timeline

  const registerSectionThunk = (thunk, sectionIndex) => {
    setThunksBySection((prevThunksBySection) => {
      const newThunksBySection = [...prevThunksBySection];
      newThunksBySection[sectionIndex] = [
        ...newThunksBySection[sectionIndex],
        thunk,
      ];

      return newThunksBySection;
    });
  };

  const removeSectionThunk = (thunk) => {
    setThunksBySection((prevThunksBySection) => {
      const newThunksBySection = prevThunksBySection.map((sectionThunks) =>
        sectionThunks.filter((sectionThunk) => sectionThunk !== thunk),
      );

      return newThunksBySection;
    });
  };

  contextValue.registerSectionThunk = registerSectionThunk;
  contextValue.removeSectionThunk = removeSectionThunk;

  // ================= Mobile Orientation Change =================
  // BUG: mobile orientation change causes ScrollTrigger animations to update with wrong/stale progress after creation of ScrollTrigger instances and timeline aggregation
  // Reload page on orientation change as pragmatic workaround
  useLayoutEffect(() => {
    const onScreenOrientationChange = () => window.location.reload(); // Reload the page to re-render the app with the new orientation

    screen.orientation.addEventListener("change", onScreenOrientationChange);
    return () =>
      screen.orientation.removeEventListener(
        "change",
        onScreenOrientationChange,
      );
  }, []);

  // ========================== Render ==========================
  return (
    <>
      <AppContext value={contextValue}>
        {/* ==================== App Core ==================== */}
        <ScrollControls
          thunksBySection={thunksBySection}
          isImagePreviewOpen={imagePreview.open}
        />
        <ImagePreview {...imagePreview} onClose={closeImagePreview} />

        {/* =================== App Content ================== */}
        <Text />
        <Background />
      </AppContext>
      <Analytics />
    </>
  );
}

export default App;
