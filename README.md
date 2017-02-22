*Work In Progress...*

## riot-jest-transformer

### A jest transformer for riot tags

#### This transformer helps you to use [Jest](https://facebook.github.io/jest/) testing tool for your [Riot](http://riotjs.com/) tags.

#### Prerequisites

- Nodejs >= 6.9
- install npm package in your project: `npm i --save-dev riot-jest-transformer`

##### Setting up jest config file

```js
{
    "transform": {
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.tag$": "riot-jest-transformer"
    }
}
```
