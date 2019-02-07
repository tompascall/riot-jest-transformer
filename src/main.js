const riot = require('riot');
const { transform } = require('@babel/core');
const path = require('path');
const fs = require('fs');
const CONFIG_PATH = `${path.resolve('riot-jest-transformer.json')}`;
const RIOT_PROCESSOR = 'riot.tag2';

const transformer = {
  getCompiled (source) {
    return riot.compile(source);
  },

  insertRiot (compiled) {
    let completed;
    const [ header, tag ] = compiled.split(RIOT_PROCESSOR);
    if (header.search(/from\s*['|"]riot['|"]/) == -1 &&
      header.search(/require\s*\(['|"]riot['|"]\)/) == -1
    ) {
      completed = 'const riot = require("riot");\n' + compiled;
    }
    return completed;
  },

  getDefaultConfig ({ filename } = {}) {
    return {
      transformer: '@babel/core',
      method: 'transform',
      args: [{
        filename
      }]
    }
  },

  getConfig ({ filename = '' } = {}) {
    let config;
    if (fs.existsSync(CONFIG_PATH)) {
      try {
        config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      }
      catch (e) {
        throw Error("The content of the config file must be in JSON format");
      }

      if (Array.isArray(config.args) &&
        {}.toString.call(config.args[0]) == '[object Object]'
      ) {
        config.args[0].filename = filename;
      }
      return config;
    }
    else return this.getDefaultConfig({ filename });
  },

  validateConfig (config) {
    if ({}.toString.call(config) !== "[object Object]") {
      throw Error('riot-jest-transformer config must provide an object');
    }

    if (!config.hasOwnProperty('transformer') || !config.hasOwnProperty('method')) {
      throw Error('riot-jest-transformer config must define the name or path of the "transformer" module, the "method" of the transformer to be called, and optionally "args" ie. arguments of the method');
    }

    if (typeof config.transformer !== 'string' || typeof config.method !== 'string') {
      throw Error('"transformer" and "method" in riot-jest-transformer config must be string');
    }

    if (config.hasOwnProperty('args') && !Array.isArray(config.args)) {
      throw Error('If you define "args" in riot-jest-transformer config, it must be an array of arguments');
    }

      if (config.transformer === '@babel/core' && {}.toString.call(config.args[0]) !== '[object Object]') {
        throw Error("If you want to use @babel/core for transformation, you have to provide an object as first element of your args array");
      }
  },

  getTransformed ({ compiled, transformer, method, args = [] } = {}) {
    if (transformer && method) {
      let transformerByParam;
      try {
        transformerByParam = require(transformer);
      }
      catch (e) {
        throw Error(`The ${transformer} transformer module in your riot-jest-transformer config cannot be required (it might not have been installed or it has a wrong path in config)`);
      }
      const methodFunction = transformerByParam[method];
      if (typeof methodFunction !== 'function') {
        throw Error('You should provide a function of transformer as "method" in your riot-jest-transformer config');
      }
      return methodFunction(compiled, ...args);
    }
    return transform(compiled, ...args);
  }
}

exports.process = function (source, filename) {
  let compiled = transformer.getCompiled(source);
  let completedWithRiot = transformer.insertRiot(compiled);
  const config = transformer.getConfig({ filename });
  let composedConfig = Object.assign({}, { compiled: completedWithRiot }, config);
  let transformed = transformer.getTransformed(composedConfig);
  return transformed.code;
}

exports.transformer = transformer;
