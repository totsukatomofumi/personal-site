function parseCardBlockContent(content) {
  const titleRegex = /title:\s*(.*?)(\s+\S*:|\s*$)/;
  const subtitleRegex = /subtitle:\s*(.*?)(\s+\S*:|\s*$)/;
  const coverRegex = /cover:\s*(.*?)(\s+\S*:|\s*$)/;
  const bodyRegex = /body:\s*(.*?)(\s+\S*:|\s*$)/;
  const extrasRegex = /extras:\s*(.*?)(\s+\S*:|\s*$)/;

  const cardContent = {};

  const titleMatch = content.match(titleRegex);
  if (titleMatch) {
    cardContent.title = titleMatch[1].trim();
  }

  const subtitleMatch = content.match(subtitleRegex);
  if (subtitleMatch) {
    cardContent.subtitle = subtitleMatch[1].trim();
  }

  const coverMatch = content.match(coverRegex);
  if (coverMatch) {
    const coverValue = coverMatch[1].trim();

    if (coverValue.includes(".")) {
      cardContent.cover = {
        type: "image",
        url: coverValue,
      };
    } else {
      const dateParts = coverValue.split("-").map((part) => part.trim());
      cardContent.cover = {
        type: "date",
        start: dateParts[0],
        end: dateParts[1],
      };
    }
  }

  const bodyMatch = content.match(bodyRegex);
  if (bodyMatch) {
    cardContent.body = bodyMatch[1].trim();
  }

  const extrasMatch = content.match(extrasRegex);
  if (extrasMatch) {
    const extrasList = extrasMatch[1].split(",").map((extra) => extra.trim());
    cardContent.extras = extrasList;
  }

  return cardContent;
}

function parseLinksBlockContent(content) {
  const linkedinRegex = /linkedin:\s*(.*?)(\s+\S*:|\s*$)/;
  const githubRegex = /github:\s*(.*?)(\s+\S*:|\s*$)/;
  const kaggleRegex = /kaggle:\s*(.*?)(\s+\S*:|\s*$)/;
  const emailRegex = /email:\s*(.*?)(\s+\S*:|\s*$)/;
  const resumeRegex = /resume:\s*(.*?)(\s+\S*:|\s*$)/;
  const linksContent = [];

  const linkedinMatch = content.match(linkedinRegex);
  if (linkedinMatch) {
    linksContent.push({
      type: "linkedin",
      url: linkedinMatch[1].trim(),
    });
  }

  const githubMatch = content.match(githubRegex);
  if (githubMatch) {
    linksContent.push({
      type: "github",
      url: githubMatch[1].trim(),
    });
  }

  const kaggleMatch = content.match(kaggleRegex);
  if (kaggleMatch) {
    linksContent.push({
      type: "kaggle",
      url: kaggleMatch[1].trim(),
    });
  }

  const emailMatch = content.match(emailRegex);
  if (emailMatch) {
    linksContent.push({
      type: "email",
      url: emailMatch[1].trim(),
    });
  }

  const resumeMatch = content.match(resumeRegex);
  if (resumeMatch) {
    linksContent.push({
      type: "resume",
      url: resumeMatch[1].trim(),
    });
  }

  return linksContent;
}

function parseDocument(document) {
  const headingRegex = /^# /;
  const cardBlockStartRegex = /^:::card$/;
  const linksBlockStartRegex = /^:::links$/;
  const captionBlockStartRegex = /^:::caption$/;
  const blockEndRegex = /^:::$/;
  const spacingBlockRegex = /^:::spacing:::$/;

  let sections = document.split("---");

  sections = sections.map((section) => {
    const sectionContent = [];

    const lines = section
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let currBlock = null;

    lines.forEach((line) => {
      if (headingRegex.test(line)) {
        if (currBlock) {
          sectionContent.push(currBlock);
          currBlock = null;
        }

        sectionContent.push({
          type: "heading",
          content: line.replace(headingRegex, "").trim(),
        });
      } else if (cardBlockStartRegex.test(line)) {
        currBlock = {
          type: "card",
          content: "",
        };
      } else if (linksBlockStartRegex.test(line)) {
        currBlock = {
          type: "links",
          content: "",
        };
      } else if (captionBlockStartRegex.test(line)) {
        currBlock = {
          type: "caption",
          content: "",
        };
      } else if (spacingBlockRegex.test(line)) {
        if (currBlock) {
          sectionContent.push(currBlock);
          currBlock = null;
        }

        sectionContent.push({
          type: "spacing",
        });
      } else if (blockEndRegex.test(line)) {
        if (currBlock.type === "card") {
          currBlock.content = parseCardBlockContent(currBlock.content);
        } else if (currBlock.type === "links") {
          currBlock.content = parseLinksBlockContent(currBlock.content);
        }

        sectionContent.push(currBlock);
        currBlock = null;
      } else {
        if (currBlock) {
          currBlock.content += currBlock.content ? " " + line : line;
        } else {
          currBlock = {
            type: "paragraph",
            content: line,
          };
        }
      }
    });

    if (currBlock) {
      sectionContent.push(currBlock);
    }

    return {
      type: "section",
      content: sectionContent,
    };
  });

  return {
    type: "document",
    content: sections,
  };
}

