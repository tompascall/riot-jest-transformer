import { process, transformer } from '../main';
import * as riot from 'riot';
import { transform } from 'babel-core';

const hello = `
    <hello>
        <h1>{ opts.name }</h1>
    </hello>
`;

describe('riot-jest-transformer', function() {

    it('should be a function', function() {
     expect(typeof process).toBe('function');
    });

    it('gives back the compiled tag', function() {
        expect(process(hello).search(/riot.tag2\(['|"]hello['|"]/)).not.toEqual(-1);
    });

  it('should call getTransformed of transformer', () => {
    spyOn(transformer, 'getTransformed').and.callThrough();
    process(hello);
    expect(transformer.getTransformed).toHaveBeenCalled();
  });

  it('should transform the compiled tag with babel-core', () => {
    const transformed = transform(riot.compile(hello));
    console.log('transformed', transformed)
    expect(transformed.code).toEqual(process(hello));
  });

  xit('provides its second parameter as filename for babel-core', () => {
  });

  xit('should provide riot module in order to be able to run when imported', () => {
  });
});

