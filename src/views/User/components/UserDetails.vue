<template>
  <content-layout text="User Details">
    <t-input text="Name" v-model="userInfo.full_name"></t-input>
    <t-input text="Email" v-model="userInfo.email"></t-input>
    <t-select text="Status" v-model="userInfo.status" :items="items"></t-select>
    <t-button text="Submit" @submit="submitEdit"></t-button>
  </content-layout>
</template>

<script>
export default {
  data() {
    return {
      name: null,
      email: null,
      items: ["Active", "Inactive"],
      userInfo: {}
    };
  },
  methods: {
    async submitEdit() {
      console.log(this.userInfo);
    }
  },
  mounted() {
    this.userInfo = this.$route.query.userDetail;
  }
};
</script>

<style scoped></style>
