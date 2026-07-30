import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayPath, setDisplayPath] = useState(location.pathname);
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    setPhase("exit");
    const timer = window.setTimeout(() => {
      setDisplayPath(location.pathname);
      setPhase("enter");
    }, 180);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div key={displayPath} className={`page-transition ${phase}`}>
      {children}
    </div>
  );
}
