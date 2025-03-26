function ControlsOverlay({ isMenu, isDialogActive }) {
  const moveControls = (
    <>
      <div className="relative w-full">
        <div>
          <p className="font-synemono text-base text-custom-white">Move</p>
        </div>
        <div className="absolute top-0 right-0 h-full flex justify-center items-center gap-[1px]">
          <div className="inline-flex w-[15px] h-[15px] bg-custom-white rounded-sm justify-center items-center">
            <p className="font-synemono text-xs font-bold text-black text-center align-middle">
              W
            </p>
          </div>
          <div className="font-synemono text-base text-custom-white">/</div>
          <div className="inline-flex w-[15px] h-[15px] bg-custom-white rounded-sm justify-center items-center">
            <p className="font-synemono text-xs font-bold text-black text-center align-middle">
              A
            </p>
          </div>
          <div className="font-synemono text-base text-custom-white">/</div>
          <div className="inline-flex w-[15px] h-[15px] bg-custom-white rounded-sm justify-center items-center">
            <p className="font-synemono text-xs font-bold text-black text-center align-middle">
              S
            </p>
          </div>
          <div className="font-synemono text-base text-custom-white">/</div>
          <div className="inline-flex w-[15px] h-[15px] bg-custom-white rounded-sm justify-center items-center">
            <p className="font-synemono text-xs font-bold text-black text-center align-middle">
              D
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const openInventoryControls = (
    <>
      <div className="relative w-full">
        <div>
          <p className="font-synemono text-base text-custom-white">Inventory</p>
        </div>
        <div className="absolute top-0 right-0 h-full flex justify-center items-center">
          <div className="inline-flex w-[15px] h-[15px] bg-custom-white rounded-sm justify-center items-center">
            <p className="font-synemono text-xs font-bold text-black text-center align-middle">
              I
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const closeInventoryControls = (
    <>
      <div className="relative w-full">
        <div>
          <p className="font-synemono text-base text-custom-white">Exit</p>
        </div>
        <div className="absolute top-0 right-0 h-full flex justify-center items-center gap-[1px]">
          <div className="inline-flex w-[15px] h-[15px] bg-custom-white rounded-sm justify-center items-center">
            <p className="font-synemono text-xs font-bold text-black text-center align-middle">
              I
            </p>
          </div>
          <div className="font-synemono text-base text-custom-white">/</div>
          <div className="inline-flex w-fit h-[15px] px-1 bg-custom-white rounded-sm justify-center items-center">
            <p className="font-synemono text-xs font-bold text-black text-center align-middle">
              Esc
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const dialogueControls = (
    <>
      <div className="relative w-full">
        <div>
          <p className="font-synemono text-base text-custom-white">Next</p>
        </div>
        <div className="absolute top-0 right-0 h-full flex justify-center items-center gap-[1px]">
          <div className="inline-flex w-fit h-[15px] px-1 bg-custom-white rounded-sm justify-center items-center">
            <p className="font-synemono text-xs font-bold text-black text-center align-middle">
              Enter ↵
            </p>
          </div>
          <div className="font-synemono text-base text-custom-white">/</div>
          <div className="inline-flex w-fit h-[15px] px-3 bg-custom-white rounded-sm justify-center items-center">
            <p className="font-synemono text-xs font-bold text-black text-center align-middle">
              Space
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {isMenu && closeInventoryControls}
      {!isMenu && !isDialogActive && moveControls}
      {!isMenu && !isDialogActive && openInventoryControls}
      {isDialogActive && dialogueControls}
    </>
  );
}

export default ControlsOverlay;
