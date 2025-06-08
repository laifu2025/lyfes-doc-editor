import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import classnames from "classnames";

import File from "../component/MenuLeft/File";
import Help from "../component/MenuLeft/Help";
import Pattern from "../component/MenuLeft/Pattern";
import Function from "../component/MenuLeft/Function";

import Setting from "../component/MenuLeft/Setting";
import View from "../component/MenuLeft/View";
import UserLogin from "../component/UserLogin/UserLogin";

import "./Navbar.css";

@inject("view")
@inject("content")
@inject("documentManager")
@observer
class Navbar extends Component {
  
  // 处理用户登录后的操作
  handleUserLogin = async (userInfo) => {
    console.log('用户已登录:', userInfo);
    
    if (this.props.documentManager) {
      try {
        // 不要清空文档，直接加载当前用户的数据
        console.log('开始加载用户文档...');
        
        // 先加载本地存储的文档（如果有的话）
        this.props.documentManager.loadFromLocalStorage();
        console.log('本地文档加载完成，当前文档数量:', this.props.documentManager.documents.length);
        
        // 如果本地没有文档，创建一些默认文档
        if (this.props.documentManager.documents.length === 0) {
          console.log('本地无文档，创建默认文档');
          await this.props.documentManager.createDocument('欢迎使用文档编辑器');
          await this.props.documentManager.createFolder('我的文件夹');
        }
        
        // 在后台尝试同步服务器文档（不阻塞用户界面）
        setTimeout(async () => {
          try {
            console.log('开始后台同步服务器文档...');
            await this.props.documentManager.loadServerDocuments();
            console.log('服务器文档同步完成');
          } catch (error) {
            console.warn('服务器文档同步失败，用户可继续使用本地功能:', error);
          }
        }, 100); // 100ms后开始后台同步
        
      } catch (error) {
        console.error('登录后加载文档失败:', error);
      }
    }
  };

  // 处理用户切换的操作
  handleUserSwitch = async (userInfo) => {
    console.log('用户切换:', userInfo);
    
    if (this.props.documentManager) {
      try {
        // 使用文档管理器的用户切换功能
        await this.props.documentManager.switchUser(userInfo.userId);
        console.log('用户切换完成');
      } catch (error) {
        console.error('用户切换失败:', error);
      }
    }
  };

  // 处理用户登出后的操作
  handleUserLogout = () => {
    console.log('用户已登出');
    
    // 保存当前文档到本地存储（不丢失用户数据）
    if (this.props.documentManager) {
      this.props.documentManager.saveToLocalStorage();
      
      // 清空当前显示的文档，但不删除localStorage
      this.props.documentManager.clearBrowserDocuments();
    }
    
    // 清空编辑器内容
    if (this.props.content) {
      this.props.content.setContent('');
    }
  };

  render() {
    const {title, token} = this.props;
    const {isImmersiveEditing} = this.props.view;
    const niceNavbarClass = classnames({
      "nice-navbar": true,
      "nice-navbar-hide": isImmersiveEditing,
    });
    return (
      <div className={niceNavbarClass}>
        <div className="nice-left-nav">
          {title === "" ? null : (
            <section id="nice-title" className="nice-title">
              {title}
            </section>
          )}
          <File />
          <Pattern />
          <Function />
          <View />
          <Setting />
          <Help />
        </div>
        <div className="nice-right-nav">
          <UserLogin 
            onUserLogin={this.handleUserLogin}
            onUserSwitch={this.handleUserSwitch}
            onUserLogout={this.handleUserLogout}
          />
        </div>
      </div>
    );
  }
}

export default Navbar;
