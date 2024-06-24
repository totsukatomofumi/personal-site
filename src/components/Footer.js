import { useEffect, useRef, useState } from "react";

import { ReactComponent as FooterShape } from "../assets/images/footer-shape.svg";
import { ReactComponent as FooterOutline } from "../assets/images/footer-outline.svg";
import { ReactComponent as GithubIcon } from "../assets/images/github-icon.svg";
import { ReactComponent as LinkedinIcon } from "../assets/images/linkedin-icon.svg";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Clock() {
  const [date, setDate] = useState(new Date());
  const colonRef = useRef();

  useEffect(() => {
    let clockId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(clockId);
    };
  }, []);

  useGSAP(() => {
    gsap.to(colonRef.current, {
      opacity: 0,
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "none",
      repeatDelay: 1,
    });
  });

  return (
    <>
      <div className="text-8xl text-custom-grey-700 text-center flex justify-center">
        <div className="w-72">
          {date.getHours() % 12 || 12}
          <span ref={colonRef}>:</span>
          {date.getMinutes().toString().padStart(2, "0")}
        </div>
        <div className="relative bottom-2 w-0 text-4xl flex flex-col justify-end">
          <div>{date.getHours() >= 12 ? "PM" : "AM"}</div>
        </div>
      </div>
      <div className="mt-8 text-6xl text-custom-grey-dark text-center font-bold">
        {date.toLocaleDateString([], {
          weekday: "short",
        })}{" "}
        {date.toLocaleDateString([], {
          day: "2-digit",
          month: "2-digit",
        })}
      </div>
    </>
  );
}

function Button({ iconComponent }) {
  const selfRef = useRef();
  const whiteOverlayRef = useRef();

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // scale on hover
  useGSAP(
    () => {
      gsap.to(selfRef.current, {
        scale: isHovered ? 1.1 : 1,
        duration: 0.1,
      });
    },
    { dependencies: [isHovered] }
  );

  // blip and shine on click
  useGSAP(
    () => {
      if (isClicked) {
        const tl = gsap.timeline();

        tl.to(selfRef.current, {
          scale: 1,
          duration: 0.05,
          ease: "none",
        })
          .to(selfRef.current, {
            scale: 1.1,
            duration: 0.05,
            ease: "none",
          })
          .to(
            whiteOverlayRef.current,
            {
              opacity: 1,
              duration: 0.1,
              ease: "none",
            },
            "<-0.05"
          );
      } else {
        gsap.from(whiteOverlayRef.current, {
          opacity: 1,
          duration: 0.1,
          ease: "none",
        });
      }
    },
    { dependencies: [isClicked], revertOnUpdate: true }
  );

  return (
    <button
      className="relative ml-1 mr-7 aspect-square h-[85%] bg-custom-grey-light border-4 border-custom-blue rounded-full shadow-[10px_10px_5px_rgba(0,0,0,0.1)] flex justify-center items-center z-10 
      after:content-[' '] after:block after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-full after:shadow-[inset_-10px_-25px_5px_-1px_rgba(0,0,0,0.05)]"
      ref={selfRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
    >
      {/* Icon */}
      <div className="aspect-square h-1/2 flex justify-center items-center">
        {iconComponent}
      </div>

      {/* White overlay when clicked */}
      <div
        className="absolute h-full w-full rounded-full bg-white z-50 opacity-0"
        ref={whiteOverlayRef}
      ></div>
    </button>
  );
}

function FileIconButton() {
  const selfRef = useRef();
  const innnerBgRef = useRef();
  const whiteOverlayRef = useRef();

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // blink
  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    tl.to(innnerBgRef.current, {
      backgroundColor: "rgba(255,255,255,0.5)",
      repeat: 1,
      yoyo: true,
      ease: "none",
      duration: 0.25,
    });
  });

  // scale on hover
  useGSAP(
    () => {
      gsap.to(selfRef.current, {
        scale: isHovered ? 1.1 : 1,
        duration: 0.1,
      });
    },
    { dependencies: [isHovered] }
  );

  // blip and shine on click
  useGSAP(
    () => {
      if (isClicked) {
        const tl = gsap.timeline();

        tl.to(selfRef.current, {
          scale: 1,
          duration: 0.05,
          ease: "none",
        })
          .to(selfRef.current, {
            scale: 1.1,
            duration: 0.05,
            ease: "none",
          })
          .to(
            whiteOverlayRef.current,
            {
              opacity: 1,
              duration: 0.1,
              ease: "none",
            },
            "<-0.05"
          );
      } else {
        gsap.from(whiteOverlayRef.current, {
          opacity: 1,
          duration: 0.1,
          ease: "none",
        });
      }
    },
    { dependencies: [isClicked], revertOnUpdate: true }
  );

  return (
    <button
      className="bg-custom-blue flex items-center justify-center rounded-md"
      style={{
        clipPath: "polygon(0 0, 80% 0%, 100% 15%, 100% 100%, 0 100%)",
        aspectRatio: 3 / 4,
      }}
      ref={selfRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
    >
      <div
        className="h-[calc(100%-8px)] bg-custom-blue-light flex flex-col items-center justify-center"
        style={{
          clipPath: "polygon(0 0, 80% 0%, 100% 15%, 100% 100%, 0 100%)",
          aspectRatio: 3 / 4,
        }}
        ref={innnerBgRef}
      >
        <div className="mt-2 aspect-square w-[84%] bg-custom-white flex items-center justify-center">
          <p className="text-custom-blue font-bold text-center align-middle text-xl">
            CV
          </p>
        </div>
        <div className="mt-1 w-[84%] h-[13%] bg-custom-blue opacity-80"></div>
      </div>

      {/* White overlay when clicked */}
      <div
        className="absolute h-[calc(100%-8px)] bg-white z-50 opacity-0"
        style={{
          clipPath: "polygon(0 0, 80% 0%, 100% 15%, 100% 100%, 0 100%)",
          aspectRatio: 3 / 4,
        }}
        ref={whiteOverlayRef}
      ></div>
    </button>
  );
}

