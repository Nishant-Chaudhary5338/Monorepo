import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  enquiryType: z.enum(["stay", "events", "corporate", "general"]),
  checkin: z.string().optional(),
  checkout: z.string().optional(),
  message: z.string().min(10, "Please add a brief message or requirement"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const phones = [
  { label: "Reservations", number: "+91 979 210 6111", href: "tel:+919792106111" },
  { label: "Events & Weddings", number: "+91 979 210 6222", href: "tel:+919792106222" },
  { label: "General Enquiries", number: "+91 979 210 6333", href: "tel:+919792106333" },
];

export default function ContactPage(): React.JSX.Element {
  usePageMeta({
    title: "Contact Us — Silvanza Resort by Nivanta",
    description:
      "Contact Silvanza Resort by Nivanta. Plan your stay, enquire about events or weddings. Call +91 979 210 6111 or email contact@nivantahospitality.com",
    canonical: "/contact",
  });

  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { enquiryType: "stay" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    const formData = new FormData();
    formData.append("form-name", "contact");
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });

    try {
      await fetch("/", {
        method: "POST",
        body: formData,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <>
      {/* Hero */}
      <section
        className="section-dark relative flex items-end min-h-[52vh] overflow-hidden"
        style={{ background: "linear-gradient(150deg, #032105 0%, #1A1A17 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 40% 60%, #B98F39 0%, transparent 55%)",
          }}
        />
        <div className="container-brand section-pad relative z-10 pb-16">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="eyebrow eyebrow-light mb-6"
          >
            Silvanza Resort
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-[#FAF7F0] font-light"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
          >
            We'd Love to<br />Hear from You
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-[#D4B870] font-light max-w-md"
          >
            Our reservations team typically responds within 2 hours.
          </motion.p>
        </div>
      </section>

      {/* 2-column layout */}
      <section className="section-pad bg-[#FAF7F0]">
        <div className="container-brand">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left — Contact Info */}
            <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
              <span className="eyebrow eyebrow-dark mb-5">Find Us</span>
              <h2 className="heading-section mb-5">Contact & Address</h2>
              <div className="divider-gold" />

              {/* Address */}
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-[#5a5545] font-light mb-2">
                  Address
                </p>
                <p className="font-serif text-[#032105]" style={{ fontSize: "1.05rem" }}>
                  Silvanza Resort by Nivanta
                </p>
                <p className="text-[#5a5545] font-light">
                  Village Dhikuli, Ramnagar
                </p>
                <p className="text-[#5a5545] font-light">
                  Uttarakhand 244715, India
                </p>
              </div>

              {/* Phones */}
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-[#5a5545] font-light mb-4">
                  Phone
                </p>
                <div className="space-y-3">
                  {phones.map((p) => (
                    <div key={p.href}>
                      <p className="text-xs text-[#5a5545] font-light mb-0.5">
                        {p.label}
                      </p>
                      <a
                        href={p.href}
                        className="font-serif text-[#032105] hover:text-[#B98F39] transition-colors"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {p.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-[#5a5545] font-light mb-2">
                  Email
                </p>
                <a
                  href="mailto:contact@nivantahospitality.com"
                  className="font-serif text-[#032105] hover:text-[#B98F39] transition-colors"
                  style={{ fontSize: "1.05rem" }}
                >
                  contact@nivantahospitality.com
                </a>
              </div>

              {/* Website */}
              <div className="mb-10">
                <p className="text-xs tracking-widest uppercase text-[#5a5545] font-light mb-2">
                  Website
                </p>
                <a
                  href="https://silvanzaresort.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5a5545] font-light hover:text-[#B98F39] transition-colors"
                >
                  silvanzaresort.com
                </a>
              </div>

              {/* Map placeholder */}
              <div
                className="w-full aspect-video bg-[#253A11]/10 border border-[#B98F39]/30 flex items-center justify-center"
              >
                <div className="text-center">
                  <p className="text-[#5a5545] font-light text-sm mb-2">
                    Village Dhikuli, Ramnagar
                  </p>
                  <a
                    href="https://maps.google.com/?q=Dhikuli+Ramnagar+Uttarakhand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline text-xs"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }}>
              <span className="eyebrow eyebrow-dark mb-5">Enquire Now</span>
              <h2 className="heading-section mb-5">Send an Enquiry</h2>
              <div className="divider-gold" />

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-[#B98F39] bg-[#F5EDD4] p-10 text-center"
                >
                  <p
                    className="font-serif text-[#032105] mb-3"
                    style={{ fontSize: "1.5rem" }}
                  >
                    Thank You
                  </p>
                  <p className="text-[#5a5545] font-light">
                    Your enquiry has been received. Our team will be in touch
                    within 2 hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  name="contact"
                  data-netlify="true"
                  className="space-y-5"
                >
                  <input type="hidden" name="form-name" value="contact" />

                  <div>
                    <label className="block text-xs tracking-widest uppercase text-[#5a5545] font-light mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Your full name"
                      className="input-brand"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-1 font-light">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-[#5a5545] font-light mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@example.com"
                        className="input-brand"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs mt-1 font-light">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-[#5a5545] font-light mb-2">
                        Phone Number
                      </label>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+91 ···"
                        className="input-brand"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase text-[#5a5545] font-light mb-2">
                      Type of Enquiry *
                    </label>
                    <select {...register("enquiryType")} className="input-brand">
                      <option value="stay">Stay</option>
                      <option value="events">Events &amp; Weddings</option>
                      <option value="corporate">Corporate</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-[#5a5545] font-light mb-2">
                        Check-in Date
                      </label>
                      <input
                        {...register("checkin")}
                        type="date"
                        className="input-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-[#5a5545] font-light mb-2">
                        Check-out Date
                      </label>
                      <input
                        {...register("checkout")}
                        type="date"
                        className="input-brand"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase text-[#5a5545] font-light mb-2">
                      Message / Special Requirements *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      placeholder="Tell us about your plans, group size, or any special requirements..."
                      className="input-brand resize-none"
                    />
                    {errors.message && (
                      <p className="text-red-600 text-xs mt-1 font-light">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending…" : "Send Enquiry"}
                  </button>

                  <p className="text-xs text-[#5a5545] font-light text-center">
                    Our reservations team typically responds within 2 hours.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom phone strip */}
      <section className="section-dark section-pad py-10">
        <div className="container-brand">
          <div className="grid sm:grid-cols-3 gap-px bg-[#B98F39]/20">
            {phones.map((p) => (
              <div key={p.href} className="bg-[#032105] p-8 text-center">
                <p className="text-xs tracking-widest uppercase text-[#D4B870] font-light mb-3">
                  {p.label}
                </p>
                <a
                  href={p.href}
                  className="font-serif text-[#FAF7F0] hover:text-[#B98F39] transition-colors"
                  style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
                >
                  {p.number}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
