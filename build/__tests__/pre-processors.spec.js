"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pre_processors_1 = require("../pre-processors");
const mock_scss_preprocessor_1 = __importDefault(require("../__mocks__/mock-scss-preprocessor"));
const compiler_1 = require("@riotjs/compiler");
describe('Pre-processors', () => {
    describe('getRegistrationOptions', () => {
        it('should be a function', () => {
            expect(typeof pre_processors_1.getRegistrationOptions).toBe('function');
        });
        it('should return null if no options object \
      in riot-jest-transformer config', () => {
            const config = {
                transform: [
                    ['filePattern1', 'modulePath'],
                    ['riot-tag-pattern', 'some/riot-jest-transformer/path']
                ],
                rootDir: ''
            };
            expect(pre_processors_1.getRegistrationOptions(config)).toBe(null);
        });
        it('should return null if there is no registrations \
      in options object', () => {
            const config = {
                transform: [
                    ['filePattern1', 'modulePath'],
                    ['riot-tag-pattern', 'some/riot-jest-transformer/path',
                        // @ts-ignore: testing inappropriate options
                        { foo: 'bar' }
                    ],
                ],
                rootDir: ''
            };
            expect(pre_processors_1.getRegistrationOptions(config)).toBe(null);
        });
        it('should return registrationOptions', () => {
            const regOpts = [{
                    type: 'css',
                    name: 'anything',
                    preprocessorModulePath: ''
                }];
            const config = {
                transform: [
                    ['filePattern1', 'modulePath'],
                    ['riot-tag-pattern', 'some/riot-jest-transformer/path',
                        { registrations: regOpts }
                    ]
                ],
                rootDir: ''
            };
            expect(pre_processors_1.getRegistrationOptions(config)).toBe(regOpts);
        });
    });
    describe('getCacheOption', () => {
        it('should return true if clearCache is not defined', () => {
            const config = {
                transform: [
                    ['filePattern1', 'modulePath'],
                    ['riot-tag-pattern', 'some/riot-jest-transformer/path',
                        { registrations: [{
                                    type: 'css',
                                    name: 'scss',
                                    preprocessorModulePath: "riot-scss-preprocessor"
                                }]
                        }
                    ]
                ],
                rootDir: ''
            };
            expect(pre_processors_1.getCacheOption(config)).toBe(false);
        });
        it('should return true', () => {
            const config = {
                transform: [
                    ['filePattern1', 'modulePath'],
                    ['riot-tag-pattern', 'some/riot-jest-transformer/path',
                        { registrations: [{
                                    type: 'css',
                                    name: 'scss',
                                    preprocessorModulePath: "riot-scss-preprocessor"
                                }],
                            clearCache: true
                        }
                    ]
                ],
                rootDir: ''
            };
            expect(pre_processors_1.getCacheOption(config)).toBe(true);
        });
    });
    describe('tryRegistrations', () => {
        const jestRootDir = '';
        describe('Options validation', () => {
            it('should throw error if registration options are \
        not wrapped in an array', () => {
                // @ts-ignore: testing wrong arguments
                expect(() => pre_processors_1.tryRegistrations()).toThrow();
            });
            it('should throw error if registration options \
        are not objects', () => {
                // @ts-ignore: testing wrong arguments
                expect(() => pre_processors_1.tryRegistrations([[{}]])).toThrow();
                // @ts-ignore: testing wrong arguments
                expect(() => pre_processors_1.tryRegistrations([{}, 'something else'])).toThrow();
            });
            it('should throw error if registration options \
        do not have type: "template" | "css" | "javascript"', () => {
                // @ts-ignore: testing wrong arguments
                expect(() => pre_processors_1.tryRegistrations([{}])).toThrow();
                // @ts-ignore: testing wrong arguments
                expect(() => pre_processors_1.tryRegistrations([{ foo: 'bar' }])).toThrow();
                // @ts-ignore: testing wrong arguments
                expect(() => pre_processors_1.tryRegistrations([{ type: 'foo' }])).toThrow();
            });
            it('should throw error if registration options \
        do not have name (string)', () => {
                expect(() => 
                // @ts-ignore: testing wrong arguments
                pre_processors_1.tryRegistrations([{ type: 'template' }]))
                    .toThrow();
                expect(() => 
                // @ts-ignore: testing wrong arguments
                pre_processors_1.tryRegistrations([{ type: 'template', name: {} }]))
                    .toThrow();
            });
            it('should throw error if registration options \
        do not have preprocessorModulePath as string', () => {
                expect(() => 
                // @ts-ignore: testing wrong arguments
                pre_processors_1.tryRegistrations([{
                        type: 'template',
                        name: 'foo'
                    }], jestRootDir))
                    .toThrow();
                expect(() => 
                // @ts-ignore: testing wrong arguments
                pre_processors_1.tryRegistrations([{
                        type: 'template',
                        name: 'foo',
                        // @ts-ignore: testing wrong arguments
                        preprocessorModulePath: {}
                    }], jestRootDir, true))
                    .toThrow();
                expect(() => pre_processors_1.tryRegistrations([{
                        type: 'template',
                        name: 'foo',
                        preprocessorModulePath: 'mock-scss-preprocessor'
                    }], jestRootDir, true))
                    .not.toThrow();
            });
        });
        describe('Try registration', () => {
            const jestRootDir = '';
            beforeEach(() => {
                compiler_1.registerPreprocessor.mockReset();
            });
            it('should call registerPreprocessor for all registrations', () => {
                const options = [{
                        type: 'css',
                        name: 'foo',
                        preprocessorModulePath: 'mock-scss-preprocessor'
                    }];
                pre_processors_1.tryRegistrations(options, jestRootDir, true);
                expect(compiler_1.registerPreprocessor).toBeCalledTimes(1);
                expect(compiler_1.registerPreprocessor)
                    .toHaveBeenCalledWith(options[0].type, options[0].name, { default: mock_scss_preprocessor_1.default });
            });
        });
        describe('registerPreProcessors', () => {
            beforeEach(() => {
                compiler_1.registerPreprocessor.mockReset();
            });
            it('should get options and call registerPreprocessor', () => {
                const options = [{
                        type: 'template',
                        name: 'foo',
                        preprocessorModulePath: 'mock-scss-preprocessor'
                    }];
                const config = {
                    transform: [
                        ['filePattern1', 'modulePath'],
                        [
                            'riot-tag-pattern',
                            'riot-jest-transformer',
                            { registrations: options, clearCache: true }
                        ]
                    ],
                    rootDir: ''
                };
                pre_processors_1.registerPreProcessors(config);
                expect(compiler_1.registerPreprocessor).toBeCalledTimes(1);
                expect(compiler_1.registerPreprocessor)
                    .toHaveBeenCalledWith(options[0].type, options[0].name, { default: mock_scss_preprocessor_1.default });
            });
            it('should call registerPreprocessor only once for the same type', () => {
                const options = [{
                        type: 'css',
                        name: 'foo',
                        preprocessorModulePath: 'mock-scss-preprocessor'
                    }, {
                        type: 'css',
                        name: 'bar',
                        preprocessorModulePath: 'mock-to-another-scss-preprocessor'
                    }];
                const config = {
                    transform: [
                        ['filePattern1', 'modulePath'],
                        [
                            'riot-tag-pattern',
                            'riot-jest-transformer',
                            { registrations: options, clearCache: true }
                        ],
                    ],
                    rootDir: ''
                };
                pre_processors_1.registerPreProcessors(config);
                expect(compiler_1.registerPreprocessor).toBeCalledTimes(1);
                expect(compiler_1.registerPreprocessor)
                    .toHaveBeenCalledWith(options[0].type, options[0].name, { default: mock_scss_preprocessor_1.default });
            });
        });
    });
});
//# sourceMappingURL=pre-processors.spec.js.map