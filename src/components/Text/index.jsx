import { createRef, useMemo } from "react";
import { DOCUMENT_JSON } from "../../../constants";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
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
  });

  return (
    <div className={`flex ${className || ""}`} {...props}>
      <div className="m-auto w-6xl max-w-screen h-4/10 px-6 overflow-y-auto">
        <div className="w-full max-w-138">{document}</div>
      </div>
    </div>
  );
}

export default Text;
