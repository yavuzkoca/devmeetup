export default {
  state: {
    loading: false,
    authError: null
  },

  actions: {
    clearAuthError ({commit}) {
      commit('clearAuthError')
    }
  },

  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setAuthError (state, payload) {
      state.authError = payload
    },
    clearAuthError (state, payload) {
      state.authError = null
    }
  },

  getters: {
    authError (state) {
      return state.authError
    },
    loading (state) {
      return state.loading
    }
  }
}
