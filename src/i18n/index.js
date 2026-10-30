import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const resources = {
  fr: { translation: fr },
  ar: { translation: ar },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'ar'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Handle document direction and language attribute changes
const updateDocumentDirection = (lng) => {
  const isRtl = lng === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
};

updateDocumentDirection(i18n.resolvedLanguage || 'fr');

i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
});

export default i18n;
