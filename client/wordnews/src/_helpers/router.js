import Vue from 'vue';
import Router from 'vue-router';

import Main from '../components/Main'
import Login from '../components/Login'
import Register from '../components/Register'
import News from '../components/News';
Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Main },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/news', component:  News},

    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})