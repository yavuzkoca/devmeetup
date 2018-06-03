<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <h1 class="secondary--text">Create a new Meetup</h1>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <form @submit.prevent="onCreateMeetup">
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                    name="title"
                                    label="Title"
                                    id="title"
                                    v-model="title"
                                    required
                                    autofocus
                            >

                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                    name="location"
                                    label="Location"
                                    id="location"
                                    v-model="location"
                                    required
                            >

                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                    name="imageURL"
                                    label="Image URL"
                                    id="image-url"
                                    v-model="imageURL"
                                    required
                            >

                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <img :src="imageURL" height="150"/>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                    name="description"
                                    label="Description"
                                    id="description"
                                    multi-line
                                    v-model="description"
                                    required
                            >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                           <v-btn
                                   class="primary"
                                   :disabled="!formIsValid"
                                   type="submit"
                           >create meetup</v-btn>
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        components: {

        },
        data() {
            return {
                title: '',
                location: '',
                imageURL: '',
                description: ''
            }
        },
        computed: {
            formIsValid(){
                return this.title !== '' && this.location !== '' && this.imageURL !== '' && this.description !== '';
            }
        },
        methods: {
            onCreateMeetup(){
                if(!this.formIsValid()){
                    return;
                }
                const meetupData = {
                    title: this.title,
                    location: this.location,
                    imageURL: this.imageURL,
                    description: this.description,
                    date: new Date()
                };
                this.$store.dispatch('createMeetup', meetupData);
                this.$router.push('/meetups')
            }
        }
    }
</script>

<style>

</style>