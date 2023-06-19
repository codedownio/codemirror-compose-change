
import {makeRandomEditAndGetChange, setRandomContent} from "./RandomEdits";
import {testChanges} from "./TestCore";
import {getCodeMirror} from "./Util";


const numRepeats = 50;
const delay = 1000;

async function runRandomTest() {
  let cm = getCodeMirror();

  // Fill in random content
  setRandomContent(cm);
  // setAlphabeticalContent(cm);
  let originalContent = cm.getValue();

  const change1 = await makeRandomEditAndGetChange(cm, delay);
  const change2 = await makeRandomEditAndGetChange(cm, delay);

  window["lastChange1"] = change1;
  window["lastChange2"] = change2;
  testChanges(cm, originalContent, change1, change2);
}

describe("Dummy test", () => {
  it("Runs random tests", async () => {
    for (let i = 0; i < numRepeats; i += 1) {
      console.log("Test repeats: " + i);

      await runRandomTest();
    }
  });
});


// Load the script in a browser and use the static methods on this class to run tests
// import {runAll} from "./FixedTests";
// import {makeRandomEditAndGetChange, setAlphabeticalContent, setRandomContent} from "./RandomEdits";
// import {testChanges} from "./TestCore";
// import {getCodeMirror} from "./Util";
// Keep this commented when building dist so test stuff doesn't end up in the bundle
// export class TestRunner {
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
