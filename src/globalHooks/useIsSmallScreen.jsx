import { useEffect, useState } from "react";

export default function useIsSmallScreen(breakpoint = 640) {
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth < breakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isSmallScreen;
}
