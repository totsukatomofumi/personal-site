import Grid from "./Grid";
import Footer from "./Footer";
import overallBackground from "../assets/images/background.png";

function Menu() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      {/* Grid */}
      <div className="absolute top-0 h-3/4 w-full flex items-center justify-center">
        <Grid />
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 h-1/4 w-full -z-30">
        <Footer />
      </div>

      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-repeat-y -z-50 blur-[1px] opacity-50"
        style={{ backgroundImage: `url(${overallBackground})` }}
      ></div>
      <div className="absolute left-[40%] w-[20%] h-screen bg-custom-white -z-40 blur-3xl"></div>
    </div>
  );
}

export default Menu;
