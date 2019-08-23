"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Return negative / 0 / positive.  a < b iff posCmp(a, b) < 0 etc.
function posCmp(a, b) {
    return (a.line - b.line) || (a.ch - b.ch);
}
exports.posCmp = posCmp;
// True if inside, false if on edge.
function posInsideRange(pos, range) {
    return posCmp(range.from, pos) < 0 && posCmp(pos, range.to) < 0;
}
exports.posInsideRange = posInsideRange;
function posInsideRangeInclusive(pos, range) {
    return posCmp(range.from, pos) <= 0 && posCmp(pos, range.to) <= 0;
}
exports.posInsideRangeInclusive = posInsideRangeInclusive;
function rangesEqual(range1, range2) {
    return (posCmp(range1.from, range2.from) === 0) && (posCmp(range1.to, range2.to) === 0);
}
exports.rangesEqual = rangesEqual;
function randomString(length, chars) {
    if (chars === void 0) { chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; }
    var result = "";
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
exports.randomString = randomString;
function getCodeMirror() {
    var elem = document.querySelector(".CodeMirror");
    if (!elem)
        throw new Error("Couldn't find CodeMirror elem");
    if (!elem["CodeMirror"])
        throw new Error("Couldn't find CodeMirror");
    return elem["CodeMirror"];
}
exports.getCodeMirror = getCodeMirror;
//# sourceMappingURL=Util.js.map