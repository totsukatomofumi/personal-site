import Grid from "./Grid";
import Footer from "./Footer";
import overallBackground from "../assets/images/background.png";
import { ReactComponent as CaretLeft } from "../assets/images/caret-left-solid.svg";
import { ReactComponent as CaretRight } from "../assets/images/caret-right-solid.svg";

function Menu() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-end">
      {/* Grid */}
      <div className="relative w-full h-auto overflow-x-scroll overflow-y-visible no-scrollbar">
        <Grid />
      </div>

      {/* Arrow Icons */}
      <div className="absolute left-0 bottom-[28%] mx-16 my-10 w-16 h-[calc(13rem*3-1rem)] flex items-center">
        <CaretLeft overflow={"visible"} stroke="#001f86" strokeWidth={"2%"} />
      </div>
      <div className="absolute right-0 bottom-[28%] mx-16 my-10 w-16 h-[calc(13rem*3-1rem)] flex items-center">
        <CaretRight overflow={"visible"} stroke="#001f86" strokeWidth={"2%"} />
      </div>

      {/* Footer */}
      <div className="relative w-full h-[28%] -z-30">
        <Footer />
      </div>

      {/* Background */}
      <>
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat-y -z-40 blur-[1px] opacity-50"
          style={{ backgroundImage: `url(${overallBackground})` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white -z-50"></div>
        <div className="absolute left-[40%] w-[20%] h-screen bg-custom-white -z-40 blur-3xl"></div>
      </>
    </div>
  );
}

export default Menu;
