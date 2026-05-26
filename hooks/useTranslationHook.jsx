import i18n from "../src/localization/i18n";
import { useLanguage } from "../context/LanguageContext";

export const useTranslation = () => {
  const { locale } = useLanguage(); // 👈 this triggers re-render

  const t = (key, options) => i18n.t(key, options);

  return { t, locale };
};
