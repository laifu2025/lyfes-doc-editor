import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Button, message, Icon } from 'antd';
import './ServerSyncPanel.css';

@inject('documentManager')
@observer
class ServerSyncPanel extends Component {
    state = {
        showSyncModal: false,
        autoSaveEnabled: false
    };

    componentDidMount() {
        this.checkServerConnection();
        this.enableAutoSave();
    }

    componentWillUnmount() {
        this.props.documentManager.disableAutoSave();
        if (this.autoLoadInterval) {
            clearInterval(this.autoLoadInterval);
        }
    }

    // ✅ 检查服务器连接
    checkServerConnection = async () => {
        try {
            await this.props.documentManager.loadFromServer();
        } catch (error) {
            console.warn('服务器连接检查失败:', error);
        }
    };

    // ✅ 启用自动保存和自动加载
    enableAutoSave = () => {
        this.props.documentManager.enableAutoSave(10000); // 10秒间隔
        this.setState({ autoSaveEnabled: true });
        
        // 定期从服务器加载新数据（用于多设备同步）
        this.autoLoadInterval = setInterval(async () => {
            try {
                const { userManager } = require('../../utils/api');
                if (userManager.isLoggedIn()) {
                    await this.props.documentManager.loadFromServer();
                    console.log('自动从服务器加载文档完成');
                }
            } catch (error) {
                console.warn('自动加载失败:', error);
            }
        }, 30000); // 30秒间隔检查服务器更新
    };

    



    // ✅ 批量保存所有文档
    handleBatchSave = async () => {
        try {
            const result = await this.props.documentManager.batchSaveToServer();
            message.success(result.message);
        } catch (error) {
            message.error('批量保存失败: ' + error.message);
        }
    };



    render() {
        const { 
            saving, 
            error,
            serverConnected,
            unsyncedCount
        } = this.props.documentManager;

        // 检查用户登录状态
        const { userManager } = require('../../utils/api');
        const isLoggedIn = userManager.isLoggedIn();

        // 只在有问题需要用户注意时才显示面板
        // 注意：只有用户已登录且服务器连接断开时才显示连接错误
        const shouldShowPanel = error || (isLoggedIn && !serverConnected) || unsyncedCount > 5; // 超过5个未同步文档时显示

        if (!shouldShowPanel) {
            return null; // 完全隐藏面板
        }

        return (
            <div className="server-sync-panel" style={{ 
                position: 'fixed', 
                top: '10px', 
                right: '10px', 
                zIndex: 1000,
                background: 'white',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                maxWidth: '300px'
            }}>
                {/* 错误提示 */}
                {error && (
                    <div style={{ marginBottom: '8px', color: '#ff4d4f', fontSize: '12px' }}>
                        <Icon type="exclamation-circle" style={{ marginRight: '4px' }} />
                        {error}
                    </div>
                )}
                
                {/* 连接状态提示 - 只有用户已登录且连接断开时才显示 */}
                {isLoggedIn && !serverConnected && (
                    <div style={{ marginBottom: '8px', color: '#fa8c16', fontSize: '12px' }}>
                        <Icon type="disconnect" style={{ marginRight: '4px' }} />
                        服务器连接断开
                        <Button 
                            type="link" 
                            size="small" 
                            onClick={this.checkServerConnection}
                            style={{ padding: '0 4px', fontSize: '12px' }}
                        >
                            重试
                        </Button>
                    </div>
                )}

                {/* 紧急手动保存 */}
                {unsyncedCount > 5 && (
                    <Button
                        type="primary"
                        icon="cloud-upload"
                        onClick={this.handleBatchSave}
                        loading={saving}
                        disabled={!serverConnected}
                        size="small"
                        style={{ fontSize: '12px' }}
                    >
                        手动保存 {unsyncedCount} 个文档
                    </Button>
                )}
            </div>
        );
    }
}

export default ServerSyncPanel; 