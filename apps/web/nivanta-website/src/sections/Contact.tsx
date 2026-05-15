import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof schema>;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Contact(): React.JSX.Element {
  const [ref, inView] = useInView();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactFormData>({ resolver: zodResolver(schema) });

  const onSubmit = (_data: ContactFormData) => {
    reset();
  };

  return (
    <section id="contact" className="py-14 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Reach Us
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-[#1A1A1A] mb-4">
            Let's Connect
          </h2>
          <div className="w-12 h-px bg-[#C9A84C] mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-8">Silvanza Resort by Nivanta</h3>

            <div className="space-y-6 mb-10">
              <div>
                <p className="text-[#C9A84C] text-xs tracking-widest uppercase mb-2 font-medium">Address</p>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Village – Dhikuli, Ramnagar,<br />
                  Uttarakhand 244715
                </p>
              </div>
              <div>
                <p className="text-[#C9A84C] text-xs tracking-widest uppercase mb-2 font-medium">Phone</p>
                <div className="space-y-1">
                  <a href="tel:+919792106111" className="block text-[#6B6B6B] hover:text-[#C9A84C] transition-colors">
                    +91 979 210 6111
                  </a>
                  <a href="tel:+919792107111" className="block text-[#6B6B6B] hover:text-[#C9A84C] transition-colors">
                    +91 979 210 7111
                  </a>
                  <a href="tel:+919792109111" className="block text-[#6B6B6B] hover:text-[#C9A84C] transition-colors">
                    +91 979 210 9111
                  </a>
                  <a href="tel:+919792108111" className="block text-[#6B6B6B] hover:text-[#C9A84C] transition-colors">
                    +91 979 210 8111
                  </a>
                </div>
              </div>
              <div>
                <p className="text-[#C9A84C] text-xs tracking-widest uppercase mb-2 font-medium">Email</p>
                <a
                  href="mailto:sales@nivantahospitality.com"
                  className="text-[#6B6B6B] hover:text-[#C9A84C] transition-colors"
                >
                  sales@nivantahospitality.com
                </a>
              </div>
            </div>

            {/* Map embed */}
            <div className="w-full h-64 bg-[#F0ECE4] overflow-hidden">
              <iframe
                title="Silvanza Resort location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3472.8!2d79.05!3d29.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDIyJzQ4LjAiTiA3OcKwMDMnMDAuMCJF!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {isSubmitSuccessful ? (
              <div className="h-full flex items-center justify-center py-16">
                <div className="text-center">
                  <p className="text-[#C9A84C] text-4xl mb-4">✓</p>
                  <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3">Message Received</h3>
                  <p className="text-[#6B6B6B]">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <input
                    {...register("name")}
                    placeholder="Your Name *"
                    className="w-full px-4 py-3.5 bg-[#FAF8F4] border border-transparent focus:border-[#C9A84C] outline-none text-[#1A1A1A] placeholder-[#9A9A9A] text-sm transition-colors"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Email Address *"
                    className="w-full px-4 py-3.5 bg-[#FAF8F4] border border-transparent focus:border-[#C9A84C] outline-none text-[#1A1A1A] placeholder-[#9A9A9A] text-sm transition-colors"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="Phone Number (optional)"
                    className="w-full px-4 py-3.5 bg-[#FAF8F4] border border-transparent focus:border-[#C9A84C] outline-none text-[#1A1A1A] placeholder-[#9A9A9A] text-sm transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="Your Message *"
                    className="w-full px-4 py-3.5 bg-[#FAF8F4] border border-transparent focus:border-[#C9A84C] outline-none text-[#1A1A1A] placeholder-[#9A9A9A] text-sm resize-none transition-colors"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#C9A84C] text-white text-sm font-medium tracking-widest uppercase hover:bg-[#A07830] transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
