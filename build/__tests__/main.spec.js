"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
const compiler_1 = require("@riotjs/compiler");
const babel_jest_1 = __importDefault(require("babel-jest"));
const hello = `
    <hello>
        <h1>{ props.name }</h1>
    </hello>
`;
describe('riot-jest-transformer', function () {
    describe('process', () => {
        const filename = 'fakeFile';
        const config = {
            transform: [
                ['pattern', 'any transformer']
            ],
            rootDir: ''
        };
        const options = { instrument: false };
        const result = 'mockResult';
        let babelJestProcessMock;
        beforeEach(() => {
            babelJestProcessMock = jest.spyOn(babel_jest_1.default, 'process')
                .mockImplementation(() => result);
        });
        it('should be a function', function () {
            expect(typeof main_1.process).toBe('function');
        });
        it('returns code attribute of transformed tag', () => {
            const res = main_1.process(hello, filename, config, options);
            expect(res).toBe(result);
            expect(babelJestProcessMock.mock.calls[0][0].name).toEqual(compiler_1.compile(hello).code.name);
            expect(babelJestProcessMock.mock.calls[0][1]).toBe('fakeFile');
            expect(babelJestProcessMock.mock.calls[0][2]).toBe(config);
            expect(babelJestProcessMock.mock.calls[0][3]).toBe(options);
        });
    });
});
//# sourceMappingURL=main.spec.js.map