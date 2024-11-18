import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { enCA, frCA } from "date-fns/locale";

// Shared locale configuration
const locales = {
  "en-CA": enCA,
  "fr-CA": frCA,
};

// Function to format the date
export const FormattedDate = ({ dateStr, locale, includeYear = true }) => {
  if (!dateStr) {
    return null;
  }

  const selectedLocale = locales[locale] || enCA;
  const formatString = includeYear ? "d MMM ''yy" : "d MMM";

  const formattedDate = format(new Date(dateStr), formatString, { locale: selectedLocale });
  const dayPart = formattedDate.split(" ")[0];
  const wrappedDayPart = `<span>${dayPart}</span>`;

  const finalDate = wrappedDayPart + formattedDate.substring(dayPart.length);
  return <div dangerouslySetInnerHTML={{ __html: finalDate }} />;
};

// Function to format the time (hours and minutes)
export const FormattedTime = ({ dateStr, locale }) => {
  if (!dateStr) {
    return null;
  }

  // Define locale fallback
  const selectedLocale = locales[locale] || enCA;

  // Parse the date as a zoned time
  const zonedDate = utcToZonedTime(dateStr, "-04:00"); // Replace "-04:00" if needed dynamically

  // Format the time
  const formattedTime = format(zonedDate, "HH:mm", { locale: selectedLocale });

  return <div>{formattedTime}</div>;
};