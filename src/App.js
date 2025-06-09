import React, { Component } from "react";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/addon/search/searchcursor";
import "codemirror/keymap/sublime";
import "antd/dist/antd.css";
import { observer, inject } from "mobx-react";
import { autorun } from "mobx";
import classnames from "classnames";
import throttle from "lodash.throttle";

import Dialog from "./layout/Dialog";
import Navbar from "./layout/Navbar";
import Toobar from "./layout/Toolbar";
import Footer, { EditorFooter } from "./layout/Footer";
import Sidebar from "./layout/Sidebar";
import StyleSelector from "./component/StyleSelector/StyleSelector";
import EditorMenu from "./layout/EditorMenu";
import SearchBox from "./component/SearchBox";
import DocumentPanel from "./component/DocumentManager/DocumentPanel";
import LeftNavbar from "./component/LeftNavbar/LeftNavbar";
import ErrorBoundary from "./component/ErrorBoundary";
import NetworkStatus from "./component/NetworkStatus";


import "./App.css";
import "./utils/mdMirror.css";
import "./component/ThemeToggle/ThemeToggle.css";
import "./component/ElementSelector/ElementSelector.css";

import {
  LAYOUT_ID,
  BOX_ID,
  IMAGE_HOSTING_NAMES,
  IMAGE_HOSTING_TYPE,
  MJX_DATA_FORMULA,
  MJX_DATA_FORMULA_TYPE,
} from "./utils/constant";
import { markdownParser, markdownParserWechat, updateMathjax } from "./utils/helper";
import pluginCenter from "./utils/pluginCenter";
import appContext from "./utils/appContext";
import { uploadAdaptor } from "./utils/imageHosting";
import bindHotkeys, { betterTab, rightClick } from "./utils/hotkey";
import { getElementSelector, getElementDisplayName } from "./utils/cssHelper";

