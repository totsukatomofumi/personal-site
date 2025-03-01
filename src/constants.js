import * as THREE from "three";

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
export const PLAYER_H_SPEED = 4.5;
export const PLAYER_V_SPEED = 9;
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
  "Your projects in your inventory may come in handy during your journey.",
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
