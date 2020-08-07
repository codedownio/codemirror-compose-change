(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.codemirrorComposeChange = {})));
}(this, (function (exports) { 'use strict';

  /**
   * Gets the last element of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   */
  function last(array) {
    var length = array == null ? 0 : array.length;
    return length ? array[length - 1] : undefined;
  }

  // Return negative / 0 / positive.  a < b iff posCmp(a, b) < 0 etc.
  function posCmp(a, b) {
      return (a.line - b.line) || (a.ch - b.ch);
  }
  function posInsideRangeInclusive(pos, range) {
      return posCmp(range.from, pos) <= 0 && posCmp(pos, range.to) <= 0;
  }
  function rangesEqual(range1, range2) {
      return (posCmp(range1.from, range2.from) === 0) && (posCmp(range1.to, range2.to) === 0);
  }

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
      else if (posCmp(point, change.from) < 0) {
          // Tried to convert point to before change but it was before change.from
          return point;
      }
      else {
          // Tried to transform point that was inside of change
          return null;
      }
  }
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
      else if (posCmp(point, change.from) < 0) {
          // Tried to convert point to after change but it was before change.from
          return point;
      }
      else {
          // Point was inside of change
          return null;
      }
  }
  function adjustCh(change, removed, inserted) {
      var ch = 0;
      if (removed.length === 1 && inserted.length > 1) {
          // Single remove multiple insert
          ch -= last(removed).length;
          ch += last(inserted).length;
          ch -= change.from.ch;
      }
      else if (removed.length === 1 && inserted.length === 1) {
          // Single remove single insert
          ch -= last(removed).length;
          ch += last(inserted).length;
      }
      else if (removed.length > 1 && inserted.length === 1) {
          // Multiple remove single insert
          // If multiple lines were removed, and only one was added, then ch gets bumped forward by change.from.ch
          ch -= last(removed).length;
          ch += last(inserted).length;
          ch += change.from.ch;
      }
      else if (removed.length > 1 && inserted.length > 1) {
          // Multiple remove multiple insert
          ch -= last(removed).length;
          ch += last(inserted).length;
      }
      return ch;
  }
  function preEditToPostEditChangeRange(change) {
      var line = change.from.line + change.text.length - 1;
      var ch;
      if (change.text.length === 1) {
          ch = change.from.ch + last(change.text).length;
      }
      else {
          ch = last(change.text).length;
      }
      var to = { line: line, ch: ch };
      return {
          from: change.from,
          to: to
      };
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  /**
   * Given two changes, compose them to make another change that would have the exact same effect, if applied.
   * This is used to combine the changes produced by several OT operations into a single, more sensible change
   */
  function composeChanges(cm, oldChange, change) {
      // There are 3 coordinates systems, orig, middle, and final
      // This is the range affected by the first change, in the "middle" coordinate system
      var affectedMiddle = preEditToPostEditChangeRange(oldChange);
      // Does the new change's range (in the middle coordinate system) intersect with affectedMiddle?
      if (rangesOverlap(affectedMiddle, change)) {
          // There are 5 possible types of overlap
          if (rangesEqual(affectedMiddle, change)) {
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
              var changeToInOrigCoords = convertPointToBeforeChange(change.to, oldChange);
              if (posCmp(changeToInOrigCoords, oldChange.to) <= 0) {
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
                  var oldChangeToInMiddleCoords = convertPointToAfterChange(oldChange.to, oldChange);
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
          else if (posCmp(change.from, affectedMiddle.from) < 0) {
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
              var changeToInOrigCoords = convertPointToBeforeChange(change.to, oldChange);
              if (posCmp(changeToInOrigCoords, oldChange.to) <= 0) {
                  // The oldChange removal went further into the document
                  to = oldChange.to;
                  removed = oldChange.removed;
              }
              else {
                  // The second change's removal goes further into the document;
                  to = changeToInOrigCoords;
                  var oldChangeToInMiddleCoords = convertPointToAfterChange(oldChange.to, oldChange);
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
              var middleStartPos = preEditToPostEditChangeRange(change).to;
              var middleEndPos = convertPointToAfterChange(oldChange.from, change);
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
              var finalTo = convertPointToBeforeChange(change.to, oldChange);
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
  function rangesOverlap(range1, range2) {
      if (rangeIsAfterInclusive(range2, range1))
          return false;
      if (rangeIsAfterInclusive(range1, range2))
          return false;
      return true;
  }
  function rangeIsAfterInclusive(range1, range2) {
      return posCmp(range2.to, range1.from) <= 0; // TODO: check this
  }
  // Return true if range2 is completely contained within range1
  function rangeContains(range1, range2) {
      return posInsideRangeInclusive(range2.from, range1) && posInsideRangeInclusive(range2.to, range1);
  }
  function joinWithoutNewlines(list1, list2) {
      var ret = list1.slice(0, list1.length - 1);
      ret.push(last(list1) + list2[0]);
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
  var composeChanges$1 = composeChanges;
  var preEditToPostEditChangeRange$1 = preEditToPostEditChangeRange;
  var convertPointToAfterChange$1 = convertPointToAfterChange;
  var convertPointToBeforeChange$1 = convertPointToBeforeChange;

  exports.composeChanges = composeChanges$1;
  exports.preEditToPostEditChangeRange = preEditToPostEditChangeRange$1;
  exports.convertPointToAfterChange = convertPointToAfterChange$1;
  exports.convertPointToBeforeChange = convertPointToBeforeChange$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=codemirror-compose-change.umd.js.map
