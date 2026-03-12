import { useEffect, useState, useRef } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const lastScrollY = useRef(0);
  const threshold = 15; // Minimum scroll to trigger direction change

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // Ensure we're not at the very top (iOS bounce, etc.)
      if (Math.abs(scrollY - lastScrollY.current) < threshold) {
        ticking = false;
        return;
      }

      const direction = scrollY > lastScrollY.current ? "down" : "up";
      
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDirection]);

  return scrollDirection;
}
