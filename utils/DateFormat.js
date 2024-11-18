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
  const dayName = format(new Date(dateStr), "EEE", { locale: selectedLocale }); // Day name
  const day = format(new Date(dateStr), "d", { locale: selectedLocale }); // Day number
  const monthYear = includeYear
    ? format(new Date(dateStr), "MMM ''yy", { locale: selectedLocale }) // Month and year
    : format(new Date(dateStr), "MMM", { locale: selectedLocale }); // Month only

  return (
    <>
      <span>{dayName}</span>
      <span>{day}</span>
      <span>{monthYear}</span>
    </>
  );
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

  return <>{formattedTime}</>;
};