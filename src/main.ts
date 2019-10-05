import { registerPreprocessor } from '@riotjs/compiler';
import { registerPreProcessors } from './pre-processors';
import { TransformerConfig } from './types';

const { compile } = require('@riotjs/compiler');
const babelJest = require('babel-jest');
const { register } = require('./pre-processors');

export const process = function(
  source: string,
  filename: string,
  config: TransformerConfig,
  options: jest.TransformOptions
): jest.Transformer {
  registerPreProcessors(config);
  let compiled = compile(source);
  return babelJest.process(compiled.code, filename, config, options);
}
