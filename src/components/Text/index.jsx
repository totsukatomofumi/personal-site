import { createRef, useContext, useMemo, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { DOCUMENT_JSON, APP_CONTEXT as AppContext } from "../../../constants";
import {
  Section,
  Heading,
  Paragraph,
  Card,
  Spacing,
  Links,
  Caption,
} from "./components/";

gsap.registerPlugin(SplitText);

function Text({ className, ...props }) {
  // ========================== Setup ===========================
  const appContext = useContext(AppContext);
  const [document, documentRef, sectionRefs] = useMemo(() => {
    const documentRef = createRef();
    const sectionRefs = Array.from(
      { length: DOCUMENT_JSON.children.length },
      () => createRef()
    );

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
    Array.from({ length: DOCUMENT_JSON.children.length }, () => [])
  );

  // ===================== Parallax Scroll ======================
  useGSAP(
    () => {
      const ease = "none";
      let cumulativeY = 0;

      const animations = sectionRefs.map((sectionRef) =>
        gsap.fromTo(
          documentRef.current,
          {
            y: cumulativeY,
          },
          {
            y: (cumulativeY -= sectionRef.current.offsetHeight),
            ease: ease,
            immediateRender: false,
          }
        )
      );

      animations.forEach((animation, index) => {
        appContext.registerScrollAnimation(animation, index);
      });

      return () => {
        animations.forEach((animation) => {
          appContext.removeScrollAnimation(animation);
        });
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
      const animations = [];
      const rotationXDelta = 5;
      const alphaFactor = 0.2;
      const ease = "none";

      sectionRefs.forEach((sectionRef, sectionIndex) => {
        let cumulativeRotationX = -rotationXDelta;
        let cumulativeY = 0;
        let cumulativeZ = 0;
        let cumulativeAlpha = alphaFactor;

        // ============== Line Rotate Enter (Bottom) ==============
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
            });

            animations.push(animation);
            appContext.registerScrollAnimation(animation, sectionIndex - 1);
          });
        }

        // ============ Section Rotate Enter (Bottom) =============
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
          });

          animations.push(animation);
          appContext.registerScrollAnimation(animation, sectionIndex - 1);

          animation = gsap.from(
            nextSectionLines.flatMap((line) => line.children), // We target child elements of lines to avoid conflict
            {
              autoAlpha: 0,
              ease: ease,
            }
          );

          animations.push(animation);
          appContext.registerScrollAnimation(animation, sectionIndex - 1);
        }

        cumulativeRotationX = rotationXDelta;
        cumulativeY = 0;
        cumulativeZ = 0;
        cumulativeAlpha = alphaFactor;

        // =============== Line Rotate Exit (Top) =================
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
            });

            animations.push(animation);
            appContext.registerScrollAnimation(animation, sectionIndex);
          });
        }

        // ============== Section Rotate Exit (Top) ===============
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
          });

          animations.push(animation);
          appContext.registerScrollAnimation(animation, sectionIndex);

          animation = gsap.to(
            prevSectionLines.flatMap((line) => line.children), // We target child elements of lines to avoid conflict
            {
              autoAlpha: 0,
              ease: ease,
              immediateRender: false,
            }
          );

          animations.push(animation);
          appContext.registerScrollAnimation(animation, sectionIndex);
        }
      });

      return () => {
        animations.forEach((animation) => {
          appContext.removeScrollAnimation(animation);
        });
      };
    },
    {
      dependencies: [lines],
      revertOnUpdate: true,
    }
  );

  // ======================== Split Text ========================
  useGSAP(() => {
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
  });

  // ========================== Render ==========================
  return (
    <div className={`flex ${className || ""}`} {...props}>
      <div className="m-auto w-6xl max-w-screen h-6/10 sm:h-4/10 px-6">
        <div className="w-full max-w-138 h-full perspective-normal">
          {document}
        </div>
      </div>
    </div>
  );
}

export default Text;
