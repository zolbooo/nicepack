module.exports = config => {
  config.module.rules[0].use[0].options.presets.push("@babel/preset-react");
};
