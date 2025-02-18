import { forwardRef, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Map from "./models/Map";
import NavMesh from "./models/Navmesh";
import playerSprite from "./sprites/player.png";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { isMobile, useMobileOrientation } from "react-device-detect";
import moment from "moment";
import uiStatus from "./sprites/ui-status.png";
import uiButton from "./sprites/ui-button.png";
import uiMenuBase from "./sprites/ui-menu-base.png";
import uiMenuTitle from "./sprites/ui-menu-title.png";
import uiCloseButtom from "./sprites/ui-close-button.png";
import uiNavLeftButton from "./sprites/ui-nav-left-button.png";
import uiNavRightButton from "./sprites/ui-nav-right-button.png";
import uiEquipmentChar from "./sprites/ui-equipment-char.png";
import uiEquipmentSlots from "./sprites/ui-equipment-slots.png";
import uiEquipmentSlotsLink from "./sprites/ui-equipment-slots-link.png";
import uiInventory from "./sprites/ui-inventory.png";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const { isLandscape } = useMobileOrientation();
  const isJoyStickActive = useRef(false);
  const joystickPos = useRef([0, 0]); // x, y max 50

  if (!isMobile) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen pb-[80px] touch-none ">
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-2xl font-bold">Please use a mobile device</div>
        </div>
      </div>
    );
  }

  if (isLandscape) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen pb-[80px] touch-none ">
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-2xl font-bold">Please use potrait mode</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen pb-[80px] touch-none bg-black">
      <div className="relative w-full h-full">
        {isLoadingScreen ? (
          <Loading
            isLoaded={isLoaded}
            setIsLoadingScreen={setIsLoadingScreen}
          />
        ) : null}
        <Canvas
          onCreated={() => {
            setIsLoaded(true);
          }}
        >
          <Scene
            isJoyStickActive={isJoyStickActive}
            joystickPos={joystickPos}
          />
        </Canvas>
        <Joystick
          isJoyStickActive={isJoyStickActive}
          joystickPos={joystickPos}
        />
        <Ui />
      </div>
    </div>
  );
}

function Loading({ isLoaded, setIsLoadingScreen }) {
  const self = useRef();
  const loadingRef = useRef();
  const firstDotRef = useRef();
  const secondDotRef = useRef();
  const thirdDotRef = useRef();

  // loading animation
  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1 });

    tl.set([firstDotRef.current, secondDotRef.current, thirdDotRef.current], {
      opacity: 0,
    });
    tl.set(firstDotRef.current, { opacity: 1 }, "+=0.1");
    tl.set(secondDotRef.current, { opacity: 1 }, "+=0.1");
    tl.set(thirdDotRef.current, { opacity: 1 }, "+=0.1");
    tl.set({}, {}, "+=0.1");
  }, {});

  // fade out loading screen
  useGSAP(
    () => {
      if (isLoaded) {
        const tl = gsap.timeline();

        tl.set(loadingRef.current, { display: "none" });
        tl.to(
          self.current,
          { opacity: 0, duration: 1.5, ease: "none" },
          "+=0.5"
        );
        tl.call(() => {
          setIsLoadingScreen(false);
        });
      }
    },
    { dependencies: [isLoaded, setIsLoadingScreen] }
  );

  return (
    <div
      ref={self}
      className="absolute top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black"
    >
      <div ref={loadingRef} className="text-white text-2xl font-vt323">
        <p>
          Loading<span ref={firstDotRef}>.</span>
          <span ref={secondDotRef}>.</span>
          <span ref={thirdDotRef}>.</span>
        </p>
      </div>
    </div>
  );
}

function animateUiButton(buttonRef, toggle, scale = 0.9) {
  if (buttonRef.current === null || buttonRef.current === undefined) return;

  // toggles should be initialised as null if dont want animation to run on mounting
  if (toggle === null) return;

  const tl = gsap.timeline();

  tl.fromTo(
    buttonRef.current,
    { scale: 1 },
    { scale: scale, duration: 0.05 }
  ).to(buttonRef.current, { scale: 1, duration: 0.05 });
}

