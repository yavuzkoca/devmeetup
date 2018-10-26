import * as firebase from 'firebase'

export default {
    state: {
      user: null
    },

    actions: {
      registerUserForMeetup({commit, getters}, payload){
        commit('setLoading', true)
        const user = getters.user
        firebase.database().ref('/users/' + user.id).child('/registrations/').push(payload)
          .then(data => {
            commit('setLoading', false)
            commit('registerUserForMeetup', {id: payload, fbKey: data.key})
          }).catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
      },
      unRegisterUserFromMeetup({commit, getters}, payload){
        commit('setLoading', true)
        const user = getters.user
        if(!user.fbKeys){
          return
        }
        const fbKey = user.fbKeys[payload]
        firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey).remove()
          .then(() => {
            commit('setLoading', false)
            commit('unRegisterUserFromMeetup', payload)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
          })
      },
      // Sign up user to firebase
      signUserUp({commit}, payload){
        commit('setLoading', true);
        commit('clearAuthError');
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setLoading', false);
              const newUser = {
                id: user.uid,
                registeredMeetups: [], // New user can not have registered meetups
                fbKeys: {}
              };
              commit('setUser', newUser);
            }
          ).catch(
          error => {
            commit('setLoading', false);
            commit('setAuthError', error.message);
          }
        )
      },

      // Sign in user from firebase
      signUserIn({commit}, payload){
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              const newUser = {
                id: user.user.uid,
                registeredMeetups: [], // This part will be fixed
                fbKeys:{}
              };
              commit('setUser', newUser);
            }
          ).catch(
          error => {
            console.log(error)
          }
        )
      },

      autoSignIn({commit}, payload){
        commit('setUser', {
          id: payload.uid,
          registeredMeetups: [],
          fbKeys: {}
        })
      },
      fetchUserData ({commit, getters}) {
        commit('setLoading', true)
        firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
          .then(data => {
            const values = data.val()
            let registeredMeetups = []
            let swappedPairs = {}
            for(let key in values){
              registeredMeetups.push(values[key])
              swappedPairs[values[key]] = key
            }
            const updatedUser = {
              id: getters.user.id,
              registeredMeetups: registeredMeetups,
              fbKeys: swappedPairs
            }

            commit('setLoading', false)
            commit('setUser', updatedUser)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
          })
      },
      logout({commit}){
        firebase.auth().signOut();
        commit('setUser', null)
      }
    },

    mutations: {
      registerUserForMeetup(state, payload){
        const id = payload.id
        if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
          return
        }
        state.user.registeredMeetups.push(id)
        state.user.fbKeys[id] = payload.fbKey
      },
      unRegisterUserFromMeetup(state, payload){
        const registeredMeetups = state.user.registeredMeetups
        registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
        Reflect.deleteProperty(state.user.fbKeys, payload)
      },
      setUser(state, payload){
        state.user = payload;
      }
    },

    getters: {
      user(state){
        return state.user;
      }
    }
}
