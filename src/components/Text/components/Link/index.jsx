import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Link({
  target,
  rel,
  className,
  icon = faArrowUpRightFromSquare,
  size = "lg",
  ...props
}) {
  return (
    <a
      target={`_blank ${target || ""}`}
      rel={`noopener noreferrer me ${rel || ""}`}
      className={`inline-flex h-12 drop-shadow-[0.0625rem_0_0_Canvas,-0.0625rem_0_0_Canvas,0_0.0625rem_0_Canvas,0_-0.0625rem_0_Canvas] transition-[border] hover:border-b-2 active:border-b-6 ${className || ""}`}
      {...props}
    >
      <FontAwesomeIcon icon={icon} size={size} className="my-auto" />
    </a>
  );
}

export default Link;
