import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  icon: string;
  color: string;
  category: string;
}

const skills: Skill[] = [
  { name: "React.js", icon: "⚛️", color: "#61DAFB", category: "Frontend" },
  { name: "TypeScript", icon: "🔷", color: "#3178C6", category: "Language" },
  { name: "Next.js", icon: "▲", color: "#000000", category: "Framework" },
  { name: "Tailwind CSS", icon: "🎨", color: "#06B6D4", category: "Styling" },
  { name: "Redux", icon: "🟣", color: "#764ABC", category: "State" },
  { name: "Vite", icon: "⚡", color: "#646CFF", category: "Tooling" },
  { name: "AWS", icon: "☁️", color: "#FF9900", category: "Cloud" },
  { name: "Node.js", icon: "🟢", color: "#339933", category: "Backend" },
  { name: "Git", icon: "📦", color: "#F05032", category: "Tools" },
  { name: "REST APIs", icon: "🔗", color: "#FF6B6B", category: "Integration" },
  { name: "Storybook", icon: "📕", color: "#FF4785", category: "UI Dev" },
  { name: "Monorepo", icon: "📁", color: "#9B59B6", category: "Architecture" },
];

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      gsap.fromTo(
        card,
        {
          y: 40,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <div id="skills" ref={sectionRef} className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="My Tech Stack"
          sub="🛠️ Tools & Technologies I Work With"
        />
        <div className="grid-4-cols mt-16">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="card-border rounded-xl p-6 flex flex-col items-center gap-4 group transition-all duration-300 cursor-default opacity-0"
              style={{ "--hover-bg": "var(--bg-secondary)" } as React.CSSProperties}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${skill.color}15` }}
              >
                {skill.icon}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>{skill.name}</h3>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{skill.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;