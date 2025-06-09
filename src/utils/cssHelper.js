/**
 * CSS选择器和元素处理工具函数
 */

/**
 * 获取元素的CSS选择器路径
 * @param {Element} element - DOM元素
 * @returns {string} CSS选择器字符串
 */
export function getElementSelector(element) {
    if (!element || !element.tagName || element === document.body) {
        console.warn('getElementSelector: 无效的元素', element);
        return '';
    }

    const tagName = element.tagName.toLowerCase();

    // 优先使用ID
    if (element.id) {
        return `#${element.id}`;
    }

    // 检查是否在#nice容器内
    const niceContainer = element.closest('#nice');
    if (niceContainer) {
        let selector = '#nice ';

        // 处理常见的markdown元素
        switch (tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                return `${selector}${tagName}`;
            case 'p':
                return `${selector}p`;
            case 'blockquote':
                return `${selector}blockquote`;
            case 'code':
                const parent = element.parentElement;
                if (parent && parent.tagName.toLowerCase() === 'pre') {
                    return `${selector}pre code`;
                }
                return `${selector}p code, ${selector}li code`;
            case 'pre':
                return `${selector}pre code`;
            case 'strong':
                return `${selector}strong`;
            case 'em':
                return `${selector}em`;
            case 'del':
                return `${selector}del`;
            case 'a':
                return `${selector}a span`;
            case 'img':
                return `${selector}img`;
            case 'hr':
                return `${selector}hr`;
            case 'ul':
                return `${selector}ul`;
            case 'ol':
                return `${selector}ol`;
            case 'li':
                return `${selector}li section`;
            case 'table':
                return `${selector}table`;
            case 'th':
                return `${selector}table tr th`;
            case 'td':
                return `${selector}table tr td`;
            case 'figcaption':
                return `${selector}figcaption`;
            default:
                // 检查特殊类名
                if (element.classList && element.classList.contains('footnote-word')) {
                    return `${selector}.footnote-word`;
                }
                if (element.classList && element.classList.contains('footnote-ref')) {
                    return `${selector}.footnote-ref`;
                }
                if (element.classList && element.classList.contains('block-equation')) {
                    return `${selector}.block-equation svg`;
                }
                if (element.classList && element.classList.contains('inline-equation')) {
                    return `${selector}.inline-equation svg`;
                }
                // 如果没有特殊类名，返回基础选择器
                return `${selector}${tagName}`;
        }
    }

    // 如果不在#nice容器内，返回通用选择器
    return `#nice ${tagName}`;
}

/**
 * 在CSS文本中查找匹配的规则
 * @param {string} cssText - CSS文本内容
 * @param {string} selector - 要查找的选择器
 * @returns {Object} 匹配结果 {found: boolean, lineNumber: number, rule: string}
 */
export function findCSSRule(cssText, selector) {
    const lines = cssText.split('\n');
    const cleanSelector = selector.trim();

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 查找完全匹配的选择器
        if (line === cleanSelector + ' {' || line === cleanSelector + '{') {
            return {
                found: true,
                lineNumber: i + 1,
                rule: cleanSelector,
                fullMatch: true
            };
        }

        // 查找包含该选择器的规则（模糊匹配）
        if (line.includes(cleanSelector) && line.includes('{')) {
            return {
                found: true,
                lineNumber: i + 1,
                rule: line.split('{')[0].trim(),
                fullMatch: false
            };
        }
    }

    return {
        found: false,
        lineNumber: -1,
        rule: '',
        fullMatch: false
    };
}

/**
 * 根据标签名获取显示名称（用于CSS解析时）
 * @param {string} tagName - 标签名
 * @returns {string} 元素的可读名称
 */