@inject("content")
@inject("navbar")
@inject("footer")
@inject("view")
@inject("dialog")
@inject("imageHosting")
@inject("documentManager")
@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.scale = 1;
    this.handleUpdateMathjax = throttle(updateMathjax, 1500);
    this.state = {
      focus: false,
      // 元素选择相关状态
      selectedElement: null,
      hoveredElement: null,
    };
  }

  componentDidMount() {
    document.addEventListener("fullscreenchange", this.solveScreenChange);
    document.addEventListener("webkitfullscreenchange", this.solveScreenChange);
    document.addEventListener("mozfullscreenchange", this.solveScreenChange);
    document.addEventListener("MSFullscreenChange", this.solveScreenChange);
    try {
      window.MathJax = {
        tex: {
          inlineMath: [["$", "$"]],
          displayMath: [["$$", "$$"]],
          tags: "ams",
        },
        svg: {
          fontCache: "none",
        },
        options: {
          renderActions: {
            addMenu: [0, "", ""],
            addContainer: [
              190,
              (doc) => {
                for (const math of doc.math) {
                  this.addContainer(math, doc);
                }
              },
              this.addContainer,
            ],
          },
        },
      };
      // eslint-disable-next-line
      require("mathjax/es5/tex-svg-full");
      pluginCenter.mathjax = true;
    } catch (e) {
      console.log(e);
    }
    this.setEditorContent();
    this.setCustomImageHosting();

    // ✅ 设置文档管理器的内容变化回调
    this.props.documentManager.setContentChangeCallback((content) => {
      this.props.content.setContent(content);
    });

    // ✅ 启用自动保存功能（10秒间隔，作为立即保存的备份机制）
    this.props.documentManager.enableAutoSave(10000);

    // 初始化时应用主题
    this.applyTheme();

    // 使用autorun监听主题变化
    this.themeDisposer = autorun(() => {
      const { isDarkTheme } = this.props.view;
      this.applyTheme();
    });

    // 绑定键盘快捷键
    document.addEventListener('keydown', this.handleKeyDown);

    // 默认启用元素选择模式
    this.addElementSelectionListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    if (pluginCenter.mathjax) {
      this.handleUpdateMathjax();
    }

    // 监听主题变化
    if (prevProps && prevProps.view && prevProps.view.isDarkTheme !== this.props.view.isDarkTheme) {
      this.applyTheme();
    }


  }

  // 应用主题到body元素
  applyTheme = () => {
    const { isDarkTheme } = this.props.view;
    console.log('正在应用主题:', isDarkTheme ? '暗色' : '亮色');

    // 强制移除再添加，确保类名正确切换
    document.body.classList.remove('dark-theme');

    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    }

    console.log('应用后body类名:', document.body.className);
  };

  componentWillUnmount() {
    document.removeEventListener("fullscreenchange", this.solveScreenChange);
    document.removeEventListener("webkitfullscreenchange", this.solveScreenChange);
    document.removeEventListener("mozfullscreenchange", this.solveScreenChange);
    document.removeEventListener("MSFullscreenChange", this.solveScreenChange);
    document.removeEventListener('keydown', this.handleKeyDown);

    // ✅ 清理自动保存定时器
    this.props.documentManager.disableAutoSave();

    // 清理主题监听器
    if (this.themeDisposer) {
      this.themeDisposer();
    }

    // 清理元素选择事件
    this.removeElementSelectionListeners();
  }

  // 键盘快捷键处理
  handleKeyDown = (e) => {
    // ESC 清除当前选择
    if (e.key === 'Escape') {
      this.setState({
        selectedElement: null
      });
      this.clearElementHighlights();
    }
  };



  // 添加元素选择事件监听器
  addElementSelectionListeners = () => {
    const previewContainer = this.previewContainer;
    if (previewContainer) {
      previewContainer.addEventListener('mouseover', this.handleElementHover);
      previewContainer.addEventListener('mouseout', this.handleElementHoverOut);
      previewContainer.addEventListener('click', this.handleElementClick);
    }
  };

  // 移除元素选择事件监听器
  removeElementSelectionListeners = () => {
    const previewContainer = this.previewContainer;
    if (previewContainer) {
      previewContainer.removeEventListener('mouseover', this.handleElementHover);
      previewContainer.removeEventListener('mouseout', this.handleElementHoverOut);
      previewContainer.removeEventListener('click', this.handleElementClick);
    }
  };

  // 处理元素悬停
  handleElementHover = (e) => {
    e.stopPropagation();
    const target = e.target;

    // 移除之前的悬停样式
    if (this.state.hoveredElement && this.state.hoveredElement !== target) {
      this.state.hoveredElement.classList.remove('preview-element-hover');
    }

    // 添加悬停样式
    target.classList.add('preview-element-hover');
    this.setState({ hoveredElement: target });
  };

  // 处理元素悬停离开
  handleElementHoverOut = (e) => {
    const target = e.target;
    target.classList.remove('preview-element-hover');

    if (this.state.hoveredElement === target) {
      this.setState({ hoveredElement: null });
    }
  };

  // 处理元素点击
  handleElementClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let target = e.target;

    // 详细的调试信息
    console.log('原始点击元素:', {
      tagName: target.tagName,
      className: target.className,
      textContent: target.textContent?.substring(0, 50),
      parentElement: target.parentElement?.tagName
    });

    // 定义需要向上查找父级容器的规则
    const elementMappingRules = {
      // 点击列表项时选择整个列表（但微信代码块的行号li例外）
      'LI': ['UL', 'OL'],
      // 点击表格单元格时选择整个表格
      'TD': ['TABLE'],
      'TH': ['TABLE'],
      // 点击代码内容时选择代码块
      'CODE': ['PRE'],
      // 代码块内的行号、高亮等子元素也应该选择整个代码块
      'SPAN': ['PRE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'BLOCKQUOTE', 'STRONG', 'EM'],
      'DIV': ['PRE'], // 处理代码块内的行号容器等
      // 其他内联元素
      'A': ['P'],
      'IMG': ['P', 'FIGURE']
    };

    const blockElements = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'BLOCKQUOTE', 'UL', 'OL', 'PRE', 'TABLE', 'FIGURE', 'SECTION'];

    // 特殊处理：检查是否是微信代码块的行号
    if (target.tagName === 'LI' && target.parentElement?.classList?.contains('code-snippet__line-index')) {
      // 这是微信代码块的行号，向上查找整个代码块容器
      let parent = target.parentElement;
      while (parent && parent !== document.body) {
        if (parent.classList?.contains('code-snippet__fix')) {
          target = parent;
          console.log('检测到微信代码块行号，选择整个代码块容器:', target);
          break;
        }
        parent = parent.parentElement;
      }
    }
    // 特殊处理：检查是否是微信代码块的行号容器
    else if (target.tagName === 'UL' && target.classList?.contains('code-snippet__line-index')) {
      // 这是微信代码块的行号容器，向上查找整个代码块容器
      let parent = target.parentElement;
      while (parent && parent !== document.body) {
        if (parent.classList?.contains('code-snippet__fix')) {
          target = parent;
          console.log('检测到微信代码块行号容器，选择整个代码块容器:', target);
          break;
        }
        parent = parent.parentElement;
      }
    }
    // 常规映射规则处理
    else if (elementMappingRules[target.tagName]) {
      const targetParents = elementMappingRules[target.tagName];
      let parent = target.parentElement;

      while (parent && parent !== document.body) {
        console.log('检查父元素:', parent.tagName, parent.className);
        if (targetParents.includes(parent.tagName)) {
          target = parent;
          console.log('根据映射规则找到目标父元素:', target.tagName);
          break;
        }
        parent = parent.parentElement;
      }
    }
    // 如果当前元素不是块级元素，继续向上查找
    else if (!blockElements.includes(target.tagName)) {
      let parent = target.parentElement;
      while (parent && parent !== document.body) {
        console.log('检查父元素:', parent.tagName, parent.className);
        if (blockElements.includes(parent.tagName)) {
          target = parent;
          console.log('找到块级父元素:', target.tagName);
          break;
        }
        parent = parent.parentElement;
      }
    }

    const selector = getElementSelector(target);
    const tagName = target.tagName ? target.tagName.toLowerCase() : 'div';

    console.log('最终选择的元素:', {
      tagName: tagName,
      selector: selector,
      displayName: getElementDisplayName(target),
      element: target
    });

    if (selector && tagName) {
      // 清除之前的选择
      this.clearElementHighlights();

      // 高亮选中的元素
      target.classList.add('preview-element-selected');

      const selectedElement = {
        element: target,
        selector: selector || '',
        displayName: getElementDisplayName(target) || '未知元素',
        tagName: tagName
      };

      console.log('发送到StyleSelector的元素信息:', selectedElement);

      this.setState({
        selectedElement,
        // 保持选择模式启用状态
        hoveredElement: null
      });

      // 直接打开样式选择器
      this.props.view.setStyleEditorOpen(true);
    }
  };

  // 清除所有元素高亮
  clearElementHighlights = () => {
    const previewContainer = this.previewContainer;
    if (previewContainer) {
      const selectedElements = previewContainer.querySelectorAll('.preview-element-selected');
      const hoveredElements = previewContainer.querySelectorAll('.preview-element-hover');

      selectedElements.forEach(el => {
        el.classList.remove('preview-element-selected');

        // 同时清理所有以selected-element-开头的唯一class
        Array.from(el.classList).forEach(className => {
          if (className.startsWith('selected-element-')) {
            el.classList.remove(className);
          }
        });
      });

      hoveredElements.forEach(el => el.classList.remove('preview-element-hover'));
    }
  };



  setCustomImageHosting = () => {
    // 始终添加本地图床选项
    this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.local);

    if (this.props.useImageHosting === undefined) {
      return;
    }
    const { url, name, isSmmsOpen, isQiniuyunOpen, isAliyunOpen, isGiteeOpen, isGitHubOpen } = this.props.useImageHosting;
    if (name) {
      this.props.imageHosting.setHostingUrl(url);
      this.props.imageHosting.setHostingName(name);
      this.props.imageHosting.addImageHosting(name);
    }
    if (isSmmsOpen) {
      this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.smms);
    }
    if (isAliyunOpen) {
      this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.aliyun);
    }
    if (isQiniuyunOpen) {
      this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.qiniuyun);
    }
    if (isGiteeOpen) {
      this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.gitee);
    }
    if (isGitHubOpen) {
      this.props.imageHosting.addImageHosting(IMAGE_HOSTING_NAMES.github);
    }

    // 第一次进入没有默认图床时，优先使用本地图床
    if (window.localStorage.getItem(IMAGE_HOSTING_TYPE) === null) {
      let type = IMAGE_HOSTING_NAMES.local; // 默认使用本地图床
      if (name) {
        type = name;
      } else if (isSmmsOpen) {
        type = IMAGE_HOSTING_NAMES.smms;
      } else if (isAliyunOpen) {
        type = IMAGE_HOSTING_NAMES.aliyun;
      } else if (isQiniuyunOpen) {
        type = IMAGE_HOSTING_NAMES.qiniuyun;
      } else if (isGiteeOpen) {
        type = IMAGE_HOSTING_NAMES.gitee;
      } else if (isGitHubOpen) {
        type = IMAGE_HOSTING_NAMES.github;
      }
      this.props.imageHosting.setType(type);
      window.localStorage.setItem(IMAGE_HOSTING_TYPE, type);
    }
  };

  setEditorContent = () => {
    const { defaultText } = this.props;
    if (defaultText) {
      this.props.content.setContent(defaultText);
    }
  };

  setCurrentIndex(index) {
    this.index = index;
  }

  solveScreenChange = () => {
    const { isImmersiveEditing } = this.props.view;
    this.props.view.setImmersiveEditing(!isImmersiveEditing);
  };

  getInstance = (instance) => {
    instance.editor.on("inputRead", function (cm, event) {
      if (event.origin === "paste") {
        var text = event.text[0]; // pasted string
        var new_text = ""; // any operations here
        cm.refresh();
        const { length } = cm.getSelections();
        // my first idea was
        // note: for multiline strings may need more complex calculations
        cm.replaceRange(new_text, event.from, { line: event.from.line, ch: event.from.ch + text.length });
        // first solution did'nt work (before i guess to call refresh) so i tried that way, works too
        if (length === 1) {
          cm.execCommand("undo");
        }
        // cm.setCursor(event.from);
        cm.replaceSelection(new_text);
      }
    });
    if (instance) {
      this.props.content.setMarkdownEditor(instance.editor);
    }
  };

  handleScroll = () => {
    if (this.props.navbar.isSyncScroll) {
      const { markdownEditor } = this.props.content;
      const cmData = markdownEditor.getScrollInfo();
      const editorToTop = cmData.top;
      const editorScrollHeight = cmData.height - cmData.clientHeight;
      this.scale = (this.previewWrap.offsetHeight - this.previewContainer.offsetHeight + 55) / editorScrollHeight;
      if (this.index === 1) {
        this.previewContainer.scrollTop = editorToTop * this.scale;
      } else {
        this.editorTop = this.previewContainer.scrollTop / this.scale;
        markdownEditor.scrollTo(null, this.editorTop);
      }
    }
  };

  handleChange = async (editor) => {
    if (this.state.focus) {
      const content = editor.getValue();
      this.props.content.setContent(content);
      this.props.onTextChange && this.props.onTextChange(content);

      // ✅ 同时保存到文档管理器（异步）
      try {
        await this.props.documentManager.saveCurrentEditorContent(content);
      } catch (error) {
        console.warn('自动保存失败:', error);
        // 不影响用户编辑体验，静默处理错误
      }
    }
  };

  handleFocus = (editor) => {
    this.setState({
      focus: true,
    });
    this.props.onTextFocus && this.props.onTextFocus(editor.getValue());
  };

  handleBlur = (editor) => {
    this.setState({
      focus: false,
    });
    this.props.onTextBlur && this.props.onTextBlur(editor.getValue());
  };

  getStyleInstance = (instance) => {
    if (instance) {
      this.styleEditor = instance.editor;
      this.styleEditor.on("keyup", (cm, e) => {
        if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 189) {
          cm.showHint(e);
        }
      });
    }
  };

  handleDrop = (instance, e) => {
    // e.preventDefault();
    // console.log(e.dataTransfer.files[0]);
    if (!(e.dataTransfer && e.dataTransfer.files)) {
      return;
    }

    // 检查用户登录状态
    const userInfo = require('./store/userInfo').default;
    if (!userInfo.isLoggedIn) {
      const { message } = require('antd');
      message.warning("请先登录后再上传图片！", 3);
      return;
    }

    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      // console.log(e.dataTransfer.files[i]);
      uploadAdaptor({ file: e.dataTransfer.files[i], content: this.props.content });
    }
  };

  handlePaste = (instance, e) => {
    const cbData = e.clipboardData;

    const insertPasteContent = (cm, content) => {
      const { length } = cm.getSelections();
      cm.replaceSelections(Array(length).fill(content));
      this.setState(
        {
          focus: true,
        },
        () => {
          this.handleChange(cm);
        },
      );
    };

    if (e.clipboardData && e.clipboardData.files) {
      // 检查用户登录状态
      const userInfo = require('./store/userInfo').default;
      if (!userInfo.isLoggedIn) {
        const { message } = require('antd');
        message.warning("请先登录后再上传图片！", 3);
        return;
      }

      for (let i = 0; i < e.clipboardData.files.length; i++) {
        uploadAdaptor({ file: e.clipboardData.files[i], content: this.props.content });
      }
    }

    if (cbData) {
      const html = cbData.getData("text/html");
      const text = cbData.getData("TEXT");
      insertPasteContent(instance, text);
      console.log(html);

      if (html) {
        console.log("htmsdkskdkskdk");
        this.props.footer.setPasteHtmlChecked(true);
        this.props.footer.setPasteHtml(html);
        this.props.footer.setPasteText(text);
      } else {
        this.props.footer.setPasteHtmlChecked(false);
      }
    }
  };

  addContainer(math, doc) {
    const tag = "span";
    const spanClass = math.display ? "span-block-equation" : "span-inline-equation";
    const cls = math.display ? "block-equation" : "inline-equation";
    math.typesetRoot.className = cls;
    math.typesetRoot.setAttribute(MJX_DATA_FORMULA, math.math);
    math.typesetRoot.setAttribute(MJX_DATA_FORMULA_TYPE, cls);
    math.typesetRoot = doc.adaptor.node(tag, { class: spanClass, style: "cursor:pointer" }, [math.typesetRoot]);
  }

  render() {
    const { codeNum, previewType } = this.props.navbar;
    const { isEditAreaOpen, isPreviewAreaOpen, isStyleEditorOpen, isImmersiveEditing } = this.props.view;
    const { isSearchOpen } = this.props.dialog;

    const parseHtml =
      codeNum === 0
        ? markdownParserWechat.render(this.props.content.content)
        : markdownParser.render(this.props.content.content);

    const mdEditingClass = classnames({
      "nice-md-editing": !isImmersiveEditing,
      "nice-md-editing-immersive": isImmersiveEditing,
      "nice-md-editing-hide": !isEditAreaOpen,
    });

    const styleEditingClass = classnames({
      "nice-style-editing": true,
      "nice-style-editing-hide": isImmersiveEditing,
    });

    const richTextClass = classnames({
      "nice-marked-text": true,
      "nice-marked-text-pc": previewType === "pc",
      "nice-marked-text-hide": isImmersiveEditing || !isPreviewAreaOpen,
    });

    const richTextBoxClass = classnames({
      "nice-wx-box": true,
      "nice-wx-box-pc": previewType === "pc",
    });

    const textContainerClass = classnames({
      "nice-text-container": !isImmersiveEditing,
      "nice-text-container-immersive": isImmersiveEditing,
    });

    return (
      <ErrorBoundary>
        <appContext.Consumer>
          {({ defaultTitle, onStyleChange, onStyleBlur, onStyleFocus, token }) => (
            <div className="nice-app">
              <Navbar title={defaultTitle} token={token} />
              <Toobar token={token} />
              <div className="nice-app-body">
                <DocumentPanel />
                <LeftNavbar />
                <div className="main-content-area">
                  <div className={textContainerClass}>
                    <div className="nice-editor-area">
                      <div id="nice-md-editor" className={mdEditingClass} onMouseOver={(e) => this.setCurrentIndex(1, e)}>
                        {isSearchOpen && <SearchBox />}
                        <CodeMirror
                          value={this.props.content.content}
                          options={{
                            theme: "md-mirror",
                            keyMap: "sublime",
                            mode: "markdown",
                            lineWrapping: true,
                            lineNumbers: false,
                            extraKeys: {
                              ...bindHotkeys(this.props.content, this.props.dialog),
                              Tab: betterTab,
                              RightClick: rightClick,
                            },
                          }}
                          onChange={this.handleChange}
                          onScroll={this.handleScroll}
                          onFocus={this.handleFocus}
                          onBlur={this.handleBlur}
                          onDrop={this.handleDrop}
                          onPaste={this.handlePaste}
                          ref={this.getInstance}
                        />
                      </div>
                      <div id="nice-rich-text" className={richTextClass} onMouseOver={(e) => this.setCurrentIndex(2, e)}>
                        <Sidebar />
                        <div
                          id={BOX_ID}
                          className={richTextBoxClass}
                          onScroll={this.handleScroll}
                          ref={(node) => {
                            this.previewContainer = node;
                          }}
                        >
                          <section
                            id={LAYOUT_ID}
                            data-tool="Lyfe's Doc Editor"
                            data-website="https://github.com/laifu2025/lyfes-doc-editor"
                            dangerouslySetInnerHTML={{
                              __html: parseHtml,
                            }}
                            ref={(node) => {
                              this.previewWrap = node;
                            }}
                          />
                        </div>
                      </div>

                      {isStyleEditorOpen && (
                        <div id="nice-style-editor" className={styleEditingClass}>
                          <StyleSelector
                            selectedElementInfo={this.state.selectedElement}
                          />
                        </div>
                      )}
                    </div>

                    <EditorFooter />

                    <Dialog />
                    <EditorMenu />
                  </div>
                </div>
              </div>
              <Footer />
              <NetworkStatus />




            </div>
          )}
        </appContext.Consumer>
      </ErrorBoundary>
    );
  }
}

export default App;
