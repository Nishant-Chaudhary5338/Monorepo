import type { Testimonial } from "../types";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export default function TestimonialCard({ testimonial }: TestimonialCardProps): React.JSX.Element {
  return (
    <div className="bg-[#FAF8F4] p-8 lg:p-10 min-w-[320px] max-w-md flex-shrink-0">
      <p className="text-[#C9A84C] text-4xl font-serif leading-none mb-4">&ldquo;</p>
      <p className="text-[#1A1A1A] leading-relaxed mb-8 italic font-serif text-lg">
        {testimonial.quote}
      </p>
      <div className="border-t border-[#E8CC7A]/50 pt-5">
        <p className="font-medium text-[#1A1A1A] text-sm">{testimonial.name}</p>
        <p className="text-[#9A9A9A] text-xs mt-1">{testimonial.role}</p>
      </div>
    </div>
  );
}
