import { useEffect, useState } from "react";

export default function CountUp({ end, suffix = "", prefix = "", duration = 1200 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setValue(Math.round(progress * end));
      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
