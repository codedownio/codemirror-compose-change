"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
function convertPointToBeforeChange(point, change) {
    var linesInserted = change.text.length - change.removed.length;
    var line = point.line - linesInserted;
    var postEditChangeRange = preEditToPostEditChangeRange(change);
    if (point.line > postEditChangeRange.to.line) {
        return { line: line, ch: point.ch };
    }
    else if (point.line === postEditChangeRange.to.line) {
        // Since we're undoing this change, we think of it as first removing change.text,
        // then inserting change.removed. Hence,
        var removed = change.text;
        var inserted = change.removed;
        return {
            line: line,
            ch: point.ch + adjustCh(change, removed, inserted)
        };
    }
    else if (Util_1.posCmp(point, change.from) < 0) {
        // Tried to convert point to before change but it was before change.from
        return point;
    }
    else {
        // Tried to transform point that was inside of change
        return null;
    }
}
exports.convertPointToBeforeChange = convertPointToBeforeChange;
function convertPointToAfterChange(point, change) {
    var linesInserted = change.text.length - change.removed.length;
    var line = point.line + linesInserted;
    if (point.line > change.to.line) {
        return { line: line, ch: point.ch };
    }
    else if (point.line === change.to.line) {
        return {
            line: line,
            ch: point.ch + adjustCh(change, change.removed, change.text)
        };
    }
    else if (Util_1.posCmp(point, change.from) < 0) {
        // Tried to convert point to after change but it was before change.from
        return point;
    }
    else {
        // Point was inside of change
        return null;
    }
}
exports.convertPointToAfterChange = convertPointToAfterChange;
function adjustCh(change, removed, inserted) {
    var ch = 0;
    if (removed.length === 1 && inserted.length > 1) {
        // Single remove multiple insert
        ch -= Util_1.last(removed).length;
        ch += Util_1.last(inserted).length;
        ch -= change.from.ch;
    }
    else if (removed.length === 1 && inserted.length === 1) {
        // Single remove single insert
        ch -= Util_1.last(removed).length;
        ch += Util_1.last(inserted).length;
    }
    else if (removed.length > 1 && inserted.length === 1) {
        // Multiple remove single insert
        // If multiple lines were removed, and only one was added, then ch gets bumped forward by change.from.ch
        ch -= Util_1.last(removed).length;
        ch += Util_1.last(inserted).length;
        ch += change.from.ch;
    }
    else if (removed.length > 1 && inserted.length > 1) {
        // Multiple remove multiple insert
        ch -= Util_1.last(removed).length;
        ch += Util_1.last(inserted).length;
    }
    return ch;
}
function preEditToPostEditChangeRange(change) {
    var line = change.from.line + change.text.length - 1;
    var ch;
    if (change.text.length === 1) {
        ch = change.from.ch + Util_1.last(change.text).length;
    }
    else {
        ch = Util_1.last(change.text).length;
    }
    var to = { line: line, ch: ch };
    return {
        from: change.from,
        to: to
    };
}
exports.preEditToPostEditChangeRange = preEditToPostEditChangeRange;
function applyChange(cm, change) {
    cm.replaceRange(change.text.join("\n"), change.from, change.to);
}
exports.applyChange = applyChange;
function reverseApplyChange(cm, change) {
    var postEditChangeRange = preEditToPostEditChangeRange(change);
    // Want (0, 2) to (1, 1)
    console.log("postEditChangeRange in reverseApplyChange", postEditChangeRange);
    cm.replaceRange(change.removed.join("\n"), postEditChangeRange.from, postEditChangeRange.to);
}
exports.reverseApplyChange = reverseApplyChange;
//# sourceMappingURL=CoordinateChanges.js.map