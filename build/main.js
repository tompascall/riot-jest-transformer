"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pre_processors_1 = require("./pre-processors");
const { compile } = require('@riotjs/compiler');
const babelJest = require('babel-jest');
const { register } = require('./pre-processors');
exports.process = function (source, filename, config, options) {
    pre_processors_1.registerPreProcessors(config);
    let compiled = compile(source);
    return babelJest.process(compiled.code, filename, config, options);
};
//# sourceMappingURL=main.js.map