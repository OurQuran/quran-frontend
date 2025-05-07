import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function RotateOnScroll({
  children,
  className,
  direction = "clockwise",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "clockwise" | "counterclockwise";
}) {
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
  });

  const rotationRange = direction === "clockwise" ? [0, 360] : [0, -360];

  const rotate = useTransform(scrollYProgress, [0, 1], rotationRange);

  const smoothRotate = useSpring(rotate, {
    stiffness: 100,
    damping: 15,
    restDelta: 0.1,
  });

  return (
    <motion.div style={{ rotate: smoothRotate }} className={className}>
      {children}
    </motion.div>
  );
}
