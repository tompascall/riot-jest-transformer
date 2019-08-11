![Build Status](https://travis-ci.org/tompascall/riot-jest-transformer.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/tompascall/riot-jest-transformer/badge.svg?branch=master)](https://coveralls.io/github/tompascall/riot-jest-transformer?branch=master)

## riot-jest-transformer

### A Jest transformer for riot tags

This transformer helps you to use [Jest](https://facebook.github.io/jest/) testing tool for your [Riot](http://riotjs.com/) tags. With this transformer you can import your tags into your Jest tests.

#### Prerequisites

- Nodejs >= 6.9
- Installed Jest package (`npm i --save-dev jest babel-jest`)
- Installed riot-jest-transformer npm package into your project: `npm i --save-dev riot-jest-transformer`
- If you use Babel, set up `.babelrc` file correctly (for more see [Jest docs](https://facebook.github.io/jest/docs/getting-started.html#additional-configuration)). Don't forget setting `presets` for new javascript features. 

#### Setting up Jest config file

riot-jest-transformer must be used in your Jest config file like this:

```js
{
    "transform": {
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.tag$": "riot-jest-transformer"
    }
}
```

Let's suppose that you saved the Jest config file to the project root directory as `jest.config`. In this case you should run jest with --config option: `jest --config jest.config`

#### Usage

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

        riot.register('hello', hello);
        riot.mount(elem, 'hello');
    });

    it('should mount the tag', () => {
        expect(document.querySelector('hello h1').textContent).toBe('world');
    });
});
```

#### Demo

You can play with importing and testing tags in the demo folder:

- Clone project
- Enter demo folder
- Run `npm i`
- Run `npm test` to run a simple jest test for an example Riot tag.

#### Development

Run tests with `npm test` or `npm run test:watch`.

The transformer is developed with tdd, so if you would like to contribute (you are really welcomed :), please write your tests for your new functionality, and send pull request to integrate your changes.
