import * as keyEvents from "./editorKeyEvents";
import { isPlatformWindows } from "./helper";

const handlePressHotkey = (type, content) => {
  const { markdownEditor } = content;
  const selection = markdownEditor.getSelection();
  switch (type) {
    case "Bold":
      keyEvents.bold(markdownEditor, selection);
      break;
    case "Del":
      keyEvents.del(markdownEditor, selection);
      break;
    case "Italic":
      keyEvents.italic(markdownEditor, selection);
      break;
    case "Code":
      keyEvents.code(markdownEditor, selection);
      break;
    case "InlineCode":
      keyEvents.inlineCode(markdownEditor, selection);
      break;
    case "H1":
      keyEvents.h1(markdownEditor, selection);
      break;
    case "H2":
      keyEvents.h2(markdownEditor, selection);
      break;
    case "H3":
      keyEvents.h3(markdownEditor, selection);
      break;
    case "H4":
      keyEvents.h4(markdownEditor, selection);
      break;
    case "H5":
      keyEvents.h5(markdownEditor, selection);
      break;
    case "H6":
      keyEvents.h6(markdownEditor, selection);
      break;
    case "Underline":
      keyEvents.underline(markdownEditor, selection);
      break;
    case "Quote":
      keyEvents.quote(markdownEditor, selection);
      break;
    case "OrderedList":
      keyEvents.orderedList(markdownEditor, selection);
      break;
    case "UnorderedList":
      keyEvents.unorderedList(markdownEditor, selection);
      break;
    case "HorizontalRule":
      keyEvents.horizontalRule(markdownEditor, selection);
      break;
    case "Table":
      keyEvents.table(markdownEditor, selection);
      break;
    case "InlineMath":
      keyEvents.inlineMath(markdownEditor, selection);
      break;
    case "MathBlock":
      keyEvents.mathBlock(markdownEditor, selection);
      break;
    default:
      return;
  }

  const editorContent = markdownEditor.getValue();
  content.setContent(editorContent);
};

const bindHotkeys = (content, dialog) =>
  isPlatformWindows
    ? {
      "Ctrl-B": () => {
        handlePressHotkey("Bold", content);
      },
      "Ctrl-U": () => {
        handlePressHotkey("Del", content);
      },
      "Ctrl-I": () => {
        handlePressHotkey("Italic", content);
      },
      "Ctrl-Alt-C": () => {
        handlePressHotkey("Code", content);
      },
      "Ctrl-Alt-V": () => {
        handlePressHotkey("InlineCode", content);
      },
      "Ctrl-Alt-1": () => {
        handlePressHotkey("H1", content);
      },
      "Ctrl-Alt-2": () => {
        handlePressHotkey("H2", content);
      },
      "Ctrl-Alt-3": () => {
        handlePressHotkey("H3", content);
      },
      "Ctrl-Alt-4": () => {
        handlePressHotkey("H4", content);
      },
      "Ctrl-Alt-5": () => {
        handlePressHotkey("H5", content);
      },
      "Ctrl-Alt-6": () => {
        handlePressHotkey("H6", content);
      },
      "Ctrl-Shift-U": () => {
        handlePressHotkey("Underline", content);
      },
      "Ctrl-Shift-Q": () => {
        handlePressHotkey("Quote", content);
      },
      "Ctrl-Shift-O": () => {
        handlePressHotkey("OrderedList", content);
      },
      "Ctrl-Shift-L": () => {
        handlePressHotkey("UnorderedList", content);
      },
      "Ctrl-Shift-H": () => {
        handlePressHotkey("HorizontalRule", content);
      },
      "Ctrl-Shift-T": () => {
        handlePressHotkey("Table", content);
      },
      "Ctrl-Shift-M": () => {
        handlePressHotkey("InlineMath", content);
      },
      "Ctrl-Shift-B": () => {
        handlePressHotkey("MathBlock", content);
      },
      "Ctrl-K": () => {
        dialog.setLinkOpen(true);
      },
      "Ctrl-Alt-I": () => {
        dialog.setImageOpen(true);
      },
      "Ctrl-Alt-T": () => {
        dialog.setFormOpen(true);
      },
      "Ctrl-Alt-S": () => {
        // Converting between sans serif and serif
      },
      "Ctrl-Alt-L": () => {
        keyEvents.parseLinkToFoot(content.content, content);
      },
      "Ctrl-Alt-F": () => {
        keyEvents.formatDoc(content.content, content);
      },
      "Ctrl-F": () => {
        dialog.setSearchOpen(!dialog.isSearchOpen);
      },
    }
    : {
      "Cmd-B": () => {
        handlePressHotkey("Bold", content);
      },
      "Cmd-U": () => {
        handlePressHotkey("Del", content);
      },
      "Cmd-I": () => {
        handlePressHotkey("Italic", content);
      },
      "Cmd-Alt-C": () => {
        handlePressHotkey("Code", content);
      },
      "Cmd-Alt-V": () => {
        handlePressHotkey("InlineCode", content);
      },
      "Cmd-Alt-1": () => {
        handlePressHotkey("H1", content);
      },
      "Cmd-Alt-2": () => {
        handlePressHotkey("H2", content);
      },
      "Cmd-Alt-3": () => {
        handlePressHotkey("H3", content);
      },
      "Cmd-Alt-4": () => {
        handlePressHotkey("H4", content);
      },
      "Cmd-Alt-5": () => {
        handlePressHotkey("H5", content);
      },
      "Cmd-Alt-6": () => {
        handlePressHotkey("H6", content);
      },
      "Cmd-Shift-U": () => {
        handlePressHotkey("Underline", content);
      },
      "Cmd-Shift-Q": () => {
        handlePressHotkey("Quote", content);
      },
      "Cmd-Shift-O": () => {
        handlePressHotkey("OrderedList", content);
      },
      "Cmd-Shift-L": () => {
        handlePressHotkey("UnorderedList", content);
      },
      "Cmd-Shift-H": () => {
        handlePressHotkey("HorizontalRule", content);
      },
      "Cmd-Shift-T": () => {
        handlePressHotkey("Table", content);
      },
      "Cmd-Shift-M": () => {
        handlePressHotkey("InlineMath", content);
      },
      "Cmd-Shift-B": () => {
        handlePressHotkey("MathBlock", content);
      },
      "Cmd-K": () => {
        dialog.setLinkOpen(true);
      },
      "Cmd-Alt-I": () => {
        dialog.setImageOpen(true);
      },
      "Cmd-Alt-T": () => {
        dialog.setFormOpen(true);
      },
      "Cmd-Alt-S": () => {
        // Converting between sans serif and serif
      },
      "Cmd-Alt-L": () => {
        keyEvents.parseLinkToFoot(content.content, content);
      },
      "Cmd-Alt-F": () => {
        keyEvents.formatDoc(content.content, content);
      },
      "Cmd-F": () => {
        dialog.setSearchOpen(!dialog.isSearchOpen);
      },
    };

