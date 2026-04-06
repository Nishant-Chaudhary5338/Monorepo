import { personalInfo } from "../constants";
import TitleHeader from "../components/TitleHeader";

const Testimonials = () => {
  return (
    <section id="about" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="About Me"
          sub="🚀 Who I Am & What Drives Me"
        />

        <div className="grid-12-cols mt-16 gap-10">
          {/* Bio Section */}
          <div className="xl:col-span-7">
            <div className="card-border rounded-xl p-8 md:p-10">
              <h3 className="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
                Hi, I'm {personalInfo.name}
              </h3>
              <div className="flex flex-col gap-5 text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <p>
                  I'm a {personalInfo.title} based in {personalInfo.location} with
                  4+ years of experience building modern, high-performance web
                  applications across enterprise and product-based platforms.
                </p>
                <p>
                  My work spans architecture, development, and deployment, with a
                  strong focus on building reusable systems and improving
                  engineering productivity. I specialize in React.js, TypeScript,
                  and creating scalable, pixel-perfect, responsive UIs.
                </p>
                <p>
                  One of my key differentiators is building an{" "}
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    AI-driven development system
                  </span>{" "}
                  using Monorepo architecture and custom MCP tools. This system
                  automates UI generation, refactoring, and code standardization,
                  reducing 60–70% of repetitive frontend work and improving
                  development speed by ~3x.
                </p>
                <p>
                  While I enjoy crafting pixel-perfect UI, I equally focus on
                  architecture and developer experience — building systems that
                  scale well, reduce friction, and enable teams to move faster with
                  confidence.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            <div className="card-border rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-5" style={{ color: "var(--text-primary)" }}>⚡ Quick Facts</h3>
              <ul className="flex flex-col gap-4" style={{ color: "var(--text-secondary)" }}>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  <span>
                    <strong style={{ color: "var(--text-primary)" }}>4+ years</strong> of frontend
                    development experience
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  <span>
                  Built systems serving{" "}
                  <strong style={{ color: "var(--text-primary)" }}>15,000+</strong> B2B users
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  <span>
                  Automated{" "}
                  <strong style={{ color: "var(--text-primary)" }}>60-70%</strong> of repetitive
                    frontend tasks with AI tools
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  <span>
                  Reduced development time by{" "}
                  <strong style={{ color: "var(--text-primary)" }}>~60%</strong> with reusable
                    frameworks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">▸</span>
                  <span>
                  Currently pursuing{" "}
                  <strong style={{ color: "var(--text-primary)" }}>MCA</strong> at Chandigarh
                    University
                  </span>
                </li>
              </ul>
            </div>

            <div className="card-border rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-5" style={{ color: "var(--text-primary)" }}>🎯 Currently Focused On</h3>
              <ul className="flex flex-col gap-4" style={{ color: "var(--text-secondary)" }}>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">▸</span>
                  <span>AI-driven development automation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">▸</span>
                  <span>Scalable design systems & component libraries</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">▸</span>
                  <span>Performance optimization & web vitals</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">▸</span>
                  <span>Monorepo architecture & developer tooling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;