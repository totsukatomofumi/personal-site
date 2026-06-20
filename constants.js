import { createContext } from "react";
import * as THREE from "three";

function parseCardBlock(block) {
  // Define regex patterns for card block vars
  const varRegex = /(\S*):: (.*?)(?=\s\S*::|$)/g;

  const matches = [...block.text.matchAll(varRegex)];

  let cardVars = {};

  for (const match of matches) {
    const varName = match[1].trim();
    const varValue = match[2].trim();

    if (varName === "cover") {
      // If cover value is a path to an image, parse it as an image variable
      if (
        /\.(apng|avif|gif|jpg|jpeg|jpe|jif|jfif|png|svg|webp)$/i.test(varValue)
      ) {
        cardVars[varName] = {
          type: "image",
          src: varValue,
        };
      }
      // If it is a date range, parse it as a date variable
      else if (/^.*\s-\s.*$/.test(varValue)) {
        const [start, end] = varValue.split("-").map((part) => part.trim());

        cardVars[varName] = {
          type: "date",
          start,
          end,
        };
      }
      // Otherwise, treat it as default variable
      else {
        cardVars[varName] = varValue;
      }
    } else if (varName === "extras") {
      // Split extras by comma and trim whitespace
      cardVars[varName] = varValue.split(",").map((extra) => extra.trim());
    } else {
      cardVars[varName] = varValue;
    }
  }

  return {
    type: "card",
    ...cardVars,
  };
}

function parseLinksBlock(block) {
  // Define regex pattern for links
  const linkRegex = /(\S*):: (.*?)(?=\s\S*::|$)/g;

  const matches = [...block.text.matchAll(linkRegex)];

  const linksChildren = matches.map((match) => ({
    type: match[1],
    url: match[2],
  }));

  return {
    type: "links",
    children: linksChildren,
  };
}

function parseDocument(document) {
  // Define line-matching regex patterns
  const pathRegex = /^@path /;
  const headerRegex = /^# /;
  const spacingBlockRegex = /^:::spacing:::$/;
  const cardBlockStartRegex = /^:::card$/;
  const linksBlockStartRegex = /^:::links$/;
  const footerBlockStartRegex = /^:::footer$/;
  const blockEndRegex = /^:::$/;

  // Split document into sections, then split each section into non-empty lines
  const sections = document.split("---").map((section) =>
    section
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0),
  );

  const documentChildren = sections.map((section) => {
    const sectionChildren = [];

    let currBlock = null; // Holds the current block being parsed, if any

    for (const line of section) {
      // Active block parsing takes precedence (except for paragraphs)
      if (currBlock && currBlock.type !== "paragraph") {
        if (blockEndRegex.test(line)) {
          // Parse block based on its type, if required
          if (currBlock.type === "card") {
            currBlock = parseCardBlock(currBlock);
          } else if (currBlock.type === "links") {
            currBlock = parseLinksBlock(currBlock);
          }

          // Push block to section children amd reset state
          sectionChildren.push(currBlock);
          currBlock = null;
        } else {
          currBlock.text += currBlock.text ? " " + line : line; // Add space between lines
        }
      } else {
        if (pathRegex.test(line)) {
          // Push any active block before starting
          if (currBlock) {
            sectionChildren.push(currBlock);
            currBlock = null;
          }

          // Push path directly to section children
          sectionChildren.push({
            type: "path",
            path: PATHS[line.replace(pathRegex, "")],
          });
        } else if (headerRegex.test(line)) {
          // Push any active block before starting
          if (currBlock) {
            sectionChildren.push(currBlock);
            currBlock = null;
          }

          // Push header directly to section children
          sectionChildren.push({
            type: "header",
            text: line.replace(headerRegex, ""),
          });
        } else if (spacingBlockRegex.test(line)) {
          // Push any active block before starting
          if (currBlock) {
            sectionChildren.push(currBlock);
            currBlock = null;
          }

          // Push spacing block directly to section children
          sectionChildren.push({
            type: "spacing",
          });
        } else if (cardBlockStartRegex.test(line)) {
          // Push any active block before starting
          if (currBlock) {
            sectionChildren.push(currBlock);
            currBlock = null;
          }

          // Start a new card block
          currBlock = {
            type: "card",
            text: "",
          };
        } else if (linksBlockStartRegex.test(line)) {
          // Push any active block before starting
          if (currBlock) {
            sectionChildren.push(currBlock);
            currBlock = null;
          }

          // Start a new links block
          currBlock = {
            type: "links",
            text: "",
          };
        } else if (footerBlockStartRegex.test(line)) {
          // Push any active block before starting
          if (currBlock) {
            sectionChildren.push(currBlock);
            currBlock = null;
          }

          // Start a new footer block
          currBlock = {
            type: "footer",
            text: "",
          };
        }
        // Paragraph (default)
        else {
          // If a block is active, accumulate text
          if (currBlock) {
            currBlock.text += currBlock.text ? " " + line : line; // Add space between lines
          }
          // Otherwise, start a new paragraph block
          else {
            currBlock = {
              type: "paragraph",
              text: line,
            };
          }
        }
      }
    }

    // Push any remaining active block to section children
    if (currBlock) {
      sectionChildren.push(currBlock);
      currBlock = null;
    }

    return {
      type: "section",
      children: sectionChildren,
    };
  });

  return {
    type: "document",
    children: documentChildren,
  };
}

