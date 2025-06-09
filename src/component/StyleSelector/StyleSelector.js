import React, { Component } from 'react';
import { Card, Row, Col, Button, message, Switch, Typography } from 'antd';
import { observer, inject } from 'mobx-react';
import TEMPLATE from '../../template/index';
import { CODE_OPTIONS } from '../../utils/constant';
import './StyleSelector.css';

// 使用项目现有的TEMPLATE系统，无需重复导入代码主题

const { Text } = Typography;

@inject("content")
@inject("navbar")
@observer
class StyleSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStyleId: null,
      applyToAll: false  // 默认只对当前元素应用样式
    };
    // 预览缓存，避免重复生成
    this.previewCache = new Map();
    // 预览计数器，确保ID唯一
    this.previewCounter = 0;
  }

  componentDidMount() {
    // 初始化时，如果是代码块，检查当前选中的代码主题
    const elementType = this.getElementType();
    if (elementType === 'pre' && this.props.navbar) {
      const { codeNum } = this.props.navbar;
      if (codeNum !== undefined && CODE_OPTIONS[codeNum]) {
        this.setState({ selectedStyleId: CODE_OPTIONS[codeNum].id });
      }
    }
  }

  // 处理Mac风格切换
  handleMacStyleChange = (checked) => {
    if (!this.props.navbar) {
      console.error('navbar prop不存在');
      return;
    }

    const { codeNum } = this.props.navbar;

    // 切换Mac风格状态
    this.props.navbar.setMacCode(checked);

    // 重新应用当前选中的代码主题（使用新的Mac风格设置）
    if (codeNum !== undefined) {
      this.props.navbar.setCodeNum(codeNum, checked);
    }

    // 清除预览缓存以确保立即更新
    this.previewCache.clear();

    // 显示切换成功提示
    const currentTheme = CODE_OPTIONS[codeNum]?.name || '当前代码主题';
    message.success(`已切换到${checked ? 'Mac风格' : '标准风格'}的${currentTheme}`);

    // 强制重新渲染以更新预览
    this.forceUpdate();
  };

  componentWillUnmount() {
    // 清理预览缓存
    this.previewCache.clear();
  }

  // 获取元素类型的中文显示名称
  getElementDisplayName = (elementType) => {
    const displayNames = {
      'h1': '一级标题',
      'h2': '二级标题',
      'h3': '三级标题',
      'h4': '四级标题',
      'h5': '五级标题',
      'h6': '六级标题',
      'p': '段落',
      'blockquote': '引用',
      'ul': '无序列表',
      'ol': '有序列表',
      'li': '列表项',
      'code': '行内代码',
      'pre': '代码块',
      'strong': '加粗文字',
      'em': '斜体文字',
      'table': '表格',
      'thead': '表头',
      'tbody': '表体',
      'tr': '表格行',
      'th': '表头单元格',
      'td': '表格单元格',
      'a': '链接',
      'img': '图片',
      'div': '容器',
      'span': '文本'
    };

    return displayNames[elementType] || elementType;
  };

  // 从selectedElementInfo中获取元素类型
  getElementType = () => {
    const { selectedElementInfo } = this.props;

    if (!selectedElementInfo || !selectedElementInfo.tagName) {
      console.log('StyleSelector: 没有选中的元素信息或tagName为空', selectedElementInfo);
      return null;
    }

    // 根据tagName确定元素类型
    const tagName = selectedElementInfo.tagName.toLowerCase();

    console.log('StyleSelector: 检测到元素类型', {
      tagName: tagName,
      displayName: selectedElementInfo.displayName,
      selector: selectedElementInfo.selector
    });

    // 直接返回标签名作为元素类型
    // 这样可以处理 h1, h2, h3, h4, p, blockquote, ul, ol, code, pre, strong, em 等
    return tagName;
  };

  // 从预定义主题中提取特定元素的样式选项
  getStyleOptions = (elementType) => {
    if (!elementType) {
      console.warn('getStyleOptions: elementType 为空');
      return [];
    }

    console.log('getStyleOptions 被调用，elementType:', elementType);

    // 为代码块提供预定义的7种代码主题
    if (elementType === 'pre') {
      return this.getCodeBlockThemes();
    }

    // 从预定义主题中提取样式
    const preDefinedStyles = this.getPreDefinedStyles(elementType);
    console.log('获取到的预定义样式数量:', preDefinedStyles.length);

    return preDefinedStyles;
  };

  // 获取预定义主题中的样式选项
  getPreDefinedStyles = (elementType) => {
    const themeOptions = [];

    // 预定义主题配置
    const themeConfigs = [
      {
        id: 'normal',
        name: '默认主题',
        css: TEMPLATE.theme.normal,
        color: '#2c3e50'
      },
      {
        id: 'orange',
        name: '橙心',
        css: TEMPLATE.theme.one,
        color: '#ef7060'
      },
      {
        id: 'purple',
        name: '姹紫',
        css: TEMPLATE.theme.two,
        color: '#773098'
      },
      {
        id: 'green',
        name: '嫩青',
        css: TEMPLATE.theme.three,
        color: '#47c1a8'
      },
      {
        id: 'fresh-green',
        name: '绿意',
        css: TEMPLATE.theme.four,
        color: '#67C23A'
      },
      {
        id: 'red',
        name: '红绯',
        css: TEMPLATE.theme.five,
        color: '#F56C6C'
      },
      {
        id: 'blue',
        name: '蓝莹',
        css: TEMPLATE.theme.six,
        color: '#409EFF'
      },
      {
        id: 'cyan',
        name: '兰青',
        css: TEMPLATE.theme.seven,
        color: '#17a2b8'
      },
      {
        id: 'yellow',
        name: '山吹',
        css: TEMPLATE.theme.eight,
        color: '#E6A23C'
      },
      {
        id: 'dark-grid',
        name: '网格黑',
        css: TEMPLATE.theme.wgh,
        color: '#333333'
      },
      {
        id: 'geek-black',
        name: '极客黑',
        css: TEMPLATE.theme.ten,
        color: '#212121'
      },
      {
        id: 'rose-purple',
        name: '蔷薇紫',
        css: TEMPLATE.theme.eleven,
        color: '#9C27B0'
      },
      {
        id: 'cute-green',
        name: '萌绿风',
        css: TEMPLATE.theme.twelve,
        color: '#4CAF50'
      },
      {
        id: 'fullstack-blue',
        name: '全栈蓝',
        css: TEMPLATE.theme.thirteen,
        color: '#40B8FA'
      },
      {
        id: 'minimal-black',
        name: '极简黑',
        css: TEMPLATE.theme.fourteen,
        color: '#424242'
      },
      {
        id: 'orange-blue',
        name: '橙蓝风',
        css: TEMPLATE.theme.fifteen,
        color: '#FF9800'
      },
      {
        id: 'frontend-style',
        name: '前端之巅同款',
        css: TEMPLATE.theme.nine,
        color: '#1E88E5'
      }
    ];

    // 为每个主题生成样式选项
    themeConfigs.forEach(theme => {
      const extractedStyle = this.extractElementStyleFromTheme(theme.css, elementType);
      if (extractedStyle && extractedStyle.trim()) {
        themeOptions.push({
          id: `${elementType}-${theme.id}`,
          name: `${theme.name}风格`,
          preview: this.generatePreviewText(elementType, theme.name),
          css: extractedStyle,
          themeColor: theme.color
        });
      }
    });

    return themeOptions;
  };

  // 从主题CSS中提取特定元素的样式
  extractElementStyleFromTheme = (themeCSS, elementType) => {
    if (!themeCSS || !elementType) {
      console.warn('extractElementStyleFromTheme: 缺少参数', { themeCSS: !!themeCSS, elementType });
      return '';
    }

    console.log(`正在提取 ${elementType} 的样式，CSS长度: ${themeCSS.length}`);

    const cssRules = [];
    const patterns = this.getElementCSSPatterns(elementType);

    console.log(`${elementType} 对应的匹配模式:`, patterns);

    patterns.forEach(pattern => {
      // 改进正则表达式，使其更灵活
      const regex = new RegExp(pattern + '\\s*\\{([^}]*)\\}', 'gi');
      let match;

      while ((match = regex.exec(themeCSS)) !== null) {
        const fullMatch = match[0];
        const cssContent = match[1].trim();

        // 只添加有实际内容的CSS规则
        if (cssContent && cssContent.length > 0) {
          console.log(`模式 "${pattern}" 匹配到有效规则:`, fullMatch);
          cssRules.push(fullMatch);
        } else {
          console.log(`模式 "${pattern}" 匹配到空规则，跳过:`, fullMatch);
        }
      }
    });

    const result = cssRules.join('\n\n');
    console.log(`${elementType} 最终提取的CSS (${cssRules.length}个规则):`, result);

    return result;
  };

  // 获取元素对应的CSS选择器模式
  getElementCSSPatterns = (elementType) => {
    const patterns = {
      'h1': [
        '#nice h1(?![\\w-])',
        '#nice h1 [^{]*',
        '#nice h1:[\\w-]+[^{]*',
        '#nice h1\\.[\\w-]+[^{]*'
      ],
      'h2': [
        '#nice h2(?![\\w-])',
        '#nice h2 [^{]*',
        '#nice h2:[\\w-]+[^{]*',
        '#nice h2\\.[\\w-]+[^{]*'
      ],
      'h3': [
        '#nice h3(?![\\w-])',
        '#nice h3 [^{]*',
        '#nice h3:[\\w-]+[^{]*',
        '#nice h3\\.[\\w-]+[^{]*'
      ],
      'h4': [
        '#nice h4(?![\\w-])',
        '#nice h4 [^{]*',
        '#nice h4:[\\w-]+[^{]*',
        '#nice h4\\.[\\w-]+[^{]*'
      ],
      'p': [
        '#nice p(?![\\w-])',
        '#nice p:[\\w-]+[^{]*'
      ],
      'blockquote': [
        '#nice blockquote(?![\\w-])',
        '#nice blockquote [^{]*',
        '#nice blockquote:[\\w-]+[^{]*'
      ],
      'ul': [
        '#nice ul(?![\\w-])',
        '#nice ul [^{]*',
        '#nice li section[^{]*'
      ],
      'ol': [
        '#nice ol(?![\\w-])',
        '#nice ol [^{]*',
        '#nice li section[^{]*'
      ],
      'code': [
        '#nice [^}]*code(?![\\w-])[^{]*',
        '#nice pre code[^{]*'
      ],
      'pre': [
        '#nice pre(?![\\w-])',
        '#nice pre [^{]*'
      ],
      'strong': [
        '#nice strong(?![\\w-])',
        '#nice [^}]*strong[^{]*'
      ],
      'em': [
        '#nice em(?![\\w-])',
        '#nice [^}]*em[^{]*'
      ],
      'table': [
        '#nice table(?![\\w-])',
        '#nice table [^{]*',
        '#nice tr [^{]*',
        '#nice th[^{]*',
        '#nice td[^{]*'
      ],
      'figure': [
        '#nice img(?![\\w-])',
        '#nice figcaption[^{]*'
      ]
    };

    const result = patterns[elementType] || [];
    console.log(`${elementType} 的CSS模式:`, result);
    return result;
  };

  // 生成预览文本
  generatePreviewText = (elementType, themeName) => {
    const previewTexts = {
      'h1': `📖 ${themeName}的一级标题`,
      'h2': `📝 ${themeName}的二级标题`,
      'h3': `📄 ${themeName}的三级标题`,
      'h4': `📋 ${themeName}的四级标题`,
      'p': `这是${themeName}的段落文字样式`,
      'blockquote': `> 这是${themeName}的引用样式`,
      'ul': `• ${themeName}的列表项`,
      'ol': `1. ${themeName}的有序列表`,
      'code': `${themeName}的代码`,
      'pre': `代码块样式`,
      'strong': `**${themeName}加粗**`,
      'em': `*${themeName}斜体*`,
      'table': `${themeName}表格`,
      'figure': `${themeName}图片`
    };

    return previewTexts[elementType] || `${themeName}样式`;
  };

  // 为选中元素生成唯一标识符
  generateUniqueElementId = () => {
    return `selected-element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 为选中的元素添加唯一class
  addUniqueClassToElement = (uniqueClass) => {
    try {
      const { selectedElementInfo } = this.props;

      if (!selectedElementInfo || !selectedElementInfo.element) {
        console.error('无法获取选中的元素');
        return false;
      }

      const element = selectedElementInfo.element;

      // 验证element是否为有效的DOM元素
      if (!(element instanceof Element)) {
        console.error('选中的对象不是有效的DOM元素');
        return false;
      }

      // 添加唯一class
      element.classList.add(uniqueClass);
      console.log(`为元素添加唯一class: ${uniqueClass}`);

      // 验证是否成功添加
      if (element.classList.contains(uniqueClass)) {
        return true;
      } else {
        console.error('添加唯一class失败');
        return false;
      }
    } catch (error) {
      console.error('添加唯一class时出错:', error);
      return false;
    }
  };

  // 将通用CSS选择器转换为特定元素的选择器
  convertToSpecificSelector = (cssText, elementType, uniqueClass) => {
    if (!cssText || !uniqueClass) {
      console.warn('convertToSpecificSelector: 缺少参数', { cssText: !!cssText, uniqueClass });
      return cssText;
    }

    console.log('=== CSS转换开始 ===');
    console.log('原始CSS:', cssText);
    console.log('元素类型:', elementType);
    console.log('唯一class:', uniqueClass);

    let modifiedCSS = cssText;

    // 更全面的选择器转换
    const transformations = [
      // 基础选择器转换
      {
        pattern: `#nice ${elementType}(?![\\w-])`,
        replacement: `#nice ${elementType}.${uniqueClass}`
      },
      // 伪类选择器转换
      {
        pattern: `#nice ${elementType}(:[\\w-]+)`,
        replacement: `#nice ${elementType}.${uniqueClass}$1`
      },
      // 伪元素选择器转换
      {
        pattern: `#nice ${elementType}(::[\\w-]+)`,
        replacement: `#nice ${elementType}.${uniqueClass}$1`
      },
      // 子选择器转换
      {
        pattern: `#nice ${elementType}\\s+([.#]?[\\w-]+)`,
        replacement: `#nice ${elementType}.${uniqueClass} $1`
      },
      // 类选择器转换
      {
        pattern: `#nice ${elementType}\\.(\\w+)`,
        replacement: `#nice ${elementType}.${uniqueClass}.$1`
      }
    ];

    transformations.forEach((transform, index) => {
      const regex = new RegExp(transform.pattern, 'gi');
      const beforeCount = (modifiedCSS.match(regex) || []).length;
      modifiedCSS = modifiedCSS.replace(regex, transform.replacement);
      const afterCount = (modifiedCSS.match(new RegExp(transform.replacement.replace(/\\$\\d/g, '[^\\s]*'), 'gi')) || []).length;

      console.log(`转换 ${index + 1}: 模式="${transform.pattern}", 匹配=${beforeCount}次, 替换后=${afterCount}次`);
    });

    console.log('转换后的CSS:', modifiedCSS);
    console.log('=== CSS转换结束 ===');

    return modifiedCSS;
  };

  // 应用样式
  applyStyle = (style) => {
    const { selectedElementInfo } = this.props;
    const { applyToAll } = this.state;

    if (!selectedElementInfo) {
      message.error('没有选中的元素');
      return;
    }

    try {
      // 验证样式对象
      if (!style || !style.css) {
        console.error('无效的样式对象:', style);
        message.error('选中的样式无效，请重新选择');
        return;
      }

      // 获取元素类型
      const elementType = this.getElementType();
      if (!elementType) {
        console.error('无法获取元素类型');
        message.error('无法识别选中元素的类型，请重新选择');
        return;
      }

      let finalCSS = style.css;
      let targetDescription = '';

      // 特殊处理：代码块主题应用到项目的代码主题系统
      if (elementType === 'pre' && style.id && CODE_OPTIONS.find(opt => opt.id === style.id)) {
        const codeOptionIndex = CODE_OPTIONS.findIndex(opt => opt.id === style.id);
        const { isMacCode } = this.props.navbar;

        console.log('应用代码主题到项目系统:', {
          themeId: style.id,
          index: codeOptionIndex,
          isMacCode: isMacCode
        });

        // 调用项目的代码主题设置方法
        this.props.navbar.setCodeNum(codeOptionIndex, isMacCode);

        // 记录选中的样式
        this.setState({ selectedStyleId: style.id });

        message.success(`已应用 ${style.name} 代码主题`);
        return;
      }

      // 清理之前可能添加的唯一类（如果存在）
      this.cleanupPreviousUniqueClasses();

      if (applyToAll) {
        // 应用到所有同类型元素
        targetDescription = `所有 ${this.getElementDisplayName(elementType)} 元素`;
        console.log('应用样式到所有同类型元素');
      } else {
        // 只应用到当前选中的元素
        const uniqueClass = this.generateUniqueElementId();

        // 为选中元素添加唯一class
        if (this.addUniqueClassToElement(uniqueClass)) {
          // 将通用CSS转换为特定元素的CSS
          finalCSS = this.convertToSpecificSelector(style.css, elementType, uniqueClass);
          targetDescription = `选中的 ${selectedElementInfo.displayName}`;
          console.log('应用样式到特定元素');
        } else {
          message.error('无法为选中元素添加唯一标识，请重试');
          return;
        }
      }

      // 切换到自定义主题
      const { themeList } = this.props.content;
      if (!themeList || themeList.length === 0) {
        console.error('无法获取主题列表');
        message.error('无法获取主题配置，请刷新页面重试');
        return;
      }
      this.props.navbar.setTemplateNum(themeList.length - 1);

      // 获取当前CSS内容
      const currentCSS = this.props.content.style || '';

      // 合并新样式到当前CSS
      const newCSS = this.mergeStyleToCSS(currentCSS, finalCSS);

      // 验证合并后的CSS
      if (newCSS.length > currentCSS.length + 50000) {
        console.warn('合并后的CSS过大，可能存在重复或错误');
      }

      // 验证props方法是否存在
      if (!this.props.content.setCustomStyle) {
        console.error('setCustomStyle方法不存在');
        message.error('无法更新样式，请刷新页面重试');
        return;
      }

      // 更新自定义样式
      this.props.content.setCustomStyle(newCSS);

      // 记录选中的样式
      this.setState({ selectedStyleId: style.id });

      message.success(`已为${targetDescription}应用 ${style.name} 样式`);
    } catch (error) {
      console.error('应用样式失败:', error);
      message.error('应用样式时出现错误，请重试');
    }
  };

  // 清理之前的唯一类
  cleanupPreviousUniqueClasses = () => {
    try {
      const { selectedElementInfo } = this.props;
      if (!selectedElementInfo || !selectedElementInfo.element) {
        return;
      }

      const element = selectedElementInfo.element;
      const classList = element.classList;

      // 移除所有以 'selected-element-' 开头的类
      const classesToRemove = [];
      for (let i = 0; i < classList.length; i++) {
        const className = classList[i];
        if (className.startsWith('selected-element-')) {
          classesToRemove.push(className);
        }
      }

      classesToRemove.forEach(className => {
        element.classList.remove(className);
      });

      if (classesToRemove.length > 0) {
        console.log('已清理之前的唯一类:', classesToRemove);
      }
    } catch (error) {
      console.warn('清理唯一类时出错:', error);
    }
  };

  // 合并样式到CSS中
  mergeStyleToCSS = (currentCSS, newStyleCSS) => {
    console.log('=== CSS合并开始 ===');
    console.log('当前CSS长度:', currentCSS.length);
    console.log('新样式CSS:', newStyleCSS);

    if (!newStyleCSS || !newStyleCSS.trim()) {
      console.warn('新样式CSS为空，跳过合并');
      return currentCSS;
    }

    // 提取新样式的CSS规则
    const newRules = this.extractCSSRules(newStyleCSS);
    console.log('提取到的新规则:', newRules);

    let mergedCSS = currentCSS;

    // 对每个新规则，检查是否已存在相同选择器的规则
    newRules.forEach((newRule, index) => {
      const selector = newRule.selector;
      console.log(`处理规则 ${index + 1}: ${selector}`);

      // 移除现有的相同选择器规则
      const escapedSelector = this.escapeRegExp(selector);
      const existingRuleRegex = new RegExp(`${escapedSelector}\\s*\\{[^}]*\\}`, 'gi');

      const beforeLength = mergedCSS.length;
      mergedCSS = mergedCSS.replace(existingRuleRegex, '');
      const afterLength = mergedCSS.length;

      if (beforeLength !== afterLength) {
        console.log(`移除了现有的同名规则: ${selector}`);
      }
    });

    // 添加新的CSS规则
    mergedCSS += '\n\n/* 新应用的样式 */\n' + newStyleCSS;

    console.log('合并后CSS长度:', mergedCSS.length);
    console.log('=== CSS合并结束 ===');

    return mergedCSS;
  };

  // 提取CSS规则
  extractCSSRules = (cssText) => {
    const rules = [];
    // 改进正则表达式，更好地匹配CSS规则
    const ruleRegex = /([^{}]+)\s*\{[^}]*\}/g;
    let match;

    while ((match = ruleRegex.exec(cssText)) !== null) {
      const selector = match[1].trim();
      if (selector) { // 确保选择器不为空
        rules.push({
          selector: selector,
          fullRule: match[0]
        });
      }
    }

    console.log(`从CSS中提取到 ${rules.length} 个规则`);
    return rules;
  };

  // 转义正则表达式特殊字符
  escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // 改进的CSS选择器替换
  replaceNiceSelectors = (css, previewId) => {
    if (!css) return '';

    console.log('=== CSS选择器替换开始 ===');
    console.log('原始CSS长度:', css.length);
    console.log('原始CSS前200字符:', css.substring(0, 200));
    console.log('预览ID:', previewId);

    let modifiedCSS = css;

    // 统计替换前的#nice数量
    const originalNiceCount = (css.match(/#nice/g) || []).length;
    console.log('原始CSS中的#nice数量:', originalNiceCount);

    // 第一步：将所有的 #nice 替换为预览ID
    modifiedCSS = modifiedCSS.replace(/#nice/g, `#${previewId}`);

    // 验证替换结果
    const replacedCount = (modifiedCSS.match(new RegExp(`#${previewId}`, 'g')) || []).length;
    console.log('替换后的预览ID数量:', replacedCount);

    console.log('替换后CSS长度:', modifiedCSS.length);
    console.log('替换后CSS前200字符:', modifiedCSS.substring(0, 200));
    console.log('=== CSS选择器替换结束 ===');

    return modifiedCSS;
  };

  // 优化后的样式预览生成
  generateStylePreview = (elementType, css, themeName, style = null) => {
    // 创建缓存键（包含Mac风格状态以确保预览正确更新）
    const { isMacCode } = this.props.navbar;
    const cacheKey = `${elementType}-${css.substring(0, 50)}-${themeName}-${isMacCode}`;

    // 检查缓存
    if (this.previewCache.has(cacheKey)) {
      return this.previewCache.get(cacheKey);
    }

    // 生成唯一ID（使用计数器确保唯一性）
    const previewId = `preview-${elementType}-${++this.previewCounter}`;

    // 改进的CSS选择器替换
    const previewCSS = this.replaceNiceSelectors(css, previewId);

    // 生成对应元素类型的HTML - 确保结构与原始#nice结构一致
    const getPreviewHTML = () => {
      const previewTexts = {
        'h1': `${themeName}标题`,
        'h2': `${themeName}标题`,
        'h3': `${themeName}标题`,
        'h4': `${themeName}标题`,
        'p': `${themeName}段落`,
        'blockquote': `${themeName}引用`,
        'ul': `${themeName}列表`,
        'ol': `${themeName}列表`,
        'code': `${themeName}代码`,
        'pre': `${themeName}代码块`,
        'strong': `${themeName}加粗`,
        'em': `${themeName}斜体`,
        'table': `${themeName}表格`
      };

      const text = previewTexts[elementType] || `${themeName}样式`;

      // 创建与#nice容器结构一致的HTML
      switch (elementType) {
        case 'h1':
          return `<h1>${text}</h1>`;
        case 'h2':
          return `<h2><span class="content">${text}</span></h2>`;
        case 'h3':
          return `<h3><span class="content">${text}</span></h3>`;
        case 'h4':
          return `<h4><span class="content">${text}</span></h4>`;
        case 'p':
          return `<p>${text}</p>`;
        case 'blockquote':
          return `<blockquote><p>${text}</p></blockquote>`;
        case 'ul':
          return `<ul><li><section>${text}</section></li></ul>`;
        case 'ol':
          return `<ol><li><section>${text}</section></li></ol>`;
        case 'code':
          return `<p><code>${text}</code></p>`;
        case 'pre':
          // 为代码块提供更真实的代码示例
          const codeExample = `function hello() {
  console.log("Hello World!");
  return true;
}`;
          // 检查是否为微信代码主题
          if (style && style.isWeChat) {
            return `<section class="code-snippet__fix code-snippet__js">
              <ul class="code-snippet__line-index code-snippet__js">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
              <pre class="code-snippet__js" data-lang="javascript">
                <code><span class="code-snippet_outer">function hello() {</span></code>
                <code><span class="code-snippet_outer">  console.log("Hello World!");</span></code>
                <code><span class="code-snippet_outer">  return true;</span></code>
                <code><span class="code-snippet_outer">}</span></code>
              </pre>
            </section>`;
          }
          // 其他代码主题使用标准结构
          return `<pre class="custom"><code class="hljs">${codeExample}</code></pre>`;
        case 'strong':
          return `<p><strong>${text}</strong></p>`;
        case 'em':
          return `<p><em>${text}</em></p>`;
        case 'table':
          return `<table><thead><tr><th>${text}</th></tr></thead><tbody><tr><td>示例内容</td></tr></tbody></table>`;
        default:
          return `<div>${text}</div>`;
      }
    };

    const result = {
      id: previewId,
      css: previewCSS,
      html: getPreviewHTML()
    };

    // 缓存结果（限制缓存大小）
    if (this.previewCache.size > 100) {
      // 清理最旧的缓存项
      const firstKey = this.previewCache.keys().next().value;
      this.previewCache.delete(firstKey);
    }
    this.previewCache.set(cacheKey, result);

    return result;
  };

  // 获取代码块主题 - 直接使用项目现有的CODE_OPTIONS和TEMPLATE系统
  getCodeBlockThemes = () => {
    const { isMacCode } = this.props.navbar;

    return CODE_OPTIONS.map((option, index) => {
      // 微信代码主题特殊处理
      if (option.id === 'wechat') {
        return {
          id: option.id,
          name: option.name,
          css: TEMPLATE.basic, // 微信主题使用basic.js中的样式
          isWeChat: true
        };
      }

      // 其他代码主题根据Mac风格选择相应版本
      const themeKey = isMacCode ? option.macId : option.id;
      let css = TEMPLATE.code[themeKey];

      // 确保CSS包含#nice .custom前缀，用于预览显示
      if (css && !css.includes('#nice .custom')) {
        css = `#nice .custom {\n  display: block;\n}\n\n` + css;
      }

      return {
        id: option.id,
        name: option.name,
        css: css,
        isWeChat: false
      };
    });
  };

  render() {
    const { selectedElementInfo } = this.props;
    const { selectedStyleId, applyToAll } = this.state;

    // 从selectedElementInfo中获取elementType
    const elementType = this.getElementType();

    if (!selectedElementInfo || !elementType) {
      return (
        <div className="style-selector">
          <div className="style-selector-header">
            <h3>样式选择器</h3>
            <p>请先选择一个元素</p>
          </div>
        </div>
      );
    }

    const styleOptions = this.getStyleOptions(elementType);

    if (styleOptions.length === 0) {
      return (
        <div className="style-selector">
          <div className="style-selector-header">
            <h3>{this.getElementDisplayName(elementType)} 样式选择</h3>
            <p>暂无可用的预定义样式</p>
          </div>
        </div>
      );
    }

    return (
      <div className="style-selector">
        <div className="style-selector-header">
          <h3>{this.getElementDisplayName(elementType)} 样式选择</h3>
          <p>
            {elementType === 'pre'
              ? `选择代码主题 (当前: ${this.props.navbar.isMacCode ? 'Mac风格' : '标准风格'})`
              : `选择预定义主题中的 ${this.getElementDisplayName(elementType)} 样式`
            }
          </p>

          {/* 为代码块添加Mac风格切换 */}
          {elementType === 'pre' ? (
            <div className="mac-style-selector" style={{ marginTop: 16, padding: '12px', background: '#f0f8ff', borderRadius: '6px', border: '1px solid #d1ecf1', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
              <span style={{ fontSize: '13px', color: '#0c5460', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Mac风格：</span>
              <Switch
                size="small"
                checked={this.props.navbar?.isMacCode || false}
                onChange={this.handleMacStyleChange}
              />
              <span style={{ fontSize: '12px', color: '#0c5460', whiteSpace: 'nowrap' }}>
                {this.props.navbar?.isMacCode ? 'Mac风格代码主题' : '标准代码主题'}
              </span>
            </div>
          ) : null}

          {/* 添加应用范围选择器 - 代码块不显示此选项 */}
          {elementType !== 'pre' && (
            <div className="apply-scope-selector" style={{ marginTop: 16, padding: '12px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #e9ecef', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
              <span style={{ fontSize: '13px', color: '#495057', fontWeight: 'bold', whiteSpace: 'nowrap' }}>应用范围：</span>
              <Switch
                size="small"
                checked={applyToAll}
                onChange={(checked) => this.setState({ applyToAll: checked })}
              />
              <span style={{ fontSize: '12px', color: '#6c757d', whiteSpace: 'nowrap' }}>
                {applyToAll ?
                  `所有 ${this.getElementDisplayName(elementType)} 元素` :
                  `仅当前选中的 ${this.getElementDisplayName(elementType)}`
                }
              </span>
            </div>
          )}
        </div>

        <div className="style-options">
          <Row gutter={[12, 12]}>
            {styleOptions.map((style) => {
              // 生成样式预览
              const preview = this.generateStylePreview(elementType, style.css, style.name.replace('风格', ''), style);

              return (
                <Col span={24} key={style.id}>
                  <Card
                    size="small"
                    className={`style-option-card ${selectedStyleId === style.id ? 'selected' : ''}`}
                    onClick={() => this.applyStyle(style)}
                  >
                    <div className="style-card-content">
                      <div className="style-preview">
                        {/* 添加样式预览的CSS */}
                        <style dangerouslySetInnerHTML={{ __html: preview.css }} />
                        {/* 渲染实际的HTML预览 */}
                        <div
                          id={preview.id}
                          className="preview-content"
                          dangerouslySetInnerHTML={{ __html: preview.html }}
                        />
                      </div>
                      <div className="style-info">
                        <h4 className="style-title">{style.name}</h4>
                        <p className="style-description">来自项目预定义主题</p>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    );
  }
}

export default StyleSelector; 