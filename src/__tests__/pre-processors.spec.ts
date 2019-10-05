import {
  getRegistrationOptions,
  getCacheOption,
  registerPreProcessors,
  tryRegistrations,
} from '../pre-processors';
import mockScssPreprocessor from '../__mocks__/mock-scss-preprocessor';
import { registerPreprocessor } from '@riotjs/compiler';
import { TransformerConfig, RegistrationOptions, RiotPreprocessorType } from '../types';

describe('Pre-processors', () => {
  describe('getRegistrationOptions', () => {
    it('should be a function', () => {
      expect(typeof getRegistrationOptions).toBe('function');
    });
  
    it('should return null if no options object \
      in riot-jest-transformer config', () => {
        const config: TransformerConfig = {
          transform: [
            ['filePattern1', 'modulePath'],
            ['riot-tag-pattern', 'some/riot-jest-transformer/path']
          ],
          rootDir: ''
        };
        expect(getRegistrationOptions(config)).toBe(null);
    });

    it('should return null if there is no registrations \
      in options object', () => {
        const config: TransformerConfig = {
          transform: [
            ['filePattern1', 'modulePath'],
            ['riot-tag-pattern', 'some/riot-jest-transformer/path',
              // @ts-ignore: testing inappropriate options
              { foo: 'bar' }
            ],
          ],
          rootDir: ''
        };
        expect(getRegistrationOptions(config)).toBe(null);
    })

    it('should return registrationOptions', () => {
      const regOpts: RegistrationOptions = [{
        type: 'css',
        name: 'anything',
        preprocessorModulePath: ''
       }];  
      const config: TransformerConfig = {
          transform: [
           ['filePattern1', 'modulePath'],
           ['riot-tag-pattern', 'some/riot-jest-transformer/path',
            { registrations: regOpts }
           ]
          ],
          rootDir: ''
        };
        expect(getRegistrationOptions(config)).toBe(regOpts);
    });
  });

  describe('getCacheOption', () => {
    it('should return true if clearCache is not defined', () => {
      const config: TransformerConfig = {
          transform: [
            ['filePattern1', 'modulePath'],
            ['riot-tag-pattern', 'some/riot-jest-transformer/path',
              { registrations: [{
                  type: 'css',
                  name: 'scss',
                  preprocessorModulePath: "riot-scss-preprocessor"
                }]
              }
            ]
          ],
          rootDir: ''
        };
        expect(getCacheOption(config)).toBe(false);
    });

    it('should return true', () => {
      const config: TransformerConfig = {
          transform: [
            ['filePattern1', 'modulePath'],
            ['riot-tag-pattern', 'some/riot-jest-transformer/path',
              { registrations: [{
                  type: 'css',
                  name: 'scss',
                  preprocessorModulePath: "riot-scss-preprocessor"
                }],
                clearCache: true
              }
            ]
          ],
          rootDir: ''
        };
        expect(getCacheOption(config)).toBe(true);
    });
  });

  describe('tryRegistrations', () => {
    const jestRootDir = '';

    describe('Options validation', () => {
      it('should throw error if registration options are \
        not wrapped in an array', () => {
        // @ts-ignore: testing wrong arguments
        expect(() => tryRegistrations()).toThrow();
      });

      it('should throw error if registration options \
        are not objects', () => {
        // @ts-ignore: testing wrong arguments
        expect(() => tryRegistrations([[{}]])).toThrow();
        // @ts-ignore: testing wrong arguments
        expect(() => tryRegistrations([{}, 'something else'])).toThrow();
      });

      it('should throw error if registration options \
        do not have type: "template" | "css" | "javascript"', () => {
        // @ts-ignore: testing wrong arguments
        expect(() => tryRegistrations([{}])).toThrow();
        // @ts-ignore: testing wrong arguments
        expect(() => tryRegistrations([{ foo: 'bar' }])).toThrow();
        // @ts-ignore: testing wrong arguments
        expect(() => tryRegistrations([{ type: 'foo' }])).toThrow();
      });

      it('should throw error if registration options \
        do not have name (string)', () => {
        expect(() =>
          // @ts-ignore: testing wrong arguments
          tryRegistrations([{ type: 'template'}]))
            .toThrow();
        expect(() =>
          // @ts-ignore: testing wrong arguments
          tryRegistrations([{ type: 'template', name: {} }]))
            .toThrow();
      });

      it('should throw error if registration options \
        do not have preprocessorModulePath as string', () => {
          expect(() =>
          // @ts-ignore: testing wrong arguments
          tryRegistrations([{
            type: 'template',
            name: 'foo' }], jestRootDir))
            .toThrow();
        expect(() =>
          // @ts-ignore: testing wrong arguments
          tryRegistrations([{
            type: 'template' as RiotPreprocessorType,
            name: 'foo',
          // @ts-ignore: testing wrong arguments
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
        const options: RegistrationOptions = [{
          type: 'css',
          name: 'foo',
          preprocessorModulePath: 'mock-scss-preprocessor'
        }] as RegistrationOptions;

        tryRegistrations(options, jestRootDir, true);
        expect(registerPreprocessor).toBeCalledTimes(1);
        expect(registerPreprocessor)
          .toHaveBeenCalledWith(
            options[0].type,
            options[0].name,
            { default: mockScssPreprocessor }
          );
      });
    });

    describe('registerPreProcessors', () => {
      beforeEach(() => {
        registerPreprocessor.mockReset();
      })
    
      it('should get options and call registerPreprocessor', () => {
        const options: RegistrationOptions = [{
          type: 'template',
          name: 'foo',
          preprocessorModulePath: 'mock-scss-preprocessor'
        }];

        const config: TransformerConfig = {
          transform: [
            ['filePattern1', 'modulePath'],
            [
              'riot-tag-pattern',
              'riot-jest-transformer',
              { registrations: options, clearCache: true }
            ]
          ],
          rootDir: ''
        };

        registerPreProcessors(config);
        expect(registerPreprocessor).toBeCalledTimes(1);
        expect(registerPreprocessor)
          .toHaveBeenCalledWith(
            options[0].type,
            options[0].name,
            { default: mockScssPreprocessor }
          );
      });

      it('should call registerPreprocessor only once for the same type', () => {
        const options = [{
          type: 'css',
          name: 'foo',
          preprocessorModulePath: 'mock-scss-preprocessor'
        }, {
          type: 'css',
          name: 'bar',
          preprocessorModulePath: 'mock-to-another-scss-preprocessor'
        }];

        const config: TransformerConfig = {
          transform: [
            ['filePattern1', 'modulePath'],
            [
              'riot-tag-pattern',
              'riot-jest-transformer',
              { registrations: options as RegistrationOptions, clearCache: true }
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
            { default: mockScssPreprocessor }
          );
      });
    });
  });
});