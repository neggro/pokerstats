import Vue from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
// import firebase from './firebase';

/* eslint-disable no-new */
new Vue({
    router: router,
    // data: {
    //     firebase: firebase
    // },
    el: '#app',
    render: h => h(App)
});
