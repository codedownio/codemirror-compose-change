
import {last} from "lodash-es";

import {convertPointToAfterChange, convertPointToBeforeChange, preEditToPostEditChangeRange} from "./CoordinateChanges";
import {FromTo} from "./Types";
import {posCmp, posInsideRangeInclusive, rangesEqual} from "./Util";

/**
 * Given two changes, compose them to make another change that would have the exact same effect, if applied.
 * This is used to combine the changes produced by several OT operations into a single, more sensible change
 */
export function composeChanges(cm: CodeMirror.Doc, oldChange: CodeMirror.EditorChange, change: CodeMirror.EditorChange): CodeMirror.EditorChange {
  // There are 3 coordinates systems, orig, middle, and final

  // This is the range affected by the first change, in the "middle" coordinate system
  let affectedMiddle: FromTo = preEditToPostEditChangeRange(oldChange);

  // Does the new change's range (in the middle coordinate system) intersect with affectedMiddle?
  if (rangesOverlap(affectedMiddle, change)) {
    // There are 5 possible types of overlap

    if (rangesEqual(affectedMiddle, change)) {
      // The new change perfectly overwrites whatever the old change put there
      return {
        ...oldChange,
        text: change.text
      };
    } else if (rangeContains(affectedMiddle, change)) {
      // The second change is entirely within the text inserted by the first change

      // The first part begins at oldChange.from and proceeds to some line and ch in oldChange.text
      let [firstPart, unused] = splitTextByPositionDifference(oldChange.text, change.from, oldChange.from);

      // The second part begins where change.text ends and proceeds through the remainder of oldChange.text
      let [unused2, secondPart] = splitTextByPositionDifference(oldChange.text, change.to, oldChange.from);

      let text = joinWithoutNewlines(joinWithoutNewlines(firstPart, change.text), secondPart);

      return {
        from: oldChange.from,
        to: oldChange.to,
        removed: oldChange.removed,
        text,
        origin: oldChange.origin
      };
    } else if (rangeContains(change, affectedMiddle)) {
      // The second change overwrites all the text inserted by the first change

      let to: CodeMirror.Position;
      let removed: string[];
      let text: string[];

      let changeToInOrigCoords = convertPointToBeforeChange(change.to, oldChange);

      if (posCmp(changeToInOrigCoords, oldChange.to) <= 0) {
        // The oldChange removal went further into the document

        to = oldChange.to;

        let [initialRemoved, unused6] = splitTextByPositionDifference(change.removed, oldChange.from, change.from);
        removed = joinWithoutNewlines(initialRemoved, oldChange.removed);

        text = change.text;
      } else {
        // The change removal went further into the document

        to = changeToInOrigCoords;

        let [initialRemoved, unused6] = splitTextByPositionDifference(change.removed, oldChange.from, change.from);
        let oldChangeToInMiddleCoords = convertPointToAfterChange(oldChange.to, oldChange);
        let [unused9, finalRemoved] = splitTextByPositionDifference(change.removed, oldChangeToInMiddleCoords, change.from);
        removed = joinWithoutNewlines(joinWithoutNewlines(initialRemoved, oldChange.removed), finalRemoved);

        text = change.text;
      }

      return {
        from: change.from,
        to,
        text,
        removed,
        origin: oldChange.origin
      };
    } else if (posCmp(change.from, affectedMiddle.from) < 0) {
      // The second change overlaps on the left

      let [changeRemoved, unused4] = splitTextByPositionDifference(change.removed, oldChange.from, change.from);
      let removed = joinWithoutNewlines(changeRemoved, oldChange.removed);

      let [unused5, remainingChange1Text] = splitTextByPositionDifference(oldChange.text, change.to, oldChange.from);
      let text = joinWithoutNewlines(change.text, remainingChange1Text);

      return {
        from: change.from,
        to: oldChange.to,
        removed,
        text,
        origin: oldChange.origin
      };
    } else {
      // The second change overlaps on the right

      let to: CodeMirror.Position;
      let removed: string[];

      let changeToInOrigCoords = convertPointToBeforeChange(change.to, oldChange);

      if (posCmp(changeToInOrigCoords, oldChange.to) <= 0) {
        // The oldChange removal went further into the document
        to = oldChange.to;
        removed = oldChange.removed;
      } else {
        // The second change's removal goes further into the document;
        to = changeToInOrigCoords;

        let oldChangeToInMiddleCoords = convertPointToAfterChange(oldChange.to, oldChange);
        let [unused3, extraRemoved] = splitTextByPositionDifference(change.removed, oldChangeToInMiddleCoords, change.from);
        removed = joinWithoutNewlines(oldChange.removed, extraRemoved);
      }

      let [text, unused] = splitTextByPositionDifference(oldChange.text, change.from, oldChange.from);
      text = joinWithoutNewlines(text, change.text);

      return {
        from: oldChange.from,
        to,
        text,
        removed,
        origin: oldChange.origin
      };
    }
  } else {
    // The new change's range is completely before or completely after the old change's range
    if (rangeIsAfterInclusive(affectedMiddle, change)) {
      // The new change precedes the old change

      let middleStartPos = preEditToPostEditChangeRange(change).to;
      let middleEndPos = convertPointToAfterChange(oldChange.from, change);
      let middle = cm.getRange(middleStartPos, middleEndPos, "\n");

      return {
        from: change.from,
        to: oldChange.to,
        removed: (change.removed.join("\n") + middle + oldChange.removed.join("\n")).split("\n"),
        text: (change.text.join("\n") + middle + oldChange.text.join("\n")).split("\n"),
        origin: oldChange.origin
      };
    } else {
      // The old change precedes the new change
      if (!rangeIsAfterInclusive(change, affectedMiddle)) console.error("RANGE WAS NOT AFTER");

      // Convert change.to to the "orig" coordinate system. This will be the "to" of the composed change
      let finalTo = convertPointToBeforeChange(change.to, oldChange);
      // Find the middle piece
      let middleStartPos = affectedMiddle.to;
      let middleEndPos = change.from;
      let middle = cm.getRange(middleStartPos, middleEndPos, "\n");

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

function rangesOverlap(range1: FromTo, range2: FromTo): boolean {
  if (rangeIsAfterInclusive(range2, range1)) return false;
  if (rangeIsAfterInclusive(range1, range2)) return false;
  return true;
}

function rangeIsAfterInclusive(range1: FromTo, range2: FromTo): boolean {
  return posCmp(range2.to, range1.from) <= 0; // TODO: check this
}

// Return true if range2 is completely contained within range1
function rangeContains(range1: FromTo, range2: FromTo): boolean {
  return posInsideRangeInclusive(range2.from, range1) && posInsideRangeInclusive(range2.to, range1);
}

function joinWithoutNewlines(list1: string[], list2: string[]): string[] {
  let ret = list1.slice(0, list1.length - 1);

  ret.push(last(list1) + list2[0]);

  ret.push(...list2.slice(1));

  return ret;
}

function splitTextAt(text: string[], line: number, ch: number): [string[], string[]] {
  let firstPart = [...text.slice(0, line),
                   text[line].slice(0, ch)];

  let secondPart = [text[line].slice(ch),
                    ...text.slice(line + 1)];

  return [firstPart, secondPart];
}

function splitTextByPositionDifference(text: string[], furtherPos: CodeMirror.Position, earlierPos: CodeMirror.Position): [string[], string[]] {
  return splitTextAt(text,
                     furtherPos.line - earlierPos.line,
                     furtherPos.line === earlierPos.line ? furtherPos.ch - earlierPos.ch : furtherPos.ch);
}
