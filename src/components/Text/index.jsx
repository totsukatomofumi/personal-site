import { createRef, useRef } from "react";
import { DOCUMENT_AST, NUM_SECTIONS } from "../../../constants";
import {
  Section,
  Heading,
  Paragraph,
  Card,
  Spacing,
  Links,
  Caption,
} from "./components";

function Text() {
  const documentRef = useRef(null);
  const sectionRefs = Array.from({ length: NUM_SECTIONS }, () =>
    createRef(null),
  );

  console.log(DOCUMENT_AST);
  // ========================== Render ==========================
  return (
    // ======================== Layout ========================
    <div className="fixed top-0 left-0 flex h-dvh w-dvw">
      <div className="mx-auto h-full w-6xl max-w-dvw px-6">
        <div className="h-full w-full max-w-138">
          {/* ============== Document ============== */}
          <div
            ref={documentRef}
            className="relative top-[30dvh] text-shadow-[-1px_-1px_0_Canvas,1px_-1px_0_Canvas,-1px_1px_0_Canvas,1px_1px_0_Canvas]"
          >
            {DOCUMENT_AST.children.map((section, sectionIndex) => (
              <Section key={sectionIndex} ref={sectionRefs[sectionIndex]}>
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
        </div>
      </div>
    </div>
  );
}

export default Text;