function Footer() {
  return (
    <>
      <div className="absolute w-full h-fit left-0 top-0 z-10">
        <Clock />
      </div>

      <div className="absolute h-full w-full top-0 left-0 z-10 flex items-center">
        {/* Left container of Button */}
        <div
          className="absolute left-0 w-1/6 h-[70%] bg-custom-grey-light border-4 border-custom-grey rounded-r-full flex justify-end shadow-xl
        after:content-[' '] after:block after:absolute after:-left-1 after:bottom-2 after:w-full after:h-full after:border-4 after:border-custom-white after:rounded-r-full after:opacity-70 after:blur-[3px]"
        >
          <Button
            iconComponent={
              <LinkedinIcon className="fill-custom-grey-700 opacity-90 m-1" />
            }
          />
        </div>

        <div className="absolute left-[17.5%] bottom-[25%] h-[30%] w-1/12 flex justify-center drop-shadow-[10px_10px_5px_rgba(0,0,0,0.1)]">
          <FileIconButton />
        </div>

        {/* Right container of Button */}
        <div
          className="absolute right-0 w-1/6 h-[70%] bg-custom-grey-light border-4 border-custom-grey rounded-l-full flex justify-start shadow-xl
        after:content-[' '] after:block after:absolute after:-right-1 after:bottom-2 after:w-full after:h-full after:border-4 after:border-custom-white after:rounded-l-full after:opacity-70 after:blur-[3px]"
        >
          <Button
            iconComponent={
              <GithubIcon className="fill-custom-grey-700 opacity-90" />
            }
          />
        </div>
      </div>

      {/* Background */}
      <div className="relative -z-50">
        <div className="absolute top-0 w-full h-fit z-10 drop-shadow-[0_15px_10px_rgba(0,0,0,0.4)]">
          <FooterOutline fill="#47d4ff" />
        </div>
        <FooterShape className="relative w-full h-fit" fill="#d5d5d5" />
      </div>
      <div className="h-full bg-custom-grey-light"></div>
    </>
  );
}

export default Footer;
