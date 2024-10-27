const localization = {
	contentfulLocales: ["en-CA", "fr-CA"],
	locales: ["en", "fr"],
	defaultLocale: "en",
	nonLocalizedModels: ["siteConfig"],
};

module.exports = {
	...localization,
	getContentfulLocale: (locale) => localization.contentfulLocales[localization.locales.indexOf(locale)],
};
