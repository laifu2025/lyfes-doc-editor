import { observable, action } from "mobx";

class View {
  @observable isEditAreaOpen = true;

  @observable isPreviewAreaOpen = true;

  @observable isStyleEditorOpen = false;

  @observable isImmersiveEditing = false;

  @observable isDarkTheme = false;

  @action
  setEditAreaOpen = (isEditAreaOpen) => {
    this.isEditAreaOpen = isEditAreaOpen;
  };

  @action
  setPreviewAreaOpen = (isPreviewAreaOpen) => {
    this.isPreviewAreaOpen = isPreviewAreaOpen;
  };

  @action
  setStyleEditorOpen = (isStyleEditorOpen) => {
    this.isStyleEditorOpen = isStyleEditorOpen;
  };

  @action
  setImmersiveEditing = (isImmersiveEditing) => {
    this.isImmersiveEditing = isImmersiveEditing;
  };

  @action
  setDarkTheme = (isDarkTheme) => {
    this.isDarkTheme = isDarkTheme;
    // 保存主题设置到本地存储
    localStorage.setItem('isDarkTheme', JSON.stringify(isDarkTheme));
  };

  // 从本地存储加载主题设置
  loadThemeFromStorage = () => {
    const savedTheme = localStorage.getItem('isDarkTheme');
    if (savedTheme !== null) {
      this.isDarkTheme = JSON.parse(savedTheme);
    }
  };
}

const store = new View();

// 初始化时加载主题设置
store.loadThemeFromStorage();

export default store;
