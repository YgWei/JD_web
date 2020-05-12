<template>
  <div>
    <v-layout wrap justify-left>
      <v-flex
        v-for="(project, index) in projects"
        :key="index"
        xs3
        xl3
        :class="Viewpoint"
      >
        <project :project="project"></project>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { project } from "@/api";
import Project from "./components/Project";
export default {
  components: {
    Project
  },
  data() {
    return {
      projects: []
    };
  },
  computed: {
    Viewpoint() {
      return {
        "pa-10": this.$vuetify.breakpoint.smAndUp,
        "pa-12": this.$vuetify.breakpoint.xlOnly
      };
    }
  },
  methods: {},
  async mounted() {
    try {
      const allProjects = await project.getProjects();
      console.log(allProjects);
      this.projects = allProjects.data.data;
    } catch {
      /* empty */
    }
  }
};
</script>

<style scoped>
.layout {
  padding-left: 200px;
  padding-right: 200px;
}
</style>
