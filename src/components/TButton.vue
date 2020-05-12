<template>
  <v-col class="col-btn">
    <v-btn
      color="#2196F3"
      style="width:150px;"
      rounded
      dark
      @click="$emit('submit')"
      >{{ text }}</v-btn
    >
  </v-col>
</template>

<script>
export default {
  props: {
    text: {
      type: String
    }
  }
};
</script>

<style>
.col {
  display: flex;
  flex-direction: row;
  padding: 20px 100px 5px 50px;
}
.col-btn {
  justify-content: flex-end;
}
</style>
