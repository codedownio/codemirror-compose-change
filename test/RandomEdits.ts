
import {isEqual} from "lodash";

import {randomString} from "./Util";

export function makeRandomEditAndGetChange(cm: CodeMirror.Doc, delayMs = 0): Promise<CodeMirror.EditorChange> {
  if (cm.getValue().length === 0) {
    console.error("Editor was empty; unable to make an edit");
    return Promise.resolve({
      from: {line: 0, ch: 0},
      to: {line: 0, ch: 0},
      text: [""],
      removed: [""],
      origin: "random_edit_error"
    });
  }

  return new Promise((resolve, reject) => {
    let onChange = (cm: CodeMirror.Editor, change: CodeMirror.EditorChange) => {
      resolve(change);
      cm.off("change", onChange);
    }

    (cm as any).on("change", onChange);

    let pos1 = getRandomPosition(cm);
    let pos2 = getRandomPosition(cm);
    while (isEqual(pos2, pos1)) pos2 = getRandomPosition(cm);

    let replaceWith = randomString(Math.round(Math.random() * 10), "wxyz\n");
    // let replaceWith = "";

    cm.setSelection(pos1, pos2);

    setTimeout(() => {
      cm.replaceRange(replaceWith, pos1, pos2);
    }, delayMs)
  });
}

function getRandomPosition(cm: CodeMirror.Doc): CodeMirror.Position {
  let line = Math.round(Math.random() * cm.lineCount() - 1);
  if (line < 0) line = 0;
  if (line >= cm.lineCount()) line = cm.lineCount() - 1;

  let lineContent = cm.getLine(line);
  let ch = Math.round(Math.random() * lineContent.length);
  return {line, ch};
}

export function setRandomContent(cm: CodeMirror.Doc) {
  (cm as any).operation(() => {
    cm.setValue("");
    for (let line = 0; line < 25; line += 1) {
      let lineLength = Math.round(Math.random() * 20);
      let contents = randomString(lineLength, "abcdef");

      let pos = {line, ch: cm.getLine(line).length}
      cm.replaceRange(contents + "\n", pos, pos);
    }
  });
}

export function setAlphabeticalContent(cm: CodeMirror.Doc) {
  (cm as any).operation(() => {
    cm.setValue("");
    for (let line = 0; line < 10; line += 1) {
      let letter = String.fromCharCode(97 + line);
      let contents = "";
      let lineLength = 5;
      for (let i = 0; i < lineLength; i++) contents += letter;

      let pos = {line, ch: cm.getLine(line).length}
      cm.replaceRange(contents + "\n", pos, pos);
    }
  });
}
