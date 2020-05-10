
import {FromTo} from "./Types";

// Return negative / 0 / positive.  a < b iff posCmp(a, b) < 0 etc.
export function posCmp(a: CodeMirror.Position, b: CodeMirror.Position) {
  return (a.line - b.line) || (a.ch - b.ch);
}

// True if inside, false if on edge.
export function posInsideRange(pos: CodeMirror.Position, range: FromTo) {
  return posCmp(range.from, pos) < 0 && posCmp(pos, range.to) < 0;
}

export function posInsideRangeInclusive(pos: CodeMirror.Position, range: FromTo) {
  return posCmp(range.from, pos) <= 0 && posCmp(pos, range.to) <= 0;
}

export function rangesEqual(range1: FromTo, range2: FromTo) {
  return (posCmp(range1.from, range2.from) === 0) && (posCmp(range1.to, range2.to) === 0);
}

export function randomString(length: number, chars="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  let result = "";
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function last(x: any[]) {
  return x[x.length - 1];
}
