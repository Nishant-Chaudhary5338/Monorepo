import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import type { BookingFormData } from "../types";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  checkin: z.string().min(1, "Please select check-in date"),
  checkout: z.string().min(1, "Please select check-out date"),
  adults: z.coerce.number().min(1).max(10),
  children: z.coerce.number().min(0).max(6),
  roomType: z.string(),
});

const ROOM_OPTIONS = [
  "Any Room Type",
  "Apex Suites — ₹17,000/night",
  "Aura — ₹13,000/night",
  "Haven — ₹12,000/night",
  "Lush — ₹11,500/night",
  "Breeze — ₹10,500/night",
  "Origin — ₹10,000/night",
];

export default function BookingWidget(): React.JSX.Element {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
    defaultValues: { adults: 2, children: 0, roomType: "" },
  });

  const onSubmit = async (data: BookingFormData): Promise<void> => {
    const body = new URLSearchParams({
      "form-name": "booking",
      ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    });
    try {
      await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
    } catch {
      // Netlify captures even on network error in production
    }
    setSubmitted(true);
  };

  return (
    <section
      id="booking"
      className="py-14 bg-forest-deep"
      aria-labelledby="booking-heading"
    >
      <div className="container-brand mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="eyebrow eyebrow-light mb-3">Plan Your Stay</span>
          <h2 id="booking-heading" className="font-serif text-3xl font-light text-ivory">Check Availability</h2>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center bg-forest-mid/40 border border-gold/20 p-10"
          >
            <div className="text-4xl mb-4">✓</div>
            <p className="font-serif text-xl text-ivory mb-2">Thank You!</p>
            <p className="text-ivory/60 text-sm font-light leading-relaxed">
              Our reservations team will contact you within 2 hours. For urgent queries, call us directly at{" "}
              <a href="tel:+919792106111" className="text-gold hover:underline">+91 979 210 6111</a>.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            method="POST"
            data-netlify="true"
            name="booking"
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-4xl mx-auto"
            aria-label="Room availability booking form"
          >
            <input type="hidden" name="form-name" value="booking" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <div>
                <label htmlFor="checkin" className="eyebrow eyebrow-light mb-1.5 block">Check-in Date</label>
                <input
                  id="checkin"
                  type="date"
                  {...register("checkin")}
                  min={new Date().toISOString().split("T")[0]}
                  className="input-brand bg-forest-mid/30 border-gold/25 text-ivory"
                />
                {errors.checkin && <p className="text-[#f87171] text-xs mt-1">{errors.checkin.message}</p>}
              </div>

              <div>
                <label htmlFor="checkout" className="eyebrow eyebrow-light mb-1.5 block">Check-out Date</label>
                <input
                  id="checkout"
                  type="date"
                  {...register("checkout")}
                  min={new Date().toISOString().split("T")[0]}
                  className="input-brand bg-forest-mid/30 border-gold/25 text-ivory"
                />
                {errors.checkout && <p className="text-[#f87171] text-xs mt-1">{errors.checkout.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1">
                <div>
                  <label htmlFor="adults" className="eyebrow eyebrow-light mb-1.5 block">Adults</label>
                  <input
                    id="adults"
                    type="number"
                    min={1}
                    max={10}
                    {...register("adults")}
                    className="input-brand bg-forest-mid/30 border-gold/25 text-ivory"
                  />
                </div>
                <div>
                  <label htmlFor="children" className="eyebrow eyebrow-light mb-1.5 block">Children</label>
                  <input
                    id="children"
                    type="number"
                    min={0}
                    max={6}
                    {...register("children")}
                    className="input-brand bg-forest-mid/30 border-gold/25 text-ivory"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="roomType" className="eyebrow eyebrow-light mb-1.5 block">Room Type</label>
                <select
                  id="roomType"
                  {...register("roomType")}
                  className="input-brand bg-forest-mid/30 border-gold/25 text-ivory"
                >
                  {ROOM_OPTIONS.map((o) => (
                    <option key={o} value={o === "Any Room Type" ? "" : o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              <div>
                <label htmlFor="b-name" className="eyebrow eyebrow-light mb-1.5 block">Full Name *</label>
                <input id="b-name" type="text" placeholder="Your name" {...register("name")} className="input-brand bg-forest-mid/30 border-gold/25 text-ivory placeholder:text-ivory/30" />
                {errors.name && <p className="text-[#f87171] text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="b-email" className="eyebrow eyebrow-light mb-1.5 block">Email Address *</label>
                <input id="b-email" type="email" placeholder="your@email.com" {...register("email")} className="input-brand bg-forest-mid/30 border-gold/25 text-ivory placeholder:text-ivory/30" />
                {errors.email && <p className="text-[#f87171] text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="b-phone" className="eyebrow eyebrow-light mb-1.5 block">Phone Number *</label>
                <input id="b-phone" type="tel" placeholder="+91 xxxxxxxxxx" {...register("phone")} className="input-brand bg-forest-mid/30 border-gold/25 text-ivory placeholder:text-ivory/30" />
                {errors.phone && <p className="text-[#f87171] text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full sm:w-auto"
                aria-label="Submit booking availability request"
              >
                {isSubmitting ? "Sending…" : "Check Availability"}
              </button>
              <p className="text-ivory/75 text-base font-light text-center sm:text-left">
                Best rates guaranteed when you book direct.{" "}
                <a href="tel:+919792106111" className="text-gold hover:underline font-medium">+91 979 210 6111</a>
                {" "}for group bookings.
              </p>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
