import Footer from "./Footer";

function Channel() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black flex justify-center items-center py-5 px-6">
      <div className="w-full h-full rounded-[96px] overflow-hidden">
        <div className="w-full h-3/4 bg-white"></div>
        <div className="w-full h-1/4">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Channel;
