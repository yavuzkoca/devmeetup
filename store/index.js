import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex);

export function createStore () {
    return new Vuex.Store({
        state: {
            loadedMeetups: [
                {
                    imageURL: 'http://notkutusu.com/img/gmail/Screenshot_26.png',
                    id: 'adfjlsadf',
                    title: 'Meetup in New York',
                    date: new Date(),
                    location: 'Turkey',
                    description: 'Lorem Ipsum'
                },
                {
                    imageURL: 'http://notkutusu.com/img/gmail/Screenshot_26.png',
                    id: 'ajlsadf',
                    title: 'Meetup in Paris',
                    date: new Date(),
                    location: 'Turkey',
                    description: 'Lorem Ipsum'
                }
            ],
            user: null
        },

        actions: {
            createMeetup({commit}, payload){
                const meetup = {
                    title: payload.title,
                    location: payload.location,
                    imageURL: payload.imageURL,
                    description: payload.description,
                    date: payload.date,
                    id: 'asdfsdaf'
                };
                // Reach out to firebase and store it
                commit('createMeetup', meetup)
            },

            // Sign up user to firebase
            signUserUp({commit}, payload){
                firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                    .then(
                        user => {
                            const newUser = {
                                id: user.uid,
                                registeredMeetups: [] // New user can not have registered meetups
                            };
                            commit('setUser', newUser);
                        }
                    ).catch(
                        error => {
                            console.log(error)
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
            }
        },

        mutations: {
            createMeetup(state, payload){
                state.loadedMeetups.push(payload);
            },
            setUser(state, payload){
                state.user = payload;
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
            }
        }
    })
}