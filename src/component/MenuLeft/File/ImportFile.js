import React, { Component } from "react";
import { observer, inject } from "mobx-react";

import "../common.css";
import { message, Tooltip, Spin } from "antd";

@inject("content")
@observer
class ImportFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      importing: false
    };
  }

  // 支持的文件格式配置
  supportedFormats = {
    '.md': 'Markdown文件',
    '.txt': '纯文本文件',
    '.json': 'JSON文件',
    '.html': 'HTML文件',
    '.htm': 'HTM文件'
  };

  // 获取文件扩展名
  getFileExtension = (fileName) => {
    return fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  };

  // 验证文件格式
  validateFileFormat = (fileName) => {
    const extension = this.getFileExtension(fileName);
    return Object.keys(this.supportedFormats).includes(extension);
  };

  // 处理JSON文件
  handleJsonFile = (content) => {
    try {
      const jsonData = JSON.parse(content);
      // 如果是导出的文档格式
      if (jsonData.content) {
        return jsonData.content;
      }
      // 如果是纯JSON数据，转换为Markdown格式
      return `\`\`\`json\n${JSON.stringify(jsonData, null, 2)}\n\`\`\``;
    } catch (error) {
      throw new Error('JSON文件格式不正确');
    }
  };

  // 处理HTML文件
  handleHtmlFile = (content) => {
    // 简单的HTML到Markdown转换
    let markdown = content
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<a[^>]*href=['"](.*?)['"][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<img[^>]*src=['"](.*?)['"][^>]*alt=['"](.*?)['"][^>]*>/gi, '![$2]($1)')
      .replace(/<[^>]+>/g, ''); // 移除其他HTML标签

    return markdown.replace(/\n{3,}/g, '\n\n').trim();
  };

  // 处理文件内容
  processFileContent = (content, fileName) => {
    const extension = this.getFileExtension(fileName);

    switch (extension) {
      case '.json':
        return this.handleJsonFile(content);
      case '.html':
      case '.htm':
        return this.handleHtmlFile(content);
      case '.md':
      case '.txt':
      default:
        return content;
    }
  };

  // 格式化文件大小显示
  formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  handleChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 验证文件格式
    if (!this.validateFileFormat(file.name)) {
      const supportedList = Object.entries(this.supportedFormats)
        .map(([ext, desc]) => `${ext}(${desc})`)
        .join('、');
      message.error(`不支持的文件格式！支持的格式：${supportedList}`);
      // 清空input值，允许重新选择相同文件
      e.target.value = '';
      return;
    }

    // 验证文件大小 (限制10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.error(`文件大小不能超过10MB！当前文件大小：${this.formatFileSize(file.size)}`);
      e.target.value = '';
      return;
    }

    // 显示导入进度
    this.setState({ importing: true });
    const hideLoading = message.loading(`正在导入 ${file.name}...`, 0);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const processedContent = this.processFileContent(event.target.result, file.name);
        this.props.content.setContent(processedContent);

        const extension = this.getFileExtension(file.name);
        const formatName = this.supportedFormats[extension];

        hideLoading();
        this.setState({ importing: false });
        message.success(`${formatName}导入成功！文件：${file.name}`);
      } catch (error) {
        hideLoading();
        this.setState({ importing: false });
        message.error(`文件导入失败：${error.message}`);
      }
    };

    reader.onerror = () => {
      hideLoading();
      this.setState({ importing: false });
      message.error('文件读取失败！请检查文件是否损坏。');
    };

    reader.readAsText(file, 'UTF-8');

    // 清空input值，允许重新选择相同文件
    e.target.value = '';
  };

  render() {
    const { importing } = this.state;
    const acceptFormats = Object.keys(this.supportedFormats).join(',');

    const tooltipTitle = (
      <div style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>支持的文件格式：</div>
        {Object.entries(this.supportedFormats).map(([ext, desc]) => (
          <div key={ext} style={{ margin: '2px 0' }}>
            <span style={{ color: '#1890ff', fontFamily: 'monospace' }}>{ext}</span>
            <span style={{ margin: '0 4px' }}>-</span>
            <span>{desc}</span>
          </div>
        ))}
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          文件大小限制：10MB
        </div>
      </div>
    );

    return (
      <Tooltip
        title={tooltipTitle}
        placement="right"
        overlayClassName="import-file-tooltip"
      >
        <label
          id="nice-menu-import-file"
          className={`nice-menu-item ${importing ? 'importing' : ''}`}
          htmlFor="importFile"
          style={{ opacity: importing ? 0.7 : 1 }}
        >
          <span>
            <span className="nice-menu-flag">
              {importing && <Spin size="small" style={{ marginRight: '4px' }} />}
            </span>
            <span className="nice-menu-name">导入</span>
            <input
              style={{ display: "none" }}
              type="file"
              id="importFile"
              accept={acceptFormats}
              hidden=""
              onChange={this.handleChange}
              disabled={importing}
            />
          </span>
        </label>
      </Tooltip>
    );
  }
}

export default ImportFile;
