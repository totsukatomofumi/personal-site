import { useEffect, useState } from "react";

import { ReactComponent as FooterShape } from "../assets/images/footer-shape.svg";
import { ReactComponent as GithubIcon } from "../assets/images/github-icon.svg";
import { ReactComponent as LinkedinIcon } from "../assets/images/linkedin-icon.svg";

function Clock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    let clockId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(clockId);
    };
  }, []);

  // TODO: Responsive design
  return (
    <>
      <div className="text-8xl text-custom-grey-700 text-center">
        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
  return (
    <button
      className="group relative ml-1 mr-7 aspect-square h-[85%] bg-custom-grey-light border-4 border-custom-blue rounded-full shadow-[10px_10px_5px_rgba(0,0,0,0.1)] flex justify-center items-center z-10 
      after:content-[' '] after:block after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-full after:shadow-[inset_-10px_-25px_5px_-1px_rgba(0,0,0,0.05)] active:after:shadow-[inset_10px_15px_15px_-1px_rgba(0,0,0,0.05)]"
    >
      {/* Icon */}
      <div className="aspect-square h-1/2 flex justify-center items-center">
        {iconComponent}
      </div>
    </button>
  );
}

function FileIcon() {
  return (
    <div
      className="bg-custom-blue flex items-center justify-center rounded-md"
      style={{
        clipPath: "polygon(0 0, 80% 0%, 100% 15%, 100% 100%, 0 100%)",
        aspectRatio: 3 / 4,
      }}
    >
      <div
        className="h-[calc(100%-8px)] bg-custom-blue-light flex flex-col items-center justify-center"
        style={{
          clipPath: "polygon(0 0, 80% 0%, 100% 15%, 100% 100%, 0 100%)",
          aspectRatio: 3 / 4,
        }}
      >
        <div className="mt-2 aspect-square w-[84%] bg-custom-white flex items-center justify-center">
          <p className="text-custom-blue font-bold text-center align-middle text-xl">
            CV
          </p>
        </div>
        <div className="mt-1 w-[84%] h-[13%] bg-custom-blue"></div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <>
      <div className="absolute w-full h-auto left-0 top-0 z-10">
        <Clock />
      </div>

      <div className="absolute h-full w-full top-0 left-0 z-10 flex items-center">
        {/* Left container of Button */}
        <div
          className="absolute left-0 w-1/6 h-[75%] bg-custom-grey-light border-4 border-custom-grey rounded-r-full flex justify-end shadow-xl
        after:content-[' '] after:block after:absolute after:-left-1 after:bottom-2 after:w-full after:h-full after:border-4 after:border-custom-white after:rounded-r-full after:opacity-70 after:blur-[3px]"
        >
          <Button
            iconComponent={
              <LinkedinIcon className="fill-custom-grey-700 group-hover:fill-custom-blue opacity-90 m-1" />
            }
          />
        </div>

        <div className="absolute left-[17.5%] bottom-[25%] h-1/3 w-1/12 flex justify-center drop-shadow-[10px_10px_5px_rgba(0,0,0,0.1)]">
          <FileIcon />
        </div>

        {/* Right container of Button */}
        <div
          className="absolute right-0 w-1/6 h-[75%] bg-custom-grey-light border-4 border-custom-grey rounded-l-full flex justify-start shadow-xl
        after:content-[' '] after:block after:absolute after:-right-1 after:bottom-2 after:w-full after:h-full after:border-4 after:border-custom-white after:rounded-l-full after:opacity-70 after:blur-[3px]"
        >
          <Button
            iconComponent={
              <GithubIcon className="fill-custom-grey-700 group-hover:fill-custom-blue opacity-90" />
            }
          />
        </div>
      </div>

      {/* Background */}
      <div className="relative">
        <FooterShape className="fill-custom-blue w-full h-auto -z-10" />
        <FooterShape className="absolute top-[4px] fill-custom-grey-light w-full h-auto" />
      </div>
      <div className="h-full bg-custom-grey-light"></div>
    </>
  );
}

export default Footer;