export function getDisplayNameByTag(tagName) {
    const lowercaseTag = tagName.toLowerCase();

    switch (lowercaseTag) {
        case 'h1': return '一级标题';
        case 'h2': return '二级标题';
        case 'h3': return '三级标题';
        case 'h4': return '四级标题';
        case 'h5': return '五级标题';
        case 'h6': return '六级标题';
        case 'p': return '段落';
        case 'blockquote': return '引用块';
        case 'code': return '行内代码';
        case 'pre': return '代码块';
        case 'strong': return '加粗文字';
        case 'em': return '斜体文字';
        case 'del': return '删除线';
        case 'a': return '链接';
        case 'img': return '图片';
        case 'hr': return '分隔线';
        case 'ul': return '无序列表';
        case 'ol': return '有序列表';
        case 'li': return '列表项';
        case 'table': return '表格';
        case 'th': return '表头';
        case 'td': return '表格单元格';
        case 'figcaption': return '图片描述';
        default:
            return '元素';
    }
}

/**
 * 获取元素的可读名称
 * @param {Element} element - DOM元素
 * @returns {string} 元素的可读名称
 */
export function getElementDisplayName(element) {
    if (!element || !element.tagName) {
        return '元素';
    }

    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
        case 'h1': return '一级标题';
        case 'h2': return '二级标题';
        case 'h3': return '三级标题';
        case 'h4': return '四级标题';
        case 'h5': return '五级标题';
        case 'h6': return '六级标题';
        case 'p': return '段落';
        case 'blockquote': return '引用块';
        case 'code':
            const parent = element.parentElement;
            if (parent && parent.tagName.toLowerCase() === 'pre') {
                return '代码块';
            }
            return '行内代码';
        case 'pre': return '代码块';
        case 'strong': return '加粗文字';
        case 'em': return '斜体文字';
        case 'del': return '删除线';
        case 'a': return '链接';
        case 'img': return '图片';
        case 'hr': return '分隔线';
        case 'ul': return '无序列表';
        case 'ol': return '有序列表';
        case 'li': return '列表项';
        case 'table': return '表格';
        case 'th': return '表头';
        case 'td': return '表格单元格';
        case 'figcaption': return '图片描述';
        default:
            if (element.classList && element.classList.contains('footnote-word')) {
                return '脚注文字';
            }
            if (element.classList && element.classList.contains('footnote-ref')) {
                return '脚注引用';
            }
            if (element.classList && element.classList.contains('block-equation')) {
                return '数学公式(块)';
            }
            if (element.classList && element.classList.contains('inline-equation')) {
                return '数学公式(行内)';
            }
            return '元素';
    }
}

/**
 * 生成CSS规则模板
 * @param {string} selector - CSS选择器
 * @param {string} displayName - 元素显示名称
 * @returns {string} CSS规则模板
 */
export function generateCSSRuleTemplate(selector, displayName) {
    return `
/* ${displayName} */
${selector} {
  /* 在这里添加${displayName}的样式 */
  
}`;
}

/**
 * 提取与选择器相关的CSS规则
 * @param {string} cssText - 完整的CSS文本
 * @param {string} targetSelector - 目标选择器
 * @returns {string} 相关的CSS规则文本
 */
