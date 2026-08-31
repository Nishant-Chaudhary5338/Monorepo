import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/** How long to wait before showing the prompt — and before re-opening it after every close. */
export const BOOKING_POPUP_DELAY_MS = 4000;

type BookingPopupState = {
  open: boolean;
  /** Sends the guest back to the home page; the prompt re-opens after the delay. */
  close: () => void;
};

/**
 * Opens the booking prompt `delayMs` after mount and re-opens it `delayMs` after
 * every close. Closing always returns the guest to the home page, whichever
 * control they used.
 */
export function useBookingPopup(delayMs = BOOKING_POPUP_DELAY_MS): BookingPopupState {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(() => setOpen(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, open]);

  const close = useCallback(() => {
    setOpen(false);
    navigate("/");
  }, [navigate]);

  return { open, close };
}
