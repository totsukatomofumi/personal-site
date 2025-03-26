import { useEffect } from "react";

function DialogControls({ setToggleDialog }) {
  function handleOnClick() {
    setToggleDialog((prev) => (prev ? !prev : true)); // can be null
  }

  useEffect(() => {
    function handleOnKeyDown(e) {
      if (e.key === "Enter" || e.key === " ") {
        handleOnClick();
      }
    }

    document.addEventListener("keydown", handleOnKeyDown);
    return () => {
      document.removeEventListener("keydown", handleOnKeyDown);
    };
  }, []);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full z-30"
      onClick={handleOnClick}
    ></div>
  );
}

export default DialogControls;
