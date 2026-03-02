import bg from "../messages/bg.json";
import en from "../messages/en.json";

type Locale = "en" | "bg";

interface Messages {
  [key: string]: unknown;
}

const messages: Record<Locale, Messages> = { en, bg };

export const getMessages = (locale: Locale | string): Messages => {
  return messages[locale as Locale] || messages["bg"];
};
