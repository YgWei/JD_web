<template>
  <v-col>
    <p>{{ text }}</p>
    <v-text-field
      outlined
      hide-details
      :disabled="disabled"
      dense
      @input="$emit('input', $event)"
      placeholder="Input"
      :value="inputed"
      :rules="otherRules || rules"
      :append-icon="icon"
      :error="error"
    ></v-text-field>
  </v-col>
</template>
<script>
export default {
  data() {
    return {
      rules: [value => !!value || "Required."]
    };
  },
  model: {
    prop: "inputed",
    event: "input"
  },
  props: {
    error: Boolean,
    disabled: Boolean,
    inputed: {},
    text: {
      type: String
    },
    placeholder: {
      type: String
    },
    otherRules: {
      type: Array
    },
    icon: {
      type: String
    }
  },
  methods: {
    textInput(e) {
      this.$emit("textInput", e);
    }
  }
};
</script>
<style lang="scss" scoped>
p {
  padding-top: 10px;
  width: 75px;
  font-size: 14px;
  margin-bottom: 10px;
  color: #8e8e93;
  font-weight: 500;
}

.col {
  display: flex;
  flex-direction: row;
}
</style>
