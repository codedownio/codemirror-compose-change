"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoordinateChanges = require("./CoordinateChanges");
var ComposeChanges = require("./ComposeChanges");
var FixedTests_1 = require("./FixedTests");
var RandomEdits_1 = require("./RandomEdits");
var TestCore_1 = require("./TestCore");
var Util_1 = require("./Util");
// Load the script in a browser and use the static methods on this class to run tests
var TestRunner = /** @class */ (function () {
    function TestRunner() {
    }
    TestRunner.runFixedTests = function () {
        FixedTests_1.runAll();
    };
    TestRunner.runRandomTests = function (repeats, delay) {
        var _this = this;
        if (repeats === void 0) { repeats = 1; }
        if (delay === void 0) { delay = 1000; }
        if (repeats === 0) {
            console.log("No further repeats to run!");
            return;
        }
        console.log("Test repeats remaining: " + repeats);
        var cm = Util_1.getCodeMirror();
        // Fill in random content
        RandomEdits_1.setRandomContent(cm);
        // setAlphabeticalContent(cm);
        var originalContent = cm.getValue();
        RandomEdits_1.makeRandomEditAndGetChange(cm, delay).then(function (change1) {
            RandomEdits_1.makeRandomEditAndGetChange(cm, delay).then(function (change2) {
                window["lastChange1"] = change1;
                window["lastChange2"] = change2;
                TestCore_1.testChanges(cm, originalContent, change1, change2);
                _this.runRandomTests(repeats - 1, delay);
            });
        });
    };
    TestRunner.repeatLastTest = function () {
        var change1 = window["lastChange1"];
        var change2 = window["lastChange2"];
        if (!change1 || !change2)
            return console.error("Couldn't find changes to repeat");
        var cm = Util_1.getCodeMirror();
        RandomEdits_1.setAlphabeticalContent(cm);
        var originalContent = cm.getValue();
        cm.setSelection(change1.from, change1.to);
        setTimeout(function () {
            cm.replaceRange(change1.text, change1.from, change1.to);
            setTimeout(function () {
                cm.setSelection(change2.from, change2.to);
                setTimeout(function () {
                    cm.replaceRange(change2.text, change2.from, change2.to);
                    TestCore_1.testChanges(cm, originalContent, change1, change2);
                }, 1000);
            }, 1000);
        }, 1000);
    };
    return TestRunner;
}());
exports.TestRunner = TestRunner;
exports.composeChanges = ComposeChanges.composeChanges;
exports.preEditToPostEditChangeRange = CoordinateChanges.preEditToPostEditChangeRange;
exports.convertPointToAfterChange = CoordinateChanges.convertPointToAfterChange;
exports.convertPointToBeforeChange = CoordinateChanges.convertPointToBeforeChange;
//# sourceMappingURL=codemirror-compose-change.js.map