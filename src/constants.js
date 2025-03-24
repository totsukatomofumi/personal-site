import moment from "moment";
import * as THREE from "three";
import nusSword from "./sprites/nus-sword.png";
import rsChestplate from "./sprites/rs-chestplate.png";
import cuBelt from "./sprites/cu-belt.png";
import mystudentProj from "./sprites/mystudent-proj.png";
import battleshipProj from "./sprites/battleship-proj.png";
import smarttrashcanProj from "./sprites/smarttrashcan-proj.png";
import resumeIcon from "./sprites/resume-icon.png";

export const DEBUG_DISABLE_CANVAS = false;
export const DEBUG_DISABLE_COLLISION = false;
export const DEBUG_ENABLE_CAM_ORBIT_CONTROLS = false;
export const DEBUG_CAM_ORBIT_CONTROLS_TARGET = [0, 2, -30];
export const DEBUG_ENABLE_AMBIENT_LIGHT = false;
export const DYNAMIC_DPR_FACTOR = 0.4; // 0 to 1, 1 is max dpr
export const NAME = "Totsuka Tomofumi";
export const AGE = moment().diff("2000-12-15", "years");
export const OCCUPATION = "Undergraduate";
export const MAP_POS = [0, 0, 0];
export const MAP_ROT = [0, -Math.PI / 2, 0];
export const NAVMESH_POS = [MAP_POS[0], MAP_POS[1] - 1, MAP_POS[2]];
export const CAM_FOV = 30;
export const CAM_VERT = 7;
export const CAM_DOWNWARD_ANGLE = 9.5;
export const MAX_CAM_HORIZ = 1;
export const MIN_CAM_HORIZ = -1;
export const MAX_CAM_DEPTH = 22;
export const MIN_CAM_DEPTH = 10;
export const CAM_ROT = [THREE.MathUtils.degToRad(-CAM_DOWNWARD_ANGLE), 0, 0];
export const CAM_INIT_POS = [0, CAM_VERT, MAX_CAM_DEPTH];
export const MAX_CAM_TRACK_HORIZ = 4;
export const MIN_CAM_TRACK_HORIZ = -4;
export const MIN_CAM_TRACK_DEPTH = -15;
export const MAX_CAM_TRACK_DEPTH = -3;
export const PLAYER_INIT_POS = [0, 1, 5.5];
export const PLAYER_H_SPEED = 3.5;
export const PLAYER_V_SPEED = 7;
export const PLAYER_INIT_DIR = [true, false, false, false]; // up, left, down, right
export const PLAYER_TIME_PER_IDLE_FRAME = 10;
export const PLAYER_TIME_PER_WALK_FRAME = 0.1;
export const PLAYER_INTRO_Z = 12;
export const PLAYER_INTRO_SPEED_OFFSET = 0.3;
export const PLAYER_INTRO_DELAY = 1;
export const SPRITE_WIDTH = 2;
export const SPRITE_HEIGHT = 2;
export const SPRITE_HORIZ_TILES_NUM = 4;
export const SPRITE_VERT_TILES_NUM = 8;
export const SPRITE_SEQUENCES = {
  idleLeft: [0, 1],
  idleUp: [4, 5],
  idleRight: [8, 9],
  idleDown: [12, 13],
  walkLeft: [16, 17, 18, 19],
  walkUp: [20, 21, 22, 23],
  walkRight: [24, 25, 26, 27],
  walkDown: [28, 29, 30, 31],
};
export const SPRITE_DIAGONAL_THRESHOLD_SCALE = 0.6;
export const NPC_DIALOG_TRIGGER_ELAPSED_TIME = 2;
export const NPC_DIALOG_TEXT_TIME_PER_CHAR = 0.025;
export const NPC_KNIGHT_DIALOG_ARRAY = [
  "Ah, Totsuka Tomofumi! Welcome back, traveller. It's good to see you again.",
  "Word of your journey has spread far and wide, reaching even the farthest corners of the continent.",
  "I've heard of your dedication as a final-year student at the National University of Singapore.",
  "And your determination as an aspiring web developer and machine learner.",
  "You've even honed your craft at a renowned German electronics company.",
  "Great work so far, and I can't wait to see what you'll achieve next.",
  "Ah, before you head out, don't forget to check your equipment and inventory.",
  "You'll find equipment from your past academic and work experiences.",
  "And your projects in your inventory may come in handy during your journey.",
  "Whenever you seek guidance or a word of advice, you know where to find me.",
  "Safe adventures, traveller! May your path be bold and your resolve remain unshaken.",
];
export const NPC_KNIGHT_DIALOG_TUTORIAL_INDEX = 6;
export const NPC_KNIGHT_INIT_POS = [0, 1, -1.5];
export const NPC_KNIGHT_INIT_DIR = [false, false, true, false]; // up, left, down, right
export const NPC_KNIGHT_TIME_PER_IDLE_FRAME = 6;
export const NPC_KNIGHT_TIME_PER_WALK_FRAME = 0.1;
export const NPC_KNIGHT_TIME_PER_BLINK_FRAME = 0.1;
export const MAX_NPC_KNIGHT_BLINK_TIME_ADVANCE = 3;
export const NPC_CAT_DIALOG_ARRAY = ["Meow..."];
export const NPC_CAT_INIT_POS = [-2.2, 1, -17];
export const NPC_CAT_INIT_DIR = [false, false, false, true]; // up, left, down, right
export const NPC_CAT_TIME_PER_IDLE_FRAME = 3;
export const NPC_CAT_TIME_PER_WALK_FRAME = 0.1;
export const NPC_CAT_TIME_PER_BLINK_FRAME = 1;
export const MAX_NPC_CAT_BLINK_TIME_ADVANCE = 0;
export const DUST_X_AXIS_MAX = 7;
export const DUST_X_AXIS_MIN = -7;
export const DUST_Y_AXIS_MAX = 10;
export const DUST_Y_AXIS_MIN = 0;
export const DUST_Z_AXIS_MAX = 22;
export const DUST_Z_AXIS_MIN = -25;
export const DUST_TIME_PER_ANIM_FRAME = 0.01;
export const DUST_PARTICLE_COUNT = 60;
export const DUST_COLOR = "#9E9C9A";
export const TAVERN_LIGHT_COLOR = "#FFC170";
export const LAMP_LIGHT_COLOR = "#FFA500";
export const NIGHT_SKY_COLOR = "#2C0B4B";
export const TOWN_LIGHT_BRIGHTNESS_SCALE = 1;
export const MOON_LIGHT_BRIGHTNESS_SCALE = 1;
export const CASTLE_LIGHT_BRIGHTNESS_SCALE = 1;
const NUS_SWORD_DESC = {
  name: "NUS Sword",
  attributes: [["ATK: ", "+1461"]],
  description: [
    "A blade forged in the halls of the National University of Singapore.",
    "A testament to the wielder's ongoing four-year study (Aug 2021 – Present) in the Bachelor of Computing Computing (Honours) in Computer Science, with a focus area in Artificial Intelligence.",
  ],
  additional: [
    "Relevant Coursework:",
    [
      "- Programming Methodology",
      "- Programming Methodology II",
      "- Data Structures and Algorithms",
      "- Software Engineering",
      "- Computer Organisation",
      "- Introduction to Operating Systems",
      "- Database Systems",
      "- Introduction to Information Security",
      "- Introduction to AI and Machine Learning",
      "- Design and Analysis of Algorithms",
      "- Foundations of Machine Learning",
      "- Natural Language Processing",
      "- Computer Vision and Pattern Recognition",
    ],
  ],
};
const RS_CHESTPLATE_DESC = {
  name: "R&S Chestplate",
  attributes: [["DEF: ", "+88"]],
  description: [
    "A sturdy chestplate forged in the industry-leading electronics company, Rohde & Schwarz.",
    "A testament to a three-month internship (May 2024 – Aug 2024), where the wearer developed a full-stack, microservice architecture-based lab management dashboard to interface with legacy lab software.",
    "Built using TypeScript, React, and Redux for the frontend, the system utilises an ASP.NET backend with SignalR for real-time dashboard updates. Microservices were developed to interface with legacy software and called via gRPC, with service discovery through Consul.",
  ],
  additional: [
    "Leveraged Knowledge:",
    [
      "- TypeScript",
      "- React",
      "- Redux",
      "- C#",
      "- ASP.NET Core 8.0",
      "- SignalR",
      "- gRPC",
      "- Consul",
      "- Git",
      "- GitLab",
    ],
  ],
};
const CU_BELT_DESC = {
  name: "CU Belt",
  attributes: [["HP: ", "+128"]],
  description: [
    "A belt weaved in the halls of Chulalongkorn University.",
    "A symbol of the wearer's semester-long NUS Student Exchange Programme (Aug 2023 – Dec 2023), where the wearer engaged in coursework in the Bachelor of Engineering in Information and Communication Engineering (International Program) at Chulalongkorn University.",
  ],
  additional: [
    "Relevant Coursework:",
    [
      "- Internet of Things",
      "- User Interface Design",
      "- Principles of Information System",
      "- Netcentric Architecture",
    ],
  ],
};
export const EQUIPMENT = [
  {
    img: {
      src: nusSword,
      alt: "nus-sword",
    },
    scale: 1,
    position: { x: 26, y: 132 },
    description: NUS_SWORD_DESC,
  },
  {
    img: {
      src: rsChestplate,
      alt: "rs-chestplate",
    },
    scale: 1,
    position: { x: 242, y: 237 },
    description: RS_CHESTPLATE_DESC,
  },
  {
    img: {
      src: cuBelt,
      alt: "cu-belt",
    },
    scale: 1,
    position: { x: 26.5, y: 237 },
    description: CU_BELT_DESC,
  },
];
const SMARTTRASHCAN_PROJ_DESC = {
  name: "Smart Trash Can Blueprint",
  description: [
    "A blueprint detailing the IoT-based Smart Trash Can co-developed during the holder's time at Chulalongkorn University.",
    "Using an STM32 MCU and Raspberry Pi with cross-board serial communication, it sorts recyclable waste using multiple servos, sensors, and a camera powered by a TensorFlow Lite pretrained model. The system also features integrated real-time LINE notifications and a NETPIE dashboard for live device monitoring.",
    "The holder was primarily responsible for software implementation and integration.",
  ],
  additional: ["Utilised:", ["- C", "- Python", "- STM32", "- Raspberry Pi"]],
};
const BATTLESHIP_PROJ_DESC = {
  name: "Battleship Grimoire",
  description: [
    "A grimoire containing a real-time, online multiplayer, browser-based Battleship game, co-developed during the holder's time at Chulalongkorn University.",
    "Built with JavaScript and React for the frontend, the project features an Express with Node.js backend with Socket.IO and Redis enabling real-time player interactions and game state updates. Mongoose and MongoDB were integrated to manage persistent player data.",
    "The holder was primarily responsible for backend development. ",
  ],
  additional: [
    "Utilised:",
    [
      "- JavaScript",
      "- Express",
      "- Socket.IO",
      "- Redis",
      "- Mongoose",
      "- Git",
      "- GitHub",
    ],
  ],
  link: [
    "Click here to view project repository.",
    "https://github.com/battleship-web/battleship",
  ],
};
const MYSTUDENT_PROJ_DESC = {
  name: "myStudent Grimoire",
  description: [
    "A grimoire containing the myStudent desktop application, designed to help tuition centers manage students, tutors, and classes, co-developed during the holder's time at the National University of Singapore.",
    "Built with Java and JavaFX, the application uses local JSON-based data persistence and incorporates JUnit for unit testing.",
    "The holder was primary responsible for implementing the core application logic.",
  ],
  additional: [
    "Utilised:",
    ["- Java", "- JavaFX", "- JUnit", "- Git", "- GitHub", "- Codecov"],
  ],
  link: [
    "Click here to view project website.",
    "http://ay2223s1-cs2103t-f12-4.github.io/tp/",
  ],
};
const RESUME_DESC = {
  name: "Resume",
  description: ["A document containing the holder's resume."],
  link: ["Click here to view document.", "/resume.pdf"],
};
export const INVENTORY = [
  {
    img: {
      src: smarttrashcanProj,
      alt: "smarttrashcan-proj",
    },
    scale: 0.95,
    position: { x: 27.5, y: 58 },
    description: SMARTTRASHCAN_PROJ_DESC,
  },
  {
    img: {
      src: battleshipProj,
      alt: "battleship-proj",
    },
    scale: 1.05,
    position: { x: 97, y: 54 },
    description: BATTLESHIP_PROJ_DESC,
  },
  {
    img: {
      src: mystudentProj,
      alt: "mystudent-proj",
    },
    scale: 1.05,
    position: { x: 168.5, y: 54 },
    description: MYSTUDENT_PROJ_DESC,
  },
  {
    img: {
      src: resumeIcon,
      alt: "resume-icon",
    },
    scale: 1,
    position: { x: 241.5, y: 55.5 },
    description: RESUME_DESC,
  },
];
export const MENU_ITEM_DESC_BOX_EDGE_PADDING = 10;
export const MENU_ITEM_DESC_BOX_DEFAULT_WIDTH = 225;
export const MENU_ITEM_DESC_BOX_DEFAULT_HEIGHT = "fit-content";
export const ATTRIBUTIONS = [
  {
    title: ["Notice board low-poly", "https://skfb.ly/oQNPu"],
    creator: ["Viktor_", "https://sketchfab.com/Viktor.Zhuravlev"],
    license: ["CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"],
  },
  {
    title: ["Barrels", "https://skfb.ly/o8vFz"],
    creator: ["RipeR", "https://sketchfab.com/RipeR"],
    license: ["CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"],
  },
  {
    title: ["Medieval Lamp Post", "https://skfb.ly/6XuLK"],
    creator: ["Daan van Leeuwen", "https://sketchfab.com/superwortel"],
    license: ["CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"],
  },
  {
    title: ["Shop", "https://skfb.ly/6XnSq"],
    creator: ["Vadim Rychkov", "https://sketchfab.com/vadim_rychkov"],
    license: ["CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"],
  },
  {
    title: ["Stylized medieval cart with a lamp", "https://skfb.ly/orPrz"],
    creator: ["3D_Kod", "https://sketchfab.com/3D_Kod"],
    license: ["CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"],
  },
  {
    title: ["Castle", "https://skfb.ly/otLpZ"],
    creator: ["hamidkhan224", "https://sketchfab.com/hamidkhan224"],
    license: ["CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"],
  },
  {
    title: ["Medieval_Wooden-Ladder", "https://skfb.ly/6snwq"],
    creator: ["ArcheoteryxFr", "https://sketchfab.com/Archeopteryxfr"],
    license: [
      "CC BY-NC-ND 4.0",
      "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    ],
  },
  {
    title: ["Porte Saint-Vincent Gate, Vannes", "https://skfb.ly/6UWUo"],
    creator: ["Lost Gecko", "https://sketchfab.com/Lost_Gecko"],
    license: ["CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"],
  },
  {
    title: [
      "lowpoly animated medieval signs (Blender.file)",
      "https://skfb.ly/p7Dw9",
    ],
    creator: ["n-malmberg", "https://sketchfab.com/n-malmberg"],
    license: ["CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"],
  },
];
export const FINAL_NOTE =
  "Built with React, Tailwind CSS, and Three.js with R3F libraries, and deployed with Vercel.";
export const EMAIL = "totsukatomofumi@gmail.com";
export const GITHUB = "https://github.com/totsukatomofumi";
export const KAGGLE = "https://www.kaggle.com/totsukatomofumi";
export const LINKEDIN = "https://www.linkedin.com/in/totsukatomofumi";
