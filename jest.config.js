module.exports = {
    "verbose": true,
    "automock": false,
    "transform": {
        "^.+\\.[jt]s?$": "babel-jest"
    },
    "testPathIgnorePatterns": ["<rootDir>/node_modules/", "<rootDir>/demo/", "<rootDir>/build/__tests__"],
    "modulePathIgnorePatterns": ["/build/"]
};
