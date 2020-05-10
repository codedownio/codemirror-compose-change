
import {composeChanges} from "../src/ComposeChanges";
import {applyChange, reverseApplyChange} from "../src/CoordinateChanges";

export function testChanges(cm: CodeMirror.Doc, originalContent: string, change1: CodeMirror.EditorChange, change2: CodeMirror.EditorChange) {
  console.log("Got changes 1 and 2", change1, change2);

  let finalContent = cm.getValue();

  let composedChange = composeChanges(cm, change1, change2);
  console.log("Composed change is", composedChange);

  // Reverse the composed change and make sure it matches the original
  reverseApplyChange(cm, composedChange);
  let reversedContent = cm.getValue();
  if (originalContent === reversedContent) {
    console.log("Reversed success!");
  } else {
    console.error("Reversed content didn't match", JSON.stringify(originalContent), JSON.stringify(reversedContent));
    cm.setValue(finalContent);
    return;
  }

  // Re-apply the composed change and make sure we go back to the final
  applyChange(cm, composedChange);
  let reappliedContent = cm.getValue();
  if (finalContent === reappliedContent) {
    console.log("Re-applied success!");
  } else {
    console.error("Re-applied content didn't match", JSON.stringify(finalContent), JSON.stringify(reappliedContent));
    cm.setValue(finalContent);
    return;
  }
}
