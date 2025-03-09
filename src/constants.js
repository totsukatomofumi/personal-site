import moment from "moment";
import * as THREE from "three";
import nusSword from "./sprites/nus-sword.png";
import rsChestplate from "./sprites/rs-chestplate.png";
import cuBelt from "./sprites/cu-belt.png";

export const NAME = "Totsuka Tomofumi";
export const AGE = moment().diff("2000-12-15", "years");
export const OCCUPATION = "Undergraduate";
export const DEBUG_DISABLE_CANVAS = false;
export const SCREEN_BOTTOM_PADDING = 80;
export const MAP_POS = [0, 0, 0];
export const MAP_ROT = [0, -Math.PI / 2, 0];
export const NAVMESH_POS = [MAP_POS[0], MAP_POS[1] - 1, MAP_POS[2]];
export const CAM_FOV = 60;
export const CAM_VERT = 6;
export const CAM_DOWNWARD_ANGLE = 5;
export const MAX_CAM_HORIZ = 1;
export const MIN_CAM_HORIZ = -1;
export const MAX_CAM_DEPTH = 22;
export const MIN_CAM_DEPTH = 10;
export const CAM_ROT = [THREE.MathUtils.degToRad(-CAM_DOWNWARD_ANGLE), 0, 0];
export const CAM_INIT_POS = [0, CAM_VERT, MAX_CAM_DEPTH];
export const MAX_CAM_TRACK_HORIZ = 4;
export const MIN_CAM_TRACK_HORIZ = -4;
export const MIN_CAM_TRACK_DEPTH = -12;
export const MAX_CAM_TRACK_DEPTH = 0;
export const PLAYER_INIT_POS = [0, 1, 0];
export const PLAYER_H_SPEED = 3.5;
export const PLAYER_V_SPEED = 7;
export const PLAYER_INIT_DIR = [true, false, false, false]; // up, left, down, right
export const PLAYER_TIME_PER_IDLE_FRAME = 10;
export const PLAYER_TIME_PER_WALK_FRAME = 0.1;
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
export const INTRO_DURATION = 1.5;
export const DUST_X_AXIS_MAX = 5;
export const DUST_X_AXIS_MIN = -5;
export const DUST_Y_AXIS_MAX = 10;
export const DUST_Y_AXIS_MIN = 0;
export const DUST_Z_AXIS_MAX = 10;
export const DUST_Z_AXIS_MIN = -25;
export const DUST_TIME_PER_ANIM_FRAME = 0.01;
export const DUST_PARTICLE_COUNT = 50;
export const DUST_COLOR = "#9E9C9A";
export const TAVERN_LIGHT_COLOR = "#FFC170";
export const LAMP_LIGHT_COLOR = "#FFA500";
export const NIGHT_SKY_COLOR = "#2C0B4B";
export const TOWN_LIGHT_BRIGHTNESS_SCALE = 1;
export const MOON_LIGHT_BRIGHTNESS_SCALE = 1;
export const CASTLE_LIGHT_BRIGHTNESS_SCALE = 1;
export const NUS_SWORD_DESC = {
  name: "NUS Sword",
  attributes: [["ATK: ", "+1461"]],
  description: [
    "A blade forged in the halls of the National University of Singapore.",
    "A testament to the wearer's ongoing four-year study (Aug 2021 – Present) in the Bachelor of Computing Computing (Honours) in Computer Science, with a focus area in Artificial Intelligence.",
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
export const RS_CHESTPLATE_DESC = {
  name: "R&S Chestplate",
  attributes: [["DEF: ", "+88"]],
  description: [
    "A sturdy chestplate forged in the industry-leading electronics company, Rohde & Schwarz.",
    "A testament to a three-month internship (May 2024 – Aug 2024), where the wearer developed a full-stack, microservice architecture-based lab management dashboard to interface with legacy lab software.",
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
export const CU_BELT_DESC = {
  name: "CU Belt",
  attributes: [["HP: ", "+128"]],
  description: [
    "A belt weaved in the halls of Chulalongkorn University.",
    "A symbol of the wearer's semester-long NUS Student Exchange Programme (Aug 2023 – Dec 2023) to Chulalongkorn University, where the wearer engaged in coursework in the Bachelor of Engineering in Information and Communication Engineering (International Program).",
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
    name: "NUS Sword",
    img: {
      src: nusSword,
      alt: "nus-sword",
    },
    scale: 1,
    position: { x: 27, y: 130 },
    description: NUS_SWORD_DESC,
  },
  {
    name: "R&S Chestplate",
    img: {
      src: rsChestplate,
      alt: "rs-chestplate",
    },
    scale: 1,
    position: { x: 242, y: 236 },
    description: RS_CHESTPLATE_DESC,
  },
  {
    name: "CU Belt",
    img: {
      src: cuBelt,
      alt: "cu-belt",
    },
    scale: 0.9,
    position: { x: 29, y: 239 },
    description: CU_BELT_DESC,
  },
];
export const MENU_ITEM_DESC_BOX_EDGE_PADDING = 10;
export const MENU_ITEM_DESC_BOX_DEFAULT_WIDTH = 250;
export const MENU_ITEM_DESC_BOX_DEFAULT_HEIGHT = "fit-content";
