<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-col>
        <p>Engines:</p>
        <v-select
          outlined
          dense
          hide-details
          :items="engines"
          item-text="name"
          :rules="rules"
          v-model="selectedEngine"
          placeholder="Select Engine"
        ></v-select>
      </v-col>
      <v-col>
        <p>HTML File:</p>
        <v-file-input
          outlined
          dense
          hide-details
          prepend-icon
          accept=".zip"
          :rules="rules"
          v-model="file"
          placeholder="Upload Files"
        ></v-file-input>
      </v-col>
    </v-form>
    <v-col class="col-btn">
      <v-btn
        color="#2196F3"
        style="width:150px;"
        rounded
        dark
        @click="confirm()"
        >Submit</v-btn
      >
    </v-col>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import { render } from "@/api";
export default {
  data() {
    return {
      engines: [],
      selectedEngine: null,
      file: null,
      overlay: false,
      rules: [v => !!v || "Required"],
      valid: true
    };
  },
  methods: {
    async confirm() {
      if (this.$refs.form.validate()) {
        this.overlay = true;
        let formData = new FormData();
        formData.append("engine", this.selectedEngine);
        formData.append("file", this.file);
        try {
          const result = await render.renderData(formData);
          this.overlay = false;

          var file = new Blob([result.data], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        } catch {
          this.overlay = false;
        }
      }
    }
  },
  async mounted() {
    try {
      const allEngines = await render.getEngines();
      this.engines = allEngines.data.data;
    } catch {
      /* empty */
    }
  }
};
</script>

<style>
.container {
  margin-top: 100px;
  width: 800px !important;
}
.col {
  display: flex;
  flex-direction: row;
  padding: 5px 100px 5px 50px;
}
p {
  padding-top: 10px;
  width: 15%;
  font-size: 14px;
  margin-right: 25px;
  margin-bottom: 10px;
  font-weight: 500;
}
.col-btn {
  justify-content: flex-end;
}
</style>
