export const localization = {
  contentfulLocales: ['en-CA'],
  locales: ['en'],
  defaultLocale: 'en',
  nonLocalizedModels: ['siteConfig'],
};

export const getContentfulLocale = (locale: string) => {
  const index = localization.locales.indexOf(locale);
  if (index !== -1) {
    return localization.contentfulLocales[index];
  }
  // Fallback to the first locale if not found
  return localization.contentfulLocales[0];
};
