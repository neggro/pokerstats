import Vue from 'vue';
import VueI18n from 'vue-i18n';

import enLanguage from './languages/en.json';
import esLanguage from './languages/es.json';

let locales = {
    en: enLanguage,
    es: esLanguage
};

Vue.use(VueI18n);

let userLanguage = localStorage.getItem('lang') || (navigator.languages && navigator.languages[0] ||
    navigator.language || 'en').split('-')[0];

Vue.config.lang = locales[userLanguage] ? userLanguage : 'en';

localStorage.setItem('lang', Vue.config.lang);

Vue.config.missingHandler = (lang, key) => {
    // handle translation missing
    return key;
};

// set locales
Object.keys(locales).forEach((lang) => {
    Vue.locale(lang, locales[lang]);
});
