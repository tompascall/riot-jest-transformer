import { process } from '../main';
import { compile } from '@riotjs/compiler';
import babelJest from 'babel-jest';

const hello = `
    <hello>
        <h1>{ props.name }</h1>
    </hello>
`;

describe('riot-jest-transformer', function() {
  describe('process', () => {
    const filename = 'fakeFile';
    const config = {};
    const options = {};
    const result = {};

    beforeEach(() => {
      babelJest.process.mockImplementation(() => result);
    });

    it('should be a function', function() {
        expect(typeof process).toBe('function');
    });

    it('returns code attribute of transformed tag', () => {
      const res = process(hello, filename, config, options);
      expect(res).toBe(result);
      expect(babelJest.process.mock.calls[0][0].name).toEqual(compile(hello).code.name);
      expect(babelJest.process.mock.calls[0][1]).toBe('fakeFile');
      expect(babelJest.process.mock.calls[0][2]).toBe(config);
      expect(babelJest.process.mock.calls[0][3]).toBe(options);
    });
  });
});
