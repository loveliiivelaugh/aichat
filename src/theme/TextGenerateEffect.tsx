import { useEffect, useMemo, useRef } from "react";
import { motion, stagger, useAnimate } from "framer-motion";

export const TextGenerateEffect = ({ words = "" }) => {
  const [scope, animate] = useAnimate();
  const wordsArray = typeof words === "string" ? words.split(" ") : [];

  // useRef to keep track of the last animation
  const lastAnimation = useRef(null);

  useEffect(() => {
    // Only animate if wordsArray has changed
    if (wordsArray.length > 0) {
      if (lastAnimation.current) {
        (lastAnimation.current as any).stop();
      }

      (lastAnimation.current as any) = animate(
        "span",
        {
          opacity: 1,
        },
        {
          duration: 2,
          delay: stagger(0.1),
        }
      );
    }

    // Cleanup function to stop the animation when the component unmounts
    return () => {
      if (lastAnimation.current) {
        (lastAnimation.current as any).stop();
      }
    }

  }, [wordsArray, animate]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return useMemo(() => renderWords(), [words]) || renderWords();
};
