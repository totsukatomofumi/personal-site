import { createRef, useContext, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { useMediaQuery } from "@uidotdev/usehooks";
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
  const sectionRefs = Array.from({ length: NUM_SECTIONS }, () =>
    createRef(null),
  );
  const [lines, setLines] = useState(
    Array.from({ length: NUM_SECTIONS }, () => []),
  );

  // ======================== Split Text ========================
  const isSmallDevice = useMediaQuery("(width >= 40rem)"); // Tailwind's 'sm' breakpoint

  // Split each section into lines or pseudo-lines grouped by semantic meaning (e.g. Cover + Title + Subtitle in Card) for perspective scroll animations
  useGSAP(
    () => {
      sectionRefs.forEach((sectionRef, index) => {
        SplitText.create(sectionRef.current.children, {
          type: "lines",
          autoSplit: true, // Auto re-splits on width changes (e.g. resize), but not on internal property changes (e.g. text font size)
          ignore: ".no-split", // Terminate deepSlice (i.e. nested splitting) at elements with this class
          onSplit: (self) => {
            Header.onSplit(self);
            Footer.onSplit(self);
            Card.onSplit(self);

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
      dependencies: [isSmallDevice], // Re-run for internal property changes caused by breakpoint changes (e.g. text font size) not handled by autoSplit
      revertOnUpdate: true, // Kill and revert all SplitText instances to prevent accumulation
    },
  );

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

  // ========================== Render ==========================
  return (
    // ======================== Layout ========================
    <div className="fixed top-0 left-0 flex h-dvh w-dvw">
      <div className="mx-auto h-full w-6xl max-w-dvw px-6">
        <div className="h-full w-full max-w-138 overflow-y-auto">
          {/* ============== Document ============== */}
          <div
            ref={documentRef}
            className="relative top-[30dvh] text-shadow-[-1px_-1px_0_Canvas,1px_-1px_0_Canvas,-1px_1px_0_Canvas,1px_1px_0_Canvas]"
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
