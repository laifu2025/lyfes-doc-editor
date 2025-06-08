import React from 'react';
import { observer, inject } from 'mobx-react';
import { Tree, Button, Input, Dropdown, Menu, Modal, message } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import SvgIcon from '../../icon';
import { documentManagerStore } from '../../store/documentManager';
import ServerSyncPanel from '../ServerSync/ServerSyncPanel';
import TrashPanel from '../TrashPanel';
import './DocumentPanel.css';

const { Search } = Input;

// ✅ 可排序的文档项 - 整个项目都可拖拽
const SortableDocumentItem = SortableElement(({ document, isActive, onClick, onRename, onDelete, isRenaming, tempName, onTempNameChange, onRenameConfirm, onRenameCancel }) => {
  
  const handleClick = (e) => {
    // 如果是重命名状态，不处理点击
    if (isRenaming) return;
    
    // 直接切换文档，不进行选择
    onClick();
  };

  return (
    <Dropdown 
      overlay={(
        <Menu>
          <Menu.Item key="rename" onClick={(e) => { e.domEvent.stopPropagation(); onRename(); }}>
            重命名
          </Menu.Item>
          <Menu.Item key="delete" onClick={(e) => { e.domEvent.stopPropagation(); onDelete(); }} danger>
            删除
          </Menu.Item>
        </Menu>
      )} 
      trigger={['contextMenu']} 
      placement="bottomLeft"
      disabled={isRenaming}
    >
      <div 
        className={`document-item sortable-item ${isActive ? 'active' : ''}`} 
        data-active={isActive}
        data-document-id={document.id}
        onClick={handleClick}
        style={{ cursor: isRenaming ? 'default' : 'pointer' }}
      >
        <div className="item-content" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <span style={{fontSize: '14px', marginRight: '6px'}}>📄</span>
          {isRenaming ? (
            <Input
              size="small"
              value={tempName}
              onChange={(e) => onTempNameChange(e.target.value)}
              onPressEnter={() => onRenameConfirm(tempName)}
              onBlur={() => onRenameConfirm(tempName)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.stopPropagation();
                  onRenameCancel();
                }
              }}
              autoFocus
              style={{ 
                flex: 1, 
                border: '1px solid #1890ff',
                borderRadius: '4px'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="document-title">{document.title}</span>
          )}
        </div>
      </div>
    </Dropdown>
  );
});

// ✅ 可排序的文件夹项 - 整个项目都可拖拽
const SortableFolderItem = SortableElement(observer(({ folder, isExpanded, onToggle, onRename, onDelete, onCreateDocument, onCreateFolder, children, isRenaming, tempName, onTempNameChange, onRenameConfirm, onRenameCancel }) => {
  const handleToggleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isRenaming) {
      console.log('Folder toggle clicked:', folder.name, 'isExpanded:', isExpanded);
      onToggle();
    }
  };

  const handleFolderClick = (e) => {
    // 如果是重命名状态，不处理点击
    if (isRenaming) return;
    
    // 如果点击的是展开/收起按钮，不处理其他逻辑
    if (e.target.closest('.toggle-button')) return;
    
    // 其他区域点击也触发展开/收起
    onToggle();
  };

  return (
    <div className={`folder-item sortable-item ${isExpanded ? 'expanded' : ''}`}>
      <Dropdown 
        overlay={(
          <Menu>
            <Menu.Item key="newDoc" onClick={(e) => { e.domEvent.stopPropagation(); onCreateDocument(); }}>
              新建文档
            </Menu.Item>
            <Menu.Item key="newFolder" onClick={(e) => { e.domEvent.stopPropagation(); onCreateFolder(); }}>
              新建文件夹
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="rename" onClick={(e) => { e.domEvent.stopPropagation(); onRename(); }}>
              重命名
            </Menu.Item>
            <Menu.Item key="delete" onClick={(e) => { e.domEvent.stopPropagation(); onDelete(); }} danger>
              删除
            </Menu.Item>
          </Menu>
        )} 
        trigger={['contextMenu']} 
        placement="bottomLeft"
        disabled={isRenaming}
      >
        <div className="folder-header" onClick={handleFolderClick} style={{ cursor: isRenaming ? 'default' : 'pointer' }}>
          <div className="item-content" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <span 
              className="toggle-button"
              onClick={handleToggleClick} 
              style={{
                fontSize: '12px', 
                marginRight: '4px', 
                opacity: 0.6,
                cursor: 'pointer',
                padding: '2px',
                display: 'inline-block'
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
            <span style={{fontSize: '14px', marginRight: '6px'}}>
              {isExpanded ? '📂' : '📁'}
            </span>
            {isRenaming ? (
              <Input
                size="small"
                value={tempName}
                onChange={(e) => onTempNameChange(e.target.value)}
                onPressEnter={() => onRenameConfirm(tempName)}
                onBlur={() => onRenameConfirm(tempName)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.stopPropagation();
                    onRenameCancel();
                  }
                }}
                autoFocus
                style={{ 
                  flex: 1, 
                  border: '1px solid #1890ff',
                  borderRadius: '4px'
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="folder-name">{folder.name}</span>
            )}
          </div>
        </div>
      </Dropdown>
      {isExpanded && children && (
        <div className="folder-children">
          {children}
        </div>
      )}
    </div>
  );
}));

