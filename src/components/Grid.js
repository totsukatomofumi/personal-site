import placeholder from "../assets/images/tex1_128x96_1cb50192dde67d02_2.png";

function Box() {
  return (
    <div className="h-48 w-[22rem] rounded-2xl border-4 border-custom-grey bg-custom-white">
      <div
        className="h-full w-full bg-contain bg-center opacity-10"
        style={{ backgroundImage: `url(${placeholder})` }}
      ></div>
    </div>
  );
}

function Grid() {
  return (
    <div className="h-auto w-auto grid grid-rows-3 grid-flow-col auto-cols-min gap-4">
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
    </div>
  );
}

export default Grid;
