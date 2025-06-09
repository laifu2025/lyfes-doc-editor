import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button, Tooltip } from "antd";
import { ENTER_DELAY, LEAVE_DELAY } from "../../utils/constant";

import "./LeftNavbar.css";

@inject("documentManager")
@inject("view")
@inject("dialog")
@inject("content")
@observer
class LeftNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isHovered: false,
      isDragging: false,
      isHorizontal: false, // 新增：是否为横向布局
      position: this.getInitialPosition(), // 使用函数计算初始位置
      dragOffset: { x: 0, y: 0 }
    };
    this.checkTimer = null;
    this.hideTimer = null;
    this.navbarRef = React.createRef();
  }

  getInitialPosition = () => {
    // 考虑导航栏尺寸和安全边距计算初始位置
    const navbarWidth = 48; // 导航栏宽度（竖向时）
    const navbarHeight = 220; // 增加估算导航栏高度，更保守
    const margin = 40; // 增加安全边距，确保不跳出边界

    // 确保初始位置不会导致导航栏超出屏幕
    const maxY = window.innerHeight - navbarHeight - margin;
    const safeY = Math.max(margin, maxY);

    return {
      x: margin, // 左边距
      y: safeY // 安全的Y坐标
    };
  };

  componentDidMount() {
    // 初始检查
    this.checkDocumentPanelState();

    // 设置定时器定期检查
    this.checkTimer = setInterval(this.checkDocumentPanelState, 1000);

    // 添加鼠标事件监听器用于拖拽
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);

    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);

    // 组件挂载后进行一次位置校正
    setTimeout(() => {
      this.adjustPosition();
    }, 100);
  }

  componentWillUnmount() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    // 移除事件监听器
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    // 窗口大小变化时调整位置，确保导航栏不会超出视窗
    this.adjustPosition();
  };

  adjustPosition = () => {
    // 调整位置确保导航栏不会超出视窗
    const navbar = this.navbarRef.current;
    if (!navbar) return;

    const rect = navbar.getBoundingClientRect();
    const margin = 40; // 与getInitialPosition保持一致的安全边距
    const maxX = window.innerWidth - rect.width - margin;
    const maxY = window.innerHeight - rect.height - margin;

    this.setState(prevState => {
      const newPosition = {
        x: Math.min(Math.max(margin, prevState.position.x), maxX),
        y: Math.min(Math.max(margin, prevState.position.y), maxY)
      };

      // 只有位置真的需要调整时才更新状态
      if (newPosition.x !== prevState.position.x || newPosition.y !== prevState.position.y) {
        return { position: newPosition };
      }
      return null;
    });
  };

  checkDocumentPanelState = () => {
    // 检查文档面板是否隐藏
    const documentPanel = document.querySelector('.document-panel');

    // 如果文档面板不存在或隐藏，则显示左侧导航栏
    const shouldShow = !documentPanel || documentPanel.style.display === 'none';

    if (this.state.isVisible !== shouldShow) {
      this.setState({ isVisible: shouldShow });
    }
  };

  handleMouseEnter = () => {
    if (!this.state.isDragging) {
      this.setState({ isHovered: true });
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
    }
  };

  handleMouseLeave = () => {
    if (!this.state.isDragging) {
      this.setState({ isHovered: false });
      // 设置延迟隐藏
      this.hideTimer = setTimeout(() => {
        this.setState({ isHovered: false });
      }, 1000); // 1秒后开始淡化
    }
  };

  handleMouseDown = (e) => {
    if (e.button !== 0) return; // 只响应左键

    const navbar = this.navbarRef.current;
    if (!navbar) return;

    const rect = navbar.getBoundingClientRect();

    this.setState({
      isDragging: true,
      isHovered: true,
      dragOffset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    });

    e.preventDefault();
  };

  handleMouseMove = (e) => {
    if (!this.state.isDragging) return;

    const navbar = this.navbarRef.current;
    if (!navbar) return;

    const rect = navbar.getBoundingClientRect();
    const newX = e.clientX - this.state.dragOffset.x;
    const newY = e.clientY - this.state.dragOffset.y;

    // 限制在视窗范围内，保持边距
    const margin = 40; // 与getInitialPosition保持一致的安全边距
    const maxX = window.innerWidth - rect.width - margin;
    const maxY = window.innerHeight - rect.height - margin;

    this.setState({
      position: {
        x: Math.min(Math.max(margin, newX), maxX),
        y: Math.min(Math.max(margin, newY), maxY)
      }
    });
  };

  handleMouseUp = () => {
    if (this.state.isDragging) {
      this.setState({ isDragging: false });

      // 延迟恢复hover状态
      setTimeout(() => {
        if (!this.state.isHovered) {
          this.handleMouseLeave();
        }
      }, 100);
    }
  };

  handleDocumentManagerToggle = () => {
    // 直接调用documentManager的显示方法
    if (this.props.documentManager) {
      // 这里我们需要直接操作documentManager来显示面板
      // 由于DocumentPanel的isHidden状态是内部状态，我们可以通过一个更直接的方法
      const event = new CustomEvent('toggleDocumentPanel');
      window.dispatchEvent(event);
    }
  };

  handleSettings = () => {
    // 由于项目中没有设置对话框，我们可以打开样式编辑器作为设置功能
    if (this.props.view) {
      this.props.view.setStyleEditorOpen(!this.props.view.isStyleEditorOpen);
    }
  };

  handleHelp = () => {
    if (this.props.dialog) {
      this.props.dialog.setVersionOpen(true);
    }
  };

  handleLayoutToggle = () => {
    this.setState(prevState => {
      const newIsHorizontal = !prevState.isHorizontal;

      // 切换布局时重新调整位置，确保不超出边界
      setTimeout(() => {
        this.adjustPosition();
      }, 100); // 等待CSS动画完成后调整位置

      return {
        isHorizontal: newIsHorizontal
      };
    });
  };

  handleImmersiveMode = () => {
    if (this.props.view) {
      this.props.view.setImmersiveEditing(!this.props.view.isImmersiveEditing);
    }
  };

  render() {
    if (!this.state.isVisible) {
      return null;
    }

    const { position, isDragging, isHovered, isHorizontal } = this.state;
    const navbarClass = `left-navbar ${isHorizontal ? 'horizontal' : 'vertical'} ${!isHovered && !isDragging ? 'auto-hide' : ''} ${isDragging ? 'dragging' : ''}`;

    const navbarStyle = {
      left: position.x,
      top: position.y,
      transform: 'none', // 移除默认的居中变换
      cursor: isDragging ? 'grabbing' : 'grab'
    };

    return (
      <div
        ref={this.navbarRef}
        className={navbarClass}
        style={navbarStyle}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseDown={this.handleMouseDown}
      >
        {/* 拖拽提示图标 */}
        <div className="drag-indicator">
          <div className="drag-dots">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* 文档管理按钮 */}
        <div className="left-navbar-header">
          <Tooltip
            title="显示文档管理"
            placement={isHorizontal ? "bottom" : "right"}
            mouseEnterDelay={ENTER_DELAY}
            mouseLeaveDelay={LEAVE_DELAY}
          >
            <Button
              type="text"
              size="large"
              className="nav-button"
              onClick={this.handleDocumentManagerToggle}
              onMouseDown={(e) => e.stopPropagation()} // 防止拖拽冲突
            >
              📁
            </Button>
          </Tooltip>
        </div>

        {/* 布局切换控制区域 */}
        <div className="layout-toggle-section">
          <Tooltip
            title={isHorizontal ? "切换到竖向布局" : "切换到横向布局"}
            placement={isHorizontal ? "bottom" : "right"}
            mouseEnterDelay={ENTER_DELAY}
            mouseLeaveDelay={LEAVE_DELAY}
          >
            <Button
              type="text"
              size="small"
              className="nav-button"
              onClick={this.handleLayoutToggle}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {isHorizontal ? "⇅" : "⇄"}
            </Button>
          </Tooltip>
        </div>

        {/* 功能按钮区域 */}
        <div className="left-navbar-footer">
          <Tooltip
            title="沉浸模式"
            placement={isHorizontal ? "bottom" : "right"}
            mouseEnterDelay={ENTER_DELAY}
            mouseLeaveDelay={LEAVE_DELAY}
          >
            <Button
              type="text"
              size="small"
              className="nav-button"
              onClick={this.handleImmersiveMode}
              onMouseDown={(e) => e.stopPropagation()}
            >
              🎯
            </Button>
          </Tooltip>

          <Tooltip
            title="样式设置"
            placement={isHorizontal ? "bottom" : "right"}
            mouseEnterDelay={ENTER_DELAY}
            mouseLeaveDelay={LEAVE_DELAY}
          >
            <Button
              type="text"
              size="small"
              className="nav-button"
              onClick={this.handleSettings}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ⚙️
            </Button>
          </Tooltip>

          <Tooltip
            title="帮助信息"
            placement={isHorizontal ? "bottom" : "right"}
            mouseEnterDelay={ENTER_DELAY}
            mouseLeaveDelay={LEAVE_DELAY}
          >
            <Button
              type="text"
              size="small"
              className="nav-button"
              onClick={this.handleHelp}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ❓
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default LeftNavbar; 