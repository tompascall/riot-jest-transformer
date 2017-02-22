const riot = require('riot');

exports.process = function (source) {
  riot.compile(source);
}
