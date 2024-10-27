import { useState, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useRouter } from "next/router";
import useTransitionContext from "../context/transitionContext";
import useIsomorphicLayoutEffect from "../hooks/useIsomorphicLayoutEffect";

export default function TransitionLayout({ children }) {
	useEffect(() => {
    // prevents flashing
    gsap.to("body", {
      duration: 1,
      css: { visibility: "visible" },
    });
  });
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState({
    route: router.asPath,
    children,
  });
  const { timeline, resetTimeline } = useTransitionContext();

  useIsomorphicLayoutEffect(() => {
    if (currentPage.route !== router.asPath) {
      if (timeline.duration() === 0) {
        /* There are no outro animations, so immediately transition */
        setCurrentPage({
          route: router.asPath,
          children,
        });
        ScrollTrigger.refresh(true);
        return;
      }

      timeline.play().then(() => {
        /* outro complete so reset to an empty paused timeline */
        resetTimeline();
        setCurrentPage({
          route: router.asPath,
          children,
        });
        ScrollTrigger.refresh(true);
      });
    } else {
      ScrollTrigger.refresh(true);
    }
  }, [router.asPath]);

  return <div className="u-overflow--hidden">{currentPage.children}</div>;
}
