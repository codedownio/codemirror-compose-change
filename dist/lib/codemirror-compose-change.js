"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoordinateChanges = require("./CoordinateChanges");
var ComposeChanges = require("./ComposeChanges");
// Load the script in a browser and use the static methods on this class to run tests
// import {runAll} from "./FixedTests";
// import {makeRandomEditAndGetChange, setAlphabeticalContent, setRandomContent} from "./RandomEdits";
// import {testChanges} from "./TestCore";
// import {getCodeMirror} from "./Util";
// Keep this commented when building dist so test stuff doesn't end up in the bundle
// export class TestRunner {
//   static runFixedTests() {
//     runAll();
//   }
//   static runRandomTests(repeats=1, delay=1000) {
//     if (repeats === 0) {
//       console.log("No further repeats to run!");
//       return;
//     }
//     console.log("Test repeats remaining: " + repeats);
//     let cm = getCodeMirror();
//     // Fill in random content
//     setRandomContent(cm);
//     // setAlphabeticalContent(cm);
//     let originalContent = cm.getValue();
//     makeRandomEditAndGetChange(cm, delay).then((change1) => {
//       makeRandomEditAndGetChange(cm, delay).then((change2) => {
//         window["lastChange1"] = change1;
//         window["lastChange2"] = change2;
//         testChanges(cm, originalContent, change1, change2);
//         this.runRandomTests(repeats - 1, delay);
//       });
//     })
//   }
//   static repeatLastTest() {
//     let change1 = window["lastChange1"];
//     let change2 = window["lastChange2"];
//     if (!change1 || !change2) return console.error("Couldn't find changes to repeat");
//     let cm = getCodeMirror();
//     setAlphabeticalContent(cm);
//     let originalContent = cm.getValue();
//     cm.setSelection(change1.from, change1.to);
//     setTimeout(() => {
//       cm.replaceRange(change1.text, change1.from, change1.to);
//       setTimeout(() => {
//         cm.setSelection(change2.from, change2.to);
//         setTimeout(() => {
//           cm.replaceRange(change2.text, change2.from, change2.to);
//           testChanges(cm, originalContent, change1, change2);
//         }, 1000);
//       }, 1000);
//     }, 1000);
//   }
// }
exports.composeChanges = ComposeChanges.composeChanges;
exports.preEditToPostEditChangeRange = CoordinateChanges.preEditToPostEditChangeRange;
exports.convertPointToAfterChange = CoordinateChanges.convertPointToAfterChange;
exports.convertPointToBeforeChange = CoordinateChanges.convertPointToBeforeChange;
//# sourceMappingURL=codemirror-compose-change.js.map