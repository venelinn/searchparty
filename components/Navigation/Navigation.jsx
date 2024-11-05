import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import cx from "classnames";
import useNavigationContext from "../../context/navigationContext";
import useElementSize from "../../hooks/useElementSize";
import useWindowSize from "../../hooks/useWindowSize";
import { Social } from "../Social";
import styles from "./Navigation.module.scss";

function Hamburger({ isOpen, toggle }) {
  return (
    <button
      className={cx(styles.hamburger, {
        [styles["is-nav-active"]]: isOpen,
      })}
      type="button"
      aria-label="Toggle menu"
      onClick={toggle}
    >
      <div className={styles.hamburger__lines}>
        <span></span>
      </div>
    </button>
  );
}

const Navigation = ({ pageLocale, siteConfig, links, allLinks, isNavigationVisible, isLogoVisible }) => {
  const { setRef, sticky, stuck, fixed, isOpen, toggle } = useNavigationContext();
	const [navigationRef, { height }] = useElementSize();
	const router = useRouter();
	const { isMobile, isDesktop } = useWindowSize();
  const headerText = siteConfig?.headerText; // This value is field-localized
	const logo = siteConfig?.logo[0];
  const locale = pageLocale.split("-")[0];
	useEffect(() => {
    if (fixed) {
      document.body.classList.add(styles.fixedNav);
    } else {
      document.body.classList.remove(styles.fixedNav);
    }

    // Clean up the class when the component unmounts
    return () => {
      document.body.classList.remove(styles.fixedNav);
    };
  }, [fixed]);

	function getCloudinaryAsSvg(url) {
		// Remove `f_auto` for SVG images to prevent WebP conversion
		if (url.includes(".svg")) {
			return url.replace("/f_auto", "");
		}
		return url;
	}
  return (
    <>
      <style jsx global>{`
        :root {
          --navigation-height: ${height}px;
        }
      `}</style>
				<header
					className={cx(styles.navigation, {
						[styles["is-stuck"]]: sticky,
						[styles["is-open"]]: isOpen,
						[styles["is-fixed"]]: fixed,
						[styles["is-stuck"]]: stuck,
						[styles["logo-hidden"]]: isLogoVisible === false,
					})}
					ref={el => {
						navigationRef(el);
						setRef(el);
					}}
				>
					<div className={styles.navigation__inner} data-anim="navigation" data-is-nav-visible={isNavigationVisible}>
						<div className={styles.navigation__menu}>
							{isNavigationVisible !== false && (
								<div className={styles["navigation__menu-list"]}>
									{links.map((link) => {
										const isActive = router.asPath === link.slug;
										return (
											<Link
												key={link.slug}
												href={link.slug}
												target={link?.target}
												locale={locale}
												className={cx(styles.link, {
													[styles.link__active]: isActive,
												})}
												>{link.pageName}
											</Link>
										);
									})}
								</div>
								)}
						</div>
						<div className={cx(styles.navigation__logo, {
							[styles["with-nav"]]: isNavigationVisible !== false,
						})}>
						{headerText && (
							<Link href="/" locale={pageLocale}>
								<Image
									src={getCloudinaryAsSvg(logo.src)}
									alt={logo.alt}
									width={logo.width}
									height={logo.height}
									/>

							</Link>
						)}
						</div>
						{isDesktop && (
							<div className={styles.navigation__social}>
								<Social items={siteConfig.social} />
							</div>
						)}

						{/* {isOpen && isMobile && (
							<>
								<nav className={styles.nav} data-name="Menu">
									{links.map((link) => {
										const isActive = router.asPath === link.slug;
										return (
											<Link
												key={link.slug}
												href={link.slug}
												target={link?.target}
												locale={locale}
												className={cx(styles.navLink, {
													[styles.navLinkActive]: isActive,
												})}
												>
													<span className="link__text">{link.pageName}</span>
											</Link>
										);
									})}
								</nav>
							</>
						)} */}
						{isNavigationVisible !== false &&  <Hamburger isOpen={isOpen} toggle={toggle} />}
					</div>
				</header>

    </>
  );
}

export default Navigation;
export { Navigation }