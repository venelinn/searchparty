// FormattedDate.js
import { format } from "date-fns";
import { enCA, frCA } from "date-fns/locale";

const FormattedDate = ({ dateStr, locale, includeYear = true }) => {
  if (!dateStr) {
    return null;
  }

  const locales = {
    "en-CA": enCA,
    "fr-CA": frCA,
  };

  const selectedLocale = locales[locale] || enCA;
  const formatString = includeYear ? "d MMM ''yy" : "d MMM";

	const formattedDate = format(new Date(dateStr), formatString, { locale: selectedLocale });
	const dayPart = formattedDate.split(" ")[0];
	const wrappedDayPart = `<span>${dayPart}</span>`;

	const finalDate = wrappedDayPart + formattedDate.substring(dayPart.length);
	return <div dangerouslySetInnerHTML={{ __html: finalDate }} />;
};

export default FormattedDate;
