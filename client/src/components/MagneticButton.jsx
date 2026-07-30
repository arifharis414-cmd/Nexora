import { useRef } from "react";

export default function MagneticButton({ as: Component = "button", children, className = "", ...props }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const offsetX = ((x / rect.width) - 0.5) * 6;
    const offsetY = ((y / rect.height) - 0.5) * 6;

    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  };

  const resetPosition = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Component
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={resetPosition}
      onMouseEnter={resetPosition}
      className={`magnetic-button ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
