import { createRef, useContext, useMemo, useRef, useState } from "react";
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

gsap.registerPlugin(SplitText);

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
  useGSAP(() => {
    sectionRefs.forEach((sectionRef, index) => {
      SplitText.create(sectionRef.current.children, {
        type: "lines",
        autoSplit: true, // Auto re-splits on width changes (e.g. resize), but not on internal property changes (e.g. text font size)
        ignore: ".no-split", // Terminate deepSlice (i.e. nested splitting) at elements with this class
        mask: "lines",
        onRevert: () => {
          // Reset GSAP styles on section element to ensure correct re-splitting
          gsap.set(sectionRef.current, { clearProps: true });
        },
        onSplit: (self) => {
          // Call onSplit of child components to perform any necessary pre-processing (e.g. setting paddings on Header for correct spacing between lines)
          Header.onSplit(self);
          Footer.onSplit(self);
          Card.onSplit(self);

          const { lines, masks } = self;

          // Store lines and masks as inner and outer animation targets per line to support potentialy conflicting animations
          setLinesBySection((prevLinesBySection) => {
            const newLinesBySection = [...prevLinesBySection];

            newLinesBySection[index] = lines.map((line, i) => ({
              inner: line,
              outer: masks[i],
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
  // Translate document vertically during scroll for parallax effect
  useGSAP(
    () => {
      let cumulativeY = 0;

      // Create animations
      const animations = sectionRefs.map((sectionRef) => {
        return gsap.to(documentRef.current, {
          y: (cumulativeY -= sectionRef.current.offsetHeight),
          ease: "none",
        });
      });

      // Register animations
      animations.forEach((animation, sectionIndex) => {
        appContext.registerSectionAnimation(animation, sectionIndex);
      });

      // Cleanup
      return () => {
        // Remove animations
        animations.forEach((animation) => {
          appContext.removeSectionAnimation(animation);
        });
      };
    },
    {
      dependencies: [linesBySection],
      revertOnUpdate: true,
    },
  );

  // ==================== Perspective Scroll ====================
  useGSAP(
    () => {
      const rotationXDelta = 5;
      const opacityFactor = 0.2;
      const animations = [];

      // Create animations
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

            const animation = gsap.from(line.outer, {
              transformOrigin: "top center",
              rotationX: rotationX,
              y: y,
              z: z,
              autoAlpha: opacity,
              ease: "none",
            });

            animations.push(animation);
            appContext.registerSectionAnimation(animation, sectionIndex - 1);
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

          let animation = gsap.from(nextSection, {
            transformOrigin: "top center",
            rotationX: rotationX,
            y: y,
            z: z,
            ease: "none",
          });

          animations.push(animation);
          appContext.registerSectionAnimation(animation, sectionIndex - 1);

          if (nextSectionLines.length > 0) {
            animation = gsap.from(
              nextSectionLines.map((line) => line.inner),
              {
                autoAlpha: 0,
                ease: "none",
              },
            );

            animations.push(animation);
            appContext.registerSectionAnimation(animation, sectionIndex - 1);
          }
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
            const alpha = cumulativeOpacity;

            cumulativeRotationX += rotationXDelta;
            cumulativeY +=
              line.outer.offsetHeight * (1 - Math.cos(rotationXRad));
            cumulativeZ -= line.outer.offsetHeight * Math.sin(rotationXRad);
            cumulativeOpacity *= opacityFactor;

            const animation = gsap.to(line.outer, {
              transformOrigin: "bottom center",
              rotationX: rotationX,
              y: y,
              z: z,
              autoAlpha: alpha,
              ease: "none",
            });

            animations.push(animation);
            appContext.registerSectionAnimation(animation, sectionIndex);
          });
        }

        // Section Rotate Exit (Top)
        if (sectionIndex < sectionRefs.length - 1 && sectionIndex - 1 >= 0) {
          const prevSection = sectionRefs[sectionIndex - 1].current;
          const prevSectionLines = linesBySection[sectionIndex - 1];

          const rotationX = cumulativeRotationX;
          const y = cumulativeY;
          const z = cumulativeZ;

          let animation = gsap.to(prevSection, {
            transformOrigin: "bottom center",
            rotationX: rotationX,
            y: y,
            z: z,
            ease: "none",
          });

          animations.push(animation);
          appContext.registerSectionAnimation(animation, sectionIndex);

          if (prevSectionLines.length > 0) {
            animation = gsap.to(
              prevSectionLines.map((line) => line.inner),
              {
                autoAlpha: 0,
                ease: "none",
              },
            );

            animations.push(animation);
            appContext.registerSectionAnimation(animation, sectionIndex);
          }
        }
      });

      // Cleanup
      return () => {
        // Remove animations
        animations.forEach((animation) => {
          appContext.removeSectionAnimation(animation);
        });
      };
    },
    {
      dependencies: [linesBySection],
      revertOnUpdate: true,
    },
  );

  // ========================== Render ==========================
  return (
    // ======================== Layout ========================
    <div className="fixed top-0 left-0 flex h-dvh w-dvw">
      <div className="mx-auto h-full w-6xl max-w-dvw px-6">
        <div className="h-full w-full max-w-138 perspective-normal">
          {/* ============== Document ============== */}
          <div
            ref={documentRef}
            className="relative top-[30dvh] text-shadow-[-0.0625rem_-0.0625rem_0_Canvas,0.0625rem_-0.0625rem_0_Canvas,-0.0625rem_0.0625rem_0_Canvas,0.0625rem_0.0625rem_0_Canvas] transform-3d"
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
