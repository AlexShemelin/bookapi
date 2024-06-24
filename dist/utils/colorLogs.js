"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleRed = exports.consoleGreen = void 0;
function consoleGreen(text) {
    console.log("\x1b[32m%s\x1b[0m", text);
}
exports.consoleGreen = consoleGreen;
function consoleRed(text) {
    console.log("\x1b[31m%s\x1b[0m", text);
}
exports.consoleRed = consoleRed;
