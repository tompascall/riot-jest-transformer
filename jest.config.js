module.exports = {
    "verbose": true,
    "automock": false,
    "transform": {
        "^.+\\.[jt]s?$": "babel-jest"
    },
    "testPathIgnorePatterns": ["/node_modules/", "/demo/", "/build/"],
    "modulePathIgnorePatterns": ["/build/"]
};
