import Vue from "vue";
import camelCase from "loadsh/camelCase";

const requireLayout = require.context(".", false, /_[\w-]+\.vue$/);

requireLayout.keys().forEach(fileName => {
  const layoutConfig = requireLayout(fileName);

  const layoutName = camelCase(fileName.replace(/(\.\/|\.vue)/g, ""));

  Vue.component(layoutName, layoutConfig.default || layoutConfig);
});
