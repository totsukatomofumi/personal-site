import {
  faGithub,
  faKaggle,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUpRightFromSquare,
  faEnvelope,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Links({ children }) {
  const icons = {
    resume: faFile,
    linkedin: faLinkedin,
    github: faGithub,
    kaggle: faKaggle,
    email: faEnvelope,
  };

  const titles = {
    resume: "Resume",
    linkedin: "LinkedIn",
    github: "GitHub",
    kaggle: "Kaggle",
    email: "Email",
  };

  return (
    <nav className="no-split flex gap-3">
      {children.map((child, index) => (
        <a
          key={index}
          href={child.url}
          target="_blank"
          rel="noopener noreferrer me"
          className="text-lg py-2 border-y-2 border-transparent hover:border-b-inherit transition-[border]"
          title={titles[child.type]}
        >
          <FontAwesomeIcon
            icon={icons[child.type] || faArrowUpRightFromSquare}
            size="lg"
          />
        </a>
      ))}
    </nav>
  );
}

export default Links;