function Ui() {
  const [isMenu, setIsMenu] = useState(false);
  const [toggleButtonAnim, setToggleButtonAnim] = useState(null);
  const uiButtonRef = useRef();

  function handleOnClick() {
    setToggleButtonAnim((prev) => (prev === null ? false : !prev));
    setTimeout(() => {
      setIsMenu(true);
    }, 100);
  }

  // button animation
  useGSAP(() => animateUiButton(uiButtonRef, toggleButtonAnim), {
    dependencies: [toggleButtonAnim],
  });

  return (
    <>
      <div className="absolute top-5 left-5 z-40 w-fit h-[80px]">
        <img src={uiStatus} alt="ui-status" className="h-full" />
      </div>

      <div className="absolute bottom-5 z-40 right-5 w-fit h-[80px]">
        <img
          ref={uiButtonRef}
          src={uiButton}
          alt="ui-button"
          className="h-full"
          onClick={handleOnClick}
        />
      </div>

      {isMenu ? <Menu setIsMenu={setIsMenu} /> : null}
    </>
  );
}

function Menu({ setIsMenu }) {
  const [pageNum, setPageNum] = useState(1);

  // level age calculation
  const age = moment().diff("2000-12-15", "years");
  const occupation = "Undergraduate";

  const equipmentPage = (
    <>
      <div className="absolute top-[50px] left-[32.5px] z-50 flex flex-col justify-center items-center font-vt323 text-left text-custom-off-white whitespace-pre-line leading-tight drop-shadow-sm">
        <p>
          <span className="text-custom-white text-xl leading-none">
            Totsuka Tomofumi
          </span>
          {`\n`}
          {occupation}
          <span className="text-custom-gold">{`\nLevel: `}</span>
          {age}
        </p>
      </div>

      <div className="relative z-0 w-fit h-full">
        <img src={uiMenuBase} alt="ui-equipment" className="h-full" />
        <img
          src={uiEquipmentChar}
          alt="ui-equipment-char"
          className="absolute top-0 left-0 z-40 h-full"
        />
        <img
          src={uiEquipmentSlots}
          alt="ui-equipment-slots"
          className="absolute top-0 left-0 z- 50 h-full"
        />
        <img
          src={uiEquipmentSlotsLink}
          alt="ui-equipment-slots-link"
          className="absolute top-0 left-0 z-50 h-full"
        />
      </div>
    </>
  );

  const inventoryPage = (
    <>
      <img src={uiInventory} alt="ui-inventory" className="h-full" />
    </>
  );

  const creditsPage = (
    <>
      <img src={uiMenuBase} alt="ui-menu-base" className="h-full" />
    </>
  );

  const pages = [equipmentPage, inventoryPage, creditsPage];
  const titles = ["Equipment", "Inventory", "Credits"];

  function handleOnClickUiNavLeftButton() {
    setToggleUiNavLeftButtonAnim((prev) => (prev === null ? false : !prev));
    setTimeout(() => {
      setPageNum((prev) => (prev === 1 ? 1 : prev - 1));
    }, 100);
  }

  function handleOnClickUiNavRightButton() {
    setToggleUiNavRightButtonAnim((prev) => (prev === null ? false : !prev));
    setTimeout(() => {
      setPageNum((prev) => (prev === 3 ? 3 : prev + 1));
    }, 100);
  }

  function handleOnClick() {
    setIsMenu(false);
  }

  function handleOnClickUiCloseButton() {
    setToggleUiCloseButtonAnim((prev) => (prev === null ? false : !prev));
    setTimeout(() => {
      setIsMenu(false);
    }, 100);
  }

  // button animations
  const uiNavLeftButtonRef = useRef();
  const uiNavRightButtonRef = useRef();
  const uiCloseButtonRef = useRef();
  const [toggleUiNavLeftButtonAnim, setToggleUiNavLeftButtonAnim] =
    useState(null);
  const [toggleUiNavRightButtonAnim, setToggleUiNavRightButtonAnim] =
    useState(null);
  const [toggleUiCloseButtonAnim, setToggleUiCloseButtonAnim] = useState(null);

  useGSAP(
    () => animateUiButton(uiNavLeftButtonRef, toggleUiNavLeftButtonAnim, 0.8),
    {
      dependencies: [toggleUiNavLeftButtonAnim],
    }
  );

  useGSAP(
    () => animateUiButton(uiNavRightButtonRef, toggleUiNavRightButtonAnim, 0.8),
    {
      dependencies: [toggleUiNavRightButtonAnim],
    }
  );

  useGSAP(
    () => animateUiButton(uiCloseButtonRef, toggleUiCloseButtonAnim, 0.8),
    {
      dependencies: [toggleUiCloseButtonAnim],
    }
  );

  return (
    <div className="absolute top-0 left-0 z-50 w-full h-full flex justify-center items-center">
      <div className="relative w-fit h-[500px]">
        {pages[pageNum - 1]}

        <div className="absolute -top-[6px] left-0 z-40 w-full h-fit flex justify-center items-center">
          <div className="relative w-fit h-[30px]">
            <div className="absolute top-0 left-0 w-full h-full text-center text-custom-gold font-vt323 font-semibold text-xl">
              {titles[pageNum - 1]}
            </div>
            <img src={uiMenuTitle} alt="ui-menu-title" className="h-full" />
          </div>
        </div>

        <div className="absolute -top-[10px] -right-[10px] z-50 w-fit h-[40px]">
          <img
            ref={uiCloseButtonRef}
            src={uiCloseButtom}
            alt="ui-close-button"
            className="h-full"
            onClick={handleOnClickUiCloseButton}
          />
        </div>

        <div className="absolute bottom-[30px] w-full h-[30px] flex flex-row justify-center items-center">
          <div className="w-fit h-full">
            <img
              ref={uiNavLeftButtonRef}
              src={uiNavLeftButton}
              alt="ui-nav-left-button"
              className="h-full"
              onClick={pageNum === 1 ? null : handleOnClickUiNavLeftButton}
              style={{ opacity: pageNum === 1 ? 0.5 : 1 }}
            />
          </div>

          <div className="w-[50px] text-center text-custom-gold font-vt323">
            {pageNum} / 3
          </div>

          <div className="w-fit h-full">
            <img
              ref={uiNavRightButtonRef}
              src={uiNavRightButton}
              alt="ui-nav-right-button"
              className="h-full"
              onClick={pageNum === 3 ? null : handleOnClickUiNavRightButton}
              style={{ opacity: pageNum === 3 ? 0.5 : 1 }}
            />
          </div>
        </div>
      </div>
      <div
        className="absolute top-0 left-0 w-full h-full -z-50 bg-black opacity-50"
        onClick={handleOnClick}
      ></div>
    </div>
  );
}

