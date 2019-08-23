"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
var CoordinateChanges_1 = require("./CoordinateChanges");
var lodash_es_1 = require("lodash-es");
/**
 * Given two changes, compose them to make another change that would have the exact same effect, if applied.
 * This is used to combine the changes produced by several OT operations into a single, more sensible change
 */
function composeChanges(cm, oldChange, change) {
    // There are 3 coordinates systems, orig, middle, and final
    // This is the range affected by the first change, in the "middle" coordinate system
    var affectedMiddle = CoordinateChanges_1.preEditToPostEditChangeRange(oldChange);
    // Does the new change's range (in the middle coordinate system) intersect with affectedMiddle?
    if (rangesOverlap(affectedMiddle, change)) {
        // There are 5 possible types of overlap
        if (Util_1.rangesEqual(affectedMiddle, change)) {
            // The new change perfectly overwrites whatever the old change put there
            return __assign({}, oldChange, { text: change.text });
        }
        else if (rangeContains(affectedMiddle, change)) {
            // The second change is entirely within the text inserted by the first change
            // The first part begins at oldChange.from and proceeds to some line and ch in oldChange.text
            var _a = splitTextByPositionDifference(oldChange.text, change.from, oldChange.from), firstPart = _a[0], unused = _a[1];
            // The second part begins where change.text ends and proceeds through the remainder of oldChange.text
            var _b = splitTextByPositionDifference(oldChange.text, change.to, oldChange.from), unused2 = _b[0], secondPart = _b[1];
            var text = joinWithoutNewlines(joinWithoutNewlines(firstPart, change.text), secondPart);
            return {
                from: oldChange.from,
                to: oldChange.to,
                removed: oldChange.removed,
                text: text,
                origin: oldChange.origin
            };
        }
        else if (rangeContains(change, affectedMiddle)) {
            // The second change overwrites all the text inserted by the first change
            var to = void 0;
            var removed = void 0;
            var text = void 0;
            var changeToInOrigCoords = CoordinateChanges_1.convertPointToBeforeChange(change.to, oldChange);
            if (Util_1.posCmp(changeToInOrigCoords, oldChange.to) <= 0) {
                // The oldChange removal went further into the document
                to = oldChange.to;
                var _c = splitTextByPositionDifference(change.removed, oldChange.from, change.from), initialRemoved = _c[0], unused6 = _c[1];
                removed = joinWithoutNewlines(initialRemoved, oldChange.removed);
                text = change.text;
            }
            else {
                // The change removal went further into the document
                to = changeToInOrigCoords;
                var _d = splitTextByPositionDifference(change.removed, oldChange.from, change.from), initialRemoved = _d[0], unused6 = _d[1];
                var oldChangeToInMiddleCoords = CoordinateChanges_1.convertPointToAfterChange(oldChange.to, oldChange);
                var _e = splitTextByPositionDifference(change.removed, oldChangeToInMiddleCoords, change.from), unused9 = _e[0], finalRemoved = _e[1];
                removed = joinWithoutNewlines(joinWithoutNewlines(initialRemoved, oldChange.removed), finalRemoved);
                text = change.text;
            }
            return {
                from: change.from,
                to: to,
                text: text,
                removed: removed,
                origin: oldChange.origin
            };
        }
        else if (Util_1.posCmp(change.from, affectedMiddle.from) < 0) {
            // The second change overlaps on the left
            var _f = splitTextByPositionDifference(change.removed, oldChange.from, change.from), changeRemoved = _f[0], unused4 = _f[1];
            var removed = joinWithoutNewlines(changeRemoved, oldChange.removed);
            var _g = splitTextByPositionDifference(oldChange.text, change.to, oldChange.from), unused5 = _g[0], remainingChange1Text = _g[1];
            var text = joinWithoutNewlines(change.text, remainingChange1Text);
            return {
                from: change.from,
                to: oldChange.to,
                removed: removed,
                text: text,
                origin: oldChange.origin
            };
        }
        else {
            // The second change overlaps on the right
            var to = void 0;
            var removed = void 0;
            var changeToInOrigCoords = CoordinateChanges_1.convertPointToBeforeChange(change.to, oldChange);
            if (Util_1.posCmp(changeToInOrigCoords, oldChange.to) <= 0) {
                // The oldChange removal went further into the document
                to = oldChange.to;
                removed = oldChange.removed;
            }
            else {
                // The second change's removal goes further into the document;
                to = changeToInOrigCoords;
                var oldChangeToInMiddleCoords = CoordinateChanges_1.convertPointToAfterChange(oldChange.to, oldChange);
                var _h = splitTextByPositionDifference(change.removed, oldChangeToInMiddleCoords, change.from), unused3 = _h[0], extraRemoved = _h[1];
                removed = joinWithoutNewlines(oldChange.removed, extraRemoved);
            }
            var _j = splitTextByPositionDifference(oldChange.text, change.from, oldChange.from), text = _j[0], unused = _j[1];
            text = joinWithoutNewlines(text, change.text);
            return {
                from: oldChange.from,
                to: to,
                text: text,
                removed: removed,
                origin: oldChange.origin
            };
        }
    }
    else {
        // The new change's range is completely before or completely after the old change's range
        if (rangeIsAfterInclusive(affectedMiddle, change)) {
            // The new change precedes the old change
            var middleStartPos = CoordinateChanges_1.preEditToPostEditChangeRange(change).to;
            var middleEndPos = CoordinateChanges_1.convertPointToAfterChange(oldChange.from, change);
            var middle = cm.getRange(middleStartPos, middleEndPos, "\n");
            return {
                from: change.from,
                to: oldChange.to,
                removed: (change.removed.join("\n") + middle + oldChange.removed.join("\n")).split("\n"),
                text: (change.text.join("\n") + middle + oldChange.text.join("\n")).split("\n"),
                origin: oldChange.origin
            };
        }
        else {
            // The old change precedes the new change
            if (!rangeIsAfterInclusive(change, affectedMiddle))
                console.error("RANGE WAS NOT AFTER");
            // Convert change.to to the "orig" coordinate system. This will be the "to" of the composed change
            var finalTo = CoordinateChanges_1.convertPointToBeforeChange(change.to, oldChange);
            // Find the middle piece
            var middleStartPos = affectedMiddle.to;
            var middleEndPos = change.from;
            var middle = cm.getRange(middleStartPos, middleEndPos, "\n");
            return {
                from: oldChange.from,
                to: finalTo,
                text: (oldChange.text.join("\n") + middle + change.text.join("\n")).split("\n"),
                removed: (oldChange.removed.join("\n") + middle + change.removed.join("\n")).split("\n"),
                origin: oldChange.origin
            };
        }
    }
}
exports.composeChanges = composeChanges;
function rangesOverlap(range1, range2) {
    if (rangeIsAfterInclusive(range2, range1))
        return false;
    if (rangeIsAfterInclusive(range1, range2))
        return false;
    return true;
}
function rangeIsAfterInclusive(range1, range2) {
    return Util_1.posCmp(range2.to, range1.from) <= 0; // TODO: check this
}
// Return true if range2 is completely contained within range1
function rangeContains(range1, range2) {
    return Util_1.posInsideRangeInclusive(range2.from, range1) && Util_1.posInsideRangeInclusive(range2.to, range1);
}
function joinWithoutNewlines(list1, list2) {
    var ret = list1.slice(0, list1.length - 1);
    ret.push(lodash_es_1.last(list1) + list2[0]);
    ret.push.apply(ret, list2.slice(1));
    return ret;
}
function splitTextAt(text, line, ch) {
    var firstPart = text.slice(0, line).concat([text[line].slice(0, ch)]);
    var secondPart = [text[line].slice(ch)].concat(text.slice(line + 1));
    return [firstPart, secondPart];
}
function splitTextByPositionDifference(text, furtherPos, earlierPos) {
    return splitTextAt(text, furtherPos.line - earlierPos.line, furtherPos.line === earlierPos.line ? furtherPos.ch - earlierPos.ch : furtherPos.ch);
}
//# sourceMappingURL=ComposeChanges.js.map