// ✅ 可排序的文档列表容器 - 添加observer以响应currentDocumentId变化
const SortableDocumentsList = SortableContainer(observer(({ items, folderId, documentManager, onDocumentClick, onRename, onDelete, renamingItem, onTempNameChange, onRenameConfirm, onRenameCancel }) => {
  return (
    <div className="sortable-documents-list">
      {items.map((document, index) => {
        const isRenaming = renamingItem && renamingItem.id === document.id && renamingItem.type === 'document';
        return (
          <SortableDocumentItem
            key={`doc-${document.id}`}
            index={index}
            document={document}
            isActive={document.id === documentManager.currentDocumentId}
            onClick={() => onDocumentClick(document.id)}
            onRename={() => onRename(document.id, 'document', document.title)}
            onDelete={() => onDelete(document.id, 'document')}
            isRenaming={isRenaming}
            tempName={isRenaming ? renamingItem.tempName : ''}
            onTempNameChange={onTempNameChange}
            onRenameConfirm={onRenameConfirm}
            onRenameCancel={onRenameCancel}
          />
        );
      })}
    </div>
  );
}));

// ✅ 可排序的文件夹列表容器
const SortableFoldersList = SortableContainer(observer(({ items, parentId, documentManager, onFolderToggle, onDocumentClick, onRename, onDelete, onCreateDocument, onCreateFolder, buildFolderContent, renamingItem, onTempNameChange, onRenameConfirm, onRenameCancel }) => {
  return (
    <div className="sortable-folders-list">
      {items.map((folder, index) => {
        const isExpanded = documentManager.expandedFolders.has(folder.id);
        const isRenaming = renamingItem && renamingItem.id === folder.id && renamingItem.type === 'folder';
        console.log(`Folder "${folder.name}" isExpanded:`, isExpanded); // 添加调试信息
        return (
          <SortableFolderItem
            key={`folder-${folder.id}`}
            index={index}
            folder={folder}
            isExpanded={isExpanded}
            onToggle={() => onFolderToggle(folder.id)}
            onRename={() => onRename(folder.id, 'folder', folder.name)}
            onDelete={() => onDelete(folder.id, 'folder')}
            onCreateDocument={() => onCreateDocument(folder.id)}
            onCreateFolder={() => onCreateFolder(folder.id)}
            isRenaming={isRenaming}
            tempName={isRenaming ? renamingItem.tempName : ''}
            onTempNameChange={onTempNameChange}
            onRenameConfirm={onRenameConfirm}
            onRenameCancel={onRenameCancel}
          >
            {/* ✅ 始终传递子内容，让SortableFolderItem根据isExpanded决定是否显示 */}
            {buildFolderContent(folder.id)}
          </SortableFolderItem>
        );
      })}
    </div>
  );
}));

@inject('content', 'documentManager')
@observer
class DocumentPanel extends React.Component {
  state = {
    searchKeyword: '',
    showCreateModal: false,
    createType: 'document', // 'document' or 'folder'
    createParentId: null,
    createName: '',
    searchInputFocused: false,
    isDragging: false,
    renamingItem: null, // { id, type, currentName, tempName }
    showTrashPanel: false, // 是否显示回收站面板
    isHidden: false, // 是否隐藏整个文档管理面板
    panelWidth: (() => {
      const savedWidth = localStorage.getItem('documentPanelWidth');
      if (savedWidth) {
        const width = parseInt(savedWidth, 10);
        return Math.max(200, Math.min(600, width));
      }
      return 320; // 从280增加到320，为头部内容提供更多空间
    })(),
    isResizing: false,
  };

  // 搜索防抖
  searchTimeout = null;
  
  // 显示创建弹窗
  showCreateModal = (type, parentId = null) => {
    this.setState({
      showCreateModal: true,
      createType: type,
      createParentId: parentId,
      createName: type === 'document' ? '新建文档' : '新建文件夹'
    });
  };

  // 处理创建确认
  handleCreateOk = async () => {
    const { createType, createParentId, createName } = this.state;
    
    if (createName && createName.trim()) {
      try {
        if (createType === 'document') {
          const doc = await this.props.documentManager.createDocument(createName.trim(), createParentId);
          message.success(`文档"${doc.title}"创建成功，已自动同步到服务器`);
        } else {
          const folder = await this.props.documentManager.createFolder(createName.trim(), createParentId);
          message.success(`文件夹"${folder.name}"创建成功，已自动同步到服务器`);
        }
        
        this.setState({
          showCreateModal: false,
          createName: ''
        });
      } catch (error) {
        console.error('创建失败:', error);
        message.error('创建失败，请重试');
      }
    }
  };

  // 处理创建取消
  handleCreateCancel = () => {
    this.setState({
      showCreateModal: false,
      createName: ''
    });
  };

  // 处理新建文档
  handleCreateDocument = (folderId = null) => {
    this.showCreateModal('document', folderId);
  };

  // 处理新建文件夹
  handleCreateFolder = (parentId = null) => {
    this.showCreateModal('folder', parentId);
  };

  // 处理文档点击
  handleDocumentClick = (documentId) => {
    this.props.documentManager.setCurrentDocument(documentId);
    const doc = this.props.documentManager.currentDocument;
    if (doc) {
      // 将文档内容同步到编辑器
      this.props.content.setContent(doc.content);
      console.log('切换到文档:', doc.title);
    }
  };

  // 开始重命名
  startRename = (id, type, currentName) => {
    this.setState({
      renamingItem: { id, type, currentName, tempName: currentName }
    });
  };

  // 处理重命名
  handleRename = async (id, type, newName) => {
    if (!newName || !newName.trim()) {
      this.cancelRename();
      return;
    }

    const trimmedName = newName.trim();
    const { renamingItem } = this.state;
    
    // 如果名称没有变化，直接取消
    if (trimmedName === renamingItem.currentName) {
      this.cancelRename();
      return;
    }

    try {
      if (type === 'document') {
        await this.props.documentManager.updateDocument(id, { title: trimmedName });
        message.success('文档重命名成功');
      } else {
        await this.props.documentManager.updateFolder(id, { name: trimmedName });
        message.success('文件夹重命名成功');
      }
      this.setState({ renamingItem: null });
    } catch (error) {
      console.error('重命名失败:', error);
      message.error('重命名失败，请重试');
      // 重命名失败时恢复原名称
      this.setState({
        renamingItem: { ...renamingItem, tempName: renamingItem.currentName }
      });
    }
  };

