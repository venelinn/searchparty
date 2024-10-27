import { useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import gsap from "gsap";
import cx from "classnames";
import useReduceMotion from "../../hooks/useReduceMotion";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";
import Section from "../Section";
import styles from "./Footer.module.scss";


export default function Footer({siteConfig, links, pageLocale}) {
	const reduceMotion = useReduceMotion();
	const router = useRouter();
	const element = useRef();
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
	}, [router.asPath, reduceMotion]);

	return (
		<Section
			theme={siteConfig?.theme?.color}
			classNames={{
				main: styles.main,
			}}>
			<div className={styles.footer} ref={element}>
				<div className={styles.footer__content}>
					<div className={styles.footer__top}>
						<div className={styles.footer__nav}>
							{links.map((link) => {
								const isActive = router.asPath === link.slug;
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
					</div>
					<div className={styles.footer__fineprint}>
						<span>{siteConfig?.copyright} &copy; {new Date().getFullYear()} {siteConfig?.fineprint} </span>
					</div>
				</div>
			</div>
		</Section>
	);
}

