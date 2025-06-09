import { Tooltip } from "antd";
import React, { Component } from "react";
import SvgIcon from "../../icon";
import { ENTER_DELAY, LEAVE_DELAY, LAYOUT_ID } from "../../utils/constant";
import { observer, inject } from "mobx-react";

import "./pdf.css";

@inject("content")
@inject("navbar")
@inject("imageHosting")
@inject("dialog")
@observer
class Pdf extends Component {
  handleClick = () => {
    // 获取预览区域的内容
    const previewElement = document.getElementById(LAYOUT_ID);
    if (!previewElement) {
      console.error('找不到预览区域');
      return;
    }

    // 添加打印样式
    this.addPrintStyles();

    // 延迟执行打印，确保样式生效
    setTimeout(() => {
      window.print();
    }, 300);
  };

  addPrintStyles = () => {
    // 检查是否已经添加了打印样式
    const existingStyle = document.getElementById('pdf-export-styles');
    if (existingStyle) {
      return;
    }

    // 创建样式元素
    const style = document.createElement('style');
    style.id = 'pdf-export-styles';
    style.type = 'text/css';

    // 定义打印样式
    const printCSS = `
      @media print {
        /* 隐藏所有不需要的元素 */
        .nice-navbar,
        .nice-footer, 
        .nice-toolbar,
        .document-panel,
        .left-navbar,
        .left-navbar.vertical,
        .left-navbar.horizontal,
        .nice-sidebar,
        .nice-sidebar-hide,
        .nice-md-editor,
        .nice-md-editing,
        .nice-md-editing-immersive,
        .nice-md-editing-hide,
        .nice-style-editor,
        .nice-style-editing,
        .nice-style-editing-hide,
        .ant-tooltip,
        .nice-btn-pdf,
        .document-panel-toggle-button,
        .search-box,
        #nice-sidebar-pdf,
        button:not(.print-safe),
        .toolbar,
        .menu {
          display: none !important;
          visibility: hidden !important;
        }

        /* 确保主应用和主体区域完全显示 */
        .nice-app {
          width: 100% !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .nice-app-body {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          flex-direction: row !important;
        }

        /* 确保主内容区域显示 */
        .main-content-area {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          flex: none !important;
        }

        /* 只显示预览区域 */
        .nice-text-container,
        .nice-text-container-immersive {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* 强制显示预览内容 */
        .nice-marked-text,
        .nice-marked-text-pc,
        .nice-marked-text-hide {
          display: block !important;
          visibility: visible !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          position: static !important;
          opacity: 1 !important;
        }

        .nice-wx-box,
        .nice-wx-box-pc {
          max-width: none !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 20px !important;
          box-shadow: none !important;
          border: none !important;
          background: white !important;
        }

        /* 优化预览内容的显示 */
        #${LAYOUT_ID} {
          max-width: none !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
          background: white !important;
          display: block !important;
          visibility: visible !important;
        }

        /* 设置页面基本样式 */
        body {
          margin: 0 !important;
          padding: 0 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
          line-height: 1.6 !important;
          color: #333 !important;
          background: white !important;
        }

        html {
          background: white !important;
        }

        /* 确保代码块和表格不会被截断 */
        pre, code, table {
          page-break-inside: avoid;
          overflow: visible !important;
        }

        /* 标题前避免分页 */
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
          page-break-inside: avoid;
          margin-top: 0;
        }

        /* 图片适应页面 */
        img {
          max-width: 100% !important;
          height: auto !important;
          page-break-inside: avoid;
        }

        /* 列表优化 */
        ul, ol {
          page-break-inside: avoid;
        }

        /* 表格优化 */
        table {
          width: 100% !important;
          font-size: 12px;
        }

        /* 代码块优化 */
        pre {
          white-space: pre-wrap;
          word-break: break-word;
          font-size: 12px;
        }

        /* 隐藏滚动条 */
        ::-webkit-scrollbar {
          display: none;
        }

        /* 确保链接颜色适合打印 */
        a {
          color: #333 !important;
          text-decoration: underline;
        }

        /* 表格边框优化 */
        table, th, td {
          border: 1px solid #333 !important;
          border-collapse: collapse;
        }

        /* 确保重要内容不被隐藏 */
        .print-safe {
          display: block !important;
        }

        /* 隐藏特定的功能按钮和工具栏 */
        [class*="ant-"], 
        [class*="nice-btn"],
        [class*="toolbar"],
        [class*="sidebar"]:not(#${LAYOUT_ID}):not(.nice-marked-text):not(.nice-wx-box) {
          display: none !important;
        }

        /* 确保 MathJax 公式正确显示 */
        mjx-container,
        mjx-container * {
          color: #333 !important;
        }
      }
    `;

    style.textContent = printCSS;
    document.head.appendChild(style);
  };

  render() {
    return (
      <Tooltip placement="left" mouseEnterDelay={ENTER_DELAY} mouseLeaveDelay={LEAVE_DELAY} title="导出PDF">
        <a id="nice-sidebar-pdf" className="nice-btn-pdf" onClick={this.handleClick}>
          <SvgIcon name="pdf" className="nice-btn-pdf-icon" />
        </a>
      </Tooltip>
    );
  }
}

export default Pdf;
