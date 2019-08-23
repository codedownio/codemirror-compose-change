/// <reference types="codemirror" />
/**
 * Given two changes, compose them to make another change that would have the exact same effect, if applied.
 * This is used to combine the changes produced by several OT operations into a single, more sensible change
 */
export declare function composeChanges(cm: CodeMirror.Doc, oldChange: CodeMirror.EditorChange, change: CodeMirror.EditorChange): CodeMirror.EditorChange;
