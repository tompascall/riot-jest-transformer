module.exports = {
    "verbose": true,
    "automock": false,
    "transform": {
        "^.+\\.tag$": ["../src/main", {
            registrations: [{
                type: 'css',
                name: 'scss',
                preprocessorModulePath: "riot-scss-preprocessor"
            }]
        }],
        "^.+\\.jsx?$": "babel-jest",
    },
};