import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export function createStore () {
    return new Vuex.Store({
        state: {
            loadedMeetups: [
                {
                    imageURL: 'http://notkutusu.com/img/gmail/Screenshot_26.png',
                    id: 'adfjlsadf',
                    title: 'Meetup in New York',
                    date: '2017-07-19'
                },
                {
                    imageURL: 'http://notkutusu.com/img/gmail/Screenshot_26.png',
                    id: 'ajlsadf',
                    title: 'Meetup in Paris',
                    date: '2017-07-17'
                }
            ],
            user: {
                id: 'ajlsfkaj',
                registeredMeetups: ['ajlsadf']
            }
        },

        actions: {},

        mutations: {},

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
            }
        }
    })
}