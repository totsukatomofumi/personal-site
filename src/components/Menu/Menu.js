import Body from "./Body";
import Footer from "./Footer";
import overallBackground from "../../assets/images/background.png";

function Menu() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <div className="relative w-full h-full z-0">
        <div className="w-full h-3/4">
          <Body />
        </div>
        <div className="w-full h-1/4">
          <Footer />
        </div>
      </div>

      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-50">
        <div className="absolute top-0 left-[40%] w-[20%] h-screen bg-custom-white blur-3xl -z-30"></div>
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat-y -z-40 opacity-50"
          style={{ backgroundImage: `url(${overallBackground})` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full bg-custom-white -z-50"></div>
      </div>
    </div>
  );
}

export default Menu;
