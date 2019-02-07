![Build Status](https://travis-ci.org/tompascall/riot-jest-transformer.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/tompascall/riot-jest-transformer/badge.svg?branch=master)](https://coveralls.io/github/tompascall/riot-jest-transformer?branch=master)

## riot-jest-transformer

### A Jest transformer for riot tags

This transformer helps you to use [Jest](https://facebook.github.io/jest/) testing tool for your [Riot](http://riotjs.com/) tags. With this transformer you can import your tags into your Jest tests.

#### Prerequisites

- Nodejs >= 6.9
- Installed Jest package (`npm i --save-dev jest babel-jest`)
- Installed riot-jest-transformer npm package into your project: `npm i --save-dev riot-jest-transformer`
- If you use Babel, set up `.babelrc` file correctly (for more see [Jest docs](https://facebook.github.io/jest/docs/getting-started.html#additional-configuration)). Don't forget setting `presets` for new javascript features. `babel-jest` does not seem to be able to pick up `babel.config.js` files, so please prefer `.babelrc`.

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

        riot.mount(elem, 'hello');
    });

    it('should mount the tag', () => {
        expect(document.querySelector('hello h1').textContent).toBe('world');
    });
});
```

#### Misc

The transformation has two steps:
- it compiles the tag with Riot's compiler
- it transformes the compiled tag in order to be able to run it when imported

The transformer uses *@babel/core* module by default as transformer for the compiled tag (and uses the .babelrc for babel configuration). You can also use other transformer by configuring it in the `riot-jest-transformer.json` config file in the root of your project directory. In the latter case the form of the config file must be like this:

```js
{
    "transformer": <transformer module name or path, it will be required by Jest> : String, required
    "method": <the used method of transformer module> : String, required
    "args": <arguments for method> : Array, optional
}
```

##### Notes:

- If you'd like to use babel-core for transformation, and options provided in .babelrc is enough for you, you do not need to create riot-jest-transformer.json file, the transformer just works out of the box
- if you provide a configuration in `riot-jest-transformer.json` and want to use `babel-core` as transformer (maybe with special options for riot tags), the first argument must be an object in `args`, because transformer method of `babel-core` needs an options object for transformation.
- If you want to use other transformer module than babel-core, you have to give the proper path in `transformer` attribute. If the transformer module is from an npm package, it is enough to give the name of the module, otherwise you have to provide the path of the module from project root directory

#### Demo

You can play with importing and testing tags in the demo folder:

- Clone project
- Enter demo folder
- Run `npm i`
- Run `npm test` to run a simple jest test for an example Riot tag.

#### Development

Run tests with `npm test` or `npm run test:watch`.

The transformer is developed with tdd, so if you would like to contribute (you are really welcomed :), please write your tests for your new functionality, and send pull request to integrate your changes.