export const hotKeys = isPlatformWindows
  ? {
    bold: "Ctrl+B",
    del: "Ctrl+U",
    italic: "Ctrl+I",
    code: "Ctrl+Alt+C",
    inlineCode: "Ctrl+Alt+V",
    h1: "Ctrl+Alt+1",
    h2: "Ctrl+Alt+2",
    h3: "Ctrl+Alt+3",
    h4: "Ctrl+Alt+4",
    h5: "Ctrl+Alt+5",
    h6: "Ctrl+Alt+6",
    underline: "Ctrl+Shift+U",
    quote: "Ctrl+Shift+Q",
    orderedList: "Ctrl+Shift+O",
    unorderedList: "Ctrl+Shift+L",
    horizontalRule: "Ctrl+Shift+H",
    table: "Ctrl+Shift+T",
    inlineMath: "Ctrl+Shift+M",
    mathBlock: "Ctrl+Shift+B",
    link: "Ctrl+K",
    image: "Ctrl+Alt+I",
    form: "Ctrl+Alt+T",
    format: "Ctrl+Alt+F",
    linkToFoot: "Ctrl+Alt+L",
    search: "Ctrl+F",
  }
  : {
    bold: "⌘B",
    del: "⌘U",
    italic: "⌘I",
    code: "⌥⌘C",
    inlineCode: "⌥⌘V",
    h1: "⌥⌘1",
    h2: "⌥⌘2",
    h3: "⌥⌘3",
    h4: "⌥⌘4",
    h5: "⌥⌘5",
    h6: "⌥⌘6",
    underline: "⇧⌘U",
    quote: "⇧⌘Q",
    orderedList: "⇧⌘O",
    unorderedList: "⇧⌘L",
    horizontalRule: "⇧⌘H",
    table: "⇧⌘T",
    inlineMath: "⇧⌘M",
    mathBlock: "⇧⌘B",
    link: "⌘K",
    image: "⌥⌘I",
    form: "⌥⌘T",
    format: "⌥⌘F",
    linkToFoot: "⌥⌘L",
    search: "⌘F",
  };

export const betterTab = (cm) => {
  if (cm.somethingSelected()) {
    cm.indentSelection("add");
  } else {
    cm.replaceSelection(
      cm.getOption("indentWithTabs") ? "\t" : Array(cm.getOption("indentUnit") + 1).join(" "),
      "end",
      "+input",
    );
  }
};

export const rightClick = (cm) => {
  const ele = document.getElementById("nice-md-editor");
  ele.oncontextmenu = (e) => {
    const element = document.getElementById("nice-editor-menu");
    element.style.display = "block";
    // event--ie  ev--其他浏览器
    const oEvent = window.event || window.ev;
    // documentElement--其他游览器    body--谷歌
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 菜单的style样式跟随鼠标的位置
    element.style.top = oEvent.clientY + scrollTop + "px";
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    element.style.left = oEvent.clientX + scrollLeft + "px";
    return false;
  };
  window.onclick = (e) => {
    const element = document.getElementById("nice-editor-menu");
    element.style.display = "none";
  };
};
export default bindHotkeys;
