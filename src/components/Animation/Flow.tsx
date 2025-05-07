import { motion, Variants } from "framer-motion";
import { Children } from "react";

export default function Flow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const childrenArray = Children.toArray(children);

  const animationVariants: Variants = {
    visible: {
      opacity: 1,
      y: [0, -10, 0],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  return (
    <>
      {childrenArray.map((child, index) => (
        <motion.div
          className={className}
          key={index}
          variants={animationVariants}
          initial={{ opacity: 1, y: 0 }}
          animate="visible"
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
