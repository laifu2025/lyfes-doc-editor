import React, { Component } from "react";
import { Modal, message, Button, Tooltip } from "antd";

import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/css-hint";
import "antd/dist/antd.css";
import { observer, inject } from "mobx-react";

import "../utils/styleMirror.css";
import { findCSSRule, generateCSSRuleTemplate, extractRelatedCSS, mergeCSS } from "../utils/cssHelper";

@inject("content")
@inject("navbar")
@observer
class StyleEditor extends Component {
  constructor(props) {
    super(props);
    this.focus = false;
    this.state = {
      filteredCSS: '', // 过滤后的CSS
      originalCSS: '', // 原始完整CSS
      selectedElementInfo: null // 选中的元素信息
    };
  }

  componentDidMount() {
    // 保存原始CSS
    this.setState({
      originalCSS: this.props.content.style
    });
  }

  componentDidUpdate(prevProps) {
    // 如果CSS内容变化，更新原始CSS
    if (prevProps.content.style !== this.props.content.style) {
      this.setState({
        originalCSS: this.props.content.style
      }, () => {
        // 如果有选中元素，重新过滤CSS
        if (this.props.selectedElementInfo) {
          this.updateFilteredCSS();
        }
      });
    }

    // 如果选中元素信息变化，更新过滤后的CSS
    if (this.props.selectedElementInfo !== prevProps.selectedElementInfo) {
      if (this.props.selectedElementInfo) {
        this.updateFilteredCSS();
      }
    }
  }

  // 更新过滤后的CSS
  updateFilteredCSS = () => {
    const { selectedElementInfo } = this.props;

    if (!selectedElementInfo || !selectedElementInfo.selector) {
      console.warn('updateFilteredCSS: 缺少选中元素信息');
      return;
    }

    // 获取CSS源内容
    const cssSource = this.state.originalCSS || this.props.content.style || '';

    if (!cssSource) {
      console.warn('updateFilteredCSS: 没有CSS内容可过滤');
      this.setState({
        filteredCSS: `/* 当前没有可用的CSS内容 */\n/* 请先选择一个主题模板或添加自定义样式 */`,
        selectedElementInfo: selectedElementInfo
      });
      return;
    }

    try {
      console.log('过滤CSS - 选择器:', selectedElementInfo.selector);
      console.log('CSS源长度:', cssSource.length);

      const filtered = extractRelatedCSS(cssSource, selectedElementInfo.selector);

      console.log('过滤结果:', filtered);

      this.setState({
        filteredCSS: filtered || `/* 未找到 ${selectedElementInfo.displayName} 的相关样式 */`,
        selectedElementInfo: selectedElementInfo
      });

    } catch (error) {
      console.error('更新过滤CSS时出错:', error);
      this.setState({
        filteredCSS: `/* 解析CSS时出现错误: ${error.message} */
/* 选择器: ${selectedElementInfo.selector} */
/* 元素: ${selectedElementInfo.displayName} */
/* 请检查控制台了解详细信息 */`,
        selectedElementInfo: selectedElementInfo
      });
    }
  };



