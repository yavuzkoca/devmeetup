import Vue from 'vue'
import Vuex from 'vuex'

import meetup from './meetup'
import user from './user'
import shared from './shared'

Vue.use(Vuex);

export function createStore () {
    return new Vuex.Store({
      modules: {
        meetup: meetup,
        user: user,
        shared: shared
      }
    })
}
