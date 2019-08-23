"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComposeChanges_1 = require("./ComposeChanges");
var CoordinateChanges_1 = require("./CoordinateChanges");
function testChanges(cm, originalContent, change1, change2) {
    console.log("Got changes 1 and 2", change1, change2);
    var finalContent = cm.getValue();
    var composedChange = ComposeChanges_1.composeChanges(cm, change1, change2);
    console.log("Composed change is", composedChange);
    // Reverse the composed change and make sure it matches the original
    CoordinateChanges_1.reverseApplyChange(cm, composedChange);
    var reversedContent = cm.getValue();
    if (originalContent === reversedContent) {
        console.log("Reversed success!");
    }
    else {
        console.error("Reversed content didn't match", JSON.stringify(originalContent), JSON.stringify(reversedContent));
        cm.setValue(finalContent);
        return;
    }
    // Re-apply the composed change and make sure we go back to the final
    CoordinateChanges_1.applyChange(cm, composedChange);
    var reappliedContent = cm.getValue();
    if (finalContent === reappliedContent) {
        console.log("Re-applied success!");
    }
    else {
        console.error("Re-applied content didn't match", JSON.stringify(finalContent), JSON.stringify(reappliedContent));
        cm.setValue(finalContent);
        return;
    }
}
exports.testChanges = testChanges;
//# sourceMappingURL=TestCore.js.map