<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn accent slot="activator">
      Edit Date
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Date</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-date-picker v-model="editableDate" style="width: 100%" actions>
              <template scope="{save, cancel}">
                <v-btn
                  class="blue--text darken-1"
                  flat
                  @click.native="editDialog = false"
                >Close</v-btn>
                <v-btn
                  class="blue--text darken-1"
                  flat
                  @click.native="onSaveChanges"
                >Save</v-btn>
              </template>
            </v-date-picker>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
    export default {
      name: "EditMeetupDateDialog",
      props: ['meetup'],
      data() {
        return {
          editDialog: false,
          editableDate: null
        }
      },
      methods: {
        onSaveChanges () {
          const newDate = new Date(this.meetup.date);
          const newDay = new Date(this.editableDate).getUTCDate()
          const newMonth = new Date(this.editableDate).getUTCMonth()
          const newYear = new Date(this.editableDate).getUTCFullYear()
          newDate.setUTCDate(newDay)
          newDate.setUTCDate(newMonth)
          newDate.setUTCDate(newYear)
          this.$store.dispatch('updateMeetupData', {
            id: this.meetup.id,
            date: newDate
          })
        }
      },
      created () {
        const pickerDate = new Date(this.meetup.date)
        this.editableDate = pickerDate.getUTCFullYear() + '-' + (pickerDate.getUTCMonth() + 1) + '-' + pickerDate.getUTCDate()
      }
    }
</script>

<style scoped>

</style>