const MAX_JOYSTICK_POS = 50;

function Joystick({ isJoyStickActive, joystickPos }) {
  const [isActive, setIsActive] = useState(false);
  const [initTouchPos, setInitTouchPos] = useState([0, 0]);
  const [currTouchPos, setCurrTouchPos] = useState([0, 0]);
  const [touchId, setTouchId] = useState(null);
  const baseRef = useRef();
  const stickRef = useRef();

  // pass joystick position to parent
  useEffect(() => {
    isJoyStickActive.current = isActive;

    let x = currTouchPos[0] - initTouchPos[0];
    let y = currTouchPos[1] - initTouchPos[1];

    if (x > MAX_JOYSTICK_POS) x = MAX_JOYSTICK_POS;
    if (x < -MAX_JOYSTICK_POS) x = -MAX_JOYSTICK_POS;
    if (y > MAX_JOYSTICK_POS) y = MAX_JOYSTICK_POS;
    if (y < -MAX_JOYSTICK_POS) y = -MAX_JOYSTICK_POS;

    joystickPos.current = [x, y];
  }, [isActive, initTouchPos, currTouchPos, isJoyStickActive, joystickPos]);

  function handleOnTouchStart(e) {
    const touch = e.changedTouches[0];

    setTouchId(touch.identifier);
    setInitTouchPos([touch.clientX, touch.clientY]);
    setCurrTouchPos([touch.clientX, touch.clientY]);

    setIsActive(true);
  }

  function handleOnTouchMove(e) {
    let touch = null;

    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        touch = e.changedTouches[i];
        break;
      }
    }

    if (touch === null) return;
    setCurrTouchPos([touch.clientX, touch.clientY]);
  }

  function handleOnTouchEnd(e) {
    setCurrTouchPos(initTouchPos);
    setIsActive(false);
  }

  // joystick fade in
  useGSAP(
    () => {
      if (baseRef.current === null) return;

      const opacity = isActive ? 1 : 0;

      const tl = gsap.timeline();

      tl.to(baseRef.current, { opacity: opacity, duration: 0.2 });
    },
    { dependencies: [isActive] }
  );

  // joystick movement animation
  useGSAP(
    () => {
      if (baseRef.current === null) return;

      const tl = gsap.timeline();

      tl.set(baseRef.current, { x: initTouchPos[0], y: initTouchPos[1] });
      tl.set(stickRef.current, { x: 0, y: 0 });
    },
    { dependencies: [baseRef, initTouchPos] }
  );

  useGSAP(
    () => {
      if (stickRef.current === null) return;

      const tl = gsap.timeline();

      tl.to(stickRef.current, {
        x: currTouchPos[0] - initTouchPos[0],
        y: currTouchPos[1] - initTouchPos[1],
        duration: 0.1,
      });
    },
    { dependencies: [stickRef, currTouchPos, initTouchPos] }
  );

  return (
    <div
      className="absolute top-0 left-0 w-full h-full z-30"
      onTouchStart={handleOnTouchStart}
      onTouchEnd={handleOnTouchEnd}
      onTouchMove={handleOnTouchMove}
    >
      <div
        ref={baseRef}
        className="absolute top-0 left-0 w-[100px] h-[100px] flex justify-center items-center translate-x-[-50px] translate-y-[-50px] opacity-0"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-black rounded-full"></div>
        <div
          ref={stickRef}
          className="w-[40px] h-[40px] opacity-50 bg-black rounded-full"
        ></div>
      </div>
    </div>
  );
}

