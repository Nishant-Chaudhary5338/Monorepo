import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import BookingPopup from "../components/BookingPopup";
import { useBookingPopup } from "../hooks/useBookingPopup";

export default function RootLayout(): React.JSX.Element {
  const { pathname } = useLocation();
  const { open, close } = useBookingPopup();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <BookingPopup open={open} onClose={close} />
    </>
  );
}
