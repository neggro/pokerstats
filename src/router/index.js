import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from '../views/Login.vue';
import RegisterView from '../views/Register.vue';
import HomeView from '../views/Home.vue';
import firebase from '../firebase';

var beforeEnterLogginRequiredPath = (to, from, next) => {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            next();
        } else {
            next('/login');
        }
    });
};

var beforeEnterNotLogginRequiredPath = (to, from, next) => {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            next('/');
        } else {
            next();
        }
    });
};

Vue.use(VueRouter);

const ROUTES = [
    {
        name: 'Home',
        path: '/',
        component: HomeView,
        beforeEnter: beforeEnterLogginRequiredPath
    },
    {
        name: 'Login',
        path: '/login',
        component: LoginView,
        beforeEnter: beforeEnterNotLogginRequiredPath
    },
    {
        name: 'Register',
        path: '/register',
        component: RegisterView,
        beforeEnter: beforeEnterNotLogginRequiredPath
    },
    {
        path: '*',
        redirect: '/'
    }
];

export default new VueRouter({
    mode: 'hash',
    scrollBehavior: () => ({
        y: 0
    }),
    routes: ROUTES
});
