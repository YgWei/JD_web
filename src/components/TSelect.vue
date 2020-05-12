<template>
  <v-col>
    <p>{{ text }}</p>
    <v-select
      outlined
      hide-details
      :items="selectItems"
      dense
      item-text="name"
      :disabled="disabled"
      :value="selected"
      return-object
      :rules="rules"
      @change="$emit('change', $event)"
    >
      <template v-slot:prepend-item>
        <div>
          <v-text-field
            color="blue"
            dense
            hide-details
            placeholder="search"
            prepend-inner-icon="mdi-search"
            v-model="val"
          ></v-text-field>
        </div>
      </template>
    </v-select>
  </v-col>
</template>
<script>
export default {
  data() {
    return {
      rules: [value => !!value || "Required."],
      val: ""
    };
  },
  model: {
    prop: "selected",
    event: "change"
  },
  props: {
    disabled: Boolean,
    selected: {},
    items: {
      type: Array
    },
    text: {
      type: String
    }
  },
  computed: {
    selectItems() {
      if (this.val) {
        let searchItems = this.items.filter(item => {
          if (item instanceof Object) {
            return item.name.match(this.val);
          }

          return item.match(this.val);
        });
        return searchItems;
      }

      return this.items;
    }
  }
};
</script>
<style lang="scss" scoped>
.col {
  display: flex;
  flex-direction: row;
}
p {
  padding-top: 10px;
  width: 75px;
  font-size: 14px;
  margin-bottom: 10px;
  color: #8e8e93;
  font-weight: 500;
}
</style>