const MAP_POS = [0, 0, 0];
const MAP_ROT = [0, -Math.PI / 2, 0];
const CAM_VERT = 6;
const CAM_ROT = -5;
const MAX_CAM_DEPTH = 22;
const MIN_CAM_DEPTH = 10;
const MAX_CAM_HORIZ = 1;
const MIN_CAM_HORIZ = -1;

function Scene({ isJoyStickActive, joystickPos }) {
  const playerRef = useRef();

  useThree(({ gl, camera }) => {
    gl.setClearColor("white");
    camera.setFocalLength(60);
    camera.position.set(0, CAM_VERT, MAX_CAM_DEPTH); // horiz x [-1, 1] vert y [6] depth z [10, 22]
    camera.rotation.set(THREE.MathUtils.degToRad(CAM_ROT), 0, 0); // angle at -5
  });

  return (
    <>
      <Camera playerRef={playerRef} />
      <Player
        ref={playerRef}
        isJoyStickActive={isJoyStickActive}
        joystickPos={joystickPos}
      />
      <Map position={MAP_POS} rotation={MAP_ROT} renderOrder={1} />

      <ambientLight intensity={2} />
      <fog attach="fog" args={["white", 0, 180]} />
    </>
  );
}

function Camera({ playerRef }) {
  const maxHoriz = 4;
  const minDepth = -12;
  const maxDepth = 0;
  const [toggleAnim, setToggleAnim] = useState(false);
  const cameraRef = useRef();

  useThree(({ camera }) => {
    cameraRef.current = camera;
  });

  useFrame(() => {
    setToggleAnim((prev) => !prev);
  });

  useGSAP(
    () => {
      if (playerRef.current === null || playerRef.current === undefined) return;

      const tl = gsap.timeline();

      // [-4, 4]
      const playerHoriz =
        Math.abs(playerRef.current.position.x) > maxHoriz
          ? Math.sign(playerRef.current.position.x) * maxHoriz
          : playerRef.current.position.x;

      // [-10, 0]
      const playerDepth =
        playerRef.current.position.z < maxDepth
          ? playerRef.current.position.z > minDepth
            ? playerRef.current.position.z
            : minDepth
          : maxDepth;

      const camHoriz = (playerHoriz / maxHoriz) * MAX_CAM_HORIZ;
      const camDepth =
        MAX_CAM_DEPTH +
        (playerDepth / (maxDepth - minDepth)) * (MAX_CAM_DEPTH - MIN_CAM_DEPTH);

      tl.to(cameraRef.current.position, {
        x: camHoriz,
        z: camDepth,
        duration: 1,
      });
    },
    { dependencies: [cameraRef, toggleAnim] }
  );

  return null;
}

