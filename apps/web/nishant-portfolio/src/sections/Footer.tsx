import { socialLinks, personalInfo } from "../constants";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col justify-center">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--text-secondary)"; }}
          >
            View on GitHub →
          </a>
        </div>
        <div className="socials">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="icon"
              title={social.name}
            >
              <img src={social.imgPath} alt={social.name} />
            </a>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
