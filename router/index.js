import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Meetups from '../components/Meetup/Meetups.vue'
import Meetup from '../components/Meetup/Meetup.vue'
import CreateMeetup from '../components/Meetup/CreateMeetup.vue'
import Profile from '../components/User/Profile.vue'
import Signup from '../components/User/Signup.vue'
import Signin from '../components/User/Signin.vue'
import AuthGuard from './auth-guard'

// The meta data for your routes
const meta = require('./meta.json');

// Function to create routes
// Is default lazy but can be changed
function route (path, view, c) {
    return {
        path: path,
        meta: meta[path],
        component: resolve => import(`pages/${view}View.vue`).then(resolve)
    }
}

Vue.use(Router);

export function createRouter () {
    const router = new Router({
        base: __dirname,
        mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            {
                path: '/',
                name: 'Root',
                component: Home
            },

            // Global redirect for 404
            { path: '*', redirect: '/' },

            {
              path: '/meetups',
              name: 'Meetups',
              component: Meetups
            },
            {
                path: '/meetup/new',
                name: 'CreateMeetup',
                component: CreateMeetup,
                // beforeEnter: AuthGuard
            },
            {
                path: '/meetups/:id',
                name: 'Meetup',
                props: true,
                component: Meetup
            },
            {
                path: '/profile',
                name: 'Profile',
                component: Profile,
                // beforeEnter: AuthGuard
            },
            {
                path: '/signup',
                name: 'Signup',
                component: Signup
            },
            {
                path: '/signin',
                name: 'Signin',
                component: Signin
            }
        ]
    });

    // Send a pageview to Google Analytics
    router.beforeEach((to, from, next) => {
        if (typeof ga !== 'undefined') {
            ga('set', 'page', to.path);
            ga('send', 'pageview')
        }
        next()
    });

    return router
}
