import {
  faGithub,
  faKaggle,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faFile } from "@fortawesome/free-solid-svg-icons";
import { Link } from "../";

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
        <Link
          key={index}
          href={child.url}
          title={titles[child.type]}
          icon={icons[child.type]}
        />
      ))}
    </nav>
  );
}

export default Links;
