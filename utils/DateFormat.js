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
  const formatString = includeYear ? "d MMM yyyy" : "yyyy";

  const formattedDate = format(new Date(dateStr), formatString, { locale: selectedLocale });
  return <>{formattedDate}</>;
};

export default FormattedDate;
