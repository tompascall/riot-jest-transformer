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

const configPath = `${path.resolve('.riot-jest-tranformer')}`;

describe('riot-jest-transformer', function() {

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
        expect(callGetConfig).not.toThrow();
        const config = transformer.getConfig({ filename: 'fakeFile' });
        expect(config).toEqual(transformer.getDefaultConfig({ filename: 'fakeFile' }));
      }
    });

    it('should use .riot-jest-transformer file as config if it exists', () => {
      let config = {
        transformer: "babel-core",
        method: 'transform',
        args: [{filename: 'fakeFile'}, 'fakeArg']
      };

      fs.writeFileSync(configPath, JSON.stringify(config), {encoding: 'utf8'});
      expect(transformer.getConfig({ filename: 'fakeFile'})).toEqual(config);
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
    it('should be a function', function() {
        expect(typeof process).toBe('function');
    });

    it('gives back the compiled tag', function() {
        expect(process(hello).search(/riot.tag2\(['|"]hello['|"]/)).not.toEqual(-1);
    });

    it('should call getConfig with the second argument (provided by jest as filename)', () => {
      spyOn(transformer, 'getConfig');
      process(hello, 'fakeFile');
      expect(transformer.getConfig).toHaveBeenCalledWith({ filename: 'fakeFile'});
    });
  });

});

