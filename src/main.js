const { compile } = require('@riotjs/compiler');
const babelJest = require('babel-jest');

exports.process = function (source, filename, config, options) {
  let compiled = compile(source);
  return babelJest.process(compiled.code, filename, config, options);
}
