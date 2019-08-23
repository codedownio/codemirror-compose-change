/// <reference types="codemirror" />
export declare function makeRandomEditAndGetChange(cm: CodeMirror.Doc, delayMs?: number): Promise<CodeMirror.EditorChange>;
export declare function setRandomContent(cm: CodeMirror.Doc): void;
export declare function setAlphabeticalContent(cm: CodeMirror.Doc): void;
