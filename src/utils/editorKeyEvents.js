import { message } from "antd";
import prettier from "prettier/standalone";
import prettierMarkdown from "prettier/parser-markdown";

const wrapChar = /windows|win32/i.test(navigator.userAgent) ? "\r\n" : "\n";

const handleWechatOuterLink = (content) => {
  const linkImgReg = /(!)*\[.*?\]\(((?!mp.weixin.qq.com).)*?\)/g;
  const res = content.match(linkImgReg); // 匹配到图片、链接和脚注

  if (res === null) {
    return content;
  }

  const footReg = /.*?\(.*?"(.*?)".*?\)/;
  const filterRes = res.filter((val) => {
    const comment = val.match(footReg);
    if (val[0] === "!") {
      return false;
    }
    if (comment && comment[1] !== "") {
      return false;
    }
    return true;
  }); // 过滤掉图片和脚注

  if (filterRes.length > 0) {
    filterRes.forEach((val) => {
      const linkReg = /\[(.*?)\]\((.*?)\)/; // 匹配链接中具体的值
      const matchValue = val.match(linkReg);
      const name = matchValue[1];
      const url = matchValue[2].trim();

      const newVal = `[${name}](${url} "${name}")`;
      content = content.replace(val, newVal);
    });
    return content;
  } else {
    return content;
  }
};

export const parseLinkToFoot = (content, store) => {
  content = handleWechatOuterLink(content);
  content = content.replace(/([\u4e00-\u9fa5])\$/g, "$1 $");
  content = content.replace(/\$([\u4e00-\u9fa5])/g, "$ $1");
  store.setContent(content);
  message.success("微信外链转脚注完成！");
};

const handlePrettierDoc = (content) => {
  const prettierRes = prettier.format(content, {
    parser: "markdown",
    plugins: [prettierMarkdown],
  });
  return prettierRes;
};

export const formatDoc = (content, store) => {
  content = handlePrettierDoc(content);
  content = content.replace(/([\u4e00-\u9fa5])\$/g, "$1 $");
  content = content.replace(/\$([\u4e00-\u9fa5])/g, "$ $1");
  store.setContent(content);
  message.success("格式化文档完成！");
};

// 辅助函数：检测文本是否包含特定格式，并返回清理后的文本
const detectAndRemoveFormat = (text, formatPattern, replacement = '$1') => {
  const matches = text.match(formatPattern);
  if (matches) {
    return {
      hasFormat: true,
      cleanText: text.replace(formatPattern, replacement)
    };
  }
  return {
    hasFormat: false,
    cleanText: text
  };
};

// 智能格式切换函数
const toggleInlineFormat = (editor, selection, startMark, endMark, formatPattern) => {
  if (selection) {
    // 检测选中文本是否已经有该格式
    const { hasFormat, cleanText } = detectAndRemoveFormat(selection, formatPattern);

    if (hasFormat) {
      // 如果已有格式，则移除
      editor.replaceSelection(cleanText);
    } else {
      // 如果没有格式，则添加
      editor.replaceSelection(`${startMark}${selection}${endMark}`);
    }
  } else {
    // 没有选中文本时，在当前位置插入格式标记
    const cursor = editor.getCursor();
    editor.replaceSelection(`${startMark}${endMark}`);
    // 将光标移动到格式标记中间
    const newCursor = { ...cursor, ch: cursor.ch + startMark.length };
    editor.setCursor(newCursor);
  }
};

export const bold = (editor, selection) => {
  const boldPattern = /^\*\*(.*?)\*\*$/;
  toggleInlineFormat(editor, selection, '**', '**', boldPattern);
};

export const del = (editor, selection) => {
  const delPattern = /^~~(.*?)~~$/;
  toggleInlineFormat(editor, selection, '~~', '~~', delPattern);
};

export const italic = (editor, selection) => {
  const italicPattern = /^\*(.*?)\*$/;
  toggleInlineFormat(editor, selection, '*', '*', italicPattern);
};

export const code = (editor, selection) => {
  editor.replaceSelection(`${wrapChar}\`\`\`${wrapChar}${selection}${wrapChar}\`\`\`${wrapChar}`);
  const cursor = editor.getCursor();
  cursor.line -= 2;
  editor.setCursor(cursor);
};

export const inlineCode = (editor, selection) => {
  const codePattern = /^`(.*?)`$/;
  toggleInlineFormat(editor, selection, '`', '`', codePattern);
};

