<template>
  <content-layout text="Invite Members">
    <t-input text="Email" v-model="email"></t-input>
    <t-button text="Submit" @submit="sendInvitation"></t-button>
  </content-layout>
</template>

<script>
import { mail } from "@/api";
export default {
  data() {
    return {
      email: null
    };
  },
  methods: {
    async sendInvitation() {
      try {
        const sentResult = await mail.sendInvite({ email: this.email });
        console.log(sentResult);
      } catch {
        /* empty */
      }
    }
  },
  mounted() {}
};
</script>

<style scoped></style>
