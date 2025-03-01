function DialogControls({ setToggleDialog }) {
  function handleOnClick() {
    setToggleDialog((prev) => (prev ? !prev : true)); // can be null
  }

  return (
    <div
      className="absolute top-0 left-0 w-full h-full z-30"
      onClick={handleOnClick}
    ></div>
  );
}

export default DialogControls;
