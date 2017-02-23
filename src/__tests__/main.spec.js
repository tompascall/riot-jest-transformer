import { process } from '../main';
const riot = require('riot');

const hello = `
    <hello>
        <h1>{ opts.name }</h1>
    </hello>
`;

describe('riot-jest-transformer', function() {

    it('should be a function', function() {
     expect(typeof process).toBe('function');  
    }); 

    it('should call riot.compile with the first param (ie. with source)', function() {
        console.log(typeof riot, 'X'.repeat(100));
        spyOn(riot, 'compile');
        process(hello);
        expect(riot.compile).toHaveBeenCalledWith(hello);
    });
});

