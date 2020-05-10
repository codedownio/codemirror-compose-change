"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CoordinateChanges = require("./CoordinateChanges");
var ComposeChanges = require("./ComposeChanges");
exports.composeChanges = ComposeChanges.composeChanges;
exports.preEditToPostEditChangeRange = CoordinateChanges.preEditToPostEditChangeRange;
exports.convertPointToAfterChange = CoordinateChanges.convertPointToAfterChange;
exports.convertPointToBeforeChange = CoordinateChanges.convertPointToBeforeChange;
exports.default = exports.composeChanges;
//# sourceMappingURL=codemirror-compose-change.js.map