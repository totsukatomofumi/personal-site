import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Link({ target, rel, className, icon, ...props }) {
  return (
    <a
      target={`_blank ${target || ""}`}
      rel={`noopener noreferrer me ${rel || ""}`}
      className={`h-12 text-lg flex hover:border-b-2 active:border-b-6 transition-[border] ${
        className || ""
      }`}
      {...props}
    >
      <FontAwesomeIcon
        icon={icon || faArrowUpRightFromSquare}
        size="lg"
        className="my-auto"
      />
    </a>
  );
}

export default Link;
