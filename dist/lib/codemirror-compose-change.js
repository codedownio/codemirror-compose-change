"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseApplyChange = exports.preEditToPostEditChangeRange = exports.convertPointToAfterChange = exports.convertPointToBeforeChange = exports.applyChange = exports.composeChanges = void 0;
var ComposeChanges_1 = require("./ComposeChanges");
Object.defineProperty(exports, "composeChanges", { enumerable: true, get: function () { return ComposeChanges_1.composeChanges; } });
var CoordinateChanges_1 = require("./CoordinateChanges");
Object.defineProperty(exports, "applyChange", { enumerable: true, get: function () { return CoordinateChanges_1.applyChange; } });
Object.defineProperty(exports, "convertPointToBeforeChange", { enumerable: true, get: function () { return CoordinateChanges_1.convertPointToBeforeChange; } });
Object.defineProperty(exports, "convertPointToAfterChange", { enumerable: true, get: function () { return CoordinateChanges_1.convertPointToAfterChange; } });
Object.defineProperty(exports, "preEditToPostEditChangeRange", { enumerable: true, get: function () { return CoordinateChanges_1.preEditToPostEditChangeRange; } });
Object.defineProperty(exports, "reverseApplyChange", { enumerable: true, get: function () { return CoordinateChanges_1.reverseApplyChange; } });
//# sourceMappingURL=codemirror-compose-change.js.map