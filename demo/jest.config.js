module.exports = {
    "verbose": true,
    "automock": false,
    "transform": {
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.tag$": "../src/main.js"
    }
};
