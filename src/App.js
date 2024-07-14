import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import "./App.css";
import Channel from "./components/channel/Channel";
import Menu from "./components/menu/Menu";
import Startup from "./components/startup/Startup";

function App() {
  const displayRef = useRef();
  const [isStartupClicked, setIsStartupClicked] = useState(false);

  const [display, setDisplay] = useState(
    <Startup setIsStartupClicked={setIsStartupClicked} />
  );

  useGSAP(
    () => {
      if (isStartupClicked) {
        const tl = gsap.timeline();
        tl.to(displayRef.current, {
          opacity: 0,
          onComplete: () => {
            setDisplay(<Menu />);
          },
        }).to(displayRef.current, {
          opacity: 1,
          delay: 1,
        });
      }
    },
    { dependencies: [isStartupClicked] }
  );

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen bg-black">
        <div ref={displayRef}>{display}</div>
      </div>
    </>
  );
}

export default App;
