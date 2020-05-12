<template>
  <v-container id="container">
    <div>
      <v-btn class="mx-2 icon" color="black" icon fab @click="goBack()">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </div>
    <h2>{{ text }}</h2>

    <v-container fluid>
      <div id="card">
        <slot></slot>
      </div>
    </v-container>
  </v-container>
</template>

<script>
export default {
  props: {
    text: {
      type: String
    }
  },
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
#container {
  max-width: 720px;
  margin: 0 auto;
}
h2 {
  margin-top: 10%;
  padding-top: 20px;
  padding-bottom: 20px;
  color: black;
  font-weight: normal;
  text-align: center;
}
.icon {
  position: relative;
  left: 90%;
  top: 50px;
}
#card {
  min-height: 150px;
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 0;
  border: 1px solid rgba(84, 194, 240, 1);
  justify-content: left;
  font-size: 22px;
  border-radius: 3px;
  font-weight: normal;
}
</style>
