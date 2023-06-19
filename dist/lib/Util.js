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
function last(array) {
    var length = array == null ? 0 : array.length;
    return length ? array[length - 1] : undefined;
}
exports.last = last;
//# sourceMappingURL=Util.js.map