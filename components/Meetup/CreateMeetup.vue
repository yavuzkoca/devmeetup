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
                          <v-btn raised class="primary" @click="onPickFile">Upload Image</v-btn>
                          <input type="file" hidden ref="fileInput" accept="image/*" @change="onFilePicked">
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
                        <v-flex xs12 sm9 offset-sm3>
                            <h4>Choose a Date & Time</h4>
                        </v-flex>
                    </v-layout>
                    <v-layout row class="mb-2">
                        <v-flex xs12 sm6 offset-sm3>
                            <v-date-picker v-model="date"></v-date-picker>
                        </v-flex>
                    </v-layout>
                    <v-layout row class="mb-2">
                        <v-flex xs12 sm6 offset-sm3>
                            <v-time-picker v-model="time"></v-time-picker>
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
                description: '',
                date: new Date().toJSON().slice(0,10).replace(/-/g,'-'),
                time: "00:00",
                image: null
            }
        },
        computed: {
            formIsValid(){
                return this.title !== '' && this.location !== '' && this.imageURL !== '' && this.description !== '';
            },
            submittableDateTime(){
                const date = new Date(this.date);
                date.setUTCHours(this.time.match(/^(\d+)/)[1]);
                date.setMinutes(this.time.match(/:(\d+)/)[1]);

                return date;
            }
        },
        methods: {
            onCreateMeetup(){
                if(!this.formIsValid || !this.image){
                    return;
                }
                const meetupData = {
                    title: this.title,
                    location: this.location,
                    image: this.image,
                    description: this.description,
                    date: this.submittableDateTime
                };
                this.$store.dispatch('createMeetup', meetupData);
                this.$router.push('/meetups')
            },
            onPickFile(){
                this.$refs.fileInput.click();
            },
            onFilePicked(event){
                const files = event.target.files;
                let filename = files[0].name;
                if (filename.lastIndexOf('.') <= 0) {
                  return alert('Please add a valid file!')
                }

                const fileReader = new FileReader();
                fileReader.addEventListener('load', () => {
                  this.imageURL = fileReader.result;
                });
                fileReader.readAsDataURL(files[0]);
                this.image = files[0]
            }
        }
    }
</script>

<style>

</style>
