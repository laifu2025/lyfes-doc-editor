import { observable, action } from "mobx";
import {
  IMAGE_HOSTING_TYPE,
  ALIOSS_IMAGE_HOSTING,
  QINIUOSS_IMAGE_HOSTING,
  GITEE_IMAGE_HOSTING,
  GITHUB_IMAGE_HOSTING,
  IMAGE_HOSTING_NAMES,
} from "../utils/constant";

class ImageHosting {
  @observable type = "";

  @observable hostingList = [];

  @observable hostingUrl = "";

  @observable hostingName = "";

  @action
  setType = (type) => {
    this.type = type;
  };

  @action
  setHostingUrl = (url) => {
    this.hostingUrl = url;
  };

  @action
  setHostingName = (name) => {
    this.hostingName = name;
  };

  @action
  addImageHosting = (name) => {
    this.hostingList.push({
      value: name,
      label: name,
    });
  };
}

const store = new ImageHosting();

// 如果为空先把数据放进去
if (!window.localStorage.getItem(ALIOSS_IMAGE_HOSTING)) {
  const alioss = JSON.stringify({
    region: "",
    accessKeyId: "",
    accessKeySecret: "",
    bucket: "",
  });
  window.localStorage.setItem(ALIOSS_IMAGE_HOSTING, alioss);
}

// 如果为空先把数据放进去
if (!window.localStorage.getItem(QINIUOSS_IMAGE_HOSTING)) {
  const qiniuoss = JSON.stringify({
    region: "",
    accessKey: "",
    secretKey: "",
    bucket: "",
    domain: "https://",
    namespace: "",
  });
  window.localStorage.setItem(QINIUOSS_IMAGE_HOSTING, qiniuoss);
}

// 如果为空先把数据放进去
if (!window.localStorage.getItem(GITEE_IMAGE_HOSTING)) {
  const gitee = JSON.stringify({
    username: "",
    repo: "",
    token: "",
  });
  window.localStorage.setItem(GITEE_IMAGE_HOSTING, gitee);
}

// 如果为空先把数据放进去
if (!window.localStorage.getItem(GITHUB_IMAGE_HOSTING)) {
  const github = JSON.stringify({
    username: "",
    repo: "",
    token: "",
    jsdelivr: "true",
  });
  window.localStorage.setItem(GITHUB_IMAGE_HOSTING, github);
}

// 初始化图床类型，如果没有设置则默认使用本地图床
const savedType = window.localStorage.getItem(IMAGE_HOSTING_TYPE);
if (!savedType) {
  store.type = IMAGE_HOSTING_NAMES.local;
  window.localStorage.setItem(IMAGE_HOSTING_TYPE, IMAGE_HOSTING_NAMES.local);
} else {
  store.type = savedType;
}

export default store;
