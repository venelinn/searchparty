const localization = require("./utils/localization");

/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n: {
		locales: localization.locales,
		defaultLocale: localization.defaultLocale,
		localeDetection: false,
	},
	trailingSlash: false,
	images: {
		// dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "downloads.ctfassets.net",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "images.ctfassets.net",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "**",
			},
		],
	},
	sassOptions: {
		additionalData: "@import 'styles/shared.scss';",
	},
	async rewrites() {
    return [
      {
        source: "/storybook/:path*",
        destination: "/_next/storybook/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
