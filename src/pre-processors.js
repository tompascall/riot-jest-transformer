const get = require('lodash/get');
const path = require('path');
const { registerPreprocessor } = require('@riotjs/compiler');

const TRANSFORMER_PATH = 1;
const TRANSFORMER_OPTIONS = 2;
const RIOT_PREPROCESSOR_TYPES = ['template', 'css', 'javascript'];

const getRegistrationOptions = (config) => {
  const { transform } = config;
  if (Array.isArray(transform)) {
    const rjtConfig = transform.find(entry =>
      entry[TRANSFORMER_PATH].includes('riot-jest-transformer'));
    const registrations = get(rjtConfig[TRANSFORMER_OPTIONS],'registrations', null);
    return registrations;
  }
  return null;
};

const getCacheOption = (config) => {
  const { transform } = config;
  if (Array.isArray(transform)) {
    const rjtConfig = transform.find(entry =>
      entry[TRANSFORMER_PATH].includes('riot-jest-transformer'));
    return get(rjtConfig[TRANSFORMER_OPTIONS], 'clearCache', false);
  }
  return false;
}

const validateOptions = (registrationOptions) => {
  if (!Array.isArray(registrationOptions)) {
    throw new Error('You should wrap registration options into an array');
  }

  if (!registrationOptions.every((options) =>
    (Object.prototype.toString.call(options) === '[object Object]'))
  ) {
    throw new Error('You should use options objects for using \
    registration options in the transformer');
  };

  if (!registrationOptions.every((options) =>
    (RIOT_PREPROCESSOR_TYPES.some((type) =>
      type === options.type)))
  ) {
    throw new Error(`type option should be one of ${RIOT_PREPROCESSOR_TYPES.join()}`)
  }

  if (!registrationOptions.every((options) =>
    (typeof options.name === 'string'))
  ) {
    throw new Error('name option should be string');
  }

  if (!registrationOptions.every((options) =>
    (typeof options.preprocessorModulePath === 'string'))
  ) {
    throw new Error('PreprocessorModulePath option should be \
a relative path to a module which exports a callback for riot preprocessor. \
Check preprocessor docs for callback format: \
https://riot.js.org/compiler/#pre-processors');
  }
};

const tryRegistrations = (() => {
  let registeredTypes = [];
  return (registrationOptions, jestRootDir, clearCache) => {
    validateOptions(registrationOptions);
    if (clearCache) { registeredTypes = [] }
    registrationOptions.forEach((option) => {
      const { type, name, preprocessorModulePath } = option;
      if (!registeredTypes.includes(type)) {
        registeredTypes.push(type);
        const preprocessorFn = require(path.join(jestRootDir, preprocessorModulePath));
        registerPreprocessor(type, name, preprocessorFn);
      }
    });
  };
})();

const registerPreProcessors = (config) => {
  const registrationOptions = getRegistrationOptions(config);
  const clearCache = getCacheOption(config);
  if (registrationOptions) {
    tryRegistrations(registrationOptions, config.rootDir, clearCache);
  }
};

exports.getRegistrationOptions = getRegistrationOptions;
exports.getCacheOption = getCacheOption;
exports.tryRegistrations = tryRegistrations;
exports.registerPreProcessors = registerPreProcessors;
