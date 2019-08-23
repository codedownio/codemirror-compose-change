"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_es_1 = require("lodash-es");
var Util_1 = require("./Util");
function makeRandomEditAndGetChange(cm, delayMs) {
    if (delayMs === void 0) { delayMs = 0; }
    if (cm.getValue().length === 0) {
        console.error("Editor was empty; unable to make an edit");
        return Promise.resolve({
            from: { line: 0, ch: 0 },
            to: { line: 0, ch: 0 },
            text: [""],
            removed: [""],
            origin: "random_edit_error"
        });
    }
    return new Promise(function (resolve, reject) {
        var onChange = function (cm, change) {
            resolve(change);
            cm.off("change", onChange);
        };
        cm.on("change", onChange);
        var pos1 = getRandomPosition(cm);
        var pos2 = getRandomPosition(cm);
        while (lodash_es_1.isEqual(pos2, pos1))
            pos2 = getRandomPosition(cm);
        var replaceWith = Util_1.randomString(Math.round(Math.random() * 10), "wxyz\n");
        // let replaceWith = "";
        cm.setSelection(pos1, pos2);
        setTimeout(function () {
            cm.replaceRange(replaceWith, pos1, pos2);
        }, delayMs);
    });
}
exports.makeRandomEditAndGetChange = makeRandomEditAndGetChange;
function getRandomPosition(cm) {
    var line = Math.round(Math.random() * cm.lineCount() - 1);
    if (line < 0)
        line = 0;
    if (line >= cm.lineCount())
        line = cm.lineCount() - 1;
    var lineContent = cm.getLine(line);
    var ch = Math.round(Math.random() * lineContent.length);
    return { line: line, ch: ch };
}
function setRandomContent(cm) {
    cm.operation(function () {
        cm.setValue("");
        for (var line = 0; line < 25; line += 1) {
            var lineLength = Math.round(Math.random() * 20);
            var contents = Util_1.randomString(lineLength, "abcdef");
            var pos = { line: line, ch: cm.getLine(line).length };
            cm.replaceRange(contents + "\n", pos, pos);
        }
    });
}
exports.setRandomContent = setRandomContent;
function setAlphabeticalContent(cm) {
    cm.operation(function () {
        cm.setValue("");
        for (var line = 0; line < 10; line += 1) {
            var letter = String.fromCharCode(97 + line);
            var contents = "";
            var lineLength = 5;
            for (var i = 0; i < lineLength; i++)
                contents += letter;
            var pos = { line: line, ch: cm.getLine(line).length };
            cm.replaceRange(contents + "\n", pos, pos);
        }
    });
}
exports.setAlphabeticalContent = setAlphabeticalContent;
//# sourceMappingURL=RandomEdits.js.map