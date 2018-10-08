<template>
    <v-app>
        <v-navigation-drawer v-model="sideNav" temporary absolute value="">
            <v-list>
                <v-list-tile
                        v-for="item in menuItems"
                        :key="item.title"
                        :to="item.link"
                >
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                            {{ item.title }}
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if="userIsAuthenticated" @click="onLogout">
                  <v-list-tile-action>
                    <v-icon>exit_to_app</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>Logout</v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar class="error" dark>
            <v-toolbar-side-icon
                    @click="sideNav = !sideNav"
                    class="hidden-md-and-up"
            ></v-toolbar-side-icon>
            <v-toolbar-title>
                <router-link to="/" tag="span" style="cursor: pointer;">
                    Dev Meetup
                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat
                       v-for="item in menuItems"
                       :key="item.title"
                       :to="item.link"
                >
                    <v-icon left>{{ item.icon }}</v-icon>
                    {{ item.title }}
                </v-btn>
                <v-btn flat v-if="userIsAuthenticated" @click="onLogout">
                  <v-icon left>exit_to_app</v-icon>
                  Logout
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <main>
            <router-view></router-view>
        </main>
    </v-app>
</template>

<script>

    export default {
        components: {},
        data () {
            return {
                sideNav: false
            }
        },
        computed: {
            menuItems(){
                let menuItems = [
                    {icon: 'face', title: 'Sign up', link: '/signup'},
                    {icon: 'lock_open', title: 'Sign in', link: 'signin'},
                ];
                if(this.userIsAuthenticated){
                    menuItems = [
                        {icon: 'supervisor_account', title: 'View Meetups', link: '/meetups'},
                        {icon: 'room', title: 'Organize Meetup', link: '/meetup/new'},
                        {icon: 'person', title: 'Profile', link: '/profile'}
                    ]
                }
                return menuItems;
            },
            userIsAuthenticated(){
                const user = this.$store.getters.user;
                return user !== null && user !== undefined;
            }
        },
        methods:{
          onLogout(){
            this.$store.dispatch('logout')
          }
        }
    }
</script>
