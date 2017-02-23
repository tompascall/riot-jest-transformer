import { process } from '../main';
import * as riot from 'riot';

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
        console.log(process(hello).search(/riot.tag2\(['|"]hello['|"]/));
        expect(process(hello).search(/riot.tag2\(['|"]hello['|"]/)).not.toEqual(-1);
    });
});

