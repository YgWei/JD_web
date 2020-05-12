<template>
  <div>
    <v-btn
      class="button"
      color="rgba(255,255,255,1)"
      @click="viewProject(project)"
    >
      <v-img src="../../../assets/personalise.png" width="80px"></v-img>
    </v-btn>
    <h3
      style="color:rgba(4,30,99,1); padding-top:10px;font-weight:normal;word-wrap:break-word;"
    >
      {{ project.projectName }}
    </h3>
  </div>
</template>

<script>
export default {
  props: ["project"],
  methods: {
    viewProject(project) {
      this.$router.push({
        path: `/projects/${project.id}`,
        query: {
          id: project.id
        }
      });
    }
  }
};
</script>

<style scoped>
.button {
  box-shadow: 0px 0px 10px rgba(155, 223, 251, 1);
  width: 120px;
  height: 120px !important;
  color: rgba(0, 32, 99, 1) !important;
  font-size: 24px;
  border-radius: 10px;
  font-weight: normal;
}
</style>
