
export function randomString(length: number, chars="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  let result = "";
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function getCodeMirror(): CodeMirror.Doc {
  let elem: any = document.querySelector(".CodeMirror");
  if (!elem) throw new Error("Couldn't find CodeMirror elem");

  if (!elem["CodeMirror"]) throw new Error("Couldn't find CodeMirror");
  return elem["CodeMirror"];
}
