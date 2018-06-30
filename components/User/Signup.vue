<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <form @submit.prevent="onSignUp">
                                <!--EMAIL INPUT FIELD-->
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                                name="email"
                                                label="Mail"
                                                id="email"
                                                v-model="email"
                                                type="email"
                                                required
                                        >

                                        </v-text-field>
                                    </v-flex>
                                </v-layout>

                                <!--PASSWORD INPUT FIELD-->
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                                name="password"
                                                label="Password"
                                                id="password"
                                                v-model="password"
                                                type="password"
                                                required
                                        >

                                        </v-text-field>
                                    </v-flex>
                                </v-layout>

                                <!--CONFIRM PASSWORD INPUT FIELD-->
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                                name="confirmPassword"
                                                label="Confirm Password"
                                                id="confirmPassword"
                                                v-model="confirmPassword"
                                                type="password"
                                                required
                                                :rules="[comparePasswords]"
                                        >

                                        </v-text-field>
                                    </v-flex>
                                </v-layout>

                                <v-layout row>
                                    <v-flex xs12>
                                        <v-btn type="submit">
                                            Sign Up
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </form>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                email: '',
                password: '',
                confirmPassword: ''
            }
        },
        methods: {
            onSignUp(){
                // Vuex
                this.$store.dispatch('signUserUp', {email: this.email, password: this.password})
            }
        },
        computed: {
            comparePasswords() {
                return this.password !== this.confirmPassword ? 'Passwords do not match' : true;
            },
            user(){
                return this.$store.getters.user;
            }
        },
        watch: {
            user(value){
                if(value !== null && value !== undefined){
                    this.$router.push('/');
                }
            }
        }
    }
</script>

<style>

</style>