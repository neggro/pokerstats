import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from '../views/Login.vue';
import RegisterView from '../views/Register.vue';
import HomeView from '../views/Home.vue';
import GroupView from '../views/Group.vue';
import DetailsView from '../views/Details.vue';
import GameView from '../views/Game.vue';
import firebase from '../firebase';

let beforeEnterLogginRequiredPath = (to, from, next) => {

    firebase.auth().onAuthStateChanged((user) => {

        return user ? next() : next('/login');
    });
};

let beforeEnterNotLogginRequiredPath = (to, from, next) => {

    firebase.auth().onAuthStateChanged((user) => {

        return user ? next('/') : next();
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
        name: 'GroupDetails',
        path: '/group-details/:groupId',
        component: DetailsView,
        beforeEnter: beforeEnterLogginRequiredPath
    },
    {
        name: 'CreateGame',
        path: '/group-details/:groupId/create-game',
        component: GameView,
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
