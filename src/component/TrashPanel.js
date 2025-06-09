import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { message, Modal } from 'antd';
import { trashAPI, folderAPI, handleApiError } from '../utils/api';
import '../styles/TrashPanel.css';

@observer
class TrashPanel extends Component {
    state = {
        trashItems: [],
        loading: false,
        selectedItems: new Set(), // 存储选中项目的ID集合
        itemPaths: new Map() // 存储每个项目的原始路径
    };

    componentDidMount() {
        this.loadTrashItems();
    }

    // 加载回收站内容
    loadTrashItems = async () => {
        try {
            this.setState({ loading: true });
            const response = await trashAPI.getTrashItems();
            if (response.success) {
                this.setState({ trashItems: response.data });
                // 异步加载路径信息
                this.loadItemPaths(response.data);
            } else {
                message.error(response.message || '加载回收站失败');
            }
        } catch (error) {
            console.error('加载回收站失败:', error);
            message.error(handleApiError(error, '加载回收站失败'));
        } finally {
            this.setState({ loading: false });
        }
    };

    // 加载项目的原始路径信息
    loadItemPaths = async (items) => {
        try {
            const folderResponse = await folderAPI.getFolders();
            if (folderResponse.success) {
                const folders = folderResponse.data;
                const pathMap = new Map();
                
                for (const item of items) {
                    let path = '根目录';
                    
                    if (item.type === 'document' && item.originalData.folderId) {
                        const folderPath = this.buildFolderPath(item.originalData.folderId, folders);
                        path = folderPath || '根目录';
                    } else if (item.type === 'folder' && item.originalData.parentId) {
                        const folderPath = this.buildFolderPath(item.originalData.parentId, folders);
                        path = folderPath || '根目录';
                    }
                    
                    pathMap.set(item.id, path);
                }
                
                this.setState({ itemPaths: pathMap });
            }
        } catch (error) {
            console.error('加载路径信息失败:', error);
        }
    };

    // 恢复单个项目
    restoreItem = async (itemId) => {
        try {
            this.setState({ loading: true });
            const response = await trashAPI.restoreItem(itemId);
            if (response.success) {
                message.success(response.message);
                await this.loadTrashItems(); // 重新加载
            } else {
                message.error(response.message || '恢复项目失败');
            }
        } catch (error) {
            console.error('恢复项目失败:', error);
            message.error(handleApiError(error, '恢复项目失败'));
        } finally {
            this.setState({ loading: false });
        }
    };

