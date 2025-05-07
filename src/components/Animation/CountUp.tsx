import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

interface CountUpProps {
  targetNumber: number;
  duration?: number;
}

export default function CountUp({ targetNumber, duration = 2 }: CountUpProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, targetNumber, {
      duration,
      ease: "easeInOut",
    });

    return () => controls.stop();
  }, [count, targetNumber, duration]);

  return <motion.span>{rounded}</motion.span>;
}
