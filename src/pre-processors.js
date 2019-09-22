const get = require('lodash/get');
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
    (typeof options.registrationCb === 'function'))
  ) {
    throw new Error('registrationCb option should be a function. \
    Check preprocessor docs for callback format: \
    https://riot.js.org/compiler/#pre-processors');
  }

};

const tryRegistrations = (registrationOptions) => {
  validateOptions(registrationOptions);
  registrationOptions.forEach((option) => {
    const { type, name, registrationCb } = option; 
    registerPreprocessor(type, name, registrationCb);
  });
};

const registerPreProcessors = (config) => {
  const registrationOptions = getRegistrationOptions(config);
  if (registrationOptions) {
    tryRegistrations(registrationOptions);
  }
};

exports.getRegistrationOptions = getRegistrationOptions;
exports.tryRegistrations = tryRegistrations;
exports.registerPreProcessors = registerPreProcessors;