import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useNextCssRemovalPrevention from "../hooks/useNextCssRemovalPrevention";
import { TransitionContextProvider } from "../context/transitionContext";
import { NavigationContextProvider } from "../context/navigationContext";
import { DataProvider } from "../utils/DataProvider";

import "@/styles/globals.scss";

gsap.registerPlugin(ScrollTrigger);

export default function App({ Component, pageProps }) {
	const router = useRouter();
	const currentLanguageCode = router.locale;

	/* Removes focus from next/link element after page change */
	useEffect(() => {
		document.activeElement && document.activeElement.blur();
	}, [router]);

	useEffect (() => {
    document.documentElement.lang = currentLanguageCode
  },[currentLanguageCode]);

	/* Temporary fix to avoid flash of unstyled content (FOUC) during route transitions */
	useNextCssRemovalPrevention();

	return (
		<TransitionContextProvider>
			<NavigationContextProvider>
				<DataProvider>
					<Component {...pageProps} />
				</DataProvider>
			</NavigationContextProvider>
		</TransitionContextProvider>
	);
}
