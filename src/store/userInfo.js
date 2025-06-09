// mobx
import {observable, action} from "mobx";

class UserInfo {
  // 观察值
  @observable userInfo = {};

  @observable userRepo = [];

  @observable isLoggedIn = false;

  @observable currentUserId = null;

  constructor() {
    // 从localStorage恢复用户状态
    this.loadUserFromStorage();
  }

  @action
  setUserInfo = (userInfo) => {
    this.userInfo = userInfo;
    this.isLoggedIn = !!userInfo.username;
    this.currentUserId = userInfo.userId || null;
    
    // 保存到localStorage
    if (userInfo.username) {
      localStorage.setItem('username', userInfo.username);
      localStorage.setItem('user_id', userInfo.userId);
    }
  };

  @action
  setUserRepo = (userRepoList) => {
    this.userRepo = userRepoList;
  };

  @action
  loadUserFromStorage = () => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('user_id');
    
    if (username && userId) {
      this.userInfo = { username, userId };
      this.isLoggedIn = true;
      this.currentUserId = userId;
    }
  };

  @action
  login = (username) => {
    if (!username || !username.trim()) {
      throw new Error('用户名不能为空');
    }
    
    const cleanUsername = username.trim();
    const userId = 'user_' + cleanUsername.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // 检查是否是新用户（切换用户）
    const isUserSwitch = this.currentUserId && this.currentUserId !== userId;
    
    this.setUserInfo({ username: cleanUsername, userId });
    
    return { username: cleanUsername, userId, isUserSwitch };
  };

  @action
  logout = () => {
    // 清除用户信息
    this.userInfo = {};
    this.userRepo = [];
    this.isLoggedIn = false;
    this.currentUserId = null;
    
    // 清除localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('auth_token');
  };

  @action
  switchUser = (newUsername) => {
    // 先登出当前用户
    this.logout();
    
    // 再登录新用户
    return this.login(newUsername);
  };

  // 计算属性
  get username() {
    return this.userInfo.username || '';
  }

  get userId() {
    return this.userInfo.userId || '';
  }
}

const userInfo = new UserInfo();

export default userInfo;
