import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

// Floating button that appears after scrolling down, jumps back to top on click
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 bg-[var(--color-primary)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--color-primary-dark)] transition-colors z-50"
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </button>
  );
}
