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

  return (
    <nav className="no-split flex gap-3 text-lg">
      {children.map((child, index) => (
        <a
          key={index}
          href={child.url}
          target="_blank"
          rel="noopener noreferrer me"
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