export const DOCUMENT = `# Hello, I'm Totsuka.

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

# Education

:::card
title: National University of Singapore
subtitle: Bachelor of Computing in Computer Science (Honours)
cover: Aug 2021 - Aug 2025
extras: Programming Methodology, Programming Methodology II, Data Structures 
and Algorithms, Software Engineering, Computer Organisation, Introduction to 
Operating Systems, Database Systems, Introduction to Information Security, 
Introduction to AI and Machine Learning, Design and Analysis of Algorithms, 
Foundations of Machine Learning, Natural Language Processing, Computer Vision 
and Pattern Recognition
:::

---

:::card
title: Chulalongkorn University (NUS Student Exchange Programme)
subtitle: Bachelor of Engineering in Information and Communication Engineering 
(International Program)
cover: Aug 2023 - Dec 2023
extras: Internet of Things, User Interface Design, Principles of Information 
System, Netcentric Architecture
:::

---

# Employment

:::card
title: Pentas Vision (Sony Semiconductor Solutions)
subtitle: Embedded Systems Development Intern
cover: May 2025 - Nov 2025
body: Led development of a production-grade frontend dashboard for 
computer-vision model training workflows, establishing scalable architecture 
and engineering best practices. Designed and implemented a chatbot interface 
powered by LLMs and VLMs, with SSE streaming and rich conversational UI 
(history management, image/file uploads, RAG).
extras: TypeScript, React, Ant Design Pro, Ant Design, ProComponents, 
Ant Design X, UmiJS, OpenAPI, FastAPI, Python, Git, GitLab
:::

---

:::card
title: Rohde & Schwarz
subtitle: Intern, Software Developer
cover: May 2024 - Aug 2024
body: Co-developed a full-stack, real-time lab management dashboard to 
automate lab workflows. Co-implemented microservices with service discovery 
to interface with legacy lab software.
extras: TypeScript, React, Redux, C#, ASP.NET Core, SignalR, gRPC, Consul, 
Git, GitLab
:::

---

# Projects

:::card
title: VisualPython
subtitle: NUS BComp Dissertation (FYP)
cover: /images/visualpython.png
body: Extended a brownfield drag-and-drop Python learning platform with 
real-time collaborative coding sessions for peer-to-peer and instructor 
interaction.
extras: React, Redux, Django, Django Channels, Redis, Daphne, Docker, 
Git, GitHub
:::

---

:::card
title: Battleship
subtitle: CU Netcentric Architecture (2190472)
body: Co-developed the backend of a real-time, online multiplayer, 
"Battleship" web clone.
extras: JavaScript, Express, Socket.IO, Redis, Mongoose, Git, GitHub
:::

---

:::card
title: Smart Trash Can
subtitle: CU Internet of Things (2147336)
body: Co-implemented software for a IoT-based waste-sorting system using 
servos and sensors.
extras: C, Python, STM32, Raspberry Pi
:::

---

:::card
title: myStudent
subtitle: NUS Software Engineering (CS2103T)
body: Co-developed a Java-based tuition centre management application.
extras: Java, JavaFX, JUnit, Git, GitHub, Codecov
:::

---

# Thank you.

I look forward to connecting with you!

:::spacing:::

:::links
linkedin: https://www.linkedin.com/in/totsukatomofumi
github: https://github.com/totsukatomofumi
kaggle: https://www.kaggle.com/totsukatomofumi
email: mailto:totsukatomofumi@gmail.com
:::

:::spacing:::

:::caption
Built with React, Tailwind CSS, Font Awesome, GSAP, and Three.js with R3F 
libraries, and deployed with Vercel.
:::`;

export const DOCUMENT_JSON = parseDocument(DOCUMENT);
