export default `/* 自定义样式，实时生效，浏览器实时缓存 */

/* 全局属性 */
#nice {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #fff;
  padding: 30px;
  word-break: break-word;
}

/* 段落样式 */
#nice p {
  margin: 12px 0;
  line-height: 1.8;
  font-size: 16px;
  color: #444;
  text-align: justify;
}

/* 一级标题 */
#nice h1 {
  margin: 30px 0 20px;
  padding: 0;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  border-bottom: 3px solid #3498db;
  padding-bottom: 10px;
}

#nice h1 .content {
  color: #2c3e50;
  background: linear-gradient(90deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 二级标题 */
#nice h2 {
  margin: 25px 0 15px;
  padding-left: 12px;
  font-size: 22px;
  font-weight: bold;
  border-left: 4px solid #3498db;
  background: #f8f9fa;
  padding: 8px 0 8px 12px;
}

#nice h2 .content {
  color: #2c3e50;
}

/* 三级标题 */
#nice h3 {
  margin: 20px 0 12px;
  font-size: 18px;
  font-weight: bold;
  color: #34495e;
  position: relative;
}

#nice h3 .content {
  padding-left: 10px;
}

#nice h3:before {
  content: "📖";
  margin-right: 8px;
}

/* 四级标题 */
#nice h4 {
  margin: 18px 0 10px;
  font-size: 16px;
  font-weight: bold;
  color: #7f8c8d;
}

/* 无序列表 */
#nice ul {
  margin: 15px 0;
  padding-left: 25px;
}

#nice ul li {
  margin: 5px 0;
  list-style-type: none;
  position: relative;
}

#nice ul li:before {
  content: "▸";
  color: #3498db;
  position: absolute;
  left: -15px;
  font-weight: bold;
}

/* 有序列表 */
#nice ol {
  margin: 15px 0;
  padding-left: 25px;
}

#nice ol li {
  margin: 5px 0;
}

/* 列表内容 */
#nice li section {
  line-height: 1.6;
  color: #444;
}

/* 引用块 */
#nice blockquote {
  margin: 20px 0;
  padding: 15px 20px;
  border-left: 4px solid #e74c3c;
  background: #fdf2f2;
  position: relative;
  border-radius: 0 8px 8px 0;
}

#nice blockquote:before {
  content: "💡";
  position: absolute;
  top: 15px;
  left: -10px;
  background: #fff;
  font-size: 18px;
}

#nice blockquote p {
  margin: 0;
  color: #555;
  font-style: italic;
}

/* 链接样式 */
#nice a {
  text-decoration: none;
}

#nice a span {
  color: #3498db;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

#nice a:hover span {
  color: #2980b9;
  border-bottom-color: #2980b9;
}

/* 加粗 */
#nice strong {
  font-weight: bold;
  color: #e74c3c;
}

/* 斜体 */
#nice em {
  font-style: italic;
  color: #8e44ad;
}

/* 删除线 */
#nice del {
  text-decoration: line-through;
  color: #95a5a6;
}

/* 分隔线 */
#nice hr {
  margin: 30px 0;
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #bdc3c7, transparent);
}

/* 图片 */
#nice img {
  max-width: 100%;
  margin: 20px auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

#nice img:hover {
  transform: scale(1.02);
}

/* 图片描述 */
#nice figcaption {
  text-align: center;
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 8px;
  font-style: italic;
}

/* 行内代码 */
#nice p code, #nice li code {
  background: #f1f2f6;
  color: #e74c3c;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
  border: 1px solid #e1e8ed;
}

/* 代码块 */
#nice pre {
  margin: 20px 0;
  background: #2c3e50;
  border-radius: 8px;
  overflow-x: auto;
  position: relative;
}

#nice pre:before {
  content: "💻 代码";
  position: absolute;
  top: 10px;
  right: 15px;
  color: #95a5a6;
  font-size: 12px;
}

#nice pre code {
  display: block;
  padding: 20px;
  color: #ecf0f1;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
  background: transparent;
  border: none;
}

/* 表格样式 */
#nice table {
  margin: 20px auto;
  border-collapse: collapse;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

#nice table tr th {
  background: #3498db;
  color: white;
  font-weight: bold;
  padding: 12px 15px;
  text-align: left;
  border: none;
}

#nice table tr td {
  padding: 12px 15px;
  border-bottom: 1px solid #ecf0f1;
  color: #444;
}

#nice table tr:nth-child(even) {
  background: #f8f9fa;
}

#nice table tr:hover {
  background: #e8f4fd;
}

/* 脚注样式 */
#nice .footnote-word {
  color: #3498db;
  font-weight: bold;
}

#nice .footnote-ref {
  color: #e74c3c;
  font-size: 12px;
  vertical-align: super;
}

/* 参考资料标题 */
#nice .footnotes-sep:before {
  content: "📚 参考资料";
  color: #2c3e50;
  font-weight: bold;
  font-size: 18px;
}

/* 参考资料编号 */
#nice .footnote-num {
  color: #3498db;
  font-weight: bold;
}

/* 参考资料文字 */
#nice .footnote-item p { 
  margin: 5px 0;
  color: #555;
  line-height: 1.5;
}

/* 行间公式 */
#nice .block-equation svg {
  max-width: 100% !important;
  margin: 15px auto;
  display: block;
}

/* 行内公式 */
#nice .inline-equation svg {
  max-width: 100% !important;
  vertical-align: middle;
}

/* 任务列表 */
#nice .task-list-item {
  list-style-type: none;
  position: relative;
  padding-left: 25px;
}

#nice .task-list-item input {
  position: absolute;
  left: 0;
  top: 3px;
}

/* 键盘按键样式 */
#nice kbd {
  background: #f7f7f7;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 2px 4px;
  font-size: 12px;
  color: #333;
  box-shadow: 0 1px 0 rgba(0,0,0,0.2);
}

/* 高亮文本 */
#nice mark {
  background: #fff3cd;
  color: #856404;
  padding: 2px 4px;
  border-radius: 3px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #nice {
    padding: 20px 15px;
  }
  
  #nice h1 {
    font-size: 24px;
  }
  
  #nice h2 {
    font-size: 20px;
  }
  
  #nice h3 {
    font-size: 16px;
  }
  
  #nice p {
    font-size: 15px;
  }
  
  #nice table {
    font-size: 14px;
  }
  
  #nice pre code {
    font-size: 13px;
  }
}`;
