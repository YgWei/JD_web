import Vue from "vue";
import camelCase from "loadsh/camelCase";

const requireComponent = require.context(".", false, /\.vue$/);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);

  const componentName = camelCase(fileName.replace(/(\.\/|\.vue)/g, ""));

  Vue.component(componentName, componentConfig.default || componentConfig);
});
