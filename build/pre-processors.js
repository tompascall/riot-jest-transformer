"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_1 = __importDefault(require("lodash/get"));
const path_1 = __importDefault(require("path"));
const compiler_1 = require("@riotjs/compiler");
const TRANSFORMER_PATH = 1;
const TRANSFORMER_OPTIONS = 2;
const RIOT_PREPROCESSOR_TYPES = ['template', 'css', 'javascript'];
exports.getRegistrationOptions = (config) => {
    const { transform } = config;
    if (Array.isArray(transform)) {
        const rjtConfig = exports.getRjtConfig(transform);
        const registrations = get_1.default(rjtConfig && rjtConfig[TRANSFORMER_OPTIONS], 'registrations', null);
        return registrations;
    }
    return null;
};
exports.getRjtConfig = (transform) => transform.find(entry => entry[TRANSFORMER_PATH].includes('riot-jest-transformer'));
exports.getCacheOption = (config) => {
    const { transform } = config;
    if (Array.isArray(transform)) {
        const rjtConfig = exports.getRjtConfig(transform);
        return get_1.default(rjtConfig && rjtConfig[TRANSFORMER_OPTIONS], 'clearCache', false);
    }
    return false;
};
exports.validateOptions = (registrationOptions) => {
    if (!Array.isArray(registrationOptions)) {
        throw new Error('You should wrap registration options into an array');
    }
    if (!registrationOptions.every((options) => (Object.prototype.toString.call(options) === '[object Object]'))) {
        throw new Error('You should use options objects for using \
    registration options in the transformer');
    }
    ;
    if (!registrationOptions.every((options) => (RIOT_PREPROCESSOR_TYPES.some((type) => type === options.type)))) {
        throw new Error(`type option should be one of ${RIOT_PREPROCESSOR_TYPES.join()}`);
    }
    if (!registrationOptions.every((options) => (typeof options.name === 'string'))) {
        throw new Error('name option should be string');
    }
    if (!registrationOptions.every((options) => (typeof options.preprocessorModulePath === 'string'))) {
        throw new Error('PreprocessorModulePath option should be \
a relative path to a module which exports a callback for riot preprocessor. \
Check preprocessor docs for callback format: \
https://riot.js.org/compiler/#pre-processors');
    }
};
exports.tryRegistrations = (() => {
    let registeredTypes = [];
    return (registrationOptions, jestRootDir, clearCache) => {
        exports.validateOptions(registrationOptions);
        if (clearCache) {
            registeredTypes = [];
        }
        registrationOptions.forEach((option) => {
            const { type, name, preprocessorModulePath } = option;
            if (!registeredTypes.includes(type)) {
                registeredTypes.push(type);
                const preprocessorFn = require(path_1.default.join(jestRootDir, preprocessorModulePath));
                compiler_1.registerPreprocessor(type, name, preprocessorFn);
            }
        });
    };
})();
exports.registerPreProcessors = (config) => {
    const registrationOptions = exports.getRegistrationOptions(config);
    const clearCache = exports.getCacheOption(config);
    if (registrationOptions) {
        exports.tryRegistrations(registrationOptions, config.rootDir, clearCache);
    }
};
//# sourceMappingURL=pre-processors.js.map