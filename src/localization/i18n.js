import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import de from "./de";
import en from "./en";

// Define the key-value pairs for the languages you want to support.
const translations = {
  en: en,
  de: de,
};

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
// i18n.locale = Localization.getLocales()[0].languageCode ?? "en";
i18n.locale = "de"

// When a value is missing from a language, it falls back to another language with the key present.
i18n.enableFallback = true;

export default i18n;
