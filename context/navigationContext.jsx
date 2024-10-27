import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useScrollbar from "../hooks/useScrollbar";
import useWindowSize from "../hooks/useWindowSize";
import useLockedScroll from "../hooks/useLockedScroll";

const NavigationContext = createContext({
  open: false,
  sticky: false,
  fixed: false,
  stuck: false,
  setOpen: () => {},
  toggle: () => {},
});

export function NavigationContextProvider({ children }) {
  const [ref, setRef] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScrollbar();
  const { windowSize, isDesktop } = useWindowSize();
  const [locked, setLocked] = useLockedScroll(false);
  const router = useRouter();

  const navigationHeight = 100; // Set the height at which the "stuck" state should be triggered

  const [isSticky, setIsSticky] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
	const [isFixedAlwaysTrue, setIsFixedAlwaysTrue] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
    setLocked(!locked);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrollPastNavigation = scrollY > navigationHeight;
      setIsSticky(isScrollPastNavigation && scrollY > windowSize.height);
      setIsStuck(scrollY > navigationHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY, windowSize.height]);

  useEffect(() => {
    if (isDesktop) {
      setIsOpen(false);
      setLocked(false);
    }
  }, [isDesktop]);


  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
      setLocked(false);
    }
		setIsFixedAlwaysTrue(false);
		// Reset the fixed, sticky, and stuck values when the router changes
		requestAnimationFrame(() => {
			setIsSticky(false);
			setIsStuck(false);
		});

		setIsFixedAlwaysTrue(
			router.asPath === "/contact" ||
			router.asPath === "/privacy-policy" ||
			router.asPath === "/terms-and-conditions" ||
			/^\/media(\/|$)/.test(router.asPath)
		);

  }, [router.asPath]);

	// const isFixedAlwaysTrue =
  //   router.asPath === "/privacy-policy" ||
  //   router.asPath === "/terms-and-conditions"; // Add the new page where 'fixed' should always be true


  return (
    <NavigationContext.Provider
      value={{
        ref,
        setRef,
        isOpen,
        setIsOpen,
        fixed: isFixedAlwaysTrue,
        sticky: isSticky,
        stuck: isStuck,
        toggle,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export default function useNavigationContext() {
  return useContext(NavigationContext);
}