    // 永久删除单个项目
    deleteItemPermanently = async (itemId) => {
        Modal.confirm({
            title: '永久删除确认',
            content: '确定要永久删除此项目吗？此操作不可撤销！',
            okText: '永久删除',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
                try {
                    this.setState({ loading: true });
                    const response = await trashAPI.deleteItem(itemId);
                    if (response.success) {
                        message.success(response.message);
                        await this.loadTrashItems(); // 重新加载
                    } else {
                        message.error(response.message || '永久删除失败');
                    }
                } catch (error) {
                    console.error('永久删除项目失败:', error);
                    message.error(handleApiError(error, '永久删除项目失败'));
                } finally {
                    this.setState({ loading: false });
                }
            }
        });
    };

    // 清空回收站
    emptyTrash = async () => {
        Modal.confirm({
            title: '清空回收站确认',
            content: '确定要清空回收站吗？此操作不可撤销！',
            okText: '清空回收站',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
                try {
                    this.setState({ loading: true });
                    const response = await trashAPI.emptyTrash();
                    if (response.success) {
                        message.success(response.message);
                        await this.loadTrashItems(); // 重新加载
                    } else {
                        message.error(response.message || '清空回收站失败');
                    }
                } catch (error) {
                    console.error('清空回收站失败:', error);
                    message.error(handleApiError(error, '清空回收站失败'));
                } finally {
                    this.setState({ loading: false });
                }
            }
        });
    };

    // 批量恢复选中项目
    restoreSelectedItems = async () => {
        const { selectedItems } = this.state;
        if (selectedItems.size === 0) {
            message.warning('请先选择要恢复的项目');
            return;
        }

        try {
            this.setState({ loading: true });
            let successCount = 0;
            let failedCount = 0;
            
            for (const itemId of selectedItems) {
                try {
                    await trashAPI.restoreItem(itemId);
                    successCount++;
                } catch (error) {
                    failedCount++;
                    console.error(`恢复项目 ${itemId} 失败:`, error);
                }
            }
            
            if (successCount > 0) {
                message.success(`成功恢复 ${successCount} 个项目${failedCount > 0 ? `，${failedCount} 个失败` : ''}`);
            } else {
                message.error('所有项目恢复失败');
            }
            
            this.setState({ selectedItems: new Set() });
            await this.loadTrashItems();
        } catch (error) {
            console.error('批量恢复失败:', error);
            message.error(handleApiError(error, '批量恢复失败'));
        } finally {
            this.setState({ loading: false });
        }
    };

    // 切换项目选择状态
    toggleItemSelection = (itemId) => {
        const { selectedItems } = this.state;
        const newSelection = new Set(selectedItems);
        if (newSelection.has(itemId)) {
            newSelection.delete(itemId);
        } else {
            newSelection.add(itemId);
        }
        this.setState({ selectedItems: newSelection });
    };

    // 全选/取消全选
    toggleSelectAll = () => {
        const { selectedItems, trashItems } = this.state;
        if (selectedItems.size === trashItems.length) {
            this.setState({ selectedItems: new Set() });
        } else {
            this.setState({ selectedItems: new Set(trashItems.map(item => item.id)) });
        }
    };

    // 格式化删除时间
    formatDeletedTime = (deletedAt) => {
        const date = new Date(deletedAt);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return '今天 ' + date.toLocaleTimeString('zh-CN', { hour12: false });
        } else if (diffDays === 1) {
            return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour12: false });
        } else if (diffDays < 7) {
            return `${diffDays}天前`;
        } else {
            return date.toLocaleDateString('zh-CN');
        }
    };

    // 获取项目图标
    getItemIcon = (type) => {
        switch (type) {
            case 'document':
                return '📄';
            case 'folder':
                return '📁';
            default:
                return '❓';
        }
    };

    // 格式化文件大小
    formatFileSize = (bytes) => {
        if (!bytes) return '';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        let size = bytes;
        while (size >= 1024 && i < sizes.length - 1) {
            size /= 1024;
            i++;
        }
        return `${size.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
    };



    // 构建文件夹路径
    buildFolderPath = (folderId, folders) => {
        const findFolder = (id) => folders.find(f => f.id === id);
        const buildPath = (id, path = []) => {
            const folder = findFolder(id);
            if (!folder) return path;
            path.unshift(folder.name);
            if (folder.parentId) {
                return buildPath(folder.parentId, path);
            }
            return path;
        };
        
        const pathArray = buildPath(folderId);
        return pathArray.length > 0 ? pathArray.join(' / ') : '';
    };

    render() {
        const { trashItems, loading, selectedItems, itemPaths } = this.state;

        return (
            <div className="trash-panel">
                <div className="trash-header">
                    <div className="trash-actions">
                        {trashItems.length > 0 && (
                            <>
                                <button 
                                    className="btn btn-secondary"
                                    onClick={this.toggleSelectAll}
                                    disabled={loading}
                                >
                                    {selectedItems.size === trashItems.length ? '取消全选' : '全选'}
                                </button>
                                {selectedItems.size > 0 && (
                                    <button 
                                        className="btn btn-primary"
                                        onClick={this.restoreSelectedItems}
                                        disabled={loading}
                                    >
                                        恢复选中项目 ({selectedItems.size})
                                    </button>
                                )}
                            </>
                        )}
                        <button 
                            className="btn btn-outline"
                            onClick={this.loadTrashItems}
                            disabled={loading}
                        >
                            {loading ? '刷新中...' : '刷新'}
                        </button>
                    </div>
                </div>

                <div className="trash-content">
                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <span>加载中...</span>
                        </div>
                    )}

                    {!loading && trashItems.length === 0 && (
                        <div className="empty-trash">
                            <h3>暂无删除的内容</h3>
                            <p>删除的文档和文件夹会出现在这里</p>
                            <p style={{ fontSize: '14px', marginTop: '8px', color: '#999' }}>
                                您可以在这里恢复误删的内容，或永久删除不需要的项目
                            </p>
                        </div>
                    )}

                    {!loading && trashItems.length > 0 && (
                        <div className="trash-list">
                            {trashItems.map(item => (
                                <div 
                                    key={item.id} 
                                    className={`trash-item ${selectedItems.has(item.id) ? 'selected' : ''}`}
                                >
                                    <div className="item-main">
                                        <div className="item-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.has(item.id)}
                                                onChange={() => this.toggleItemSelection(item.id)}
                                                disabled={loading}
                                            />
                                        </div>
                                        
                                        <div className="item-icon">
                                            {this.getItemIcon(item.type)}
                                        </div>
                                        
                                        <div className="item-info">
                                            <div className="item-name" title={item.originalData.title || item.originalData.name}>
                                                {item.originalData.title || item.originalData.name}
                                            </div>
                                                                                    <div className="item-details">
                                            <span className="item-type">
                                                {item.type === 'document' ? '文档' : '文件夹'}
                                            </span>
                                            <span className="deleted-time">
                                                删除于 {this.formatDeletedTime(item.deletedAt)}
                                            </span>
                                            <span className="original-path">
                                                原位置: {itemPaths.get(item.id) || '加载中...'}
                                            </span>
                                            {item.originalData.wordCount && (
                                                <span className="word-count">
                                                    {item.originalData.wordCount} 字
                                                </span>
                                            )}
                                            {item.originalData.createdAt && (
                                                <span className="created-time">
                                                    创建于 {new Date(item.originalData.createdAt).toLocaleDateString('zh-CN')}
                                                </span>
                                            )}
                                            {item.originalData.size && (
                                                <span className="file-size">
                                                    {this.formatFileSize(item.originalData.size)}
                                                </span>
                                            )}
                                        </div>
                                        </div>
                                    </div>
                                    
                                    <div className="item-actions">
                                        <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={() => this.restoreItem(item.id)}
                                            disabled={loading}
                                            title="恢复到原位置"
                                        >
                                            恢复
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => this.deleteItemPermanently(item.id)}
                                            disabled={loading}
                                            title="永久删除，此操作不可撤销"
                                        >
                                            永久删除
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {trashItems.length > 0 && (
                    <div className="trash-footer">
                        <p className="trash-info">
                            回收站中有 <strong>{trashItems.length}</strong> 个项目
                            {selectedItems.size > 0 && (
                                <span> (已选择 <strong>{selectedItems.size}</strong> 个)</span>
                            )}
                        </p>
                        {trashItems.length > 5 && (
                            <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                                提示：回收站项目过多会影响性能，建议定期清理
                            </p>
                        )}
                        <div className="trash-bottom-actions">
                            <button 
                                className="btn btn-danger btn-clear-trash"
                                onClick={this.emptyTrash}
                                disabled={loading}
                            >
                                清空回收站
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default TrashPanel;