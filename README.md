![Build Status](https://travis-ci.org/tompascall/riot-jest-transformer.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/tompascall/riot-jest-transformer/badge.svg?branch=master)](https://coveralls.io/r/tompascall/riot-jest-transformer?branch=master)

## riot-jest-transformer

### A jest transformer for riot tags

#### This transformer helps you to use [Jest](https://facebook.github.io/jest/) testing tool for your [Riot](http://riotjs.com/) tags. 

With the help of this transformer you can import your tags into your Jest tests.

#### Prerequisites

- Nodejs >= 6.9
- Installed jest package (`npm i --save-dev jest`)
- Installed riot-jest-transformer npm package into your project: `npm i --save-dev riot-jest-transformer`

##### Setting up Jest config file

riot-jest-transformer must be used in your Jest config file like this:

```js
{
    "transform": {
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.tag$": "riot-jest-transformer"
    }
}
```

##### Usage

Just import your tag into the Jest test file. After that you can mount your tag to an html element. For example:

```js
import * as riot from 'riot';
import hello from '../hello.tag'; // <hello><h1>{ opts.name }</h1></hello>

describe('hello', () => {
    beforeAll( () => {
        // create mounting point
        const elem = document.createElement('hello');
        
        elem.setAttribute('name', 'world');
        document.body.appendChild(elem)
        
        riot.mount(elem, 'hello');
    });
  
    it('should mount the tag', () => {
        expect(document.querySelector('hello h1').textContent).toBe('world');
    });
});
```

##### Demo

You can play with importing and testing tags in the demo folder:

- Clone project
- Enter demo folder
- Run `npm i`
- Run `npm test` to run a simple jest test for an example Riot tag.

##### Development

Run tests with `npm test` or `npm run test:watch`. 

The transformer is developed by using tdd, so if you would like to contribute, please write your tests for your new functionality. 
