import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { projects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const ShowcaseSection = () => {
  const sectionRef = useRef(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    projectRefs.current.forEach((card, index) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  const featuredProject = projects[0];
  const sideProjects = projects.slice(1, 3);
  const moreProjects = projects.slice(3);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          {/* Featured Project */}
          <div
            ref={(el) => { projectRefs.current[0] = el; }}
            className="first-project-wrapper"
          >
            <div
              className="image-wrapper rounded-xl overflow-hidden"
              style={{ backgroundColor: featuredProject.bgColor }}
            >
              <img
                src={featuredProject.imgPath}
                alt={featuredProject.title}
              />
            </div>
            <div className="text-content">
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 style={{ color: "var(--text-primary)" }}>{featuredProject.title}</h2>
              <p className="md:text-xl" style={{ color: "var(--text-secondary)" }}>
                {featuredProject.description}
              </p>
            </div>
          </div>

          {/* Side Projects */}
          <div className="project-list-wrapper overflow-hidden">
            {sideProjects.map((project, index) => (
              <div
                key={project.title}
                className="project"
                ref={(el) => { projectRefs.current[index + 1] = el; }}
              >
                <div
                  className="image-wrapper rounded-xl overflow-hidden"
                  style={{ backgroundColor: project.bgColor }}
                >
                  <img src={project.imgPath} alt={project.title} />
                </div>
                <div className="flex flex-wrap gap-2 mt-3 mb-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 style={{ color: "var(--text-primary)" }}>{project.title}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* More Projects Grid */}
        {moreProjects.length > 0 && (
          <div className="grid-3-cols mt-16">
            {moreProjects.map((project, index) => (
              <div
                key={project.title}
                ref={(el) => { projectRefs.current[index + 3] = el; }}
                className="card-border rounded-xl p-5 flex flex-col gap-4"
              >
                <div
                  className="image-wrapper rounded-xl overflow-hidden h-48"
                  style={{ backgroundColor: project.bgColor }}
                >
                  <img
                    src={project.imgPath}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{project.title}</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowcaseSection;