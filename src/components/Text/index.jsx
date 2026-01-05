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
      <div ref={documentRef}>
        {DOCUMENT_JSON.children.map((section, index) => (
          <Section key={index} ref={sectionRefs[index]}>
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

  // ===================== Parallax Scroll ======================
  const [parallaxRevision, setParallaxRevision] = useState(0);

  useGSAP(
    () => {
      let cumulativeY = 0;

      const tweens = sectionRefs.map((sectionRef) =>
        gsap.fromTo(
          documentRef.current,
          {
            y: cumulativeY,
          },
          {
            y: (cumulativeY -= sectionRef.current.offsetHeight),
            immediateRender: false,
          }
        )
      );

      tweens.forEach((tween, index) => {
        appContext.registerScrollAnim(tween, index);
      });

      return () => {
        tweens.forEach((tween) => {
          appContext.removeScrollAnim(tween);
        });
      };
    },
    {
      dependencies: [parallaxRevision],
      revertOnUpdate: true,
    }
  );

  // ==================== Perspective Scroll ====================
  useGSAP(() => {
    const splits = [];

    sectionRefs.forEach((sectionRef) => {
      if (sectionRef.current) {
        const split = new SplitText(sectionRef.current, {
          type: "lines",
          ignore: ".no-split",
          autoSplit: true,
          onSplit: (self) => {
            setParallaxRevision((prev) => prev + 1);

            gsap.fromTo(
              self.lines,
              { border: "2px solid transparent" },
              {
                border: "2px solid #000",
                duration: 1,
                ease: "power1.inOut",
                repeat: -1,
                yoyo: true,
              }
            );
          },
        });
        splits.push(split);
      }
    });

    return () => {
      splits.forEach((split) => split.revert());
    };
  });

  // ========================== Render ==========================
  return (
    <div className={`flex ${className || ""}`} {...props}>
      <div className="m-auto w-6xl max-w-screen h-4/10 px-6">
        <div className="w-full max-w-138">{document}</div>
      </div>
    </div>
  );
}

export default Text;
