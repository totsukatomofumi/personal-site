import { useEffect, useState } from "react";

const KEY_INDICES = {
  w: 0,
  a: 1,
  s: 2,
  d: 3,
};

function KeyboardControls({ movementVector, setIsMenu }) {
  const [activeKeys, setActiveKeys] = useState([false, false, false, false]);

  useEffect(() => {
    function handleKeyDownMovement(e) {
      if (e.repeat) return;

      setActiveKeys((prev) =>
        prev.map((_, i) => (i === KEY_INDICES[e.key] ? true : _))
      );
    }

    function handleKeyDownMenu(e) {
      if (e.key === "i") {
        setIsMenu(true);
      }
    }

    function handleKeyUpMovement(e) {
      setActiveKeys((prev) =>
        prev.map((_, i) => (i === KEY_INDICES[e.key] ? false : _))
      );
    }

    window.addEventListener("keydown", handleKeyDownMovement);
    window.addEventListener("keyup", handleKeyUpMovement);
    window.addEventListener("keydown", handleKeyDownMenu);
    return () => {
      window.removeEventListener("keydown", handleKeyDownMovement);
      window.removeEventListener("keyup", handleKeyUpMovement);
      window.removeEventListener("keydown", handleKeyDownMenu);
    };
  }, []);

  useEffect(() => {
    const [w, a, s, d] = activeKeys;
    const x = d - a;
    const y = s - w;

    movementVector.current = [x, y];
  }, [activeKeys, movementVector]);

  return null;
}

export default KeyboardControls;