  // 更新临时名称
  updateTempName = (tempName) => {
    const { renamingItem } = this.state;
    if (renamingItem) {
      this.setState({
        renamingItem: { ...renamingItem, tempName }
      });
    }
  };

  // 取消重命名
  cancelRename = () => {
    this.setState({ renamingItem: null });
  };

  // ✅ 拖拽排序处理方法
  handleDocumentSortEnd = async ({ oldIndex, newIndex }, folderId = null) => {
    if (oldIndex === newIndex) return;
    
    this.setState({ isDragging: false });
    
    try {
      await this.props.documentManager.reorderDocuments(oldIndex, newIndex, folderId);
      // 注意：内容变更时不改变排序，这里不需要特殊处理
    } catch (error) {
      console.error('文档排序失败:', error);
      message.error('排序失败，请重试');
    }
  };

  // ✅ 处理拖拽开始事件
  handleSortStart = ({ node, index, collection }) => {
    this.setState({ isDragging: true });
    
    // 在helper上添加文本内容
    setTimeout(() => {
      const helper = document.querySelector('.sortable-helper');
      if (helper && !helper.querySelector('.helper-content')) {
        const textElement = node.querySelector('.document-title') || node.querySelector('.folder-name');
        const iconElement = node.querySelector('.item-content span:first-child');
        
        const text = textElement ? textElement.textContent : '文件';
        const icon = iconElement ? iconElement.textContent : '📄';
        
        helper.innerHTML = `
          <div class="helper-content">
            <span class="helper-icon">${icon}</span>
            <span class="helper-text">${text}</span>
          </div>
        `;
      }
    }, 0);
  };

  handleFolderSortEnd = async ({ oldIndex, newIndex }, parentId = null) => {
    if (oldIndex === newIndex) return;
    
    this.setState({ isDragging: false });
    
    try {
      await this.props.documentManager.reorderFolders(oldIndex, newIndex, parentId);
    } catch (error) {
      console.error('文件夹排序失败:', error);
      message.error('排序失败，请重试');
    }
  };

  // ✅ 旧的handleSortStart已被上面的新版本替换

  handleFolderToggle = (folderId) => {
    console.log('handleFolderToggle called with folderId:', folderId);
    console.log('Current expanded folders:', Array.from(this.props.documentManager.expandedFolders));
    this.props.documentManager.toggleFolderExpansion(folderId);
    console.log('After toggle, expanded folders:', Array.from(this.props.documentManager.expandedFolders));
  };

  // ✅ 处理隐藏/显示文档管理面板
  handleTogglePanel = () => {
    this.setState(prevState => ({ isHidden: !prevState.isHidden }));
  };

  // 监听自定义事件
  componentDidMount() {
    window.addEventListener('toggleDocumentPanel', this.handleToggleFromExternal);
  }

  // 处理来自外部的切换请求
  handleToggleFromExternal = () => {
    this.setState({ isHidden: false });
  };

  // ✅ 处理全部收起文件夹
  handleCollapseAll = () => {
    this.props.documentManager.collapseAllFolders();
    message.success('已收起所有文件夹');
  };

  // ✅ 处理展开所有文件夹
  handleExpandSelected = () => {
    const { documentManager } = this.props;
    documentManager.expandAllFolders();
    message.success('已展开所有文件夹');
  };

  // ✅ 递归计算文件夹内容统计（优化版本）
  calculateFolderContents = (folderId, maxDepth = 10, currentDepth = 0) => {
    // 防止无限递归
    if (currentDepth > maxDepth) {
      console.warn('文件夹嵌套层级过深，停止递归计算');
      return { documents: 0, folders: 0, totalItems: 0, documentList: [], folderList: [], hasMoreContent: true };
    }

    const stats = {
      documents: 0,
      folders: 0,
      totalItems: 0,
      documentList: [],
      folderList: [],
      hasMoreContent: false,
      maxDepthReached: false
    };
    
    try {
      // 直接子文档
      const directDocuments = this.props.documentManager.documentsInFolder(folderId);
      stats.documents += directDocuments.length;
      stats.documentList.push(...directDocuments.map(doc => ({ 
        name: doc.title, 
        level: currentDepth,
        id: doc.id,
        type: 'document',
        size: doc.content ? doc.content.length : 0
      })));
      
      // 直接子文件夹
      const directFolders = this.props.documentManager.subFolders(folderId);
      
      directFolders.forEach(folder => {
        stats.folders += 1;
        stats.folderList.push({ 
          name: folder.name, 
          level: currentDepth,
          id: folder.id,
          type: 'folder'
        });
        
        // 递归计算子文件夹内容
        const subStats = this.calculateFolderContents(folder.id, maxDepth, currentDepth + 1);
        stats.documents += subStats.documents;
        stats.folders += subStats.folders;
        
        if (subStats.maxDepthReached) {
          stats.maxDepthReached = true;
        }
        
        // 添加子级内容到列表（增加层级标识）
        stats.documentList.push(...subStats.documentList.map(item => ({ 
          ...item, 
          level: item.level + 1,
          name: `${folder.name}/${item.name}`,
          parentPath: folder.name
        })));
        stats.folderList.push(...subStats.folderList.map(item => ({ 
          ...item, 
          level: item.level + 1,
          name: `${folder.name}/${item.name}`,
          parentPath: folder.name
        })));
      });
      
      stats.totalItems = stats.documents + stats.folders;
      
      // 检查是否有过多内容
      if (stats.totalItems > 100) {
        stats.hasMoreContent = true;
      }
      
      return stats;
    } catch (error) {
      console.error('计算文件夹内容时出错:', error);
      return {
        documents: 0,
        folders: 0, 
        totalItems: 0,
        documentList: [],
        folderList: [],
        hasError: true,
        errorMessage: '无法获取文件夹内容'
      };
    }
  };