const Player = forwardRef(function Player(
  { joystickPos, isJoyStickActive },
  playerRef
) {
  const playerWidth = 2;
  const playerHeight = 2;
  const playerInitPos = [0, 1, 0];

  // Move player
  const hSpeed = 4;
  const vSpeed = 11;
  const activeKeys = useRef([false, false, false, false]); // w, a, s, d
  const playerDir = useRef([true, false, false, false]); // up, left, down, right
  const isPlayerMoving = useRef(false);

  // joystick

  useEffect(() => {
    function handleKeyDown(e) {
      if (!e.repeat) {
        switch (e.key) {
          case "w":
            activeKeys.current[0] = true;
            break;
          case "a":
            activeKeys.current[1] = true;
            break;
          case "s":
            activeKeys.current[2] = true;
            break;
          case "d":
            activeKeys.current[3] = true;
            break;
          default:
        }
      }
    }

    function handleKeyUp(e) {
      switch (e.key) {
        case "w":
          activeKeys.current[0] = false;
          break;
        case "a":
          activeKeys.current[1] = false;
          break;
        case "s":
          activeKeys.current[2] = false;
          break;
        case "d":
          activeKeys.current[3] = false;
          break;
        default:
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // per frame
  function movePlayerKeyboard(delta) {
    const [w, a, s, d] = activeKeys.current;

    if (w) {
      const distance = vSpeed * delta;

      // do prediction
      const predictionOrigin = new THREE.Vector3();
      predictionOrigin.copy(playerRef.current.position);
      predictionOrigin.z -= distance;
      raycasterRef.current.ray.origin.copy(predictionOrigin);

      if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
        playerRef.current.position.z -= distance;
      }
    }
    if (a) {
      const distance = hSpeed * delta;

      // do prediction
      const predictionOrigin = new THREE.Vector3();
      predictionOrigin.copy(playerRef.current.position);
      predictionOrigin.x -= distance;
      raycasterRef.current.ray.origin.copy(predictionOrigin);

      if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
        playerRef.current.position.x -= distance;
      }
    }
    if (s) {
      const distance = vSpeed * delta;

      // do prediction
      const predictionOrigin = new THREE.Vector3();
      predictionOrigin.copy(playerRef.current.position);
      predictionOrigin.z += distance;
      raycasterRef.current.ray.origin.copy(predictionOrigin);

      if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
        playerRef.current.position.z += distance;
      }
    }
    if (d) {
      const distance = hSpeed * delta;

      // do prediction
      const predictionOrigin = new THREE.Vector3();
      predictionOrigin.copy(playerRef.current.position);
      predictionOrigin.x += distance;
      raycasterRef.current.ray.origin.copy(predictionOrigin);

      if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
        playerRef.current.position.x += distance;
      }
    }

    if (w || a || s || d) {
      isPlayerMoving.current = true;
      playerDir.current = [w, a, s, d];
    } else {
      isPlayerMoving.current = false;
    }
  }

  function movePlayerJoystick(delta) {
    if (!isJoyStickActive.current) {
      return;
    }

    const [x, y] = joystickPos.current;
    const vDist = (y / MAX_JOYSTICK_POS) * vSpeed * delta;
    const hDist = (x / MAX_JOYSTICK_POS) * hSpeed * delta;

    const predictionOrigin = new THREE.Vector3();
    predictionOrigin.copy(playerRef.current.position);
    predictionOrigin.x += hDist;
    raycasterRef.current.ray.origin.copy(predictionOrigin);

    if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
      playerRef.current.position.x += hDist;
    }

    predictionOrigin.copy(playerRef.current.position);
    predictionOrigin.z += vDist;
    raycasterRef.current.ray.origin.copy(predictionOrigin);

    if (raycasterRef.current.intersectObject(navMeshRef.current).length > 0) {
      playerRef.current.position.z += vDist;
    }

    const diagThreshold = 20;

    if (x !== 0 || y !== 0) {
      isPlayerMoving.current = true;
      playerDir.current = [
        y < 0,
        Math.abs(y) < 10 ? x < 0 : x < -diagThreshold,
        y > 0,
        Math.abs(y) < 10 ? x > 0 : x > diagThreshold,
      ];
    } else {
      isPlayerMoving.current = false;
    }
  }

  useFrame((state, delta, xrFrame) => {
    movePlayerKeyboard(delta);
    movePlayerJoystick(delta);
  });

  // Sprite animations
  const playerSpriteMap = useLoader(THREE.TextureLoader, playerSprite);
  const tilesHoriz = 4;
  const tilesVert = 8;
  playerSpriteMap.magFilter = THREE.NearestFilter;
  playerSpriteMap.repeat.set(1 / tilesHoriz, 1 / tilesVert);

  const tileIndex = useRef(0);
  const elapsedTime = useRef(0);
  const idleLeft = [0, 1];
  const idleUp = [4, 5];
  const idleRight = [8, 9];
  const idleDown = [12, 13];
  const walkLeft = [16, 17, 18, 19];
  const walkUp = [20, 21, 22, 23];
  const walkRight = [24, 25, 26, 27];
  const walkDown = [28, 29, 30, 31];
  const timePerFrame = 0.1;

  function animatePlayerSprite(delta) {
    elapsedTime.current += delta;

    if (elapsedTime.current < timePerFrame) return;

    elapsedTime.current = 0;

    const [isDirUp, isDirLeft, isDirDown, isDirRight] = playerDir.current;

    if (isPlayerMoving.current) {
      if (isDirLeft) {
        if (tileIndex.current === walkLeft[0]) {
          tileIndex.current = walkLeft[1];
        } else if (tileIndex.current === walkLeft[1]) {
          tileIndex.current = walkLeft[2];
        } else if (tileIndex.current === walkLeft[2]) {
          tileIndex.current = walkLeft[3];
        } else if (tileIndex.current === walkLeft[3]) {
          tileIndex.current = walkLeft[0];
        } else {
          tileIndex.current = walkLeft[0];
        }
      } else if (isDirRight) {
        if (tileIndex.current === walkRight[0]) {
          tileIndex.current = walkRight[1];
        } else if (tileIndex.current === walkRight[1]) {
          tileIndex.current = walkRight[2];
        } else if (tileIndex.current === walkRight[2]) {
          tileIndex.current = walkRight[3];
        } else if (tileIndex.current === walkRight[3]) {
          tileIndex.current = walkRight[0];
        } else {
          tileIndex.current = walkRight[0];
        }
      } else {
        if (isDirUp) {
          if (tileIndex.current === walkUp[0]) {
            tileIndex.current = walkUp[1];
          } else if (tileIndex.current === walkUp[1]) {
            tileIndex.current = walkUp[2];
          } else if (tileIndex.current === walkUp[2]) {
            tileIndex.current = walkUp[3];
          } else if (tileIndex.current === walkUp[3]) {
            tileIndex.current = walkUp[0];
          } else {
            tileIndex.current = walkUp[0];
          }
        } else if (isDirDown) {
          if (tileIndex.current === walkDown[0]) {
            tileIndex.current = walkDown[1];
          } else if (tileIndex.current === walkDown[1]) {
            tileIndex.current = walkDown[2];
          } else if (tileIndex.current === walkDown[2]) {
            tileIndex.current = walkDown[3];
          } else if (tileIndex.current === walkDown[3]) {
            tileIndex.current = walkDown[0];
          } else {
            tileIndex.current = walkDown[0];
          }
        }
      }
    } else {
      if (isDirLeft) {
        if (tileIndex.current === idleLeft[0]) {
          tileIndex.current = idleLeft[1];
        } else if (tileIndex.current === idleLeft[1]) {
          tileIndex.current = idleLeft[0];
        } else {
          tileIndex.current = idleLeft[0];
        }
      } else if (isDirRight) {
        if (tileIndex.current === idleRight[0]) {
          tileIndex.current = idleRight[1];
        } else if (tileIndex.current === idleRight[1]) {
          tileIndex.current = idleRight[0];
        } else {
          tileIndex.current = idleRight[0];
        }
      } else if (isDirUp) {
        if (tileIndex.current === idleUp[0]) {
          tileIndex.current = idleUp[1];
        } else if (tileIndex.current === idleUp[1]) {
          tileIndex.current = idleUp[0];
        } else {
          tileIndex.current = idleUp[0];
        }
      } else if (isDirDown) {
        if (tileIndex.current === idleDown[0]) {
          tileIndex.current = idleDown[1];
        } else if (tileIndex.current === idleDown[1]) {
          tileIndex.current = idleDown[0];
        } else {
          tileIndex.current = idleDown[0];
        }
      }
    }

    const offsetX = (tileIndex.current % tilesHoriz) / tilesHoriz;
    const offsetY = Math.floor(tileIndex.current / tilesHoriz) / tilesVert;

    playerRef.current.material.map.offset.set(offsetX, offsetY);
  }

  useFrame((state, delta, xrFrame) => {
    animatePlayerSprite(delta);
  });

  // Navmesh collision
  const raycasterDir = new THREE.Vector3(0, -1, 0);
  const navMeshPos = [MAP_POS[0], MAP_POS[1] - 1, MAP_POS[2]];
  const raycasterRef = useRef();
  const navMeshRef = useRef();

  return (
    <>
      <sprite
        ref={playerRef}
        position={playerInitPos}
        scale={[playerHeight, playerWidth]}
      >
        <spriteMaterial map={playerSpriteMap} />
      </sprite>
      <raycaster ref={raycasterRef} ray-direction={raycasterDir} />
      <NavMesh ref={navMeshRef} position={navMeshPos} rotation={MAP_ROT} />
    </>
  );
});

export default App;
