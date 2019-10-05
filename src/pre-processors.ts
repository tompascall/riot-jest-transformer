import get from 'lodash/get';
import path from 'path';
import { registerPreprocessor } from '@riotjs/compiler';
import {
  TransformConfig,
  TransformerConfig,
  RiotPreprocessorType,
  RegistrationOptions
} from './types';

const TRANSFORMER_PATH = 1;
const TRANSFORMER_OPTIONS = 2;
const RIOT_PREPROCESSOR_TYPES: [
  'template',
  'css',
  'javascript'
] = ['template', 'css', 'javascript'];

export const getRegistrationOptions = (config: TransformerConfig) => {
  const { transform } = config;
  if (Array.isArray(transform)) {
    const rjtConfig = getRjtConfig(transform); 
    const registrations = get(rjtConfig && rjtConfig[TRANSFORMER_OPTIONS], 'registrations', null);
    return registrations;
  }
  return null;
};

const getRjtConfig = (transform: TransformConfig) =>
  transform.find(entry =>
    entry[TRANSFORMER_PATH].includes('riot-jest-transformer')); 

export const getCacheOption = (config: TransformerConfig) => {
  const { transform } = config;
  if (Array.isArray(transform)) {
    const rjtConfig = getRjtConfig(transform);
    return get(rjtConfig && rjtConfig[TRANSFORMER_OPTIONS], 'clearCache', false);
  }
  return false;
}

export const validateOptions = (registrationOptions: RegistrationOptions) => {
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

export const tryRegistrations = (() => {
  let registeredTypes: RiotPreprocessorType[] = [];
  return (registrationOptions: RegistrationOptions, jestRootDir: string, clearCache: boolean) => {
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

export const registerPreProcessors = (config: TransformerConfig) => {
  const registrationOptions = getRegistrationOptions(config);
  const clearCache = getCacheOption(config);
  if (registrationOptions) {
    tryRegistrations(registrationOptions, config.rootDir, clearCache);
  }
};
