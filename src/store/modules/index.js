import camelCase from "loadsh/camelCase";

const requireModule = require.context(".", false, /\.js$/);
const modules = {};

requireModule.keys().forEach(fileName => {
  if (fileName === "./index.js") return;

  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ""));

  modules[moduleName] = {
    namespace: true,
    ...requireModule(fileName)
  };
});

export default modules;
