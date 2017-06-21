import Vue from 'vue';
import App from './App.vue';
import router from './router';
/* eslint-disable no-unused-vars */
import i18n from './i18n';
import jquery from 'jquery';
import materializejs from 'materializejs';
/* eslint-enable no-unused-vars */

/* eslint-disable no-new */
new Vue({
    router: router,
    i18n: i18n,
    el: '#app',
    render: h => h(App)
});
