
import {setAlphabeticalContent} from "./RandomEdits";
import {testChanges} from "./TestCore";
import {getCodeMirror} from "./Util";

import {applyChange} from "../src/codemirror-compose-change";


function testSpecificChanges(change1: CodeMirror.EditorChange, change2: CodeMirror.EditorChange) {
  let cm = getCodeMirror();

  setAlphabeticalContent(cm);

  let originalContent = cm.getValue();

  applyChange(cm, change1);
  applyChange(cm, change2);

  testChanges(cm, originalContent, change1, change2);
}

it("example 1", () => {
  let change1 = {
    from: { line: 7, ch: 3 },
    to: { line: 10, ch: 0 },
    text: [""],
    removed: ["hh", "iiiii", "jjjjj", ""],
    origin: "whatever"
  };

  let change2 = {
    from: { line: 0, ch: 3 },
    to: { line: 2, ch: 0 },
    text: [""],
    removed: ["aa", "bbbbb", ""],
    origin: "whatever"
  };

  testSpecificChanges(change1, change2);
});

// function testExample2() {
//   let change1 = {
//     from: { line: 7, ch: 5 },
//     to: { line: 9, ch: 5 },
//     text: [""],
//     removed: ["", "iiiii", "jjjjj"]
//   };

//   let change2 = {
//     from: { line: 6, ch: 3 },
//     to: { line: 7, ch: 1 },
//     text: [""],
//     removed: ["gg", "h" ]
//   };

//   testSpecificChanges(change1, change2);
// }

// function testExample3() {
//   let change1 = {
//     from: { line: 0, ch: 2 },
//     to: { line: 6, ch: 1 },
//     "text": [""],
//     "removed": [
//       "aaa",
//       "bbbbb",
//       "ccccc",
//       "ddddd",
//       "eeeee",
//       "fffff",
//       "g"
//     ]
//   };

//   let change2 = {
//     from: { line: 0, ch: 5 },
//     to: { line: 3, ch: 5 },
//     "text": [""],
//     "removed": [
//       "g",
//       "hhhhh",
//       "iiiii",
//       "jjjjj"
//     ]
//   };

//   testSpecificChanges(change1, change2);
// }

// export function testExample4() {
//   let change1 = {
//     from: { line: 3, ch: 0 },
//     to: { line: 6, ch: 4 },
//     text: [""],
//     removed: [
//       "ddddd",
//       "eeeee",
//       "fffff",
//       "gggg"
//     ]
//   };

//   let change2 = {
//     from: { line: 0, ch: 1 },
//     to: { line: 6, ch: 3 },
//     text: [""],
//     removed: [
//       "aaaa",
//       "bbbbb",
//       "ccccc",
//       "g",
//       "hhhhh",
//       "iiiii",
//       "jjj"
//     ]
//   };

//   testSpecificChanges(change1, change2);
// }

// export function testExample5() {
//   let change1 = {
//     from: { line: 1, ch: 1 },
//     to: { line: 2, ch: 0 },
//     text: [""],
//     "removed": [
//       "bbbb",
//       ""
//     ]
//   };

//   let change2 = {
//     from: { line: 0, ch: 4 },
//     to: { line: 5, ch: 1 },
//     text: [""],
//     "removed": [
//       "a",
//       "bccccc",
//       "ddddd",
//       "eeeee",
//       "fffff",
//       "g"
//     ]
//   };

//   testSpecificChanges(change1, change2);
// }

// export function testExample6() {
//   let change1 = {
//     from: { line: 0, ch: 4 },
//     to: { line: 5, ch: 4 },
//     text: [""],
//     removed: [
//       "a",
//       "bbbbb",
//       "ccccc",
//       "ddddd",
//       "eeeee",
//       "ffff"
//     ]
//   };

//   let change2 = {
//     from: { line: 0, ch: 1 },
//     to: { line: 1, ch: 2 },
//     text: [""],
//     removed: [
//       "aaaf",
//       "gg"
//     ]
//   }

//   testSpecificChanges(change1, change2);
// }

// export function testExample7() {
//   let change1 = {
//     from: { line: 0, ch: 5 },
//     to: { line: 8, ch: 1 },
//     text: [""],
//     removed: [
//       "",
//       "bbbbb",
//       "ccccc",
//       "ddddd",
//       "eeeee",
//       "fffff",
//       "ggggg",
//       "hhhhh",
//       "i"
//     ]
//   };

//   let change2 = {
//     from: { line: 0, ch: 1 },
//     to: { line: 0, ch: 8 },
//     text: [""],
//     removed: [
//       "aaaaiii"
//     ]
//   };

//   testSpecificChanges(change1, change2);
// }

// export function testExample8() {
//   let change1 = {
//     from: { line: 0, ch: 5 },
//     to: { line: 2, ch: 4 },
//     text: [
//       "",
//       "zwyw",
//       "",
//       "wwy"
//     ],
//     removed: [
//       "",
//       "bbbbb",
//       "cccc"
//     ]
//   };

//   let change2 = {
//     from: { line: 1, ch: 2 },
//     to: { line: 1, ch: 3 },
//     text: [
//       "",
//       "ww",
//       "zzyy",
//       "x"
//     ],
//     removed: [
//       "y"
//     ]
//   };

//   testSpecificChanges(change1, change2);
// }

// export function testExample9() {
//   let change1 = {
//     from: { line: 0, ch: 0 },
//     to: { line: 9, ch: 3 },
//     text: [
//       "wz"
//     ],
//     removed: [
//       "aaaaa",
//       "bbbbb",
//       "ccccc",
//       "ddddd",
//       "eeeee",
//       "fffff",
//       "ggggg",
//       "hhhhh",
//       "iiiii",
//       "jjj"
//     ]
//   };

//   let change2 = {
//     from: { line: 0, ch: 1 },
//     to: { line: 0, ch: 3 },
//     text: [
//       "z",
//       "",
//       ""
//     ],
//     removed: [
//       "zj"
//     ]
//   };

//   testSpecificChanges(change1, change2);
// }
