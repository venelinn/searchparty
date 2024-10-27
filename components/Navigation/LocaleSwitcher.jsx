/*
This component has two roles:
1. Render a locale dropdown. When a visitor selects a locale,
   (a) the current path is reloaded with the selected locale, and
   (b) the Stackbit editor (if running within it) is notified, so it can update its own switch.
2. Listen to locale changes in the Stackbit visual editor, and reload the page accordingly.

This bi-di integration with Stackbit is *optional*, but provides extra convenience for content editors.
*/
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import localization from "../../utils/localization";
import Globe from "../Icons/Globe";
import cx from "classnames";
import styles from "./LocaleSwitcher.module.scss";

export const LocaleSwitcher = ({ pageLocale, isOpen }) => {
  const router = useRouter();
  // When notifying Stackbit of a change, it will fire an event back - which should be ignored
  const selfTriggeredSwitch = useRef(false);

  // Listen to locale changes in the Stackbit editor
  useEffect(() => {
    const handler = (event) => {
      if (selfTriggeredSwitch.current) {
        selfTriggeredSwitch.current = false;
        return;
      }

      const locale = event?.detail?.locale ? event?.detail?.locale.split("-")[0] : localization.defaultLocale;
      if (!locale) return;

      const { pathname, asPath, query } = router;
      router.push({ pathname, query }, asPath, { locale });
    };
    window.addEventListener("stackbitLocaleChanged", handler);
    return () => {
      window.removeEventListener("stackbitLocaleChanged", handler);
    };
  }, [router]);

	const onLanguageLinkClick = (locale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale });

    selfTriggeredSwitch.current = true;
    window.stackbit?.setLocale(locale); // Notify Stackbit editor

		// Reset the langVisible state when a language link is clicked
		setLangVisible(false);
  };

	// TOGGLE
	const [langVisible, setLangVisible] = useState(false);
	const toggleLang = () => {
    setLangVisible(!langVisible);
  };

	 // Close the menu when the router changes
	 useEffect(() => {
    setLangVisible(false);
  }, [router.asPath]);


  return (
    <div className={styles.languages}>
			<button
				className={`${langVisible || isOpen ? "hidden" : ""}`}
				onClick={toggleLang}>
					<Globe />
			</button>
			<div className={`${langVisible || isOpen ? "flex" : "hidden"} ${styles.lang}`}>
				{localization.locales.map((lang) => {
					const isActive = pageLocale === lang;
					return(
						<Link
							href={router.asPath}
							locale={lang}
							key={lang}
							className={cx("link", styles.link, {
								["link--active"]: isActive,
								[styles.lang__active]: isActive,
							})}
							>
							<span
								onClick={() => onLanguageLinkClick(lang)}
								className="link__text"
							>
							{lang === "en" ? "English" : lang === "fr" ? "Français" : lang}
							</span>
						</Link>
					)})}
			</div>
    </div>
  );
};