export function extractRelatedCSS(cssText, targetSelector) {
    // 输入验证
    if (!cssText || typeof cssText !== 'string') {
        console.warn('extractRelatedCSS: 无效的CSS文本', cssText);
        return createDefaultTemplate(targetSelector);
    }

    if (!targetSelector || typeof targetSelector !== 'string') {
        console.warn('extractRelatedCSS: 无效的目标选择器', targetSelector);
        return createDefaultTemplate(targetSelector);
    }

    console.log('提取CSS规则 - 目标选择器:', targetSelector); // 调试日志

    const lines = cssText.split('\n');
    const relatedLines = [];
    let inRelatedBlock = false;
    let braceLevel = 0;
    let foundRule = false;

    // 清理目标选择器并生成多个匹配模式
    const cleanTargetSelector = targetSelector.trim().toLowerCase();
    const selectorVariants = generateSelectorVariants(targetSelector);

    console.log('选择器变体:', selectorVariants); // 调试日志

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim().toLowerCase();

        // 跳过空行和只有注释的行（在块外）
        if (!trimmedLine || (trimmedLine.startsWith('/*') && !inRelatedBlock)) {
            // 检查注释是否包含相关信息
            if (trimmedLine.startsWith('/*')) {
                const tagName = targetSelector.split(' ').pop() || 'div';
                const displayName = getDisplayNameByTag(tagName);
                if (trimmedLine.includes(displayName.toLowerCase())) {
                    relatedLines.push(line);
                }
            }
            continue;
        }

        // 检查是否是相关的CSS规则开始
        if (trimmedLine.includes('{') && !inRelatedBlock) {
            const selectorPart = trimmedLine.split('{')[0].trim();

            // 使用改进的匹配逻辑
            if (isMatchingSelector(selectorPart, selectorVariants)) {
                inRelatedBlock = true;
                foundRule = true;
                relatedLines.push(line);
                braceLevel = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
                console.log('找到匹配规则:', selectorPart); // 调试日志
                continue;
            }
        }

        // 如果在相关块中，继续添加行
        if (inRelatedBlock) {
            relatedLines.push(line);
            braceLevel += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;

            // 如果大括号平衡，结束当前块
            if (braceLevel <= 0) {
                inRelatedBlock = false;
                braceLevel = 0;
                relatedLines.push(''); // 添加空行分隔
            }
        }
    }

    // 如果找到了规则，返回结果
    if (foundRule) {
        const result = relatedLines.join('\n').trim();
        console.log('提取结果:', result); // 调试日志
        return result || createDefaultTemplate(targetSelector);
    }

    // 如果没有找到相关规则，返回带有建议的模板
    console.log('未找到匹配规则，返回默认模板'); // 调试日志
    return createDefaultTemplate(targetSelector);
}

/**
 * 生成选择器的变体用于匹配
 * @param {string} targetSelector - 目标选择器
 * @returns {Array} 选择器变体数组
 */
function generateSelectorVariants(targetSelector) {
    const variants = [targetSelector.toLowerCase().trim()];

    // 移除#nice前缀的变体
    if (targetSelector.includes('#nice')) {
        variants.push(targetSelector.replace('#nice', '').trim().toLowerCase());
    }

    // 提取标签名
    const tagName = targetSelector.split(' ').pop();
    if (tagName) {
        variants.push(tagName.toLowerCase());
        variants.push(`#nice ${tagName}`.toLowerCase());
    }

    // 特殊处理一些常见情况
    if (targetSelector.includes('h1')) variants.push('h1');
    if (targetSelector.includes('h2')) variants.push('h2');
    if (targetSelector.includes('h3')) variants.push('h3');
    if (targetSelector.includes('h4')) variants.push('h4');
    if (targetSelector.includes('h5')) variants.push('h5');
    if (targetSelector.includes('h6')) variants.push('h6');
    if (targetSelector.includes('blockquote')) variants.push('blockquote');
    if (targetSelector.includes('code')) variants.push('code', 'pre code');
    if (targetSelector.includes('strong')) variants.push('strong');
    if (targetSelector.includes('em')) variants.push('em');

    return [...new Set(variants)]; // 去重
}

/**
 * 检查选择器是否匹配
 * @param {string} cssSelector - CSS中的选择器
 * @param {Array} variants - 目标选择器的变体
 * @returns {boolean} 是否匹配
 */
function isMatchingSelector(cssSelector, variants) {
    const cleanCssSelector = cssSelector.toLowerCase().trim();

    return variants.some(variant => {
        // 完全匹配
        if (cleanCssSelector === variant) return true;

        // 包含匹配
        if (cleanCssSelector.includes(variant) || variant.includes(cleanCssSelector)) return true;

        // 标签名匹配
        const cssTag = cleanCssSelector.split(' ').pop();
        const variantTag = variant.split(' ').pop();
        if (cssTag === variantTag) return true;

        return false;
    });
}

/**
 * 创建默认的CSS模板
 * @param {string} targetSelector - 目标选择器
 * @returns {string} 默认模板
 */
function createDefaultTemplate(targetSelector) {
    const tagName = targetSelector ? targetSelector.split(' ').pop() || 'div' : 'div';
    const displayName = getDisplayNameByTag(tagName);

    const examples = getStyleExamples(tagName);

    return `/* ${displayName} 样式规则 */
/* 当前主题中未找到 ${displayName} 的现有样式，您可以添加新样式 */

${targetSelector || `#nice ${tagName}`} {
  /* 以下是一些常用的 ${displayName} 样式示例，您可以取消注释并修改 */
  
${examples}
}

