<template>
    <v-app>
        <v-navigation-drawer v-model="sideNav" temporary absolute value="">
            <v-list>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>supervisor_account</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>View Meetups</v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar class="primary">
            <v-toolbar-side-icon
                    @click="sideNav = !sideNav"
                    class="hidden-md-and-up"
            ></v-toolbar-side-icon>
            <v-toolbar-title>Dev Meetup</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat>
                    <v-icon left>supervisor_account</v-icon>
                    View Meetups
                </v-btn>
                <v-btn flat>Link Two</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <main>

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
        }
    }
</script>
