import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import ContactExperience from "../components/models/contact/ContactExperience";
import { personalInfo } from "../constants";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current!,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );
      setForm({ name: "", email: "", message: "" });
      setSent(true);
    } catch {
      /* silent — user can retry */
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" style={{ paddingBlock: "var(--section-py)" }}>
      <div className="site-container">

      {/* Editorial heading */}
      <div className="mb-12 md:mb-16">
        <div className="section-eyebrow mb-2">06 / Contact</div>
        <h2
          className="display-headline"
          style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
        >
          Building something <em>ambitious?</em>
        </h2>
        <p
          className="mt-4"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.84rem",
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          Drop a line at{" "}
          <a
            href={`mailto:${personalInfo.email}`}
            style={{ color: "var(--accent-warm)", borderBottom: "1px solid var(--accent-warm)" }}
          >
            {personalInfo.email}
          </a>
          {" "}or fill the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-5">
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-9">
            <div>
              <label htmlFor="name">Your name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="What's your name?"
                required
              />
            </div>
            <div>
              <label htmlFor="email">Your email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message">Your message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about the project..."
                rows={5}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.84rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-primary)",
                background: "none",
                border: "none",
                borderBottom: "1.5px solid var(--accent-warm)",
                paddingBottom: "0.2rem",
                cursor: "pointer",
                alignSelf: "flex-start",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-warm)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
            >
              {loading ? "Sending..." : sent ? "Message sent →" : "Send message →"}
            </button>
          </form>
        </div>

        <div className="xl:col-span-7 min-h-96">
          <div
            className="w-full h-full hover:cursor-grab rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--bg-secondary)", minHeight: "400px" }}
          >
            <ContactExperience />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Contact;
