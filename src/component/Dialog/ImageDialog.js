import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Modal, Upload, Tabs, Select } from "antd";

import SvgIcon from "../../icon";

import AliOSS from "../ImageHosting/AliOSS";
import QiniuOSS from "../ImageHosting/QiniuOSS";
import Gitee from "../ImageHosting/Gitee";
import GitHub from "../ImageHosting/GitHub";

import { uploadAdaptor } from "../../utils/imageHosting";
import { SM_MS_PROXY, IMAGE_HOSTING_TYPE, IMAGE_HOSTING_NAMES } from "../../utils/constant";
import appContext from "../../utils/appContext";

const { Dragger } = Upload;
const { TabPane } = Tabs;
const { Option } = Select;

@inject("dialog")
@inject("content")
@inject("imageHosting")
@inject("navbar")
@observer
class ImageDialog extends Component {
  constructor(props) {
    super(props);
    this.images = [];
  }

  // 确认后将内容更新到编辑器上
  handleOk = () => {
    // 检查是否有未处理的图片需要添加
    if (this.images.length > 0) {
      let text = "";
      // 成功后添加url
      if (this.props.navbar.isContainImgName) {
        this.images.forEach((value) => {
          text += `![${value.filename}](${value.url})\n`;
        });
      } else {
        this.images.forEach((value) => {
          text += `![](${value.url})\n`;
        });
      }

      const { markdownEditor } = this.props.content;
      const cursor = markdownEditor.getCursor();
      markdownEditor.replaceSelection(text, cursor);

      // 上传后实时更新内容
      try {
        const content = markdownEditor.getValue();
        this.props.content.setContent(content);
      } catch (error) {
        console.warn('编辑器内容同步失败:', error);
      }

      // 调整光标位置
      cursor.ch += 2;
      markdownEditor.setCursor(cursor);
    }

    // 重新初始化
    this.images = [];
    this.props.dialog.setImageOpen(false);

    // 确保编辑器获得焦点
    const { markdownEditor } = this.props.content;
    if (markdownEditor) {
      markdownEditor.focus();
    }
  };

  handleCancel = () => {
    this.props.dialog.setImageOpen(false);
  };

  customRequest = ({ action, data, file, headers, onError, onProgress, onSuccess, withCredentials }) => {
    const formData = new FormData();
    const { images } = this;
    const { content } = this.props; // 获取content用于上传时直接写入编辑器

    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }

    // 使用本地图床
    if (this.props.imageHosting.type === "本地图床") {
      uploadAdaptor({ file, onSuccess, onError, onProgress, images, content });
    }
    // 使用阿里云图床
    else if (this.props.imageHosting.type === "阿里云") {
      uploadAdaptor({ file, onSuccess, onError, images, content });
    }
    // 使用七牛云图床
    else if (this.props.imageHosting.type === "七牛云") {
      uploadAdaptor({ file, onSuccess, onError, onProgress, images, content });
    }
    // 使用SM.MS图床
    else if (this.props.imageHosting.type === "SM.MS") {
      uploadAdaptor({ formData, file, action, onProgress, onSuccess, onError, headers, withCredentials, images, content });
    }
    // 使用Gitee图床
    else if (this.props.imageHosting.type === "Gitee") {
      uploadAdaptor({ formData, file, action, onProgress, onSuccess, onError, headers, withCredentials, images, content });
    }
    // 使用GitHub图床
    else if (this.props.imageHosting.type === "GitHub") {
      uploadAdaptor({ formData, file, action, onProgress, onSuccess, onError, headers, withCredentials, images, content });
    }
    // 使用用户提供的图床或是默认图床
    else {
      uploadAdaptor({ formData, file, onSuccess, onError, images, content });
    }

    return {
      abort() {
        console.log("upload progress is aborted.");
      },
    };
  };

  typeChange = (type) => {
    this.props.imageHosting.setType(type);
    window.localStorage.setItem(IMAGE_HOSTING_TYPE, type);
  };

  render() {
    const { hostingList, type } = this.props.imageHosting;

    const columns = hostingList.map((option, index) => (
      <Option key={index} value={option.value}>
        {option.label}
      </Option>
    ));

    const imageHostingSwitch = (
      <Select style={{ width: "90px" }} value={type} onChange={this.typeChange}>
        {columns}
      </Select>
    );

    return (
      <Modal
        title="本地上传"
        okText="确认"
        cancelText="取消"
        visible={this.props.dialog.isImageOpen}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ paddingTop: "10px" }}
      >
        <appContext.Consumer>
          {({ useImageHosting }) => (
            <Tabs tabBarExtraContent={imageHostingSwitch} type="card">
              <TabPane tab="图片上传" key="1">
                <Dragger name="file" multiple action={SM_MS_PROXY} customRequest={this.customRequest}>
                  <p className="ant-upload-drag-icon">
                    <SvgIcon name="inbox" style={style.svgIcon} fill="#40a9ff" />
                  </p>
                  <p className="ant-upload-text">点击或拖拽一张或多张照片上传</p>
                  <p className="ant-upload-hint">{"正在使用" + type + "图床"}</p>
                </Dragger>
              </TabPane>
              {useImageHosting.isAliyunOpen ? (
                <TabPane tab={IMAGE_HOSTING_NAMES.aliyun} key="2">
                  <AliOSS />
                </TabPane>
              ) : null}
              {useImageHosting.isQiniuyunOpen ? (
                <TabPane tab={IMAGE_HOSTING_NAMES.qiniuyun} key="3">
                  <QiniuOSS />
                </TabPane>
              ) : null}
              {useImageHosting.isGiteeOpen ? (
                <TabPane tab={IMAGE_HOSTING_NAMES.gitee} key="4">
                  <Gitee />
                </TabPane>
              ) : null}
              {useImageHosting.isGitHubOpen ? (
                <TabPane tab={IMAGE_HOSTING_NAMES.github} key="5">
                  <GitHub />
                </TabPane>
              ) : null}
            </Tabs>
          )}
        </appContext.Consumer>
      </Modal>
    );
  }
}

const style = {
  svgIcon: {
    width: "48px",
    height: "48px",
  },
};

export default ImageDialog;
