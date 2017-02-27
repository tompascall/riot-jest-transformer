import { process, transformer } from '../main';
import * as riot from 'riot';
import { transform } from 'babel-core';
import path from 'path';
import fs from 'fs';

const hello = `
    <hello>
        <h1>{ opts.name }</h1>
    </hello>
`;

const configPath = `${path.resolve('riot-jest-transformer.json')}`;

describe('riot-jest-transformer', function() {

  describe('getCompiled', () => {
    it('gives back the compiled tag', function() {
        expect(transformer.getCompiled(hello).search(/riot.tag2\(['|"]hello['|"]/)).not.toEqual(-1);
    });
  });

  describe('insertRiot', () => {
    it('should insert riot dependency into compiled tag', () => {
      const hello2 = `
          import { someMethod } from 'someModule';
          <hello>
              <h1>{ opts.name }</h1>
          </hello>
      `;

      let compiled = transformer.getCompiled(hello2);
      let completed = transformer.insertRiot(compiled);
      expect(completed.indexOf('const riot = require("riot")')).not.toEqual(-1);
    });
  });

  describe('getDefaultConfig', () => {
    it('should use babel transformer optioned with filename', () => {
      const config = transformer.getDefaultConfig({ filename: 'fakeFile'});
      expect(config.transformer).toEqual('babel-core');
      expect(config.method).toEqual('transform');
      expect(config.args).toEqual([{ filename: 'fakeFile' }]);
    });
  });

  describe('getConfig', () => {
    it('should use babel-core as default transformer if no config file', () => {
      const callGetConfig = function () {
        transformer.getConfig()
      };

      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
      }
      expect(callGetConfig).not.toThrow();
      const config = transformer.getConfig({ filename: 'fakeFile' });
      expect(config).toEqual(transformer.getDefaultConfig({ filename: 'fakeFile' }));
    });

    it('should use riot-jest-transformer.json file as config if it exists', () => {
      let config = {
        transformer: "babel-core",
        method: 'transform',
        args: [{}, 'fakeArg']
      };

      fs.writeFileSync(configPath, JSON.stringify(config), {encoding: 'utf8'});
      config.args[0].filename = 'fakeFile';
      expect(transformer.getConfig({ filename: 'fakeFile'})).toEqual(config);
      fs.unlinkSync(configPath);
    });

    it('should throw informative error message if conf file is not in json format', () => {
      let config = `{
        transformer: "babel-core",
        method: 'transform',
        args: [{}]
      }`;

      fs.writeFileSync(configPath, config, {encoding: 'utf8'});
      let callGetConfig = () => {
        transformer.getConfig({ filename: 'fakeFile' });
      }

      expect(callGetConfig).toThrow('The content of the config file must be in JSON format');
      fs.unlinkSync(configPath);
    });
  });

  describe('validateConfig', function() {
    const callValidateConfig = () => {
      transformer.validateConfig(config);
    };
    let config;
    
    it('should check type of config object', () => {
      config = [];   
      expect(callValidateConfig).toThrow('riot-jest-transformer config must provide an object');
    });

    it('should check existence of compulsory config options', () => {
      config = {}; 
      expect(callValidateConfig).toThrow('riot-jest-transformer config must define the name or path of the "transformer" module, the "method" of the transformer to be called, and optionally "args" ie. arguments of the method');
    });

    it('should check type of transformer and method', () => {
      config = {
        transformer: {},
        method: []
      };

      expect(callValidateConfig).toThrow('"transformer" and "method" in riot-jest-transformer config must be string');
    });

    it('should check type of args', () => {
      config = {
        transformer: 'fakeModule',
        method: 'fakeMethod',
        args: 'arg1, arg2'
      };

      expect(callValidateConfig).toThrow('If you define "args" in riot-jest-transformer config, it must be an array of arguments');
    });

      // {
      //   transformer: "babel-core",
      //   method: 'transform',
      //   args: ["trallala"]
      // };

    it('should throw informative error message if transformer is babel-core and args[0] in conf is not an object', () => {
      let config = {
        transformer: "babel-core",
        method: 'transform',
        args: ["trallala"]
      };

      let callValidateConfig = () => {
        transformer.validateConfig(config);
      }

      expect(callValidateConfig).toThrow('If you want to use babel-core for transformation, you have to provide an object as first element of your args array');
    });
  });

  describe('getTransformed', () => {

    it('uses babel-core transform if config does not exist', () => {
      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
      }

      let compiled = transformer.getCompiled(hello);
      let result = transformer.getTransformed({ compiled, args: [{filename: 'fakeFile'}] });
      expect(result).toEqual(transform(compiled, {filename: 'fakeFile'}));
    });

    it('should use the provided transformer, method and args if given', () => {
      let compiled = transformer.getCompiled(hello);
      let fakeNodeModule = `
      exports.fakeFormer = function (compiled, options) {
          return 'fake_' + options.lalala + '____' + compiled;
      };
      `
      fs.writeFileSync(path.resolve('node_modules/fakeNodeModule.js'), fakeNodeModule, {encoding: 'utf8'});
      const result = transformer.getTransformed({
        compiled,
        transformer: 'fakeNodeModule',
        method: 'fakeFormer',
        args: [{ lalala: 'lalala' }]
      });
      expect(result.split('____')[0]).toEqual('fake_lalala');
      expect(result.split('____')[1]).toEqual(compiled);
      fs.unlinkSync(path.resolve('node_modules/fakeNodeModule.js'));
    });
  });

  describe('process', () => {
    let compiled,
      completedWithRiot,
      config,
      transformed;

    it('should be a function', function() {
        expect(typeof process).toBe('function');
    });

    it('should call getCompiled with tag source', () => {
      spyOn(transformer, 'getCompiled').and.callThrough();
      process(hello, 'fakeFile');
      expect(transformer.getCompiled).toHaveBeenCalledWith(hello);
    });

    it('should call insertRiot with compiled tag', () => {
      compiled = transformer.getCompiled(hello);
      spyOn(transformer, 'insertRiot').and.callThrough();
      process(hello, 'fakeFile');
      expect(transformer.insertRiot).toHaveBeenCalledWith(compiled);
    });

    it('should call getConfig with the second argument (provided by jest as filename)', () => {
      spyOn(transformer, 'getConfig');
      process(hello, 'fakeFile');
      expect(transformer.getConfig).toHaveBeenCalledWith({ filename: 'fakeFile'});
    });

    it('should call getTreansformed with compiled tag and config', () => {
      completedWithRiot = transformer.insertRiot(compiled);
      config = transformer.getConfig({ filename: 'fakeFile' });

      spyOn(transformer, 'getTransformed').and.callThrough();
      process(hello, 'fakeFile');
      expect(transformer.getTransformed).toHaveBeenCalledWith(Object.assign({}, { compiled: completedWithRiot }, config));
    });

    it('returns code attribute of transformed tag', () => {
      transformed = transformer.getTransformed(Object.assign({}, { compiled: completedWithRiot }, config));
      expect(process(hello, 'fakeFile')).toEqual(transformed.code);
    });
  });
});