// 辅助函数：获取当前行的内容和位置信息
const getCurrentLineInfo = (editor) => {
  const cursor = editor.getCursor();
  const lineNumber = cursor.line;
  const lineContent = editor.getLine(lineNumber);
  const lineStart = { line: lineNumber, ch: 0 };
  const lineEnd = { line: lineNumber, ch: lineContent.length };

  return {
    lineNumber,
    lineContent,
    lineStart,
    lineEnd,
    cursor
  };
};

// 辅助函数：检测当前行是否为标题，并返回标题级别和内容
const detectHeadingLevel = (lineContent) => {
  const headingMatch = lineContent.match(/^(#{1,6})\s*(.*)/);
  if (headingMatch) {
    return {
      level: headingMatch[1].length,
      content: headingMatch[2],
      isHeading: true
    };
  }
  return {
    level: 0,
    content: lineContent.trim(),
    isHeading: false
  };
};

// 辅助函数：检测和移除其他格式（粗体、斜体、删除线等）
const removeInlineFormatting = (text) => {
  // 移除粗体格式
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  // 移除斜体格式
  text = text.replace(/\*(.*?)\*/g, '$1');
  // 移除删除线格式
  text = text.replace(/~~(.*?)~~/g, '$1');
  // 移除行内代码格式
  text = text.replace(/`(.*?)`/g, '$1');
  // 移除下划线格式
  text = text.replace(/<u>(.*?)<\/u>/g, '$1');

  return text.trim();
};

// 智能标题设置函数
const setHeading = (editor, targetLevel) => {
  const { lineContent, lineStart, lineEnd, cursor } = getCurrentLineInfo(editor);
  const { level: currentLevel, content, isHeading } = detectHeadingLevel(lineContent);

  // 如果当前行已经是目标级别的标题，则移除标题格式
  if (isHeading && currentLevel === targetLevel) {
    const cleanContent = removeInlineFormatting(content);
    editor.replaceRange(cleanContent, lineStart, lineEnd);
    // 设置光标位置
    editor.setCursor({ line: cursor.line, ch: cleanContent.length });
  } else {
    // 获取纯文本内容（移除所有格式）
    const cleanContent = removeInlineFormatting(content);
    const newHeading = '#'.repeat(targetLevel) + ' ' + cleanContent;

    editor.replaceRange(newHeading, lineStart, lineEnd);
    // 设置光标位置到文本末尾
    editor.setCursor({ line: cursor.line, ch: newHeading.length });
  }
};

export const h1 = (editor, selection) => {
  if (selection) {
    // 如果有选中文本，直接替换为标题
    editor.replaceSelection(`# ${selection}`);
  } else {
    // 如果没有选中文本，智能处理当前行
    setHeading(editor, 1);
  }
};

export const h2 = (editor, selection) => {
  if (selection) {
    editor.replaceSelection(`## ${selection}`);
  } else {
    setHeading(editor, 2);
  }
};

export const h3 = (editor, selection) => {
  if (selection) {
    editor.replaceSelection(`### ${selection}`);
  } else {
    setHeading(editor, 3);
  }
};

export const h4 = (editor, selection) => {
  if (selection) {
    editor.replaceSelection(`#### ${selection}`);
  } else {
    setHeading(editor, 4);
  }
};

export const h5 = (editor, selection) => {
  if (selection) {
    editor.replaceSelection(`##### ${selection}`);
  } else {
    setHeading(editor, 5);
  }
};

export const h6 = (editor, selection) => {
  if (selection) {
    editor.replaceSelection(`###### ${selection}`);
  } else {
    setHeading(editor, 6);
  }
};

export const underline = (editor, selection) => {
  const underlinePattern = /^<u>(.*?)<\/u>$/;
  toggleInlineFormat(editor, selection, '<u>', '</u>', underlinePattern);
};

// 智能引用切换函数
const toggleQuote = (editor) => {
  const { lineContent, lineStart, lineEnd, cursor } = getCurrentLineInfo(editor);

  // 检测当前行是否为引用
  const quoteMatch = lineContent.match(/^>\s*(.*)/);

  if (quoteMatch) {
    // 如果是引用，则移除引用格式
    const content = quoteMatch[1];
    editor.replaceRange(content, lineStart, lineEnd);
    editor.setCursor({ line: cursor.line, ch: content.length });
  } else {
    // 如果不是引用，则添加引用格式
    const newContent = `> ${lineContent}`;
    editor.replaceRange(newContent, lineStart, lineEnd);
    editor.setCursor({ line: cursor.line, ch: newContent.length });
  }
};

export const quote = (editor, selection) => {
  if (selection) {
    // 如果有选中文本，检测是否已经是引用格式
    const lines = selection.split('\n');
    const isAllQuoted = lines.every(line => line.match(/^>\s*/));

    if (isAllQuoted) {
      // 如果全部都是引用，则移除引用格式
      const unquotedLines = lines.map(line => line.replace(/^>\s*/, '')).join('\n');
      editor.replaceSelection(unquotedLines);
    } else {
      // 如果不是全部引用，则添加引用格式
      const quotedLines = lines.map(line => `> ${line}`).join('\n');
      editor.replaceSelection(quotedLines);
    }
  } else {
    // 没有选中文本时，智能处理当前行
    toggleQuote(editor);
  }
};

// 智能有序列表切换函数
const toggleOrderedList = (editor) => {
  const { lineContent, lineStart, lineEnd, cursor } = getCurrentLineInfo(editor);

  // 检测当前行是否为有序列表
  const orderedListMatch = lineContent.match(/^\d+\.\s*(.*)/);

  if (orderedListMatch) {
    // 如果是有序列表，则移除列表格式
    const content = orderedListMatch[1];
    editor.replaceRange(content, lineStart, lineEnd);
    editor.setCursor({ line: cursor.line, ch: content.length });
  } else {
    // 如果不是有序列表，则添加列表格式
    const newContent = `1. ${lineContent}`;
    editor.replaceRange(newContent, lineStart, lineEnd);
    editor.setCursor({ line: cursor.line, ch: newContent.length });
  }
};

// 智能无序列表切换函数
const toggleUnorderedList = (editor) => {
  const { lineContent, lineStart, lineEnd, cursor } = getCurrentLineInfo(editor);

  // 检测当前行是否为无序列表
  const unorderedListMatch = lineContent.match(/^[-*+]\s*(.*)/);

  if (unorderedListMatch) {
    // 如果是无序列表，则移除列表格式
    const content = unorderedListMatch[1];
    editor.replaceRange(content, lineStart, lineEnd);
    editor.setCursor({ line: cursor.line, ch: content.length });
  } else {
    // 如果不是无序列表，则添加列表格式
    const newContent = `- ${lineContent}`;
    editor.replaceRange(newContent, lineStart, lineEnd);
    editor.setCursor({ line: cursor.line, ch: newContent.length });
  }
};

export const orderedList = (editor, selection) => {
  if (selection) {
    const lines = selection.split('\n');
    const isAllOrderedList = lines.every(line => line.match(/^\d+\.\s*/));

    if (isAllOrderedList) {
      // 如果全部都是有序列表，则移除列表格式
      const cleanLines = lines.map(line => line.replace(/^\d+\.\s*/, '')).join('\n');
      editor.replaceSelection(cleanLines);
    } else {
      // 如果不是全部有序列表，则添加列表格式
      const listLines = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
      editor.replaceSelection(listLines);
    }
  } else {
    // 没有选中文本时，智能处理当前行
    toggleOrderedList(editor);
  }
};

export const unorderedList = (editor, selection) => {
  if (selection) {
    const lines = selection.split('\n');
    const isAllUnorderedList = lines.every(line => line.match(/^[-*+]\s*/));

    if (isAllUnorderedList) {
      // 如果全部都是无序列表，则移除列表格式
      const cleanLines = lines.map(line => line.replace(/^[-*+]\s*/, '')).join('\n');
      editor.replaceSelection(cleanLines);
    } else {
      // 如果不是全部无序列表，则添加列表格式
      const listLines = lines.map(line => `- ${line}`).join('\n');
      editor.replaceSelection(listLines);
    }
  } else {
    // 没有选中文本时，智能处理当前行
    toggleUnorderedList(editor);
  }
};

export const horizontalRule = (editor, selection) => {
  editor.replaceSelection(`${wrapChar}---${wrapChar}`);
};

export const table = (editor, selection) => {
  const tableTemplate = `| 列1 | 列2 | 列3 |${wrapChar}|-----|-----|-----|${wrapChar}| 数据1 | 数据2 | 数据3 |${wrapChar}| 数据4 | 数据5 | 数据6 |${wrapChar}`;
  editor.replaceSelection(tableTemplate);
};

export const inlineMath = (editor, selection) => {
  const mathPattern = /^\$(.*?)\$$/;
  toggleInlineFormat(editor, selection, '$', '$', mathPattern);
};

export const mathBlock = (editor, selection) => {
  editor.replaceSelection(`${wrapChar}$$${wrapChar}${selection}${wrapChar}$$${wrapChar}`);
  const cursor = editor.getCursor();
  cursor.line -= 2;
  editor.setCursor(cursor);
};
