import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from '../views/Login.vue';
import RegisterView from '../views/Register.vue';
import HomeView from '../views/Home.vue';
import GroupView from '../views/Group.vue';
import firebase from '../firebase';

let beforeEnterLogginRequiredPath = (to, from, next) => {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            next();
        } else {
            next('/login');
        }
    });
};

let beforeEnterNotLogginRequiredPath = (to, from, next) => {

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
        name: 'Home',
        path: '/',
        component: HomeView,
        beforeEnter: beforeEnterLogginRequiredPath
    },
    {
        name: 'CreateGroup',
        path: '/create-group',
        component: GroupView,
        beforeEnter: beforeEnterLogginRequiredPath
    },
    {
        name: 'EditGroup',
        path: '/edit-group/:groupId',
        component: GroupView,
        beforeEnter: beforeEnterLogginRequiredPath
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