const PATHS = {
  introPath: new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.06, -2.22, 3.0),
    new THREE.Vector3(-0.78, -1.29, 2.6),
    new THREE.Vector3(-0.53, -1.14, 2.5),
    new THREE.Vector3(7.09, -1.07, 2.5),
  ]),
  educationPath: new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.24, -1.76, 3.5),
    new THREE.Vector3(3.96, 5.39, 0.0),
  ]),
  employmentPath: new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, -6.79, -2.5),
    new THREE.Vector3(6.21, -1.19, -5.52),
    new THREE.Vector3(7.89, 5.77, -9.26),
    new THREE.Vector3(2.4, 11.92, -12.58),
    new THREE.Vector3(-5.8, 16.15, -15.0),
  ]),
  projectsPath: new THREE.CatmullRomCurve3([
    new THREE.Vector3(5.37, -6.54, -2.75),
    new THREE.Vector3(0.11, -3.95, -4.42),
    new THREE.Vector3(0.22, -2.24, -6.19),
    new THREE.Vector3(8.07, 3.26, -7.86),
    new THREE.Vector3(8.4, 6.42, -10.28),
    new THREE.Vector3(3.26, 9.61, -12.23),
    new THREE.Vector3(-2.14, 13.42, -13.78),
    new THREE.Vector3(-10.72, 15.97, -15.1),
  ]),
  creditsPath: new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.5, -1.57, 3.75),
    new THREE.Vector3(0.92, -0.88, 1.14),
    new THREE.Vector3(2.98, 3.72, -9.38),
    new THREE.Vector3(11.95, 14.64, -21.31),
    new THREE.Vector3(19.58, 21.09, -25.58),
    new THREE.Vector3(31.1, 28.71, -30.0),
  ]),
};

