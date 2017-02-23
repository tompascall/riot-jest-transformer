const riot = require('riot');

exports.process = function (source) {
  return riot.compile(source);
}
