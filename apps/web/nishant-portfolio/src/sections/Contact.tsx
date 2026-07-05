import { useRef, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { personalInfo } from "../constants";
import { MagneticButton } from "../components/MagneticButton";
import { FloatCard } from "../components/FloatCard";

type Status = "idle" | "loading" | "sent" | "error";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("loading");
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_USER_ID
      );
      setStatus("sent");
      formRef.current.reset();
    } catch (err) {
      console.error("emailjs send failed:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="section-wrap">
        <div className="section-glow" style={{ "--section-glow-color": "var(--accent-gold)", "--section-glow-color-2": "var(--accent-lime)" } as React.CSSProperties}>
          <p className="section-label">
            <span className="section-label-num">07</span> — CONTACT
          </p>
          <h2 className="section-title" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
            Let's build <em className="pull-quote-gold gradient-text" style={{ fontStyle: "italic" }}>something real.</em>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)", alignItems: "stretch" }}>
          <FloatCard glow="--accent-gold" delay={0}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "flex-start" }}>
              <a href={`mailto:${personalInfo.email}`} className="contact-link">{personalInfo.email}</a>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="contact-link">LinkedIn ↗</a>
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="contact-link">GitHub ↗</a>
            </div>
          </FloatCard>

          <FloatCard glow="--accent-purple" delay={0.6}>
            <form ref={formRef} onSubmit={onSubmit} style={{ display: "grid", gap: "1.25rem" }}>
              <div className="contact-field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" required />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" required />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" rows={4} required />
              </div>
              <MagneticButton
                as="button"
                type="submit"
                className="btn-primary"
                disabled={status === "loading"}
                style={{ justifySelf: "start" }}
              >
                <span>
                  {status === "loading" ? "Sending…" : status === "sent" ? "Sent ✓" : status === "error" ? "Try again" : "Send message →"}
                </span>
              </MagneticButton>
            </form>
          </FloatCard>
        </div>
      </div>
    </section>
  );
};

export default Contact;
