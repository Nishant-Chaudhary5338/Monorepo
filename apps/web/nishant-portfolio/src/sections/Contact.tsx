import { useRef, useState, type FormEvent, type ReactNode } from "react";
import emailjs from "@emailjs/browser";
import { personalInfo } from "../constants";
import { Section } from "../components/Section";
import { TextLink } from "../components/TextLink";
import { cn } from "../lib/cn";
import { buttonPrimary, textLink } from "../lib/styles";

type Status = "idle" | "loading" | "sent" | "error";

const field = cn(
  "mt-1.5 block w-full px-3 py-2.5",
  "bg-surface-2 text-base text-fg",
  "border border-fg-3 rounded-sm",
);
const label = "block text-sm text-fg-2";

const STATUS_TEXT: Record<Status, string> = {
  idle: "",
  loading: "",
  sent: "Thanks. Your message is on its way and I'll reply by email.",
  error: "That didn't send. Please email me directly instead.",
};

export default function Contact(): ReactNode {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("loading");
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_USER_ID,
      );
      setStatus("sent");
      formRef.current.reset();
    } catch (err) {
      console.error("emailjs send failed:", err);
      setStatus("error");
    }
  };

  return (
    <Section id="contact" number="05" title="Contact">
      <a href={`mailto:${personalInfo.email}`} className={cn(textLink, "text-lg break-all")}>
        {personalInfo.email}
      </a>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <TextLink href={personalInfo.linkedin} mono>LinkedIn</TextLink>
        <TextLink href={personalInfo.github} mono>GitHub</TextLink>
        <TextLink href={personalInfo.npm} mono>npm</TextLink>
      </div>
      <p className="mt-4 max-w-measure text-base text-fg-2">{personalInfo.availability}</p>

      <form ref={formRef} onSubmit={onSubmit} className="mt-10 flex max-w-md flex-col gap-5">
        <label className={label}>
          Name
          <input name="name" type="text" autoComplete="name" required className={field} />
        </label>
        <label className={label}>
          Email
          <input name="email" type="email" autoComplete="email" required className={field} />
        </label>
        <label className={label}>
          Message
          <textarea name="message" rows={5} required className={field} />
        </label>
        <div>
          <button type="submit" className={buttonPrimary} disabled={status === "loading"}>
            {status === "loading" ? "Sending" : "Send message"}
          </button>
          <p role="status" className={cn("mt-3 text-sm", status === "error" ? "text-err" : "text-ok")}>
            {STATUS_TEXT[status]}
          </p>
        </div>
      </form>
    </Section>
  );
}
