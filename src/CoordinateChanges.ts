
import {last} from "lodash-es";

import {FromTo} from "./Types";
import {posCmp} from "./Util";

export function convertPointToBeforeChange(point: CodeMirror.Position, change: CodeMirror.EditorChange): CodeMirror.Position | null {
  let linesInserted = change.text.length - change.removed.length;
  let line = point.line - linesInserted;

  let postEditChangeRange = preEditToPostEditChangeRange(change);

  if (point.line > postEditChangeRange.to.line) {
    return {line, ch: point.ch};
  } else if (point.line === postEditChangeRange.to.line) {
    // Since we're undoing this change, we think of it as first removing change.text,
    // then inserting change.removed. Hence,
    let removed = change.text;
    let inserted = change.removed;

    return {
      line,
      ch: point.ch + adjustCh(change, removed, inserted)
    };
  } else if (posCmp(point, change.from) < 0) {
    // Tried to convert point to before change but it was before change.from
    return point;
  } else {
    // Tried to transform point that was inside of change
    return null;
  }
}

export function convertPointToAfterChange(point: CodeMirror.Position, change: CodeMirror.EditorChange): CodeMirror.Position | null {
  let linesInserted = change.text.length - change.removed.length;
  let line = point.line + linesInserted;

  if (point.line > change.to.line) {
    return {line, ch: point.ch};
  } else if (point.line === change.to.line) {
    return {
      line,
      ch: point.ch + adjustCh(change, change.removed, change.text)
    };
  } else if (posCmp(point, change.from) < 0) {
    // Tried to convert point to after change but it was before change.from
    return point;
  } else {
    // Point was inside of change
    return null;
  }
}

function adjustCh(change: CodeMirror.EditorChange, removed: string[], inserted: string[]): number {
  let ch = 0;

  if (removed.length === 1 && inserted.length > 1) {
    // Single remove multiple insert
    ch -= last(removed).length;
    ch += last(inserted).length;
    ch -= change.from.ch;
  } else if (removed.length === 1 && inserted.length === 1) {
    // Single remove single insert
    ch -= last(removed).length;
    ch += last(inserted).length;
  } else if (removed.length > 1 && inserted.length === 1) {
    // Multiple remove single insert
    // If multiple lines were removed, and only one was added, then ch gets bumped forward by change.from.ch
    ch -= last(removed).length;
    ch += last(inserted).length;
    ch += change.from.ch;
  } else if (removed.length > 1 && inserted.length > 1) {
    // Multiple remove multiple insert
    ch -= last(removed).length;
    ch += last(inserted).length;
  }

  return ch;
}

export function preEditToPostEditChangeRange(change: CodeMirror.EditorChange): FromTo {
  let line = change.from.line + change.text.length - 1;

  let ch: number;
  if (change.text.length === 1) {
    ch = change.from.ch + last(change.text).length;
  } else {
    ch = last(change.text).length;
  }

  let to = {line, ch};

  return {
    from: change.from,
    to
  };
}

export function applyChange(cm: CodeMirror.Doc, change: CodeMirror.EditorChange) {
  cm.replaceRange(change.text.join("\n"), change.from, change.to);
}

export function reverseApplyChange(cm: CodeMirror.Doc, change: CodeMirror.EditorChange) {
  let postEditChangeRange = preEditToPostEditChangeRange(change);

  // Want (0, 2) to (1, 1)
  console.log("postEditChangeRange in reverseApplyChange", postEditChangeRange);

  cm.replaceRange(change.removed.join("\n"), postEditChangeRange.from, postEditChangeRange.to);
}
