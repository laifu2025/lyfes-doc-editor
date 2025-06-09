import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button, Tooltip, message } from "antd";
// import { EyeOutlined, EditOutlined, CopyOutlined } from "@ant-design/icons";
import classnames from "classnames";
import "./ElementSelector.css";

@inject("view")
@observer
class ElementSelector extends Component {
    handleEditInCSS = () => {
        const { selectedElement, onEditInCSS } = this.props;
        if (selectedElement && onEditInCSS) {
            onEditInCSS(selectedElement);
        }
    };

    handleCopySelector = () => {
        const { selectedElement } = this.props;
        if (selectedElement && selectedElement.selector) {
            navigator.clipboard.writeText(selectedElement.selector);
            message.success('CSS选择器已复制到剪贴板');
        }
    };

    handleCloseSelector = () => {
        const { onClose } = this.props;
        if (onClose) {
            onClose();
        }
    };

    render() {
        const { selectedElement, visible } = this.props;

        if (!visible || !selectedElement) {
            return null;
        }

        // 添加安全检查，避免undefined显示
        const elementInfo = {
            displayName: selectedElement.displayName || '未知元素',
            selector: selectedElement.selector || '',
            tagName: selectedElement.tagName || 'div'
        };

        const selectorClass = classnames("element-selector", {
            "element-selector-visible": visible
        });

        return (
            <div className={selectorClass}>
                <div className="element-selector-header">
                    <span className="element-selector-icon">
                        👁️
                    </span>
                    <div className="element-selector-info">
                        <div className="element-name">{elementInfo.displayName}</div>
                        <div className="element-selector-text">{elementInfo.selector}</div>
                    </div>
                    <div className="element-selector-actions">
                        <Tooltip title="复制选择器">
                            <Button
                                type="text"
                                size="small"
                                onClick={this.handleCopySelector}
                            >
                                📋
                            </Button>
                        </Tooltip>
                        <Tooltip title="在CSS中编辑">
                            <Button
                                type="primary"
                                size="small"
                                onClick={this.handleEditInCSS}
                            >
                                ✏️ 编辑样式
                            </Button>
                        </Tooltip>
                        <Button
                            type="text"
                            size="small"
                            onClick={this.handleCloseSelector}
                        >
                            ×
                        </Button>
                    </div>
                </div>

                <div className="element-selector-description">
                    <div className="css-editor-tip">
                        <span className="tip-icon">💡</span>
                        <div className="tip-content">
                            <div className="tip-title">风格选择区域已自动打开</div>
                            <div className="tip-text">您可以在右侧的CSS编辑器中修改 <code>{elementInfo.displayName}</code> 的样式</div>
                        </div>
                    </div>
                </div>

                {selectedElement.description && (
                    <div className="element-selector-extra">
                        {selectedElement.description}
                    </div>
                )}
            </div>
        );
    }
}

export default ElementSelector; 