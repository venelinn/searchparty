"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import cx from "clsx";
import useReduceMotion from "../../hooks/useReduceMotion";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";
import { Section } from "../Section";
import styles from "./Footer.module.scss";

interface FooterProps {
  siteConfig: any;
  links: any[];
  pageLocale: string;
}

export default function Footer({ siteConfig, links, pageLocale }: FooterProps) {
	const reduceMotion = useReduceMotion();
	const pathname = usePathname();
	const element = useRef<HTMLDivElement | null>(null);
	const locale = pageLocale.split("-")[0];

	useIsomorphicLayoutEffect(() => {
		const ctx = gsap.context(() => {
			if (!reduceMotion) {
				gsap.from(element.current, {
					opacity: 0,
					delay: .3,
					duration: 1.5,
					ease: "power4.out",
					scrollTrigger: {
						trigger: element.current,
						start: "-100% bottom",
						end: "top top"
					}
				});
			}
		}, element);
		return () => ctx.revert();
	}, [pathname, reduceMotion]);

	return (
		<Section
			classNames={{
				main: styles.main,
			}}>
			<div className={styles.footer} ref={element}>
					<div className={styles.footer__fineprint}>
						<span>
						&copy; {new Date().getFullYear()} {siteConfig?.copyright} {siteConfig?.fineprint}  | Crafted by <a href="https://venelin.ca" target="_blank" rel="noopener noreferrer">Venelin.ca</a>
						</span>
					</div>
					{Array.isArray(links) && links.length > 0 && (
						<div className={styles.footer__nav}>
							{links.map((link) => {
								const isActive = pathname === link.slug;
								return (
									<Link
										key={link.slug}
										href={link.slug}
										locale={locale}
										className={cx("link", styles.link, {
											["link--active"]: isActive,
											[styles.link__active]: isActive,
										})}
										>
											<span className="link__text">{link.pageName}</span>
									</Link>
								);
							})}
						</div>
					)}
			</div>
		</Section>
	);
}

