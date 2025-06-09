import React, { Component } from 'react';
import { Button, Input, Modal, message, Dropdown, Menu, Avatar, Icon } from 'antd';
import { observer } from 'mobx-react';
import { userManager } from '../../utils/api';
import userInfo from '../../store/userInfo';
import './UserLogin.css';

@observer
class UserLogin extends Component {
    state = {
        loginModalVisible: false,
        username: '',
        loading: false
    };

    componentDidMount() {
        // 检查是否已登录
        if (userInfo.isLoggedIn) {
            console.log('用户已登录:', userInfo.username);
        }
    }

    // 显示登录弹窗
    showLoginModal = () => {
        this.setState({
            loginModalVisible: true,
            username: ''
        });
    };

    // 处理登录
    handleLogin = async () => {
        const { username } = this.state;

        if (!username.trim()) {
            message.error('请输入用户名');
            return;
        }

        this.setState({ loading: true });

        try {
            const result = userInfo.login(username);

            this.setState({
                loginModalVisible: false,
                username: '',
                loading: false
            });

            // 如果是切换用户，显示切换成功信息
            if (result.isUserSwitch) {
                message.success(`已切换到用户: ${result.username}`);

                // 通知父组件用户已切换
                if (this.props.onUserSwitch) {
                    await this.props.onUserSwitch(result);
                }
            } else {
                message.success(`欢迎, ${result.username}!`);

                // 通知父组件用户已登录
                if (this.props.onUserLogin) {
                    await this.props.onUserLogin(result);
                }
            }
        } catch (error) {
            message.error(error.message);
            this.setState({ loading: false });
        }
    };

    // 处理登出
    handleLogout = () => {
        Modal.confirm({
            title: '确认登出',
            content: '登出后将清除当前用户数据，确定要继续吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                userInfo.logout();
                message.success('已成功登出');

                // 通知父组件用户已登出
                if (this.props.onUserLogout) {
                    await this.props.onUserLogout();
                }
            }
        });
    };

    // 切换用户
    handleSwitchUser = () => {
        Modal.confirm({
            title: '切换用户',
            content: '切换用户将保存当前用户数据并切换到新用户，确定要继续吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                // 显示登录弹窗进行用户切换
                this.showLoginModal();
            }
        });
    };

    // 取消登录
    handleCancel = () => {
        this.setState({
            loginModalVisible: false,
            username: ''
        });
    };

    // 渲染用户菜单
    renderUserMenu = () => {
        return (
            <Menu>
                <Menu.Item key="user-info" disabled>
                    <div style={{ padding: '4px 0' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {userInfo.username}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                            ID: {userInfo.userId}
                        </div>
                    </div>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="switch" onClick={this.handleSwitchUser}>
                    <Icon type="swap" />
                    切换用户
                </Menu.Item>
                <Menu.Item key="logout" onClick={this.handleLogout}>
                    <Icon type="logout" />
                    登出
                </Menu.Item>
            </Menu>
        );
    };

    render() {
        const { loginModalVisible, username, loading } = this.state;

        return (
            <div className="user-login">
                {userInfo.isLoggedIn ? (
                    // 已登录状态
                    <Dropdown
                        overlay={this.renderUserMenu()}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <div className="user-info">
                            <Avatar
                                size="small"
                                style={{
                                    backgroundColor: '#1890ff',
                                    cursor: 'pointer'
                                }}
                            >
                                {userInfo.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <span className="username">{userInfo.username}</span>
                            <Icon type="down" style={{ marginLeft: 4, fontSize: 12 }} />
                        </div>
                    </Dropdown>
                ) : (
                    // 未登录状态
                    <Button
                        type="primary"
                        size="small"
                        onClick={this.showLoginModal}
                        icon="user"
                    >
                        登录
                    </Button>
                )}

                {/* 登录弹窗 */}
                <Modal
                    title="用户登录"
                    visible={loginModalVisible}
                    onOk={this.handleLogin}
                    onCancel={this.handleCancel}
                    confirmLoading={loading}
                    okText="登录"
                    cancelText="取消"
                    width={400}
                >
                    <div style={{ padding: '20px 0' }}>
                        <div style={{ marginBottom: 16, color: '#666' }}>
                            请输入用户名来标识您的身份，相同用户名可以访问相同的文档数据。
                        </div>
                        <Input
                            placeholder="请输入用户名"
                            value={username}
                            onChange={(e) => this.setState({ username: e.target.value })}
                            onPressEnter={this.handleLogin}
                            prefix={<Icon type="user" />}
                            autoFocus
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default UserLogin; 