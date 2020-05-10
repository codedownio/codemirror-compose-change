
import * as CoordinateChanges from "./CoordinateChanges";
import * as ComposeChanges from "./ComposeChanges";

export const composeChanges = ComposeChanges.composeChanges;
export const preEditToPostEditChangeRange = CoordinateChanges.preEditToPostEditChangeRange;
export const convertPointToAfterChange = CoordinateChanges.convertPointToAfterChange;
export const convertPointToBeforeChange = CoordinateChanges.convertPointToBeforeChange;

export default composeChanges;
