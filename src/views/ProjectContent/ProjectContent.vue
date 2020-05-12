<template>
  <v-container px-5>
    <h2>Project 1</h2>
    <!-- <div id="card">asd</div> -->
    <TreeCanvas />
  </v-container>
</template>

<script>
import { project } from "@/api";
import TreeCanvas from "./components/TreeCanvas.vue";
export default {
  data() {
    return {
      projectInfo: null
    };
  },
  components: {
    TreeCanvas
  },
  async mounted() {
    try {
      const getProject = await project.getProjectContent(this.$route.params.id);
      this.projectInfo = getProject.data.data;
      console.log(this.projectInfo);
    } catch {
      /* empty */
    }
  }
};
</script>

<style scoped>
h2 {
  padding-top: 20px;
  padding-bottom: 10px;
  color: black;
  font-weight: normal;
  text-align: center;
}
#card {
  height: 100px;
  max-width: 720px;
  margin: 0 auto;
  padding: 25px;
  border: 1px solid rgba(84, 194, 240, 1);
  justify-content: left;
  font-size: 22px;
  border-radius: 10px;
  font-weight: normal;
  /* z-index: 0; */
}
</style>
