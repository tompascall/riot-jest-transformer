module.exports = {
    "verbose": true,
    "automock": false,
    "transform": {
        "^.+\\.tag$": ["riot-jest-transformer", {
            registrations: [{
                type: 'css',
                name: 'scss',
                preprocessorModulePath: "riot-scss-preprocessor"
            }]
        }],
        "^.+\\.jsx?$": "babel-jest",
    },
};