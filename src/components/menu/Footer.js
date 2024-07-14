import { ReactComponent as FooterShape } from "../../assets/images/footer-shape.svg";
import { ReactComponent as FooterOutline } from "../../assets/images/footer-outline.svg";
import { ReactComponent as GithubIcon } from "../../assets/images/github-icon.svg";
import { ReactComponent as LinkedinIcon } from "../../assets/images/linkedin-icon.svg";
import Clock from "./Clock";
import Button from "./Button";
import FileIconButton from "./FileIconButton";

function Footer() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-fit h-fit z-0">
        <Clock />
      </div>

      <div className="absolute h-full w-full top-0 left-0 z-0 flex items-center">
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
      <div className="absolute top-0 left-0 w-full h-full -z-50">
        <div className="absolute top-0 w-full h-fit -z-40 drop-shadow-[0_15px_10px_rgba(0,0,0,0.4)]">
          <FooterOutline fill="#47d4ff" />
        </div>
        <div className="relative w-full h-fit -z-50">
          <FooterShape fill="#d5d5d5" />
        </div>
        <div className="relative h-full bg-custom-grey-light -z-50"></div>
      </div>
    </div>
  );
}

export default Footer;
