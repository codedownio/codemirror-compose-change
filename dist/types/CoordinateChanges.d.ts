/// <reference types="codemirror" />
import { FromTo } from "./Types";
export declare function convertPointToBeforeChange(point: CodeMirror.Position, change: CodeMirror.EditorChange): CodeMirror.Position;
export declare function convertPointToAfterChange(point: CodeMirror.Position, change: CodeMirror.EditorChange): CodeMirror.Position;
export declare function preEditToPostEditChangeRange(change: CodeMirror.EditorChange): FromTo;
export declare function applyChange(cm: CodeMirror.Doc, change: CodeMirror.EditorChange): void;
export declare function reverseApplyChange(cm: CodeMirror.Doc, change: CodeMirror.EditorChange): void;