/* 提示：您可以复制上面的样式规则到完整CSS中，或者点击"显示全部"按钮查看完整样式 */`;
}

/**
 * 获取不同元素类型的样式示例
 * @param {string} tagName - 标签名
 * @returns {string} 样式示例
 */
function getStyleExamples(tagName) {
    switch (tagName.toLowerCase()) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return `  /* font-size: 24px; */
  /* color: #333; */
  /* font-weight: bold; */
  /* margin: 20px 0 10px; */
  /* border-bottom: 2px solid #3498db; */`;

        case 'p':
            return `  /* font-size: 16px; */
  /* line-height: 1.8; */
  /* color: #444; */
  /* margin: 12px 0; */
  /* text-align: justify; */`;

        case 'blockquote':
            return `  /* background: #f8f9fa; */
  /* border-left: 4px solid #3498db; */
  /* padding: 15px 20px; */
  /* margin: 20px 0; */
  /* font-style: italic; */`;

        case 'code':
            return `  /* background: #f1f2f6; */
  /* padding: 2px 6px; */
  /* border-radius: 3px; */
  /* font-family: "Monaco", "Consolas", monospace; */
  /* color: #e74c3c; */`;

        case 'pre':
            return `  /* background: #2c3e50; */
  /* color: #ecf0f1; */
  /* padding: 20px; */
  /* border-radius: 8px; */
  /* overflow-x: auto; */`;

        case 'a':
            return `  /* color: #3498db; */
  /* text-decoration: none; */
  /* border-bottom: 1px solid transparent; */
  /* transition: all 0.3s ease; */`;

        case 'img':
            return `  /* max-width: 100%; */
  /* border-radius: 8px; */
  /* box-shadow: 0 4px 8px rgba(0,0,0,0.1); */
  /* margin: 20px auto; */
  /* display: block; */`;

        case 'table':
            return `  /* border-collapse: collapse; */
  /* width: 100%; */
  /* margin: 20px 0; */
  /* border: 1px solid #ddd; */`;

        case 'ul':
        case 'ol':
            return `  /* margin: 15px 0; */
  /* padding-left: 25px; */`;

        case 'li':
            return `  /* margin: 5px 0; */
  /* line-height: 1.6; */`;

        default:
            return `  /* color: #333; */
  /* font-size: 14px; */
  /* margin: 10px 0; */`;
    }
}

/**
 * 检查两个选择器是否相关
 * @param {string} selector1 - 选择器1
 * @param {string} selector2 - 选择器2
 * @returns {boolean} 是否相关
 */
function isRelatedSelector(selector1, selector2) {
    const s1 = selector1.toLowerCase().trim();
    const s2 = selector2.toLowerCase().trim();

    // 完全匹配
    if (s1 === s2) return true;

    // 检查是否一个是另一个的子集
    if (s1.includes(s2) || s2.includes(s1)) return true;

    // 检查标签名匹配
    const tag1 = s1.split(' ').pop();
    const tag2 = s2.split(' ').pop();
    if (tag1 === tag2) return true;

    return false;
}

/**
 * 合并用户编辑的CSS与原始CSS
 * @param {string} originalCSS - 原始完整CSS
 * @param {string} editedCSS - 用户编辑的CSS片段
 * @param {string} targetSelector - 目标选择器
 * @returns {string} 合并后的完整CSS
 */
export function mergeCSS(originalCSS, editedCSS, targetSelector) {
    // 简单实现：直接替换或追加
    // 更复杂的合并逻辑可以根据需要实现

    if (!editedCSS.trim()) {
        return originalCSS;
    }

    // 如果编辑的CSS包含选择器，说明是完整的规则
    if (editedCSS.includes(targetSelector)) {
        return originalCSS + '\n\n/* 用户自定义样式 */\n' + editedCSS;
    }

    // 否则，包装为完整规则
    const wrappedCSS = `\n\n/* 用户自定义样式 */\n${targetSelector} {\n${editedCSS}\n}`;
    return originalCSS + wrappedCSS;
} 