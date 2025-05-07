import { useEffect, useState } from "react";

export function useScrollDirection(threshold = 10) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScroll = () => {
      const currentScrollY = window.pageYOffset;
      const direction =
        currentScrollY > lastScrollY + threshold
          ? "down"
          : currentScrollY < lastScrollY - threshold
          ? "up"
          : scrollDirection;

      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }

      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, [scrollDirection, threshold]);

  return scrollDirection;
}