  getStyleInstance = (instance) => {
    if (instance) {
      this.styleEditor = instance.editor;
      this.styleEditor.on("keyup", (cm, event) => {
        if ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode === 189) {
          cm.showHint({ completeSingle: false });
        }
      });
    }
  };

  showConfirm = () => {
    Modal.confirm({
      title: "是否想使用该模板？",
      content: "确定后将复制当前内容和样式并切换为自定义",
      cancelText: "取消",
      okText: "确定",
      onOk: () => {
        const { templateNum } = this.props.navbar;
        const { themeList } = this.props.content;
        const { css } = themeList[templateNum];
        const style = `/*自定义样式，实时生效*/\n\n` + css;
        this.props.content.setCustomStyle(style);
        this.props.onStyleChange && this.props.onStyleChange(style);
        this.props.navbar.setTemplateNum(themeList.length - 1);
      },
      onCancel: () => { },
    });
  };

  changeStyle = (editor) => {
    const { templateNum } = this.props.navbar;
    const { themeList } = this.props.content;
    // focus状态很重要，初始化时被调用则不会进入条件
    if (this.focus) {
      if (templateNum !== themeList.length - 1) {
        this.showConfirm();
      } else {
        const style = editor.getValue();

        if (this.props.selectedElementInfo) {
          // 有选中元素时，更新过滤的CSS并合并到完整CSS
          this.setState({ filteredCSS: style });
          const merged = mergeCSS(this.state.originalCSS, style, this.props.selectedElementInfo.selector || '');
          this.props.content.setCustomStyle(merged);
          this.props.onStyleChange && this.props.onStyleChange(merged);
        } else {
          // 没有选中元素时，直接更新完整CSS
          this.props.content.setCustomStyle(style);
          this.props.onStyleChange && this.props.onStyleChange(style);
          this.setState({ originalCSS: style });
        }
      }
    }
  };

  handleFocus = (editor) => {
    this.focus = true;
    this.props.onStyleFocus && this.props.onStyleFocus(editor.getValue());
  };

  handleBlur = (editor) => {
    this.focus = false;
    this.props.onStyleBlur && this.props.onStyleBlur(editor.getValue());
  };

  /**
   * 定位到指定的CSS规则
   * @param {string} selector - CSS选择器
   * @param {string} displayName - 元素显示名称
   */
  navigateToRule = (selector, displayName) => {
    if (!this.styleEditor) {
      message.warning('CSS编辑器未准备就绪');
      return;
    }

    // 由于现在默认始终显示选中元素的样式，直接使用当前CSS内容
    const cssText = this.getCurrentCSS();
    const result = findCSSRule(cssText, selector);

    if (result.found) {
      // 找到了匹配的规则，跳转到该行
      const line = result.lineNumber - 1; // CodeMirror行号从0开始
      this.styleEditor.setCursor(line, 0);
      this.styleEditor.scrollIntoView({ line, ch: 0 }, 100);

      // 高亮该行
      const lineHandle = this.styleEditor.getLineHandle(line);
      if (lineHandle) {
        this.styleEditor.addLineClass(line, "background", "css-rule-highlight");
        // 3秒后移除高亮
        setTimeout(() => {
          this.styleEditor.removeLineClass(line, "background", "css-rule-highlight");
        }, 3000);
      }

      this.styleEditor.focus();
      message.success(`已定位到 ${displayName} 的样式规则`);
    } else {
      // 没有找到规则，询问是否创建
      Modal.confirm({
        title: `未找到 ${displayName} 的样式规则`,
        content: `是否要为 ${displayName} 创建新的样式规则？`,
        cancelText: "取消",
        okText: "创建",
        onOk: () => {
          this.createNewRule(selector, displayName);
        },
      });
    }
  };

  /**
   * 创建新的CSS规则
   * @param {string} selector - CSS选择器
   * @param {string} displayName - 元素显示名称
   */
  createNewRule = (selector, displayName) => {
    if (!this.styleEditor) {
      return;
    }

    const currentContent = this.styleEditor.getValue();
    const newRule = generateCSSRuleTemplate(selector, displayName);
    const newContent = currentContent + newRule;

    this.styleEditor.setValue(newContent);

    // 定位到新创建的规则
    const lines = newContent.split('\n');
    const targetLine = lines.findIndex(line => line.includes(selector + ' {'));
    if (targetLine > -1) {
      this.styleEditor.setCursor(targetLine + 1, 2); // 定位到规则内部
      this.styleEditor.scrollIntoView({ line: targetLine, ch: 0 }, 100);
    }

    this.styleEditor.focus();
    message.success(`已为 ${displayName} 创建新的样式规则`);
  };

  // 获取当前显示的CSS内容
  getCurrentCSS = () => {
    // 如果有选中元素，显示过滤后的CSS
    if (this.props.selectedElementInfo && this.state.filteredCSS !== undefined) {
      return this.state.filteredCSS || '/* 暂无相关CSS规则 */';
    }
    // 没有选中元素时，显示完整CSS
    return this.props.content.style || '/* 请先选择一个预览元素 */\n/* 点击预览区域的任何元素来编辑其样式 */';
  };

  render() {
    const { selectedElementInfo } = this.props;

    return (
      <div className="style-editor-container">
        {/* 工具栏 - 简化版本 */}
        {selectedElementInfo && (
          <div className="style-editor-toolbar">
            <div className="toolbar-center">
              <span className="selected-element-info">
                正在编辑: <strong>{selectedElementInfo.displayName}</strong> 的样式
              </span>
            </div>
          </div>
        )}

        {/* CSS编辑器 */}
        <CodeMirror
          value={this.getCurrentCSS()}
          options={{
            theme: "style-mirror",
            keyMap: "sublime",
            mode: "css",
            lineWrapping: true,
            lineNumbers: false,
          }}
          id="css-editor"
          onChange={this.changeStyle}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          ref={this.getStyleInstance}
        />
      </div>
    );
  }
}

export default StyleEditor;
