import Vue from 'vue';
import VueI18n from 'vue-i18n';

import enLanguage from './languages/en.json';
import esLanguage from './languages/es.json';

let locales = {
    "en-US": enLanguage,
    "es-ES": esLanguage,
    "es-UY": esLanguage
};

Vue.use(VueI18n);

let userLanguage = localStorage.getItem('lang') || (navigator.languages && navigator.languages[0] ||
    navigator.language || 'en-US');

let currentLocale = locales[userLanguage] ? userLanguage : 'en-US';

let i18n = new VueI18n({
    locale: currentLocale,
    fallbackLocale: 'en-US',
    messages: locales,
    missing: (lang, key) => {
        // handle translation missing
        return key;
    }
});

localStorage.setItem('lang', currentLocale);

export default i18n;
