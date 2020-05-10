
const CodeMirror = require("codemirror");

console.log("CodeMirror is", CodeMirror);

// export function getCodeMirror(): CodeMirror.Doc {
//   let elem: any = document.querySelector(".CodeMirror");
//   if (!elem) throw new Error("Couldn't find CodeMirror elem");

//   if (!elem["CodeMirror"]) throw new Error("Couldn't find CodeMirror");
//   return elem["CodeMirror"];
// }


export function getCodeMirror(): CodeMirror.Doc {
  let parent: HTMLDivElement = document.createElement("div");
  let elem: HTMLTextAreaElement = document.createElement("textarea");

  parent.appendChild(elem);

  window.HTMLElement.prototype.getBoundingClientRect = function () {
    return {
      width: 400,
      height: 400,
      top: 0,
      left: 0
    }
  }

  Object.defineProperties(window.HTMLElement.prototype, {
    offsetWidth: {
      get () { return 400; }
    },
    offsetHeight: {
      get () { return 400; }
    },
    offsetTop: {
      get () { return 0; }
    },
    offsetLeft: {
      get () { return 0; }
    }
  })

  let cm = CodeMirror.fromTextArea(elem);

  return cm;
}
