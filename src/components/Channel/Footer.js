import background from "../../assets/images/channel-footer-bg.png";

function Button({ text, handleClick }) {
  return (
    <button
      className="relative w-[30%] h-[85%] rounded-full bg-[#e3e8ef] border-4 border-custom-blue overflow-hidden
    after:content-[' '] after:block after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-full after:shadow-[inset_-10px_-25px_5px_-1px_rgba(0,0,0,0.05)]
    "
    >
      <div className="absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center">
        <div className="text-custom-black text-6xl">{text}</div>
      </div>
      <div className="absolute top-1 left-2 h-1/3 w-[95%] rounded-t-full bg-white blur"></div>
    </button>
  );
}

function Footer() {
  return (
    <div className="relative w-full h-full border-t-2 border-black">
      <div className="w-full h-full flex justify-center py-10">
        <Button text={"Wii Menu"} />
        <div className="w-[5%]"></div>
        <Button text={"Start"} />
      </div>

      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-repeat-y -z-40 opacity-50"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-white -z-50"></div>
    </div>
  );
}

export default Footer;
