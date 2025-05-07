import { motion } from "framer-motion";
import { Children } from "react";

export default function FadeInUp({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const childrenArray = Children.toArray(children);
  const animationSettings = {
    initial: { opacity: 0, y: 80 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    viewport: { once: true },
  };
  return (
    <>
      {childrenArray.map((child, index) => (
        <motion.div
          className={className}
          key={index + "fade-in-up"}
          {...animationSettings}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
