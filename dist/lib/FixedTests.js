"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoordinateChanges_1 = require("./CoordinateChanges");
var RandomEdits_1 = require("./RandomEdits");
var TestCore_1 = require("./TestCore");
var Util_1 = require("./Util");
function testSpecificChanges(change1, change2) {
    var cm = Util_1.getCodeMirror();
    RandomEdits_1.setAlphabeticalContent(cm);
    var originalContent = cm.getValue();
    CoordinateChanges_1.applyChange(cm, change1);
    CoordinateChanges_1.applyChange(cm, change2);
    TestCore_1.testChanges(cm, originalContent, change1, change2);
}
function testExample1() {
    var change1 = {
        from: { line: 7, ch: 3 },
        to: { line: 10, ch: 0 },
        text: [""],
        removed: ["hh", "iiiii", "jjjjj", ""],
        origin: "whatever"
    };
    var change2 = {
        from: { line: 0, ch: 3 },
        to: { line: 2, ch: 0 },
        text: [""],
        removed: ["aa", "bbbbb", ""],
        origin: "whatever"
    };
    testSpecificChanges(change1, change2);
}
function testExample2() {
    var change1 = {
        from: { line: 7, ch: 5 },
        to: { line: 9, ch: 5 },
        text: [""],
        removed: ["", "iiiii", "jjjjj"]
    };
    var change2 = {
        from: { line: 6, ch: 3 },
        to: { line: 7, ch: 1 },
        text: [""],
        removed: ["gg", "h"]
    };
    testSpecificChanges(change1, change2);
}
function testExample3() {
    var change1 = {
        from: { line: 0, ch: 2 },
        to: { line: 6, ch: 1 },
        "text": [""],
        "removed": [
            "aaa",
            "bbbbb",
            "ccccc",
            "ddddd",
            "eeeee",
            "fffff",
            "g"
        ]
    };
    var change2 = {
        from: { line: 0, ch: 5 },
        to: { line: 3, ch: 5 },
        "text": [""],
        "removed": [
            "g",
            "hhhhh",
            "iiiii",
            "jjjjj"
        ]
    };
    testSpecificChanges(change1, change2);
}
function testExample4() {
    var change1 = {
        from: { line: 3, ch: 0 },
        to: { line: 6, ch: 4 },
        text: [""],
        removed: [
            "ddddd",
            "eeeee",
            "fffff",
            "gggg"
        ]
    };
    var change2 = {
        from: { line: 0, ch: 1 },
        to: { line: 6, ch: 3 },
        text: [""],
        removed: [
            "aaaa",
            "bbbbb",
            "ccccc",
            "g",
            "hhhhh",
            "iiiii",
            "jjj"
        ]
    };
    testSpecificChanges(change1, change2);
}
exports.testExample4 = testExample4;
function testExample5() {
    var change1 = {
        from: { line: 1, ch: 1 },
        to: { line: 2, ch: 0 },
        text: [""],
        "removed": [
            "bbbb",
            ""
        ]
    };
    var change2 = {
        from: { line: 0, ch: 4 },
        to: { line: 5, ch: 1 },
        text: [""],
        "removed": [
            "a",
            "bccccc",
            "ddddd",
            "eeeee",
            "fffff",
            "g"
        ]
    };
    testSpecificChanges(change1, change2);
}
exports.testExample5 = testExample5;
function testExample6() {
    var change1 = {
        from: { line: 0, ch: 4 },
        to: { line: 5, ch: 4 },
        text: [""],
        removed: [
            "a",
            "bbbbb",
            "ccccc",
            "ddddd",
            "eeeee",
            "ffff"
        ]
    };
    var change2 = {
        from: { line: 0, ch: 1 },
        to: { line: 1, ch: 2 },
        text: [""],
        removed: [
            "aaaf",
            "gg"
        ]
    };
    testSpecificChanges(change1, change2);
}
exports.testExample6 = testExample6;
function testExample7() {
    var change1 = {
        from: { line: 0, ch: 5 },
        to: { line: 8, ch: 1 },
        text: [""],
        removed: [
            "",
            "bbbbb",
            "ccccc",
            "ddddd",
            "eeeee",
            "fffff",
            "ggggg",
            "hhhhh",
            "i"
        ]
    };
    var change2 = {
        from: { line: 0, ch: 1 },
        to: { line: 0, ch: 8 },
        text: [""],
        removed: [
            "aaaaiii"
        ]
    };
    testSpecificChanges(change1, change2);
}
exports.testExample7 = testExample7;
function testExample8() {
    var change1 = {
        from: { line: 0, ch: 5 },
        to: { line: 2, ch: 4 },
        text: [
            "",
            "zwyw",
            "",
            "wwy"
        ],
        removed: [
            "",
            "bbbbb",
            "cccc"
        ]
    };
    var change2 = {
        from: { line: 1, ch: 2 },
        to: { line: 1, ch: 3 },
        text: [
            "",
            "ww",
            "zzyy",
            "x"
        ],
        removed: [
            "y"
        ]
    };
    testSpecificChanges(change1, change2);
}
exports.testExample8 = testExample8;
function testExample9() {
    var change1 = {
        from: { line: 0, ch: 0 },
        to: { line: 9, ch: 3 },
        text: [
            "wz"
        ],
        removed: [
            "aaaaa",
            "bbbbb",
            "ccccc",
            "ddddd",
            "eeeee",
            "fffff",
            "ggggg",
            "hhhhh",
            "iiiii",
            "jjj"
        ]
    };
    var change2 = {
        from: { line: 0, ch: 1 },
        to: { line: 0, ch: 3 },
        text: [
            "z",
            "",
            ""
        ],
        removed: [
            "zj"
        ]
    };
    testSpecificChanges(change1, change2);
}
exports.testExample9 = testExample9;
function latestTest() {
}
exports.latestTest = latestTest;
function runAll() {
    testExample1();
    testExample2();
    testExample3();
    testExample4();
    testExample5();
    testExample6();
    testExample7();
    testExample8();
    testExample9();
}
exports.runAll = runAll;
//# sourceMappingURL=FixedTests.js.map