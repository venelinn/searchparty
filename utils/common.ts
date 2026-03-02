import { gsap } from "gsap";

export const PAGE_TYPE = "page";
export const PAGE_TYPES = [PAGE_TYPE] as const;
export const SITE_CONFIG_TYPE = "siteConfig";

export const IS_DEV = process.env.NODE_ENV === "development";

export function normalizeSlug(slug: string): string {
	return slug.startsWith("/") ? slug : "/" + slug;
}

export interface CarouselSettings {
	autoplay?: boolean;
	autoplayInterval?: number;
	ulSelector?: string;
	liSelector?: string;
	ease?: string;
	data?: unknown[];
	onInitUpdate?: () => void;
	onAutoplayUpdate?: (payload: {
		index: number;
		item: unknown;
		items: unknown[];
		init: boolean;
	}) => void;
}

export interface CarouselInstance {
	config: CarouselSettings;
	methods: {
		pause: () => void;
		init: () => void;
		destroy: () => void;
		autoplay: () => void;
	};
}

export function Carousel(settings: CarouselSettings = {}): CarouselInstance {
	const carousel: CarouselInstance = {
		config: {},
		methods: {} as CarouselInstance["methods"],
	};

	let currentItem = 1;
	let interval: number | undefined;

	const defaults: CarouselSettings = {
		autoplay: false,
		autoplayInterval: 3000,
		ulSelector: undefined,
		liSelector: undefined,
		ease: "power4.inOut",
		data: undefined,
		onInitUpdate: () => {},
		onAutoplayUpdate: () => {},
	};

	carousel.config = { ...defaults, ...settings };

	const displayCarousel = () => {
		const target = carousel.config.ulSelector;
		if (!target) return;
		gsap
			.to(target, {
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

	const pause = () => {
		if (carousel.config.autoplay && interval) {
			clearInterval(interval);
		}
	};

	const init = () => {
		cleanup();
		carousel.config.onInitUpdate?.();
		displayCarousel();
	};

	const autoplay = () => {
		cleanup();

		const animateElements = document.querySelectorAll(
			carousel.config.liSelector ?? ""
		).length;

		carousel.config.onAutoplayUpdate?.({
			index: currentItem,
			item: carousel.config.data?.[currentItem - 1],
			items: carousel.config.data ?? [],
			init: true,
		});

		interval = window.setInterval(() => {
			if (currentItem === animateElements) {
				currentItem = 1;
			} else {
				currentItem += 1;
			}
			carousel.config.onAutoplayUpdate?.({
				index: currentItem,
				item: carousel.config.data?.[currentItem - 1],
				items: carousel.config.data ?? [],
				init: false,
			});
		}, carousel.config.autoplayInterval ?? 3000);
	};

	const cleanup = () => {
		if (interval) {
			window.clearInterval(interval);
		}
		currentItem = 1;
	};

	const destroy = () => {
		cleanup();
	};

	carousel.methods = { pause, init, destroy, autoplay };

	return carousel;
}

export interface ImageAsset {
	src: string;
	width?: number;
	height?: number;
}

export interface OptimizedImageResult {
	url: string;
	width: number;
	height: number;
}

export function getOptimizedImageURL(
	image: ImageAsset,
	width = 500,
	quality: string | number = "auto"
): string {
	if (typeof image.src === "string") {
		return image.src.replace("/upload/", `/upload/w_${width},q_${quality}/`);
	}
	return image.src;
}

export function getOptimizedImage(
	image: ImageAsset,
	width = 500,
	quality: string | number = "auto"
): OptimizedImageResult {
	if (typeof image.src === "string" && image.width && image.height) {
		const aspectRatio = image.width / image.height;
		const newHeight = Math.round(width / aspectRatio);
		const optimizedURL = image.src.replace(
			"/upload/",
			`/upload/w_${width},q_${quality}/`
		);

		return {
			url: optimizedURL,
			width,
			height: newHeight,
		};
	}
	return {
		url: image.src,
		width: image.width ?? 500,
		height: image.height ?? 500,
	};
}

export function getCloudinaryAsSvg(url: string): string {
	if (url.includes(".svg")) {
		return url.replace("/f_auto", "");
	}
	return url;
}

export interface GetEventPermalinkParams {
	locale: string;
	title: string;
}

/**
 * Generates a permalink for an event from its title.
 * Uses slugified title for the URL path.
 */
export function getEventPermalink({ title }: GetEventPermalinkParams): string {
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	return `/events/${slug}`;
}
