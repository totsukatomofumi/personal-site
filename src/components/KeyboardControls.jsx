import { useEffect, useState } from "react";

const KEY_INDICES = {
  w: 0,
  a: 1,
  s: 2,
  d: 3,
};

function KeyboardControls({ movementVector }) {
  const [activeKeys, setActiveKeys] = useState([false, false, false, false]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.repeat) return;

      setActiveKeys((prev) =>
        prev.map((_, i) => (i === KEY_INDICES[e.key] ? true : _))
      );
    }

    function handleKeyUp(e) {
      setActiveKeys((prev) =>
        prev.map((_, i) => (i === KEY_INDICES[e.key] ? false : _))
      );
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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
