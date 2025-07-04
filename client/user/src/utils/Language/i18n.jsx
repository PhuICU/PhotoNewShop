import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import vi from "./locales/vn/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    vn: {
      translation: vi,
    },
  },
  lng: "vn",
  fallbackLng: "vn",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