const DOCUMENT = `

@path introPath

# Hello, I'm Totsuka.

I build software for today, and study machine learning for tomorrow.

---

I'm a fresh graduate focused on web development, with experience building 
pixel-perfect, responsive applications. I also have a strong interest in 
machine learning, having pursued a focus area in Artificial Intelligence 
as an undergraduate.

---

In my free time, I love watching sitcoms, going for late-night drives, 
and travelling abroad.

---

@path educationPath

# Education

:::card
title:: National University of Singapore
subtitle:: Bachelor of Computing (Honours) in Computer Science (Artificial Intelligence Focus Area)
cover:: Aug 2021 - Aug 2025
extras:: Programming Methodology, Programming Methodology II, Data Structures 
and Algorithms, Software Engineering, Computer Organisation, Introduction to 
Operating Systems, Database Systems, Introduction to Information Security, 
Introduction to AI and Machine Learning, Design and Analysis of Algorithms, 
Foundations of Machine Learning, Natural Language Processing, Computer Vision 
and Pattern Recognition
:::

---

:::card
title:: Chulalongkorn University (NUS Student Exchange Programme)
subtitle:: Bachelor of Engineering in Information and Communication Engineering 
(International Program)
cover:: Aug 2023 - Dec 2023
extras:: Internet of Things, User Interface Design, Principles of Information 
System, Netcentric Architecture
:::

---

@path employmentPath

# Employment

:::card
title:: Pentas Vision (Sony Semiconductor Solutions)
subtitle:: Embedded Systems Development Intern
cover:: May 2025 - Nov 2025
body:: Led development of a production-grade frontend dashboard for 
computer-vision model training workflows, establishing scalable architecture 
and engineering best practices. Designed and implemented a chatbot interface 
powered by LLMs and VLMs, with SSE streaming and rich conversational UI 
(history management, image/file uploads, RAG).
extras:: TypeScript, React, Ant Design Pro, Ant Design, ProComponents, 
Ant Design X, UmiJS, OpenAPI, FastAPI, Python, Git, GitLab
:::

---

:::card
title:: Rohde & Schwarz
subtitle:: Intern, Software Developer
cover:: May 2024 - Aug 2024
body:: Co-developed a full-stack, real-time lab management dashboard to 
automate lab workflows. Co-implemented microservices with service discovery 
to interface with legacy lab software.
extras:: TypeScript, React, Redux, C#, ASP.NET Core, SignalR, gRPC, Consul, 
Git, GitLab
:::

---

@path projectsPath

# Projects

:::card
title:: VisualPython
subtitle:: NUS BComp Dissertation (FYP)
cover:: /visualpython.png
link:: https://visualpython.ddns.comp.nus.edu.sg
body:: Extended a brownfield drag-and-drop Python learning platform with 
real-time collaborative coding sessions for peer-to-peer and instructor 
interaction.
extras:: React, Redux, Django, Django Channels, Redis, Daphne, Docker, 
Git, GitHub
:::

---

:::card
title:: Battleship
subtitle:: CU Netcentric Architecture (2190472)
cover:: /battleship.png
link:: https://github.com/battleship-web/battleship
body:: Co-developed the backend of a real-time, online multiplayer, 
"Battleship" web clone.
extras:: JavaScript, Express, Socket.IO, Redis, Mongoose, Git, GitHub
:::

---

:::card
title:: Smart Trash Can
subtitle:: CU Internet of Things (2147336)
cover:: /smart-trash-can.png
body:: Co-implemented software for a IoT-based waste-sorting system using 
servos and sensors.
extras:: C, Python, STM32, Raspberry Pi
:::

---

:::card
title:: myStudent
subtitle:: NUS Software Engineering (CS2103T)
cover:: /mystudent.png
link:: https://ay2223s1-cs2103t-f12-4.github.io/tp/
body:: Co-developed a Java-based tuition centre management application.
extras:: Java, JavaFX, JUnit, Git, GitHub, Codecov
:::

---

@path creditsPath

# Thank you.

I look forward to connecting with you!

:::spacing:::

:::links
resume:: /resume.pdf
linkedin:: https://www.linkedin.com/in/totsukatomofumi
github:: https://github.com/totsukatomofumi
kaggle:: https://www.kaggle.com/totsukatomofumi
email:: mailto:totsukatomofumi@gmail.com
:::

:::spacing:::

:::footer
Built with React, Tailwind CSS, Font Awesome, GSAP, and Three.js with R3F 
libraries, and deployed with Vercel.
:::
`;

export const DOCUMENT_AST = parseDocument(DOCUMENT);

export const NUM_SECTIONS = DOCUMENT_AST.children.length;

export const APP_CONTEXT = createContext();
