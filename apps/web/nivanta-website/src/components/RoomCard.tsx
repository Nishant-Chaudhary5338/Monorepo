import { useState } from "react";
import type { Room } from "../types";
import Lightbox from "./Lightbox";

type RoomCardProps = {
  room: Room;
};

export default function RoomCard({ room }: RoomCardProps): React.JSX.Element {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <>
      <div className="group bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-400">
        {/* Image */}
        <div
          className="relative overflow-hidden cursor-pointer h-60"
          onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
        >
          <img
            src={room.image}
            alt={room.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-400" />
          <div className="absolute top-4 right-4 bg-[#C9A84C] text-white text-xs px-3 py-1.5 tracking-wide">
            ₹{room.price.toLocaleString("en-IN")}/night
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-2 font-medium">
            {room.size} sq ft · {room.capacity} Adults
          </p>
          <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">{room.name}</h3>
          <p className="text-[#9A9A9A] text-sm mb-4 italic">{room.tagline}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-5">
            {room.features.slice(2).map((f) => (
              <span
                key={f}
                className="text-xs text-[#6B6B6B] bg-[#FAF8F4] border border-[#E8CC7A]/40 px-3 py-1"
              >
                {f}
              </span>
            ))}
          </div>

          <button
            onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
            className="w-full py-3 text-sm border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white transition-all duration-300 tracking-wide font-medium"
          >
            View Room
          </button>
        </div>
      </div>

      <Lightbox
        images={room.images.map((src, i) => ({ src, alt: `${room.name} — view ${i + 1}` }))}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