  // ✅ 获取用户删除偏好设置
  getUserDeletePreferences = () => {
    try {
      const prefs = localStorage.getItem('documentManager_deletePreferences');
      return prefs ? JSON.parse(prefs) : {
        showDetailedPreview: true,
        requireNameConfirmationThreshold: 50, // 超过50个项目需要输入名称确认
        skipEmptyFolderConfirmation: false,
        rememberChoice: false
      };
    } catch (error) {
      console.warn('获取删除偏好设置失败:', error);
      return {
        showDetailedPreview: true,
        requireNameConfirmationThreshold: 50,
        skipEmptyFolderConfirmation: false,
        rememberChoice: false
      };
    }
  };

  // ✅ 保存用户删除偏好设置
  saveUserDeletePreferences = (preferences) => {
    try {
      localStorage.setItem('documentManager_deletePreferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('保存删除偏好设置失败:', error);
    }
  };

  // ✅ 增强的删除处理方法
  handleDelete = async (id, type) => {
    let itemName = '';
    
    if (type === 'document') {
      const doc = this.props.documentManager.getDocument(id);
      itemName = doc ? doc.title : '未知文档';
      
      // 文档删除保持简单确认
      Modal.confirm({
        title: '删除文档',
        content: (
          <div>
            <p>确定要删除 "{itemName}" 吗？</p>
            <p style={{ color: '#666', fontSize: '12px' }}>
              🗑️ 删除的文档将移动到回收站，可以在回收站中恢复
            </p>
          </div>
        ),
        okText: '删除',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          try {
            await this.props.documentManager.deleteDocument(id);
            message.success('文档已移动到回收站');
          } catch (error) {
            console.error('删除失败:', error);
            message.error('删除失败，请重试');
          }
        }
      });
    } else {
      // 文件夹删除需要更详细的保护
      const folder = this.props.documentManager.getFolder(id);
      itemName = folder ? folder.name : '未知文件夹';
      
      // 获取用户偏好
      const preferences = this.getUserDeletePreferences();
      
      // 显示加载状态
      const loadingMessage = message.loading('正在分析文件夹内容...', 0);
      
      try {
        // 计算文件夹内容
        const contents = this.calculateFolderContents(id);
        loadingMessage();
        
        if (contents.hasError) {
          message.error('无法获取文件夹内容，删除操作已取消');
          return;
        }
        
        // 根据偏好和内容复杂度决定保护级别
        if (contents.totalItems === 0) {
          // 空文件夹处理
          if (preferences.skipEmptyFolderConfirmation) {
            // 直接删除，跳过确认
            try {
              await this.props.documentManager.deleteFolder(id);
              message.success('空文件夹已删除');
            } catch (error) {
              console.error('删除失败:', error);
              message.error('删除失败，请重试');
            }
          } else {
            this.showEmptyFolderDeleteConfirmation(id, itemName, preferences);
          }
        } else if (contents.totalItems >= preferences.requireNameConfirmationThreshold) {
          // 第三级保护：大型文件夹需要输入名称确认
          this.showHighSecurityDeleteConfirmation(id, itemName, contents, preferences);
        } else {
          // 第二级保护：包含内容的文件夹
          this.showDetailedDeleteConfirmation(id, itemName, contents, preferences);
        }
      } catch (error) {
        loadingMessage();
        console.error('分析文件夹内容失败:', error);
        message.error('分析文件夹内容失败，删除操作已取消');
      }
    }
  };

  // ✅ 空文件夹删除确认（可配置）
  showEmptyFolderDeleteConfirmation = (folderId, folderName, preferences) => {
    Modal.confirm({
      title: '删除空文件夹',
      content: (
        <div>
          <p>确定要删除空文件夹 "{folderName}" 吗？</p>
          <p style={{ color: '#666', fontSize: '12px' }}>
            🗑️ 删除的文件夹将移动到回收站，可以在回收站中恢复
          </p>
          {/* 添加偏好设置选项 */}
          <div style={{ marginTop: '12px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
            <label style={{ fontSize: '12px', color: '#666' }}>
              <input 
                type="checkbox" 
                onChange={(e) => {
                  const newPrefs = { ...preferences, skipEmptyFolderConfirmation: e.target.checked };
                  this.saveUserDeletePreferences(newPrefs);
                }}
              /> 
              记住选择，今后直接删除空文件夹
            </label>
          </div>
        </div>
      ),
      okText: '删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await this.props.documentManager.deleteFolder(folderId);
          message.success('文件夹已移动到回收站');
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败，请重试');
        }
      }
    });
  };

