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
                  location: obj[key].location,
                  creator_id: obj[key].creator_id
                })
                commit('setLoadedMeetups', meetups)
                commit('setLoading', false);
              })
              .catch(error => {
                console.log(error)
                commit('setLoading', false);
              })
          },
            createMeetup({commit, state}, payload){
                const meetup = {
                    title: payload.title,
                    location: payload.location,
                    description: payload.description,
                    date: payload.date.toString(),
                    creator_id: state.user.id
                };
                let imageUrl;
                let key;
                firebase.database().ref('meetups').push(meetup).then((data) => {
                  console.log(data);
                  key = data.key;
                  return key
                }).then(key => {
                  const filename = payload.image.name;
                  const ext = filename.slice(filename.lastIndexOf('.'));
                  return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
                }).then(fileData => {
                  fileData.ref.getDownloadURL()
                    .then(url => {
                      imageUrl = url;
                      return firebase.database().ref('meetups').child(key).update({
                        imageURL: url
                      })
                    })
                }).then(() => {
                  console.log(imageUrl);
                  commit('createMeetup', {
                    ...meetup,
                    imageURL: imageUrl,
                    id: key
                  })
                }).catch((error) => {
                  console.log(error);
                });
            },

            updateMeetupData({commit}, payload){
              commit('setLoading', true)
              const updateObj = {}

              if(payload.title){
                updateObj.title = payload.title
              }

              if(payload.description){
                updateObj.description = payload.description
              }

              if(payload.date){
                updateObj.date = payload.date
              }

              firebase.database().ref('/meetups').child(payload.id).update(updateObj)
                .then(() => {
                  commit('setLoading', false)
                  commit('updateMeetup', payload)
                }).catch(error => {
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
            updateMeetup(state, payload){
              const meetup = state.loadedMeetups.find(meetup => {
                return meetup.id === payload.id
              })

              if(payload.title){
                meetup.title = payload.title
              }
              if(payload.description){
                meetup.description = payload.description
              }
              if(payload.date){
                meetup.date = payload.date
              }
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
