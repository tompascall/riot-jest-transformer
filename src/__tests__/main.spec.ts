import { process } from '../main';
import { compile } from '@riotjs/compiler';
import babelJest from 'babel-jest';
import { TransformOptions } from '@babel/core';
import { TransformerConfig } from '../types';

const hello = `
    <hello>
        <h1>{ props.name }</h1>
    </hello>
`;

describe('riot-jest-transformer', function() {
  describe('process', () => {
    const filename = 'fakeFile';
    const config: TransformerConfig = {
      transform: [
        ['pattern', 'any transformer']
      ],
      rootDir: ''
    };
    const options = { instrument: false };
    const result = 'mockResult';
    let babelJestProcessMock: jest.Mock;

    beforeEach(() => {
      babelJestProcessMock = jest.spyOn(babelJest, 'process')
        .mockImplementation(() => result) as jest.Mock;
    });

    it('should be a function', function() {
        expect(typeof process).toBe('function');
    });

    it('returns code attribute of transformed tag', () => {
      const res = process(hello, filename, config, options);
      expect(res).toBe(result);
      expect(babelJestProcessMock.mock.calls[0][0].name).toEqual(compile(hello).code.name);
      expect(babelJestProcessMock.mock.calls[0][1]).toBe('fakeFile');
      expect(babelJestProcessMock.mock.calls[0][2]).toBe(config);
      expect(babelJestProcessMock.mock.calls[0][3]).toBe(options);
    });
  });
});
