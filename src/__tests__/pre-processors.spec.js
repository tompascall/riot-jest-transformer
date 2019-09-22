import {
  getRegistrationOptions,
  registerPreProcessors,
  tryRegistrations,
} from '../pre-processors';

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

  describe('tryRegistrations', () => {
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
        do not have registrationCb as function', () => {
        expect(() =>
          tryRegistrations([{
            type: 'template',
            name: 'foo' }]))
            .toThrow();
        expect(() =>
          tryRegistrations([{
            type: 'template',
            name: 'foo',
            registrationCb: {}
          }]))
            .toThrow();
      });
      
    });

    describe('Try registration', () => {
      beforeEach(() => {
        registerPreprocessor.mockReset();
      })
    
      it('should call registerPreprocessor for all registrations', () => {
        const options = {
          type: 'template',
          name: 'foo',
          registrationCb: () => {}
        };

        tryRegistrations([options]);
        expect(registerPreprocessor).toBeCalledTimes(1);
        expect(registerPreprocessor)
          .toHaveBeenCalledWith(
            options.type,
            options.name, 
            options.registrationCb
          );
      });
    });

    describe('registerPreProcessors', () => {
      beforeEach(() => {
        registerPreprocessor.mockReset();
      })
    
      it('should get options and call registerPreprocessor', () => {
        const options = {
          type: 'template',
          name: 'foo',
          registrationCb: () => {}
        };

        const config = {
          transform: [
            ['filePattern1', 'modulePath'],
            [
              'riot-jest-transformer-pattern',
              'some/riot-jest-transformer/path',
              { registrations: [options] }
            ],
          ]
        };

        registerPreProcessors(config);
        expect(registerPreprocessor).toBeCalledTimes(1);
        expect(registerPreprocessor)
          .toHaveBeenCalledWith(
            options.type,
            options.name, 
            options.registrationCb
          );
      });
    });
  });
});