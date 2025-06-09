import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Modal, Timeline, Button } from "antd";
import axios from "axios";
import { NEWEST_VERSION } from "../../utils/constant";
import SvgIcon from "../../icon";

import "./VersionDialog.css";

@inject("dialog")
@observer
class VersionDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      versionNumber: 0,
      versionTimeline: [],
      recommend: null,
      specialInfo: "",
    };
  }

  handleOk = () => {
    this.props.dialog.setVersionOpen(false);
  };

  handleCancel = () => {
    this.props.dialog.setVersionOpen(false);
  };

  handleMore = () => {
    const w = window.open("about:blank");
    w.location.href = "https://github.com/laifu2025/lyfes-doc-editor/blob/master/CHANGELOG.md";
  };

  handleDocs = () => {
    const w = window.open("about:blank");
    w.location.href = "https://github.com/laifu2025/lyfes-doc-editor";
  };

  componentDidMount = async () => {
    try {
      const data = {
        versionId: 1,
        versionNumber: "1.0.0",
        versionTimeline: [
          "2024-01-15 发布1.0.0正式版本",
          "2024-01-14 完善项目文档结构，新增DEPLOYMENT.md部署指南",
          "2024-01-13 整合README文档，添加系统架构图和功能对比表",
          "2024-01-12 项目清理：删除开发过程文件，优化代码结构",
          "2024-01-11 创建.gitignore，清理package.json依赖",
          "2024-01-10 添加服务器端功能，支持本地API服务",
          "2023-09-20 增加网格黑主题",
          "2023-09-14 解决超链接文字复制到公众号颜色失效的问题",
          "2023-09-01 优化部分配置与信息",
          "2023-08-30 Fork 自 markdown-nice项目"
        ],
        recommend: {
          link: "https://github.com/laifu2025/lyfes-doc-editor",
          mainInfo: "欢迎查看项目最新代码和文档",
        },
        specialInfo: ''
      };
      const newestVersion = localStorage.getItem(NEWEST_VERSION);
      if (data.versionNumber !== newestVersion) {
        this.props.dialog.setVersionOpen(true);
        localStorage.setItem(NEWEST_VERSION, data.versionNumber);
      }
      this.setState({ ...data });
    } catch (err) {
      console.error("读取最新版本信息错误");
    }
  };

  render() {
    return (
      <Modal
        title="版本更新与说明"
        visible={this.props.dialog.isVersionOpen}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={this.handleOk}>
            确认
          </Button>,
        ]}
        destroyOnClose
      >
        <Timeline>
          <Timeline.Item dot={<SvgIcon name="environment" style={style.svgIcon} />}>
            <strong>更多版本更新与说明信息请查看
              <a
                id="more-info"
                style={{ fontWeight: "bold", borderBottom: "solid" }}
                alt=""
                href="https://github.com/laifu2025/lyfes-doc-editor"
                rel="noopener noreferrer"
                target="_blank"
              >
                这里
              </a>
            </strong>
          </Timeline.Item>
          {this.state.versionTimeline.map((version, index) => {
            /*if (index === 0) {
              return (
                <Timeline.Item key={index} dot={<SvgIcon name="environment" style={style.svgIcon} />}>
                  <strong>{version}</strong>
                </Timeline.Item>
              );
            } else {
              return <Timeline.Item key={index}>{version}</Timeline.Item>;
            }*/
            return <Timeline.Item key={index}>{version}</Timeline.Item>;
          })}
          <Timeline.Item>
            了解更多，请查看
            <a
              id="nice-version-dialog-doc"
              style={{ fontWeight: "bold" }}
              alt=""
              href="https://github.com/laifu2025/lyfes-doc-editor"
              rel="noopener noreferrer"
              target="_blank"
            >
              本仓库源码与说明
            </a>
          </Timeline.Item>
          {this.state.recommend && (
            <Timeline.Item dot={<SvgIcon name="more" style={style.svgIcon} />}>
              <a
                id="nice-version-dialog-recommend"
                style={{ fontWeight: "bold", borderBottom: "double" }}
                alt=""
                href={this.state.recommend.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                {this.state.recommend.mainInfo}
              </a>
            </Timeline.Item>
          )}
        </Timeline>
        {this.state.specialInfo && (
          <div
            id="nice-version-dialog-special"
            dangerouslySetInnerHTML={{ __html: this.state.specialInfo }}
            className="specialInfo"
          />
        )}
      </Modal>
    );
  }
}

const style = {
  svgIcon: {
    width: "16px",
    height: "16px",
  },
};

export default VersionDialog;
