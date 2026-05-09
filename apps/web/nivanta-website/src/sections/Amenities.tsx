import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { amenities } from "../data/amenities";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

type AmenityImageProps = { src: string; alt: string; name: string; gallery?: string[] };

function AmenityImage({ src, alt, name, gallery }: AmenityImageProps): React.JSX.Element {
  return (
    <div>
      <div className="relative overflow-hidden group h-72 lg:h-105">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-0 left-0 right-0 p-6">
          <span className="inline-block bg-gold text-white text-xs px-4 py-2 tracking-widest uppercase font-medium">
            {name}
          </span>
        </div>
      </div>

      {/* Photo strip — shown when gallery has additional images */}
      {gallery && gallery.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {gallery.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${name} — view ${i + 2}`}
              loading="lazy"
              className="h-24 w-36 object-cover shrink-0 opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          ))}
        </div>
      )}
    </div>
  );
}

type AmenityTextProps = {
  subtitle: string;
  name: string;
  description: string;
  details: string[];
  padLeft: boolean;
};

function AmenityText({ subtitle, name, description, details, padLeft }: AmenityTextProps): React.JSX.Element {
  return (
    <div className={padLeft ? "lg:pl-8" : "lg:pr-8"}>
      <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">{subtitle}</p>
      <h3 className="font-serif text-3xl lg:text-4xl text-charcoal mb-4">{name}</h3>
      <div className="w-10 h-px bg-gold mb-6" />
      <p className="text-muted leading-relaxed mb-8 text-lg">{description}</p>
      <ul className="grid grid-cols-2 gap-3">
        {details.map((d) => (
          <li key={d} className="flex items-center gap-2 text-sm text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Amenities(): React.JSX.Element {
  const [ref, inView] = useInView();

  return (
    <section id="amenities" className="py-14 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">Experiences</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-charcoal mb-4">Our Amenities</h2>
          <div className="w-12 h-px bg-gold mx-auto" />
        </motion.div>

        {/* Alternating rows — explicit order via conditional render, no CSS tricks */}
        <div className="flex flex-col gap-14 lg:gap-24">
          {amenities.map((amenity, i) => {
            const isEven = i % 2 === 0;
            const image = (
              <AmenityImage
                src={amenity.image}
                alt={amenity.name}
                name={amenity.name}
                gallery={amenity.images}
              />
            );
            const text = (
              <AmenityText
                subtitle={amenity.subtitle}
                name={amenity.name}
                description={amenity.description}
                details={amenity.details}
                padLeft={isEven}
              />
            );

            return (
              <motion.div
                key={amenity.id}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 0.8, delay: 0.12 * i }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start"
              >
                {isEven ? <>{image}{text}</> : <>{text}{image}</>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
