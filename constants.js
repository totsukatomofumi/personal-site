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

export const PATHS = {
  introPath: new THREE.CatmullRomCurve3([
    new THREE.Vector3(
      -0.7869288080194681,
      -2.010015143681179,
      3.25282491763842,
    ),
    new THREE.Vector3(
      -0.6393009712416976,
      -0.9753985891155899,
      3.0840104729162148,
    ),
    new THREE.Vector3(
      -0.4174085583410218,
      -0.7666873762536841,
      2.999879058198597,
    ),
    new THREE.Vector3(
      4.182054741113608,
      -0.7810136870873543,
      3.0019467556273596,
    ),
  ]),
  educationPath: new THREE.CatmullRomCurve3([
    new THREE.Vector3(
      -0.022191464159920127,
      -2.0236967667847785,
      3.248613906715203,
    ),
    new THREE.Vector3(
      0.8328613043989153,
      -0.1634144542899881,
      2.5834225442632963,
    ),
    new THREE.Vector3(
      2.281636658129537,
      1.0607953097458707,
      1.9182311817839826,
    ),
    new THREE.Vector3(3.4335507193455337, 5.674093881771056, 1.253039819277217),
  ]),
  employmentPath: new THREE.CatmullRomCurve3([
    new THREE.Vector3(
      -0.10373432049496217,
      -6.440998456468838,
      -2.500058841833037,
    ),
    new THREE.Vector3(
      5.205060614231565,
      -1.962310705234339,
      -4.124627639974136,
    ),
    new THREE.Vector3(6.655863466503734, 2.516377046000168, -5.749196438115234),
    new THREE.Vector3(
      3.9150249168470967,
      6.9950647972346625,
      -7.37376523625633,
    ),
    new THREE.Vector3(
      -3.899501364610434,
      11.473752548469156,
      -8.998334034397429,
    ),
  ]),
  projectsPath: new THREE.CatmullRomCurve3([
    new THREE.Vector3(
      5.271211469831579,
      -6.5063249698319705,
      -2.5016564031293593,
    ),
    new THREE.Vector3(
      -0.31532637019352605,
      -3.049768252989987,
      -4.666270353468129,
    ),
    new THREE.Vector3(7.480551453091528, 3.712483892965373, -6.830884303896082),
    new THREE.Vector3(
      -4.866143680174812,
      11.479352111012735,
      -8.995498254413372,
    ),
  ]),
  creditsPath: new THREE.CatmullRomCurve3([
    new THREE.Vector3(
      1.336672398661447,
      -1.4441883425447566,
      4.0014196283246415,
    ),
    new THREE.Vector3(
      1.0594246501404778,
      -0.2718012081528649,
      -1.3144197048982518,
    ),
    new THREE.Vector3(1.9570502631854139, 2.586903373861289, -5.8754210856909),
    new THREE.Vector3(6.5017281464721455, 7.9855456250172, -10.436422466483556),
    new THREE.Vector3(16.57921158125091, 16.09722106658814, -14.48742384727618),
  ]),
};

const DOCUMENT = `

@path introPath

# Hello, I'm Totsuka.

I build user-facing applications, and am interested in how integrating AI 
can unlock powerful, meaningful experiences for users.

---

I'm a fresh graduate passionate about building high-quality user applications 
for web and mobile platforms. My favourite work lies at the intersection of 
app development and AI, leveraging machine learning to deliver intelligent 
digital experiences for everyday users.

---

When I'm not building apps, I love watching sitcoms, taking night drives, 
and exploring new places abroad.

---

@path educationPath

# Education

:::card
title:: National University of Singapore
subtitle:: Bachelor of Computing in Computer Science (Honours)
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
