import { useRef, useState, type ChangeEvent, type FormEvent, type ReactElement } from "react";
import emailjs from "@emailjs/browser";
import { personalInfo } from "../../constants";

interface FormData { name: string; email: string; message: string }

export function Contact(): ReactElement {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current!,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY,
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
    <section id="contact" data-morph="6" className="mx-section mx-contact">
      <div className="mx-contact__head">
        <span className="mx-eyebrow">Contact</span>
        <h2 className="mx-display mx-contact__title">Let's build<br />something <em>real.</em></h2>
        <p className="mx-contact__line">
          Or just say hi —{" "}
          <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="mx-form">
        <div className="mx-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
        </div>
        <div className="mx-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
        </div>
        <div className="mx-field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Tell me about it…" rows={4} required />
        </div>
        <button type="submit" className="mx-btn mx-btn--solid" disabled={loading}>
          {loading ? "Sending…" : sent ? "Sent ✓" : "Send message →"}
        </button>
      </form>
    </section>
  );
}
