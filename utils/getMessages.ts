import en from '../messages/en.json';

type Locale = 'en';

interface Messages {
  [key: string]: unknown;
}

const messages: Record<Locale, Messages> = { en };

export const getMessages = (locale: Locale | string): Messages => {
  return messages[locale as Locale] || messages['en'];
};
