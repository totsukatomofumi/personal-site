import { createRef, useContext, useMemo, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import {
  DOCUMENT_JSON,
  APP_CONTEXT as AppContext,
  NUM_SECTIONS,
} from "../../../constants";
import {
  Section,
  Heading,
  Paragraph,
  Card,
  Spacing,
  Links,
  Caption,
} from "./components/";
import { useMediaQuery } from "@uidotdev/usehooks";

gsap.registerPlugin(SplitText);

function Text({ className, ...props }) {
  // ========================== Setup ===========================
  const appContext = useContext(AppContext);
  const [document, documentRef, sectionRefs] = useMemo(() => {
    const documentRef = createRef();
    const sectionRefs = Array.from({ length: NUM_SECTIONS }, () => createRef());

    const document = (
      <div ref={documentRef} className="transform-3d">
        {DOCUMENT_JSON.children.map((section, index) => (
          <Section
            key={index}
            ref={sectionRefs[index]}
            className="transform-3d"
          >
            {section.children.map((child, childIndex) => {
              switch (child.type) {
                case "heading":
                  return <Heading key={childIndex} {...child} />;
                case "paragraph":
                  return <Paragraph key={childIndex} {...child} />;
                case "card":
                  return <Card key={childIndex} {...child} />;
                case "spacing":
                  return <Spacing key={childIndex} />;
                case "links":
                  return <Links key={childIndex} {...child} />;
                case "caption":
                  return <Caption key={childIndex} {...child} />;
                default:
                  return null;
              }
            })}
          </Section>
        ))}
      </div>
    );

    return [document, documentRef, sectionRefs];
  }, []);
  const [lines, setLines] = useState(
    Array.from({ length: NUM_SECTIONS }, () => [])
  );

  // ===================== Parallax Scroll ======================
  useGSAP(
    () => {
      // Setup animation config and variables
      const ease = "power1.inOut";
      let cumulativeY = 0;

      // Create animations
      const animations = sectionRefs.map((sectionRef) => {
        return gsap.to(documentRef.current, {
          y: (cumulativeY -= sectionRef.current.offsetHeight),
          ease: ease,
          immediateRender: false,
          paused: true,
        });
      });

      // Register animations
      animations.forEach((animation, index) => {
        appContext.registerSectionAnimation(animation, index);
      });

      // Cleanup
      return () => {
        // Remove animations
        animations.forEach((animation) => {
          appContext.removeSectionAnimation(animation);
        });

        // Reset target element to clean state
        gsap.set(documentRef.current, { clearProps: true });
      };
    },
    {
      dependencies: [lines],
      revertOnUpdate: true,
    }
  );

  // ==================== Perspective Scroll ====================
  useGSAP(
    () => {
      // Setup animation config and variables
      const animations = [];
      const rotationXDelta = 5;
      const alphaFactor = 0.2;
      const ease = "power2.inOut";

      // Create animations
      sectionRefs.forEach((sectionRef, sectionIndex) => {
        let cumulativeRotationX = -rotationXDelta;
        let cumulativeY = 0;
        let cumulativeZ = 0;
        let cumulativeAlpha = alphaFactor;

        // Line Rotate Enter (Bottom)
        if (sectionIndex > 0) {
          const sectionLines = lines[sectionIndex];

          sectionLines.forEach((line) => {
            const rotationX = cumulativeRotationX;
            const rotationXRad = (rotationX * Math.PI) / 180;
            const y = cumulativeY;
            const z = cumulativeZ;
            const alpha = cumulativeAlpha;

            cumulativeRotationX -= rotationXDelta;
            cumulativeY -= line.offsetHeight * (1 - Math.cos(rotationXRad));
            cumulativeZ += line.offsetHeight * Math.sin(rotationXRad);
            cumulativeAlpha *= alphaFactor;

            const animation = gsap.from(line, {
              transformOrigin: "top center",
              rotationX: rotationX,
              y: y,
              z: z,
              autoAlpha: alpha,
              ease: ease,
              paused: true,
            });

            animations.push(animation);
            appContext.registerSectionAnimation(animation, sectionIndex - 1);
          });
        }

        // Section Rotate Enter (Bottom)
        if (sectionIndex > 0 && sectionIndex + 1 < sectionRefs.length) {
          const currSection = sectionRef.current;
          const nextSection = sectionRefs[sectionIndex + 1].current;
          const nextSectionLines = lines[sectionIndex + 1];

          // We take bottom padding of section as an extra "line"
          const paddingBottom = parseFloat(
            getComputedStyle(currSection).paddingBottom
          );
          const rotationX = cumulativeRotationX;
          const rotationXRad = (rotationX * Math.PI) / 180;

          cumulativeY -= paddingBottom * (1 - Math.cos(rotationXRad));
          cumulativeZ += paddingBottom * Math.sin(rotationXRad);

          const y = cumulativeY;
          const z = cumulativeZ;

          let animation = gsap.from(nextSection, {
            transformOrigin: "top center",
            rotationX: rotationX,
            y: y,
            z: z,
            ease: ease,
            paused: true,
          });

          animations.push(animation);
          appContext.registerSectionAnimation(animation, sectionIndex - 1);

          animation = gsap.from(
            nextSectionLines.flatMap((line) => line.children), // We target child elements of lines to avoid conflict
            {
              autoAlpha: 0,
              ease: ease,
              paused: true,
            }
          );

          animations.push(animation);
          appContext.registerSectionAnimation(animation, sectionIndex - 1);
        }

        cumulativeRotationX = rotationXDelta;
        cumulativeY = 0;
        cumulativeZ = 0;
        cumulativeAlpha = alphaFactor;

        // Line Rotate Exit (Top)
        if (sectionIndex < sectionRefs.length - 1) {
          const sectionLines = lines[sectionIndex];

          sectionLines.toReversed().forEach((line) => {
            const rotationX = cumulativeRotationX;
            const rotationXRad = (rotationX * Math.PI) / 180;
            const y = cumulativeY;
            const z = cumulativeZ;
            const alpha = cumulativeAlpha;

            cumulativeRotationX += rotationXDelta;
            cumulativeY += line.offsetHeight * (1 - Math.cos(rotationXRad));
            cumulativeZ -= line.offsetHeight * Math.sin(rotationXRad);
            cumulativeAlpha *= alphaFactor;

            const animation = gsap.to(line, {
              transformOrigin: "bottom center",
              rotationX: rotationX,
              y: y,
              z: z,
              autoAlpha: alpha,
              ease: ease,
              immediateRender: false,
              paused: true,
            });

            animations.push(animation);
            appContext.registerSectionAnimation(animation, sectionIndex);
          });
        }

        // Section Rotate Exit (Top)
        if (sectionIndex < sectionRefs.length - 1 && sectionIndex - 1 >= 0) {
          const prevSection = sectionRefs[sectionIndex - 1].current;
          const prevSectionLines = lines[sectionIndex - 1];

          // Similarly, we take bottom padding of previous section as an extra "line"
          // However, we do not need to do any calculation.
          const rotationX = cumulativeRotationX;
          const y = cumulativeY;
          const z = cumulativeZ;

          let animation = gsap.to(prevSection, {
            transformOrigin: "bottom center",
            rotationX: rotationX,
            y: y,
            z: z,
            ease: ease,
            immediateRender: false,
            paused: true,
          });

          animations.push(animation);
          appContext.registerSectionAnimation(animation, sectionIndex);

          animation = gsap.to(
            prevSectionLines.flatMap((line) => line.children), // We target child elements of lines to avoid conflict
            {
              autoAlpha: 0,
              ease: ease,
              immediateRender: false,
              paused: true,
            }
          );

          animations.push(animation);
          appContext.registerSectionAnimation(animation, sectionIndex);
        }
      });

      // Cleanup
      return () => {
        // Remove animations
        animations.forEach((animation) => {
          appContext.removeSectionAnimation(animation);
        });

        // Reset target elements to clean state
        gsap.set(
          [
            ...sectionRefs.map((sectionRef) => sectionRef.current),
            ...lines.flatMap((sectionLines) => sectionLines),
          ],
          {
            clearProps: true,
          }
        );
      };
    },
    {
      dependencies: [lines],
      revertOnUpdate: true,
    }
  );

  // ======================== Split Text ========================
  const isSmallDevice = useMediaQuery("(min-width : 640px)"); // TailwindCSS sm breakpoint, used to force re-split when style changes on tailwind breakpoint (e.g. font-size), as GSAP SplitText does not auto-update on style changes

  useGSAP(
    () => {
      sectionRefs.forEach((sectionRef, index) => {
        new SplitText(sectionRef.current, {
          type: "lines",
          ignore: ".no-split",
          autoSplit: true,
          onSplit: (self) => {
            setLines((prevLines) => {
              const newLines = [...prevLines];
              newLines[index] = self.lines;
              return newLines;
            });
          },
        });
      });
    },
    {
      dependencies: [isSmallDevice],
      revertOnUpdate: true,
    }
  );

  // ==================== Delegated Handling ====================
  // Delegated click handler (as mouse events are not preserved by GSAP SplitText)
  const onClick = (e) => {
    switch (e.target.dataset.action) {
      case "image-preview":
        appContext.openImagePreview(e.target.src, e.target.alt);
        break;
      default:
        break;
    }
  };

  // ========================== Render ==========================
  return (
    <div className={`flex ${className || ""}`} {...props}>
      <div className="m-auto w-6xl max-w-screen h-6/10 sm:h-4/10 px-6">
        <div
          className="w-full max-w-138 h-full perspective-normal"
          onClick={onClick}
        >
          {document}
        </div>
      </div>
    </div>
  );
}

export default Text;
