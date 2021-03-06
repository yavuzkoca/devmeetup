import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import App from './App.vue'
import Components from 'components/_index'
import Theme from '../stylus/theme.js'
import DateFilter from '../filters/date.js'
import * as firebase from 'firebase'
import AlertComp from '../components/Shared/Alert'
import EditMeetupDetailsDialog from '../components/Meetup/Edit/EditMeetupDetailsDialog'
import EditMeetupDateDialog from '../components/Meetup/Edit/EditMeetupDateDialog'
import RegisterDialog from '../components/Meetup/Registration/RegisterDialog'

import { createStore } from 'store/index'
import { createRouter } from 'router/index'
import { sync } from 'vuex-router-sync'

Vue.use(Vuetify,Theme);
Vue.filter('dateFilter', DateFilter);
Vue.component('app-alert', AlertComp);
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog);
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog);
Vue.component('app-meetup-register-dialog', RegisterDialog);

Object.keys(Components).forEach(key => {
  Vue.component(key, Components[key])
});

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp (ssrContext) {
  // create store and router instances
  const store = createStore();
  const router = createRouter();

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router);

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
      router,
      store,
      ssrContext,
      render: h => h(App),
      created() {
          if (!firebase.apps.length) {
              firebase.initializeApp({
                  apiKey: 'AIzaSyCS76GVpSyMp236YNMJFx8qgXrsLDmFq4A',
                  authDomain: 'devmeetup-391ad.firebaseapp.com',
                  databaseURL: 'https://devmeetup-391ad.firebaseio.com',
                  projectId: 'devmeetup-391ad',
                  storageBucket: 'gs://devmeetup-391ad.appspot.com',
                  messagingSenderId: '362731410386'

              })
          }
          firebase.auth().onAuthStateChanged((user) => {
              if (user){
                this.$store.dispatch('autoSignIn', user)
                this.$store.dispatch('fetchUserData')
              }
          });
          this.$store.dispatch('loadMeetups')
      }
  });

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