  // ✅ 显示详细的删除确认对话框（增强版）
  showDetailedDeleteConfirmation = (folderId, folderName, contents, preferences) => {
    const { documents, folders, documentList, folderList, hasMoreContent, maxDepthReached } = contents;
    
    Modal.confirm({
      title: (
        <div style={{ color: '#d73527', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', marginRight: '8px' }}>⚠️</span>
          <span>删除包含内容的文件夹</span>
        </div>
      ),
      width: 560,
      content: (
        <div style={{ fontSize: '14px' }}>
          {/* 文件夹信息 */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: '500', marginBottom: '8px' }}>
              文件夹 "<span style={{ color: '#d73527' }}>{folderName}</span>" 包含以下内容：
            </p>
            
            {/* 统计信息 */}
            <div style={{ 
              background: 'linear-gradient(135deg, #fff7e6 0%, #fef7e0 100%)', 
              border: '1px solid #ffd591', 
              borderRadius: '8px', 
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '18px' }}>📄</span>
                  <span><strong>{documents}</strong> 个文档</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '18px' }}>📁</span>
                  <span><strong>{folders}</strong> 个子文件夹</span>
                </div>
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: '#8b5a2b',
                padding: '8px 12px',
                background: 'rgba(139, 90, 43, 0.1)',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                🎯 总共 <strong>{documents + folders}</strong> 个项目将被删除
                {hasMoreContent && <span style={{ color: '#d46b08' }}> (内容较多)</span>}
                {maxDepthReached && <span style={{ color: '#fa8c16' }}> (嵌套层级较深)</span>}
              </div>
            </div>
          </div>
          
          {/* 内容预览 */}
          {preferences.showDetailedPreview && (documentList.length > 0 || folderList.length > 0) && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{ fontWeight: '500', fontSize: '13px', margin: 0 }}>
                  📋 内容预览：
                </p>
                <span style={{ fontSize: '11px', color: '#999' }}>
                  显示前 {Math.min(13, documentList.length + folderList.length)} 项
                </span>
              </div>
              <div style={{ 
                maxHeight: '180px', 
                overflowY: 'auto',
                background: '#fafafa',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '12px'
              }}>
                {/* 文件夹列表 */}
                {folderList.slice(0, 5).map((item, index) => (
                  <div key={`folder-${index}`} style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    color: '#1890ff', 
                    marginBottom: '4px',
                    paddingLeft: `${item.level * 16}px`,
                    padding: '2px 4px',
                    borderRadius: '3px',
                    background: item.level > 0 ? 'rgba(24, 144, 255, 0.05)' : 'transparent'
                  }}>
                    <span style={{ marginRight: '6px' }}>📁</span>
                    <span style={{ flex: 1 }}>{item.name}</span>
                    {item.level > 0 && <span style={{ fontSize: '10px', color: '#999' }}>L{item.level}</span>}
                  </div>
                ))}
                
                {/* 文档列表 */}
                {documentList.slice(0, 8).map((item, index) => (
                  <div key={`doc-${index}`} style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    color: '#52c41a', 
                    marginBottom: '4px',
                    paddingLeft: `${item.level * 16}px`,
                    padding: '2px 4px',
                    borderRadius: '3px',
                    background: item.level > 0 ? 'rgba(82, 196, 26, 0.05)' : 'transparent'
                  }}>
                    <span style={{ marginRight: '6px' }}>📄</span>
                    <span style={{ flex: 1 }}>{item.name}</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {item.size > 0 && (
                        <span style={{ fontSize: '10px', color: '#999' }}>
                          {item.size > 1000 ? `${Math.round(item.size/1000)}k` : item.size}
                        </span>
                      )}
                      {item.level > 0 && <span style={{ fontSize: '10px', color: '#999' }}>L{item.level}</span>}
                    </div>
                  </div>
                ))}
                
                {/* 更多内容提示 */}
                {(documentList.length + folderList.length > 13) && (
                  <div style={{ 
                    color: '#999', 
                    fontStyle: 'italic', 
                    marginTop: '8px',
                    textAlign: 'center',
                    padding: '6px',
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: '4px'
                  }}>
                    ⋯ 还有 {documentList.length + folderList.length - 13} 个项目未显示
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* 警告信息 */}
          <div style={{ 
            background: 'linear-gradient(135deg, #fff1f0 0%, #fff1f0 100%)', 
            border: '1px solid #ffccc7', 
            borderRadius: '8px', 
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ color: '#a8071a', fontWeight: '500', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', marginRight: '6px' }}>⚠️</span>
              重要提醒：
            </div>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#5c0011', fontSize: '13px', lineHeight: '1.5' }}>
              <li>所有文档和子文件夹都将被永久删除</li>
              <li>删除后可在回收站中恢复（有效期30天）</li>
              <li>此操作不可撤销（除非从回收站恢复）</li>
              {hasMoreContent && <li style={{ color: '#d46b08' }}>⚡ 文件夹内容较多，删除可能需要一些时间</li>}
            </ul>
          </div>
          
          {/* 底部提示 */}
          <div style={{ 
            fontSize: '12px', 
            color: '#666',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '8px',
            background: 'rgba(0,0,0,0.02)',
            borderRadius: '4px',
            border: '1px dashed #d9d9d9'
          }}>
            确认删除后，所有内容将移动到回收站
          </div>
        </div>
      ),
      okText: (
        <span>
          确认删除
        </span>
      ),
      cancelText: '取消',
      okType: 'danger',
      okButtonProps: {
        size: 'default',
        style: { 
          backgroundColor: '#a8071a',
          borderColor: '#a8071a',
          fontWeight: 'bold',
          minWidth: '120px'
        }
      },
      cancelButtonProps: {
        size: 'default',
        style: { minWidth: '80px' }
      },
      onOk: async () => {
        // 验证输入
        if (confirmationName !== folderName) {
          message.error('文件夹名称输入不正确，删除操作已取消');
          return false; // 阻止对话框关闭
        }

        const deleteMessage = message.loading('正在删除大型文件夹，请稍候...', 0);
        try {
          await this.props.documentManager.deleteFolder(folderId);
          deleteMessage();
          message.success({
            content: `大型文件夹 "${folderName}" 已成功删除并移动到回收站`,
            duration: 5
          });
        } catch (error) {
          deleteMessage();
          console.error('删除失败:', error);
          message.error('删除操作失败，请检查网络连接后重试');
        }
      },
      onCancel: () => {
        message.info('已取消危险删除操作');
      },
      afterClose: () => {
        // 清理引用
        inputRef = null;
        confirmationName = '';
      }
    });
  };

  // ✅ 第三级保护：高安全级别删除确认（需要输入名称）
  showHighSecurityDeleteConfirmation = (folderId, folderName, contents, preferences) => {
    const { documents, folders, hasMoreContent } = contents;
    let inputRef = null;
    let confirmationName = '';
    
    Modal.confirm({
      title: (
        <div style={{ color: '#d73527', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '18px', marginRight: '8px' }}>🚨</span>
          <span>高危险删除操作</span>
        </div>
      ),
      width: 580,
      content: (
        <div style={{ fontSize: '14px' }}>
          {/* 警告横幅 */}
          <div style={{
            background: 'linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
              ⚠️ 大型文件夹删除警告 ⚠️
            </div>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>
              该文件夹包含大量内容，为防止误删，需要额外确认
            </div>
          </div>

          {/* 统计信息 */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: '500', marginBottom: '12px' }}>
              文件夹 "<span style={{ color: '#d73527', fontSize: '16px' }}>{folderName}</span>" 内容统计：
            </p>
            
            <div style={{ 
              background: '#fff2e8', 
              border: '2px solid #ff7a45', 
              borderRadius: '10px', 
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>📄</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d73527' }}>{documents}</div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>个文档</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>📁</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d73527' }}>{folders}</div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>个文件夹</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>🗑️</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d73527' }}>{documents + folders}</div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>总项目</div>
                </div>
              </div>
              
              {hasMoreContent && (
                <div style={{
                  background: 'rgba(255, 122, 69, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#d73527'
                }}>
                  ⚡ 内容量庞大，删除操作可能耗时较长
                </div>
              )}
            </div>
          </div>

          {/* 确认输入 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              background: '#fffbe6',
              border: '1px solid #ffe58f',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <p style={{ fontWeight: '500', marginBottom: '12px', color: '#ad8b00' }}>
                🔒 安全确认：请输入文件夹名称以继续删除
              </p>
              <p style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: '8px' }}>
                请在下方输入框中准确输入文件夹名称：<strong>{folderName}</strong>
              </p>
              <input
                ref={(ref) => { inputRef = ref; }}
                type="text"
                placeholder={`请输入：${folderName}`}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}
                onChange={(e) => {
                  confirmationName = e.target.value;
                  // 实时验证
                  if (e.target.value === folderName) {
                    e.target.style.borderColor = '#52c41a';
                    e.target.style.background = '#f6ffed';
                  } else {
                    e.target.style.borderColor = '#ff4d4f';
                    e.target.style.background = '#fff2f0';
                  }
                }}
              />
            </div>
          </div>

          {/* 最终警告 */}
          <div style={{ 
            background: 'linear-gradient(135deg, #fff1f0 0%, #fff1f0 100%)', 
            border: '2px solid #ff4d4f', 
            borderRadius: '8px', 
            padding: '16px'
          }}>
            <div style={{ color: '#a8071a', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
              🚨 最终警告：
            </div>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#5c0011', fontSize: '13px', lineHeight: '1.6' }}>
              <li><strong>所有 {documents + folders} 个项目将被删除</strong></li>
              <li>包括所有子文件夹和嵌套内容</li>
              <li>删除后仅能通过回收站恢复（30天内）</li>
              <li>此操作无法撤销，请谨慎确认</li>
            </ul>
          </div>
        </div>
      ),
      okText: (
        <span>
          <span style={{ marginRight: '6px' }}>💀</span>
          确认删除
        </span>
      ),
      cancelText: '取消',
      okType: 'danger',
      okButtonProps: {
        size: 'default',
        style: { 
          backgroundColor: '#a8071a',
          borderColor: '#a8071a',
          fontWeight: 'bold',
          minWidth: '120px'
        }
      },
      cancelButtonProps: {
        size: 'default',
        style: { minWidth: '80px' }
      },
      onOk: async () => {
        // 验证输入
        if (confirmationName !== folderName) {
          message.error('文件夹名称输入不正确，删除操作已取消');
          return false; // 阻止对话框关闭
        }

        const deleteMessage = message.loading('正在删除大型文件夹，请稍候...', 0);
        try {
          await this.props.documentManager.deleteFolder(folderId);
          deleteMessage();
          message.success({
            content: `大型文件夹 "${folderName}" 已成功删除并移动到回收站`,
            duration: 5
          });
        } catch (error) {
          deleteMessage();
          console.error('删除失败:', error);
          message.error('删除操作失败，请检查网络连接后重试');
        }
      },
      onCancel: () => {
        message.info('已取消危险删除操作');
      },
      afterClose: () => {
        // 清理引用
        inputRef = null;
        confirmationName = '';
      }
    });
  };

  // 构建文件夹内容（递归）
  buildFolderContent = (folderId) => {
    const folders = this.props.documentManager.subFolders(folderId);
    const documents = this.props.documentManager.documentsInFolder(folderId);
    const { renamingItem } = this.state;
    
    return (
      <div className="folder-content">
        {/* 子文件夹排在前面 */}
        {folders.length > 0 && (
          <div className="folders-section">
            <SortableFoldersList
              items={folders}
              parentId={folderId}
              documentManager={this.props.documentManager}
              onFolderToggle={this.handleFolderToggle}
              onDocumentClick={this.handleDocumentClick}
              onRename={this.startRename}
              onDelete={this.handleDelete}
              onCreateDocument={this.handleCreateDocument}
              onCreateFolder={this.handleCreateFolder}
              buildFolderContent={this.buildFolderContent}
              renamingItem={renamingItem}
              onTempNameChange={this.updateTempName}
              onRenameConfirm={(newName) => this.handleRename(renamingItem && renamingItem.id, renamingItem && renamingItem.type, newName)}
              onRenameCancel={this.cancelRename}
              onSortEnd={(sort) => this.handleFolderSortEnd(sort, folderId)}
              onSortStart={this.handleSortStart}
              helperClass="sortable-helper"
              distance={3}
              useDragHandle={false}
              lockAxis="y"
              transitionDuration={200}
            />
          </div>
        )}
        
        {/* 文档列表排在后面 */}
        {documents.length > 0 && (
          <div className="documents-section">
            <SortableDocumentsList
              items={documents}
              folderId={folderId}
              documentManager={this.props.documentManager}
              onDocumentClick={this.handleDocumentClick}
              onRename={this.startRename}
              onDelete={this.handleDelete}
              renamingItem={renamingItem}
              onTempNameChange={this.updateTempName}
              onRenameConfirm={(newName) => this.handleRename(renamingItem && renamingItem.id, renamingItem && renamingItem.type, newName)}
              onRenameCancel={this.cancelRename}
              onSortEnd={(sort) => this.handleDocumentSortEnd(sort, folderId)}
              onSortStart={this.handleSortStart}
              helperClass="sortable-helper"
              distance={3}
              useDragHandle={false}
              lockAxis="y"
              transitionDuration={200}
            />
          </div>
        )}
      </div>
    );
  };

  // 搜索处理（带防抖）
  handleSearch = (value) => {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = setTimeout(() => {
      this.setState({ searchKeyword: value.trim() });
    }, 300); // 300ms防抖
  };

  // 清空搜索
  handleClearSearch = () => {
    this.setState({ 
      searchKeyword: '',
      searchInputFocused: false 
    });
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  };

  // ✅ 面板拖拽调整功能
  handleResizeStart = (e) => {
    e.preventDefault();
    this.setState({ isResizing: true });
    
    // 添加全局事件监听
    document.addEventListener('mousemove', this.handleResizeMove);
    document.addEventListener('mouseup', this.handleResizeEnd);
    
    // 禁用用户选择
    document.body.classList.add('panel-resizing');
  };

  handleResizeMove = (e) => {
    if (!this.state.isResizing) return;
    
    const rect = this.panelRef.getBoundingClientRect();
    const newWidth = e.clientX - rect.left;
    
    // 限制宽度范围
    const constrainedWidth = Math.max(200, Math.min(600, newWidth));
    
    this.setState({ panelWidth: constrainedWidth });
  };

  handleResizeEnd = () => {
    if (this.state.isResizing) {
      this.setState({ isResizing: false });
      
      // 保存宽度到localStorage
      localStorage.setItem('documentPanelWidth', this.state.panelWidth.toString());
      
      // 移除全局事件监听
      document.removeEventListener('mousemove', this.handleResizeMove);
      document.removeEventListener('mouseup', this.handleResizeEnd);
      
      // 恢复用户选择
      document.body.classList.remove('panel-resizing');
    }
  };

  // 组件卸载时清理事件监听器
  componentWillUnmount() {
    window.removeEventListener('toggleDocumentPanel', this.handleToggleFromExternal);
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
    document.body.classList.remove('panel-resizing');
  }

  render() {
    const { searchKeyword, renamingItem, isDragging, showTrashPanel, panelWidth, isResizing, isHidden } = this.state;

    // 如果面板被隐藏，不显示任何内容
    if (isHidden) {
      return null;
    }

    // 如果显示回收站面板，则渲染回收站
    if (showTrashPanel) {
      return (
        <div 
          ref={(ref) => { this.panelRef = ref; }}
          className="document-panel" 
          style={{ width: panelWidth }}
        >
          <div className="document-panel-header">
            <h3>回收站</h3>
            <div className="header-actions">
              <Button 
                type="text" 
                size="small" 
                onClick={() => this.setState({ showTrashPanel: false })}
                title="返回文档管理"
                style={{padding: '4px 8px'}}
              >
                ← 返回
              </Button>
            </div>
          </div>
          <div className="document-panel-content" style={{ padding: 0 }}>
            <TrashPanel />
          </div>
          {/* 拖拽调整条 */}
          <div 
            className={`panel-resize-handle ${isResizing ? 'dragging' : ''}`}
            onMouseDown={this.handleResizeStart}
          />
        </div>
      );
    }

    return (
      <div 
        ref={(ref) => { this.panelRef = ref; }}
        className={`document-panel ${isDragging ? 'dragging' : ''}`}
        style={{ width: panelWidth }}
      >
        <div className="document-panel-header">
          <h3>文档管理</h3>
          <div className="header-actions">
            <Button 
              type="text" 
              size="small" 
              onClick={() => this.handleCreateDocument()}
              title="新建文档"
              style={{padding: '4px 8px'}}
            >
              📄+
            </Button>
            <Button 
              type="text" 
              size="small" 
              onClick={() => this.handleCreateFolder()}
              title="新建文件夹"
              style={{padding: '4px 8px'}}
            >
              📁+
            </Button>
            <Button 
              type="text" 
              size="small" 
              onClick={this.handleCollapseAll}
              title="收起所有文件夹"
              style={{padding: '4px 8px'}}
            >
              ⊖
            </Button>
            <Button 
              type="text" 
              size="small" 
              onClick={this.handleExpandSelected}
              title="展开所有文件夹"
              style={{padding: '4px 8px'}}
            >
              ⊕
            </Button>
            <Button 
              type="text" 
              size="small" 
              onClick={this.handleTogglePanel}
              title="隐藏文档管理"
              style={{padding: '4px 8px'}}
            >
              ⊗
            </Button>
          </div>
        </div>
        
        <div className="document-panel-search">
          <Search
            placeholder="搜索"
            allowClear
            onChange={(e) => this.handleSearch(e.target.value)}
            onFocus={() => this.setState({ searchInputFocused: true })}
            onBlur={() => this.setState({ searchInputFocused: false })}
            onSearch={(value) => this.setState({ searchKeyword: value.trim() })}
            enterButton={false}
          />
        </div>
        
        {searchKeyword ? (
          <SearchResults 
            keyword={searchKeyword}
            onDocumentClick={this.handleDocumentClick}
            onClearSearch={this.handleClearSearch}
          />
        ) : (
          <div className="document-panel-content">
            {/* 根级内容 */}
            {this.buildFolderContent(null)}
            
            {/* 回收站按钮 - 放在底部 */}
            <div className="document-panel-footer">
              <Button 
                type="text" 
                size="small" 
                onClick={() => this.setState({ showTrashPanel: true })}
                title="查看回收站中的已删除项目"
              >
                回收站
              </Button>
            </div>
          </div>
        )}
        
        {/* 创建弹窗 */}
        <Modal
          title={this.state.createType === 'document' ? '新建文档' : '新建文件夹'}
          visible={this.state.showCreateModal}
          onOk={this.handleCreateOk}
          onCancel={this.handleCreateCancel}
          okText="确定"
          cancelText="取消"
        >
          <Input
            placeholder={this.state.createType === 'document' ? '请输入文档名称' : '请输入文件夹名称'}
            value={this.state.createName}
            onChange={(e) => this.setState({ createName: e.target.value })}
            onPressEnter={this.handleCreateOk}
            autoFocus
          />
        </Modal>

        {/* 服务器同步面板 - 仅在有问题时显示浮动通知 */}
        <ServerSyncPanel />
        
        {/* 拖拽调整条 */}
        <div 
          className={`panel-resize-handle ${isResizing ? 'dragging' : ''}`}
          onMouseDown={this.handleResizeStart}
        />
      </div>
    );
  }
}

// 搜索结果组件
@inject('documentManager')
@observer 
class SearchResults extends React.Component {
  
  // 处理文件夹点击
  handleFolderClick = (folderId) => {
    this.props.documentManager.expandedFolders.add(folderId);
    this.props.onClearSearch(); // 清空搜索，回到树形视图
  };

  // 处理文档点击 - 直接跳转到文档
  handleDocumentClick = (documentId) => {
    // 切换到对应文档
    this.props.onDocumentClick(documentId);
    // 清空搜索，回到正常视图
    this.props.onClearSearch();
  };

  // 高亮搜索关键词
  highlightKeyword = (text, keyword) => {
    if (!keyword) return text;
    
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === keyword.toLowerCase() ? 
        <mark key={index} style={{backgroundColor: '#fff566', padding: '0 2px'}}>{part}</mark> : 
        part
    );
  };

  render() {
    const { keyword } = this.props;
    const { documents, folders } = this.props.documentManager.searchAll(keyword);
    
    const totalResults = documents.length + folders.length;
    
    if (totalResults === 0) {
      return (
        <div className="search-results">
          <div className="search-header">
            搜索: "{keyword}"
            <Button 
              type="text" 
              size="small" 
              onClick={this.props.onClearSearch}
              style={{float: 'right', padding: '0 4px'}}
            >
              ✕
            </Button>
          </div>
          <div className="search-empty">
            <div style={{textAlign: 'center', padding: '20px', color: '#999'}}>
              <div style={{fontSize: '16px', marginBottom: '8px'}}>🔍</div>
              <div>未找到相关内容</div>
              <div style={{fontSize: '12px', marginTop: '4px'}}>
                试试其他关键词
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="search-results">
        <div className="search-header">
          搜索: "{keyword}" ({totalResults})
          <Button 
            type="text" 
            size="small" 
            onClick={this.props.onClearSearch}
            style={{float: 'right', padding: '0 4px'}}
          >
            ✕
          </Button>
        </div>
        
        {folders.length > 0 && (
          <div className="search-section">
            <div className="search-section-title">文件夹 ({folders.length})</div>
            {folders.map(folder => (
              <div 
                key={`folder-${folder.id}`}
                className="search-item folder-search-item"
                onClick={() => this.handleFolderClick(folder.id)}
                title="点击展开文件夹"
              >
                <span className="search-item-icon" style={{fontSize: '14px'}}>📁</span>
                <span className="search-item-title">
                  {this.highlightKeyword(folder.name, keyword)}
                </span>
                <span className="search-item-meta">
                  {new Date(folder.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {documents.length > 0 && (
          <div className="search-section">
            <div className="search-section-title">文档 ({documents.length})</div>
            {documents.map(doc => (
              <div 
                key={`doc-${doc.id}`}
                className="search-item document-search-item"
                onClick={() => this.handleDocumentClick(doc.id)}
                title="点击打开文档"
              >
                <div className="search-document-container">
                  <div className="search-item-header">
                    <span className="search-item-icon" style={{fontSize: '14px'}}>📄</span>
                    <span className="search-item-title">
                      {this.highlightKeyword(doc.title, keyword)}
                    </span>
                    <span className="search-item-meta">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* 搜索内容显示在文档下方 */}
                  {doc.snippet && (
                    <div className="search-item-content">
                      <div className="search-snippet">
                        <div className="search-snippet-label">搜索内容预览:</div>
                        <div className="search-snippet-text">
                          {this.highlightKeyword(doc.snippet, keyword)}
                        </div>
                      </div>
                      {doc.highlightInfo && (
                        <div className="search-match-info">
                          {doc.highlightInfo.titleMatch && (
                            <span className="match-tag title-match">标题匹配</span>
                          )}
                          {doc.highlightInfo.contentMatch && (
                            <span className="match-tag content-match">内容匹配</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default DocumentPanel; 