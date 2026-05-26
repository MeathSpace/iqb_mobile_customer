import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import i18n from "../src/localization/i18n";

// ---------------------------------------------------------
// 1. Create Context
// ---------------------------------------------------------
const LanguageContext = createContext();

// ---------------------------------------------------------
// 2. Provider
// ---------------------------------------------------------
export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(i18n.locale);
  const [isReady, setIsReady] = useState(false); // prevent flicker

  console.log("Current Locale:", locale);

  // ---------------------------------------------------------
  // 3. Load saved language on app start
  // ---------------------------------------------------------
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem("currentLanguage");

        if (savedLang) {
          i18n.locale = savedLang;
          setLocale(savedLang);
        }
      } catch (error) {
        console.log("Error loading language:", error);
      } finally {
        setIsReady(true);
      }
    };

    loadLanguage();
  }, []);

  // ---------------------------------------------------------
  // 4. Change Language + Persist
  // ---------------------------------------------------------
  const changeLanguage = async (langCode) => {
    try {
      i18n.locale = langCode;
      setLocale(langCode);
      await AsyncStorage.setItem(locale, langCode);
    } catch (error) {
      console.log("Error saving language:", error);
    }
  };

  // ---------------------------------------------------------
  // 5. Prevent render until language is loaded
  // ---------------------------------------------------------
  if (!isReady) return null;

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ---------------------------------------------------------
// 6. Hook
// ---------------------------------------------------------
export const useLanguage = () => useContext(LanguageContext);
