const { registerPreprocessor } = require('@riotjs/compiler');

const { compile } = require('@riotjs/compiler');
const babelJest = require('babel-jest');
const { registerPreProcessors } = require('./pre-processors');

exports.process = function (source, filename, config, options) {
  registerPreProcessors(config);
  let compiled = compile(source);
  return babelJest.process(compiled.code, filename, config, options);
}
