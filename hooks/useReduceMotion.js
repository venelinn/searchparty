import { useState, useEffect } from "react";
import { gsap } from "gsap";

const useReduceMotion = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const context = mm.add({
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (ctx) => {
      setReduceMotion(ctx.conditions.reduceMotion);
    });

    return () => {
      context.revert();
    };
  }, []);

  return reduceMotion;
};

export default useReduceMotion;
