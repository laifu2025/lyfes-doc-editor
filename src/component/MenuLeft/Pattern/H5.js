import React, { Component } from "react";
import { observer, inject } from "mobx-react";

import { h5 } from "../../../utils/editorKeyEvents";
import { hotKeys } from "../../../utils/hotkey";

import "../common.css";

@inject("content")
@observer
class H5 extends Component {
    handleClick = () => {
        const { markdownEditor } = this.props.content;
        const selection = markdownEditor.getSelection();
        h5(markdownEditor, selection);

        // 上传后实时更新内容
        const content = markdownEditor.getValue();
        this.props.content.setContent(content);
        markdownEditor.focus();
    };

    render() {
        return (
            <div id="nice-menu-h5" className="nice-menu-item" onClick={this.handleClick}>
                <span>
                    <span className="nice-menu-flag" />
                    <span className="nice-menu-name">五级标题</span>
                </span>
                <span className="nice-menu-shortcut">{hotKeys.h5}</span>
            </div>
        );
    }
}

export default H5; 