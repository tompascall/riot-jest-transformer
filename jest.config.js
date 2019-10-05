module.exports = {
    "verbose": true,
    "automock": false,
    "transform": {
        "^.+\\.[jt]s?$": "babel-jest"
    },
    "testPathIgnorePatterns": ["<rootDir>/node_modules/", "<rootDir>/demo/", "<rootDir>/build/"],
    "modulePathIgnorePatterns": ["/build/"]
};
