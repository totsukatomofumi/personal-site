import {
  createRef,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import {
  APP_CONTEXT as AppContext,
  DOCUMENT_AST,
  NUM_SECTIONS,
} from "../../../constants";
import {
  Section,
  Header,
  Paragraph,
  Card,
  Spacing,
  Links,
  Footer,
} from "./components";

function Text() {
  const appContext = useContext(AppContext);
  const documentRef = useRef(null);
  const sectionRefs = useMemo(
    () => Array.from({ length: NUM_SECTIONS }, () => createRef(null)),
    [],
  );
  const [linesBySection, setLinesBySection] = useState(
    Array.from({ length: NUM_SECTIONS }, () => []),
  );

  // ======================== Split Text ========================
  // Split each section into lines or pseudo-lines grouped by semantic meaning (e.g. Cover + Title + Subtitle in Card) for perspective scroll animations
  useGSAP((_, contextSafe) => {
    sectionRefs.forEach((sectionRef, sectionIndex) => {
      SplitText.create(sectionRef.current.children, {
        type: "lines",
        mask: "lines",
        linesClass:
          "will-change-opacity will-change-transform " + // Reduce frame drops when scrolling from promoting lines to their own layers just-in-time for each scroll animation
          "flow-root! " + // flow-root! creates BFC to account for child margins in height calculation (!important to override inline styles set by SplitText)
          "translate-z-[0.01px] " + // Prevent flattening of 3D transforms in WebKit browsers (e.g. Safari)
          "opacity-0 " + // Hide lines initially before animations finish setting styles to prevent FOUC when GSAP targets are lost on re-split (removed in Perspective Scroll useLayoutEffect)
          "_", // _ absorbs the -mask suffix to prevent breaking Tailwind utilities
        ignore: ".no-split", // Terminate deepSlice (i.e. nested splitting) at elements with this class
        autoSplit: true, // Auto re-splits on width changes (e.g. resize), but not on internal property changes (e.g. text font size)
        onRevert: contextSafe(() => {
          // Reset GSAP styles on section element to ensure correct re-splitting, else layout components do not split into lines occasionally on subsequent splits on resize
          gsap.set(sectionRef.current, { clearProps: true });
        }),
        onSplit: (self) => {
          // Call onSplit of child components to perform any necessary pre-processing (e.g. setting paddings on Header for correct spacing between lines)
          Header.onSplit(self);
          Footer.onSplit(self);
          Card.onSplit(self);

          const { lines, masks } = self;

          // Store lines and masks as inner and outer animation targets per line to support potentialy conflicting animations
          setLinesBySection((prevLinesBySection) => {
            const newLinesBySection = [...prevLinesBySection];

            newLinesBySection[sectionIndex] = lines.map((line, lineIndex) => ({
              inner: line,
              outer: masks[lineIndex],
            }));

            return newLinesBySection;
          });
        },
      });
    });
  });

  // ================= Delegated Event Handlers =================
  // Delegate click events of child elements (e.g. image preview in Card) to highest non-split ancestor since GSAP SplitText does not preserve mouse events on the split elements
  const onClick = (e) => {
    switch (e.target.dataset.event) {
      case "image-preview":
        appContext.openImagePreview(e.target.src, e.target.alt);
        break;
      default:
        break;
    }
  };

  // ===================== Parallax Scroll ======================
  const { registerSectionThunk, removeSectionThunk } = appContext;

  // Translate document vertically during scroll for parallax effect
  useLayoutEffect(
    // useLayoutEffect for instant feel despite frame drops instead of smooth with delay with useEffect
    () => {
      let cumulativeY = 0;

      // Create animation thunks to register with ScrollControls
      const thunks = sectionRefs.map(
        (sectionRef) => () =>
          gsap.to(documentRef.current, {
            y: (cumulativeY -= sectionRef.current.offsetHeight),
            ease: "none",
          }),
      );

      // Register thunks
      thunks.forEach((thunk, sectionIndex) => {
        registerSectionThunk(thunk, sectionIndex);
      });

      // Cleanup
      return () => {
        // Remove thunks
        thunks.forEach((thunk) => {
          removeSectionThunk(thunk);
        });
      };
    },
    [linesBySection],
  );

  // ==================== Perspective Scroll ====================
  useLayoutEffect(
    // useLayoutEffect to prevent FOUC between opacity-0 class removal and animation instantiation in ScrollControls
    () => {
      // Remove opacity-0 class added by SplitText to prevent FOUC between GSAP target lost on re-split and setting styles
      linesBySection.forEach((sectionLines) => {
        sectionLines.forEach((line) => {
          line.inner.classList.remove("opacity-0");
          line.outer.classList.remove("opacity-0");
        });
      });

      // Create animation thunks to register with ScrollControls
      const thunks = []; // Store thunks to be registered with ScrollControls for cleanup
      const rotationXDelta = 5;
      const opacityFactor = 0.2;

      sectionRefs.forEach((sectionRef, sectionIndex) => {
        let cumulativeRotationX = -rotationXDelta;
        let cumulativeY = 0;
        let cumulativeZ = 0;
        let cumulativeOpacity = opacityFactor;

        // Rotate Enter Line (Bottom)
        if (sectionIndex > 0) {
          const sectionLines = linesBySection[sectionIndex];

          sectionLines.forEach((line) => {
            const rotationX = cumulativeRotationX;
            const rotationXRad = (rotationX * Math.PI) / 180;
            const y = cumulativeY;
            const z = cumulativeZ;
            const opacity = cumulativeOpacity;

            cumulativeRotationX -= rotationXDelta;
            cumulativeY -=
              line.outer.offsetHeight * (1 - Math.cos(rotationXRad));
            cumulativeZ += line.outer.offsetHeight * Math.sin(rotationXRad);
            cumulativeOpacity *= opacityFactor;

            const thunk = () =>
              gsap.from(line.outer, {
                transformOrigin: "top center",
                rotationX,
                y,
                z,
                autoAlpha: opacity,
                ease: "none",
              });

            thunks.push(thunk);
            registerSectionThunk(thunk, sectionIndex - 1);
          });
        }

        // Rotate Enter Section (Bottom)
        if (sectionIndex > 0 && sectionIndex + 1 < sectionRefs.length) {
          const currSection = sectionRef.current;
          const currSectionLines = linesBySection[sectionIndex];
          const nextSection = sectionRefs[sectionIndex + 1].current;
          const nextSectionLines = linesBySection[sectionIndex + 1];

          // Treat bottom spacing (padding/gap) below lines (if any) as an extra "line" for rotation to avoid gap between sections during rotation
          const bottomSpacing =
            currSection.offsetHeight -
            currSectionLines.reduce(
              (sum, line) => sum + line.outer.offsetHeight,
              0,
            );

          const rotationX = cumulativeRotationX;
          const rotationXRad = (rotationX * Math.PI) / 180;

          cumulativeY -= bottomSpacing * (1 - Math.cos(rotationXRad));
          cumulativeZ += bottomSpacing * Math.sin(rotationXRad);

          const y = cumulativeY;
          const z = cumulativeZ;

          let thunk = () =>
            gsap.from(nextSection, {
              transformOrigin: "top center",
              rotationX,
              y,
              z,
              ease: "none",
            });

          thunks.push(thunk);
          registerSectionThunk(thunk, sectionIndex - 1);

          thunk = () =>
            gsap.from(
              nextSectionLines.map((line) => line.inner), // Target inner lines for opacity animation as opacity on section element will cause unintended flattening of 3D transformed child elements
              {
                autoAlpha: 0,
                ease: "none",
              },
            );

          thunks.push(thunk);
          registerSectionThunk(thunk, sectionIndex - 1);
        }

        cumulativeRotationX = rotationXDelta;
        cumulativeY = 0;
        cumulativeZ = 0;
        cumulativeOpacity = opacityFactor;

        // Line Rotate Exit (Top)
        if (sectionIndex < sectionRefs.length - 1) {
          const sectionLines = linesBySection[sectionIndex];

          sectionLines.toReversed().forEach((line) => {
            const rotationX = cumulativeRotationX;
            const rotationXRad = (rotationX * Math.PI) / 180;
            const y = cumulativeY;
            const z = cumulativeZ;
            const opacity = cumulativeOpacity;

            cumulativeRotationX += rotationXDelta;
            cumulativeY +=
              line.outer.offsetHeight * (1 - Math.cos(rotationXRad));
            cumulativeZ -= line.outer.offsetHeight * Math.sin(rotationXRad);
            cumulativeOpacity *= opacityFactor;

            const thunk = () =>
              gsap.to(line.outer, {
                transformOrigin: "bottom center",
                rotationX,
                y,
                z,
                autoAlpha: opacity,
                ease: "none",
              });

            thunks.push(thunk);
            registerSectionThunk(thunk, sectionIndex);
          });
        }

        // Section Rotate Exit (Top)
        if (sectionIndex < sectionRefs.length - 1 && sectionIndex - 1 >= 0) {
          const prevSection = sectionRefs[sectionIndex - 1].current;
          const prevSectionLines = linesBySection[sectionIndex - 1];

          const rotationX = cumulativeRotationX;
          const y = cumulativeY;
          const z = cumulativeZ;

          let thunk = () =>
            gsap.to(prevSection, {
              transformOrigin: "bottom center",
              rotationX,
              y,
              z,
              ease: "none",
            });

          thunks.push(thunk);
          registerSectionThunk(thunk, sectionIndex);

          thunk = () =>
            gsap.to(
              prevSectionLines.map((line) => line.inner),
              {
                autoAlpha: 0,
                ease: "none",
              },
            );

          thunks.push(thunk);
          registerSectionThunk(thunk, sectionIndex);
        }
      });

      // Cleanup
      return () => {
        // Remove thunks
        thunks.forEach((thunk) => {
          removeSectionThunk(thunk);
        });
      };
    },
    [linesBySection],
  );

  // ==================== Responsive Scaling ====================
  const { mediumFontSizePx, rootEmFontSizePx } = appContext;
  const scale = rootEmFontSizePx / mediumFontSizePx; // Calculate scale ratio for responsive scaling of styles that were unable to be scaled by root em through CSS

  // ========================== Render ==========================
  return (
    // ======================== Layout ========================
    <div className="fixed top-0 left-0 flex h-lvh w-full">
      <div className="mx-auto h-full w-6xl max-w-full px-6">
        <div className="h-full w-full max-w-138 perspective-normal">
          {/* ============== Document ============== */}
          <div
            ref={documentRef}
            className="relative transform-gpu will-change-transform text-shadow-[-0.0625rem_-0.0625rem_0_Canvas,0.0625rem_-0.0625rem_0_Canvas,-0.0625rem_0.0625rem_0_Canvas,0.0625rem_0.0625rem_0_Canvas] transform-3d"
            style={{
              top: `calc(${scale} * 30lvh)`, // Initial position of document before parallax scroll animation, scaled repsponsively with viewport height and calculated scale ratio
            }}
            onClick={onClick} // Delegate click events of child elements (e.g. image preview in Card) since GSAP SplitText does not preserve mouse events on the split elements
          >
            {/* Render document AST tree as layout components */}
            {DOCUMENT_AST.children.map((section, sectionIndex) => (
              <Section key={sectionIndex} ref={sectionRefs[sectionIndex]}>
                {section.children.map((child, childIndex) => {
                  switch (child.type) {
                    case "header":
                      return <Header key={childIndex} {...child} />;
                    case "paragraph":
                      return <Paragraph key={childIndex} {...child} />;
                    case "card":
                      return <Card key={childIndex} {...child} />;
                    case "spacing":
                      return <Spacing key={childIndex} />;
                    case "links":
                      return <Links key={childIndex} {...child} />;
                    case "footer":
                      return <Footer key={childIndex} {...child} />;
                    default:
                      return null;
                  }
                })}
              </Section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Text;
