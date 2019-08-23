/// <reference types="codemirror" />
export declare function posCmp(a: CodeMirror.Position, b: CodeMirror.Position): number;
export declare function posInsideRange(pos: CodeMirror.Position, range: FromTo): boolean;
export declare function posInsideRangeInclusive(pos: CodeMirror.Position, range: FromTo): boolean;
export declare function rangesEqual(range1: FromTo, range2: FromTo): boolean;
export declare function randomString(length: number, chars?: string): string;
export declare function getCodeMirror(): CodeMirror.Doc;
