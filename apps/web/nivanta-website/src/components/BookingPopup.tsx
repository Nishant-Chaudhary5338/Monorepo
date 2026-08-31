import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { ROOM_IMAGES } from "../assets/media";
import { rooms } from "../data/rooms";

type BookingPopupProps = {
  open: boolean;
  /** Every control routes through here — close, dismiss and both CTAs alike. */
  onClose: () => void;
};

/** Clicks on any dismiss control before the prompt actually closes. */
const CLOSE_CLICKS_REQUIRED = 2;

const LOWEST_RATE = rooms.reduce((min, room) => (room.price < min ? room.price : min), Infinity);
const LOWEST_RATE_LABEL = `₹${LOWEST_RATE.toLocaleString("en-IN")}`;

export default function BookingPopup({ open, onClose }: BookingPopupProps): React.JSX.Element {
  const [dialogRef, animate] = useAnimate<HTMLDivElement>();
  // Returning focus here keeps keyboard users where they were before the prompt interrupted them
  const lastFocused = useRef<HTMLElement | null>(null);
  const [closeAttempts, setCloseAttempts] = useState(0);

  useEffect(() => {
    if (!open) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      lastFocused.current?.focus();
    };
  }, [open, dialogRef]);

  const requestClose = useCallback((): void => {
    const next = closeAttempts + 1;
    if (next >= CLOSE_CLICKS_REQUIRED) {
      setCloseAttempts(0);
      onClose();
      return;
    }
    setCloseAttempts(next);
    // Nudge the dialog so the click reads as ignored rather than broken
    if (dialogRef.current) {
      void animate(dialogRef.current, { x: [0, -10, 10, -7, 7, 0] }, { duration: 0.4 });
    }
  }, [animate, closeAttempts, dialogRef, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, requestClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={requestClose}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-popup-heading"
            aria-describedby="booking-popup-copy"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-forest-deep border border-gold/25 shadow-2xl grid md:grid-cols-2 focus-visible:outline-none"
          >
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close booking prompt"
              className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center text-ivory/70 hover:text-gold text-2xl leading-none transition-colors"
            >
              ×
            </button>

            <img
              src={ROOM_IMAGES.apexSuites[2]}
              alt="Apex Suite at Silvanza Resort"
              loading="lazy"
              className="hidden md:block h-full w-full object-cover"
            />

            <div className="p-8 sm:p-10">
              <span className="eyebrow eyebrow-light mb-3">Direct Booking Offer</span>
              <h2
                id="booking-popup-heading"
                className="font-serif text-3xl font-light text-ivory leading-tight"
              >
                Your Forest Retreat Awaits
              </h2>
              <div className="divider-gold" />
              <p id="booking-popup-copy" className="text-ivory/70 text-sm font-light leading-relaxed mb-7">
                Rooms from <span className="text-gold font-medium">{LOWEST_RATE_LABEL}</span> a night, with
                best-rate assurance when you book direct with us. Tell us your dates and our reservations
                team will confirm within 2 hours.
              </p>

              <div className="flex flex-col gap-3">
                <button type="button" onClick={requestClose} className="btn btn-primary w-full">
                  Book Your Stay
                </button>
                <a href="tel:+919792106111" onClick={requestClose} className="btn btn-ghost w-full">
                  Call +91 979 210 6111
                </a>
                <button
                  type="button"
                  onClick={requestClose}
                  className="text-ivory/45 hover:text-ivory/80 text-xs tracking-wide transition-colors mt-1"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
