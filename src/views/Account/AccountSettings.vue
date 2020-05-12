<template>
  <content-layout text="Settings">
    <t-input text="Field - 1" v-model="name"></t-input>
    <t-input text="Field - 2" v-model="email"></t-input>
    <t-input text="Field - 3" v-model="email"></t-input>
    <t-select text="Field - 4" v-model="name" :items="items"></t-select>
    <t-button text="Submit"></t-button>
  </content-layout>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      name: null,
      email: null,
      items: ["a", "b", "c"]
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  mounted() {}
};
</script>

<style scoped></style>
