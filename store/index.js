import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex);

export function createStore () {
    return new Vuex.Store({
        state: {
            loadedMeetups: [],
            user: null,
            loading: false,
            authError: null
        },

        actions: {
          loadMeetups: function ({commit}) {
            commit('setLoading', true);
            firebase.database().ref('meetups').once('value')
              .then(data => {
                const meetups = []
                const obj = data.val()
                for (let key in obj) meetups.push({
                  id: key,
                  title: obj[key].title,
                  description: obj[key].description,
                  imageURL: obj[key].imageURL,
                  date: obj[key].date,
                  creatorId: obj[key].creatorId
                })
                commit('setLoadedMeetups', meetups)
                commit('setLoading', false);
              })
              .catch(error => {
                console.log(error)
                commit('setLoading', false);
              })
          },
            createMeetup({commit}, payload){
                const meetup = {
                    title: payload.title,
                    location: payload.location,
                    imageURL: payload.imageURL,
                    description: payload.description,
                    date: payload.date.toString(),
                    creator_id: getters.user.id
                };
                firebase.database().ref('meetups').push(meetup).then((data) => {
                  console.log(data);
                  const key = data.key;
                  commit('createMeetup', {
                    ...meetup,
                    id: key
                  })
                }).catch((error) => {
                  console.log(error);
                });
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
                                registeredMeetups: [] // New user can not have registered meetups
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
                                registeredMeetups: [] // This part will be fixed
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
              commit('setUser', {id: payload.uid, registeredMeetups: []})
            },

            logout({commit}){
              firebase.auth().signOut();
              commit('setUser', null)
            },

            clearAuthError ({commit}) {
                commit('clearAuthError')
            }
        },

        mutations: {
            setLoadedMeetups(state, payload){
                state.loadedMeetups = payload;
            },
            createMeetup(state, payload){
                state.loadedMeetups.push(payload);
            },
            setUser(state, payload){
                state.user = payload;
            },
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
            loadedMeetups (state) {
                return state.loadedMeetups.sort((A, B) => {
                    return A.date > B.date;
                });
            },
            featuredMeetups(state, getters){
                return getters.loadedMeetups.slice(0, 5)
            },
            loadedMeetup(state){
                return (meetupId) => {
                    return state.loadedMeetups.find((meetup) => {
                        return meetup.id === meetupId;
                    });
                }
            },
            user(state){
                return state.user;
            },
            authError (state) {
                return state.authError
            },
            loading (state) {
                return state.loading
            }
        }
    })
}
