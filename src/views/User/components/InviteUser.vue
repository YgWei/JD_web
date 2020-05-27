<template>
  <content-layout text="Invite Members">
    <t-input text="Email" v-model="email"></t-input>
    <t-button text="Submit" @submit="sendInvitation"></t-button>
    <v-snackbar v-model="snackbar" top :color="snackbarColor" text>
      {{ snackbarText }}
      <v-btn @click="snackbar = false" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </content-layout>
</template>

<script>
import { mail } from "@/api";
export default {
  data() {
    return {
      email: null,
      snackbarColor: "success",
      snackbarText: "Invite Sent!",
      snackbar: false
    };
  },
  methods: {
    async sendInvitation() {
      try {
        const sentResult = await mail.sendInvite({ email: this.email });
        console.log(sentResult);
        this.snackbarColor = "success";
        this.snackbarText = "Invite Sent!";
        this.snackbar = true;
        this.email = null;
      } catch {
        this.snackbarColor = "error";
        this.snackbarText = "Invite Failed!";
        this.snackbar = true;
      }
    }
  },
  mounted() {}
};
</script>

<style scoped></style>
