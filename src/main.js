const riot = require('riot');
const { transform } = require('babel-core');

const transformer = {
  getCompiled (source) {
    return riot.compile(source);
  },

  getTransformed (compiled) {
    return transform(compiled);
  }
}

exports.process = function (source) {
  let compiled = transformer.getCompiled(source);
  let transformed = transformer.getTransformed(compiled);
  console.log('transformed', transformed);
  return transformed.code;
}

exports.transformer = transformer;
