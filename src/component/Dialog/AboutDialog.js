import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Modal, Button } from "antd";

@inject("dialog")
@observer
class AboutDialog extends Component {
  handleOk = () => {
    this.props.dialog.setAboutOpen(false);
  };

  handleCancel = () => {
    this.props.dialog.setAboutOpen(false);
  };

  handleVersion = () => {
    this.props.dialog.setAboutOpen(false);
    this.props.dialog.setVersionOpen(true);
  };

  render() {
    return (
      <Modal
        title="关于"
        okText="确认"
        cancelText="取消"
        visible={this.props.dialog.isAboutOpen}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={this.handleOk}>
            确认
          </Button>,
        ]}
        bodyStyle={{
          paddingTop: "5px",
        }}
      >
        <h3 style={style.headerMargin}>
          Lyfe's Doc Editor
          <a
            id="nice-about-dialog-star"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/laifu2025/lyfes-doc-editor"
            style={style.noBorder}
          >
            <img alt="" style={style.img} src="https://badgen.net/github/stars/laifu2025/lyfes-doc-editor" />
          </a>
        </h3>

        <p style={style.lineHeight}>专为中文开发者设计的智能 Markdown 编辑器；</p>
        <p style={style.lineHeight}>支持云端同步、多平台发布；</p>
        <p style={style.lineHeight}>支持微信公众号、知乎和稀土掘金样式；</p>
        <p style={style.lineHeight}>
          如果你喜欢Lyfe的工具，欢迎关注
          <a
            id="nice-about-dialog-github"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/laifu2025/lyfes-doc-editor"
          >
            &nbsp;GitHub&nbsp;
          </a>
        </p>
      </Modal>
    );
  }
}

const style = {
  leftImgWidth: {
    width: "40%",
    height: "100%",
  },
  rightImgWidth: {
    width: "60%",
    height: "100%",
  },
  headerMargin: {
    marginTop: "5px",
    marginBottom: "5px",
    color: "black",
  },
  lineHeight: {
    lineHeight: "26px",
    color: "black",
    padding: 0,
    margin: 0,
  },
  img: {
    width: "70px",
    marginLeft: "10px",
    display: "inline-block",
  },
  noBorder: {
    border: "none",
  },
};

export default AboutDialog;
