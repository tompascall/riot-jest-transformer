import {
  getRegistrationOptions,
  getCacheOption,
  registerPreProcessors,
  tryRegistrations,
} from '../pre-processors';
import mockScssPreprocessor from 'mock-scss-preprocessor';

import { registerPreprocessor } from '@riotjs/compiler';

describe('Pre-processors', () => {
  describe('getRegistrationOptions', () => {
    it('should be a function', () => {
      expect(typeof getRegistrationOptions).toBe('function');
    });
  
    it('should return null if no options object \
      in riot-jest-transformer config', () => {
        const config = {
          transform: [
            ['filePattern1', 'modulePath'],
            [
              'riot-jest-transformer-pattern',
              'some/riot-jest-transformer/path',
            ]
          ]
        };
        expect(getRegistrationOptions(config)).toBe(null);
    });

    it('should return null if there is no registrations \
      in options object', () => {
        const config = {
          transform: [
            ['filePattern1', 'modulePath'],
            [
              'riot-jest-transformer-pattern',
              'some/riot-jest-transformer/path',
              { foo: 'bar' }
            ],
          ]
        };
        expect(getRegistrationOptions(config)).toBe(null);
    });

    it('should return registrationOptions', () => {
      const regOpts = [{}, {}];  
      const config = {
          transform: [
            ['filePattern1', 'modulePath'],
            [
              'riot-jest-transformer-pattern',
              'some/riot-jest-transformer/path',
              { registrations: regOpts }
            ],
          ]
        };
        expect(getRegistrationOptions(config)).toBe(regOpts);
    });
  });

  describe('getCacheOption', () => {
    it('should return true if clearCache is not defined', () => {
      const config = {
          transform: [
            [
              'riot-jest-transformer-pattern',
              'some/riot-jest-transformer/path',
              {}
            ],
          ]
        };
        expect(getCacheOption(config)).toBe(false);
    });

    it('should return true', () => {
      const config = {
          transform: [
            [
              'riot-jest-transformer-pattern',
              'some/riot-jest-transformer/path',
              { clearCache: true }
            ],
          ]
        };
        expect(getCacheOption(config)).toBe(true);
    });
  });

  describe('tryRegistrations', () => {
    const jestRootDir = '';

    describe('Options validation', () => {
      it('should throw error if registration options are \
        not wrapped in an array', () => {
        expect(() => tryRegistrations()).toThrow();
      });

      it('should throw error if registration options \
        are not objects', () => {
        expect(() => tryRegistrations([[{}]])).toThrow();
        expect(() => tryRegistrations([{}, 'something else'])).toThrow();
      });

      it('should throw error if registration options \
        do not have type: "template" | "css" | "javascript"', () => {
        expect(() => tryRegistrations([{}])).toThrow();
        expect(() => tryRegistrations([{ foo: 'bar' }])).toThrow();
        expect(() => tryRegistrations([{ type: 'foo' }])).toThrow();
      });

      it('should throw error if registration options \
        do not have name (string)', () => {
        expect(() =>
          tryRegistrations([{ type: 'template'}]))
            .toThrow();
        expect(() =>
          tryRegistrations([{ type: 'template', name: {} }]))
            .toThrow();
      });

      it('should throw error if registration options \
        do not have preprocessorModulePath as string', () => {
          expect(() =>
          tryRegistrations([{
            type: 'template',
            name: 'foo' }], jestRootDir))
            .toThrow();
        expect(() =>
          tryRegistrations([{
            type: 'template',
            name: 'foo',
            preprocessorModulePath: {}
          }], jestRootDir, true))
            .toThrow();
        expect(() =>
          tryRegistrations([{
            type: 'template',
            name: 'foo',
            preprocessorModulePath: 'mock-scss-preprocessor'
          }], jestRootDir, true))
            .not.toThrow();
      });
    });

    describe('Try registration', () => {
      const jestRootDir = '';

      beforeEach(() => {
        registerPreprocessor.mockReset();
      })
    
      it('should call registerPreprocessor for all registrations', () => {
        const options = {
          type: 'css',
          name: 'foo',
          preprocessorModulePath: 'mock-scss-preprocessor'
        };

        tryRegistrations([options], jestRootDir, true);
        expect(registerPreprocessor).toBeCalledTimes(1);
        expect(registerPreprocessor)
          .toHaveBeenCalledWith(
            options.type,
            options.name,
            mockScssPreprocessor
          );
      });
    });

    describe('registerPreProcessors', () => {
      beforeEach(() => {
        registerPreprocessor.mockReset();
      })
    
      it('should get options and call registerPreprocessor', () => {
        const options = [{
          type: 'template',
          name: 'foo',
          preprocessorModulePath: 'mock-scss-preprocessor'
        }];

        const config = {
          transform: [
            ['filePattern1', 'modulePath'],
            [
              'riot-tag-pattern',
              'riot-jest-transformer',
              { registrations: options, clearCache: true }
            ],
          ],
          rootDir: ''
        };

        registerPreProcessors(config);
        expect(registerPreprocessor).toBeCalledTimes(1);
        expect(registerPreprocessor)
          .toHaveBeenCalledWith(
            options[0].type,
            options[0].name,
            mockScssPreprocessor
          );
      });

      it('should call registerPreprocessor only once fro the same type', () => {
        const options = [{
          type: 'css',
          name: 'foo',
          preprocessorModulePath: 'mock-scss-preprocessor'
        }, {
          type: 'css',
          name: 'bar',
          preprocessorModulePath: 'mock-to-another-scss-preprocessor'
        }];

        const config = {
          transform: [
            ['filePattern1', 'modulePath'],
            [
              'riot-tag-pattern',
              'riot-jest-transformer',
              { registrations: options, clearCache: true }
            ],
          ],
          rootDir: ''
        };

        registerPreProcessors(config);
        expect(registerPreprocessor).toBeCalledTimes(1);
        expect(registerPreprocessor)
          .toHaveBeenCalledWith(
            options[0].type,
            options[0].name,
            mockScssPreprocessor
          );
      });
    });
  });
});