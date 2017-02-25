const riot = require('riot');
const { transform } = require('babel-core');
const path = require('path');
const fs = require('fs');
const CONFIG_PATH = `${path.resolve('.riot-jest-tranformer')}`;
const transformer = {
  getCompiled (source) {
    return riot.compile(source);
  },

  insertRiot (compiled) {
    let completed;
    const [ header, tag ] = compiled.split('riot.tag2');
    if (header.search(/from\s*['|"]riot['|"]/) == -1 &&
      header.search(/require\s*\(['|"]riot['|"]\)/)
    ) {
      completed = 'const riot = require("riot")' + compiled;
    }
    return completed;
  },

  getDefaultConfig ({ filename } = {}) {
    return {
      transformer: 'babel-core',
      method: 'transform',
      args: [{
        filename
      }]
    }
  },

  getConfig ({ filename = '' } = {}) {
    let config;
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
    }
    else return this.getDefaultConfig({ filename });
  },

  getTransformed ({ compiled, transformer, method, args = [] } = {}) {
    args.unshift(compiled);
    if (transformer && method) {
      const transformerByParam = require(transformer);
      return transformerByParam[method](...args);
    }
    return transform(...args);
  }
}

exports.process = function (source, filename) {
  let compiled = transformer.getCompiled(source);
  let appendedCompiled = transformer.insertRiot(compiled);
  const config = transformer.getConfig({ filename });
  let transformed = transformer.getTransformed({ compiled: appendedCompiled, ...config });
  return transformed.code;
}

exports.transformer = transformer;
