import { gsap } from "gsap";

export const PAGE_TYPE = "page";
export const PAGE_TYPES = [PAGE_TYPE];
export const SITE_CONFIG_TYPE = "siteConfig";

export const IS_DEV = process.env.NODE_ENV === "development";

export function normalizeSlug(slug) {
	return slug.startsWith("/") ? slug : "/" + slug;
}

export function Carousel(settings = {}) {
	let carousel = {};
	let currentItem = 1;
	let interval = undefined;

	const constructor = {
		autoplay: false,
		autoplayInterval: 3000,
		ulSelector: undefined,
		liSelector: undefined,
		ease: "power4.inOut",
		data: undefined,
		onInitUpdate: () => {},
		onAutoplayUpdate: () => {},
	};

	carousel.config = { ...constructor, ...settings };

	// Private methods
	const displayCarousel = () => {
		gsap
			.to(carousel.config.ulSelector, {
				duration: 1,
				opacity: 1,
				delay: 2,
				ease: carousel.config.ease,
				zIndex: 0,
			})
			.eventCallback("onComplete", () => {
				if (carousel.config.autoplay && !interval) {
					carousel.methods.autoplay();
				}
			});
	};

	// Public methods
	const pause = () => {
		if (carousel.config.autoplay && interval) {
			clearInterval(interval);
		}
	};

	const init = () => {
		cleanup();
		carousel.config.onInitUpdate();
		displayCarousel();
	};

	const autoplay = () => {
		cleanup();

		const animateElements = document.querySelectorAll(carousel.config.liSelector).length;

		// Display first brand immediately
		carousel.config.onAutoplayUpdate({
			index: currentItem,
			item: carousel.config.data[currentItem - 1],
			items: carousel.config.data,
			init: true,
		});

		// Auto cycle through with interval
		interval = window.setInterval(() => {
			if (currentItem === animateElements) {
				currentItem = 1;
			} else {
				currentItem += 1;
			}
			carousel.config.onAutoplayUpdate({
				index: currentItem,
				item: carousel.config.data[currentItem - 1],
				items: carousel.config.data,
				init: false,
			});
		}, carousel.config.autoplayInterval);
	};

	const cleanup = () => {
		if (interval) {
			window.clearInterval(interval);
		}
		currentItem = 1;
	};

	const destroy = () => {
		cleanup();
		carousel = undefined;
	};

	carousel.methods = {
		pause,
		init,
		destroy,
		autoplay,
	};

	return carousel;
}
