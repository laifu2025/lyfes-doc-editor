import { observable, action, computed } from 'mobx';
import { documentAPI, folderAPI, uploadAPI, syncHelper, handleApiError, checkNetworkConnection } from '../utils/api';

class DocumentManagerStore {
  @observable documents = [];
  @observable folders = [];
  @observable currentDocumentId = null;
  @observable expandedFolders = observable.set();
  @observable selectedDocuments = observable.set();
  @observable selectedFolders = observable.set();
  @observable loading = false;
  @observable error = null;
  @observable saving = false;
  @observable syncing = false;
  @observable uploadProgress = 0;
  @observable serverConnected = false;

  constructor() {
    this.loadFromLocalStorage();
  }

  // ✅ 计算属性
  @computed get currentDocument() {
    return this.documents.find(doc => doc.id === this.currentDocumentId) || null;
  }

  @computed get rootFolders() {
    return this.folders.filter(folder => folder.parentId === null);
  }

  // ✅ 选择状态计算属性
  @computed get hasAnySelection() {
    return this.selectedDocuments.size > 0 || this.selectedFolders.size > 0;
  }

  @computed get selectedCount() {
    return this.selectedDocuments.size + this.selectedFolders.size;
  }

  // ✅ 获取单个文档
  getDocument(id) {
    return this.documents.find(doc => doc.id === id) || null;
  }

  // ✅ 获取单个文件夹
  getFolder(id) {
    return this.folders.find(folder => folder.id === id) || null;
  }

  // 注意：MobX 5中计算属性不能是函数，需要改为方法
  documentsInFolder(folderId) {
    return this.documents
      .filter(doc => doc.folderId === folderId)
      .sort((a, b) => (a.order || 1) - (b.order || 1)); // 按order字段排序，默认为1
  }

  subFolders(parentId) {
    return this.folders
      .filter(folder => folder.parentId === parentId)
      .sort((a, b) => (a.order || 1) - (b.order || 1)); // 按order字段排序，默认为1
  }

  // ✅ Action方法 - 文档操作
  @action async createDocument(title = '新建文档', folderId = null) {
    // 计算新文档的排序位置（当前文件夹下最大排序值+1）
    const maxOrder = Math.max(
      0,
      ...this.documentsInFolder(folderId).map(doc => doc.order || 0)
    );
    
    const newDocument = {
      id: this.generateId(),
      title,
      content: '',
      folderId,
      order: maxOrder + 1, // 添加排序字段
      createdAt: new Date(),
      updatedAt: new Date(),
      serverSynced: false, // 标记为未同步到服务器
      lastSyncTime: null   // 未同步过
    };
    
    this.documents.push(newDocument);
    this.currentDocumentId = newDocument.id;
    
    // 立即更新编辑器内容（新建文档默认为空）
    if (this.onContentChange) {
      this.onContentChange(newDocument.content);
    }
    
    this.saveToLocalStorage();
    
    // 如果用户已登录，立即保存到服务器
    try {
      const { userManager } = require('../utils/api');
      if (userManager.isLoggedIn()) {
        console.log('新建文档，立即创建到服务器');
        // 使用统一的saveToServer方法
        await this.saveToServer(newDocument.id);
        console.log('新建文档已创建到服务器');
      } else {
        console.log('用户未登录，新建文档仅保存到本地');
      }
    } catch (error) {
      console.warn('新建文档创建到服务器失败:', error);
      // 不影响用户继续使用，文档已保存到本地
      // 下次编辑时会自动重试保存
    }
    
    return newDocument;
  }

  @action async updateDocument(id, updates, skipServerSync = false) {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
      // 先更新本地文档
      this.documents[index] = {
        ...this.documents[index],
        ...updates,
        updatedAt: new Date(),
        serverSynced: skipServerSync ? this.documents[index].serverSynced : false  // 只有在非内部调用时才标记为需要同步
      };
      this.saveToLocalStorage();
      
      // 延迟一帧确保更新完成，然后再尝试同步到服务器
      if (!skipServerSync && (updates.content !== undefined || updates.title !== undefined)) {
        // 使用setTimeout确保MobX状态更新完成
        setTimeout(async () => {
          try {
            // 再次确认文档存在后才进行服务器同步
            const document = this.documents.find(doc => doc.id === id);
            if (document) {
              await this.saveToServer(id);
              console.log('文档更新已自动保存到服务器');
            } else {
              console.warn('文档同步跳过：文档不存在于本地');
            }
          } catch (error) {
            console.warn('文档更新同步失败:', error);
            // 不抛出错误，避免影响用户输入体验
          }
        }, 0);
      }
    } else {
      console.warn('updateDocument: 文档不存在，ID:', id);
    }
  }

  @action async deleteDocument(id) {
    // 先从服务器删除
    try {
      const { userManager } = require('../utils/api');
      if (userManager.isLoggedIn()) {
        const result = await documentAPI.deleteDocument(id);
        if (result.success) {
          console.log('文档已从服务器删除:', result.message);
        }
      }
    } catch (error) {
      console.warn('从服务器删除文档失败:', error);
    }
    
    // 再从本地删除
    this.documents = this.documents.filter(doc => doc.id !== id);
    if (this.currentDocumentId === id) {
      this.currentDocumentId = this.documents.length > 0 ? this.documents[0].id : null;
    }
    this.saveToLocalStorage();
  }

  @action setCurrentDocument(id) {
    this.currentDocumentId = id;
    // 切换文档时，同时更新编辑器内容
    const document = this.documents.find(doc => doc.id === id);
    if (document && document.content !== undefined) {
      // 通过回调函数来更新编辑器内容
      if (this.onContentChange) {
        this.onContentChange(document.content);
      }
    }
  }

  // 设置内容变化回调
  @action setContentChangeCallback(callback) {
    this.onContentChange = callback;
  }

  // 保存当前编辑器内容到文档
  @action async saveCurrentEditorContent(content) {
    if (this.currentDocumentId) {
      // 由于updateDocument现在包含了自动同步逻辑，我们直接调用它
      await this.updateDocument(this.currentDocumentId, { 
        content: content,
        updatedAt: new Date().toISOString()
      });
    }
  }

  // ✅ Action方法 - 文件夹操作
  @action async createFolder(name, parentId = null) {
    // 计算新文件夹的排序位置（当前父文件夹下最大排序值+1）
    const maxOrder = Math.max(
      0,
      ...this.subFolders(parentId).map(folder => folder.order || 0)
    );
    
    const newFolder = {
      id: this.generateId(),
      name,
      parentId,
      order: maxOrder + 1, // 添加排序字段
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.folders.push(newFolder);
    this.expandedFolders.add(newFolder.id);
    this.saveToLocalStorage();
    
    // 同步到服务器
    try {
      const { userManager, folderAPI, handleApiError } = require('../utils/api');
      if (userManager.isLoggedIn()) {
        await folderAPI.createFolder({
          name: newFolder.name,
          parentId: newFolder.parentId
        });
        console.log('文件夹已同步到服务器');
      }
    } catch (error) {
      console.warn('文件夹同步到服务器失败:', error);
    }
    
    return newFolder;
  }

  @action async updateFolder(id, updates) {
    const index = this.folders.findIndex(folder => folder.id === id);
    if (index !== -1) {
      this.folders[index] = {
        ...this.folders[index],
        ...updates,
        updatedAt: new Date()
      };
      this.saveToLocalStorage();
      
      // 同步到服务器
      try {
        const { userManager, folderAPI } = require('../utils/api');
        if (userManager.isLoggedIn()) {
          await folderAPI.updateFolder(id, updates);
          console.log('文件夹更新已同步到服务器');
        }
      } catch (error) {
        console.warn('文件夹更新同步到服务器失败:', error);
      }
    }
  }

  @action async deleteFolder(id) {
    // 同步到服务器删除
    try {
      const { userManager, folderAPI } = require('../utils/api');
      if (userManager.isLoggedIn()) {
        await folderAPI.deleteFolder(id);
        console.log('文件夹已从服务器删除');
      }
    } catch (error) {
      console.warn('从服务器删除文件夹失败:', error);
    }
    
    // 删除文件夹前，将其中的文档移到根目录
    this.documents.forEach(doc => {
      if (doc.folderId === id) {
        doc.folderId = null;
      }
    });
    
    // 删除子文件夹
    const subFolderIds = this.subFolders(id).map(folder => folder.id);
    subFolderIds.forEach(subfolderId => this.deleteFolder(subfolderId));
    
    // 删除文件夹本身
    this.folders = this.folders.filter(folder => folder.id !== id);
    this.expandedFolders.delete(id);
    this.saveToLocalStorage();
  }

  // ✅ 文档移动操作
  @action async moveDocument(documentId, targetFolderId) {
    await this.updateDocument(documentId, { folderId: targetFolderId });
    console.log('文档移动操作已自动同步到服务器');
  }

  @action moveFolder(folderId, targetParentId) {
    this.updateFolder(folderId, { parentId: targetParentId });
  }

  // ✅ 拖拽排序方法
  @action async reorderDocuments(oldIndex, newIndex, folderId = null) {
    const documents = this.documentsInFolder(folderId);
    if (oldIndex < 0 || oldIndex >= documents.length || newIndex < 0 || newIndex >= documents.length) {
      return;
    }

    // 移动文档到新位置
    const [movedDoc] = documents.splice(oldIndex, 1);
    documents.splice(newIndex, 0, movedDoc);

    // 重新分配order值
    documents.forEach((doc, index) => {
      const docIndex = this.documents.findIndex(d => d.id === doc.id);
      if (docIndex !== -1) {
        this.documents[docIndex].order = index + 1;
        this.documents[docIndex].updatedAt = new Date();
      }
    });

    // 保存到本地存储
    this.saveToLocalStorage();
    
    // 立即同步排序到服务器
    try {
      await this.syncOrderToServer();
      console.log('文档排序已同步到服务器');
    } catch (error) {
      console.error('排序同步失败:', error);
    }
  }

  @action async reorderFolders(oldIndex, newIndex, parentId = null) {
    const folders = this.subFolders(parentId);
    if (oldIndex < 0 || oldIndex >= folders.length || newIndex < 0 || newIndex >= folders.length) {
      return;
    }

    // 移动文件夹到新位置
    const [movedFolder] = folders.splice(oldIndex, 1);
    folders.splice(newIndex, 0, movedFolder);

    // 重新分配order值
    folders.forEach((folder, index) => {
      const folderIndex = this.folders.findIndex(f => f.id === folder.id);
      if (folderIndex !== -1) {
        this.folders[folderIndex].order = index + 1;
        this.folders[folderIndex].updatedAt = new Date();
      }
    });

    // 保存到本地存储
    this.saveToLocalStorage();
    
    // 立即同步排序到服务器
    try {
      await this.syncOrderToServer();
      console.log('文件夹排序已同步到服务器');
    } catch (error) {
      console.error('排序同步失败:', error);
    }
  }

  // ✅ 文件夹展开/收起切换
  @action toggleFolderExpansion(folderId) {
    console.log('toggleFolderExpansion called for:', folderId);
    console.log('Before toggle - has folder:', this.expandedFolders.has(folderId));
    console.log('Before toggle - expanded folders:', Array.from(this.expandedFolders));
    
    if (this.expandedFolders.has(folderId)) {
      this.expandedFolders.delete(folderId);
      console.log('Folder removed from expanded set');
    } else {
      this.expandedFolders.add(folderId);
      console.log('Folder added to expanded set');
    }
    
    console.log('After toggle - expanded folders:', Array.from(this.expandedFolders));
    
    this.saveToLocalStorage();
    
    // 强制触发MobX更新
    this.expandedFolders = observable.set(Array.from(this.expandedFolders));
    console.log('Forced MobX update complete');
  }

  // ✅ 全部收起文件夹
  @action collapseAllFolders() {
    console.log('Collapsing all folders');
    this.expandedFolders.clear();
    this.saveToLocalStorage();
    // 强制触发MobX更新
    this.expandedFolders = observable.set();
    console.log('All folders collapsed');
  }

  // ✅ 全部展开文件夹
  @action expandAllFolders() {
    console.log('Expanding all folders');
    // 展开所有文件夹
    this.folders.forEach(folder => {
      this.expandedFolders.add(folder.id);
    });
    this.saveToLocalStorage();
    // 强制触发MobX更新
    this.expandedFolders = observable.set(Array.from(this.expandedFolders));
    console.log('All folders expanded');
  }

  // ✅ 展开选中文档所在的文件夹及其父文件夹路径
  @action expandSelectedDocumentPath() {
    if (!this.currentDocumentId) {
      console.log('No document selected, cannot expand path');
      return;
    }

    const currentDoc = this.getDocument(this.currentDocumentId);
    if (!currentDoc || !currentDoc.folderId) {
      console.log('Selected document is not in a folder');
      return;
    }

    // 展开文档所在文件夹及其所有父文件夹
    let folderId = currentDoc.folderId;
    const pathFolders = [];
    
    while (folderId) {
      const folder = this.getFolder(folderId);
      if (folder) {
        pathFolders.push(folderId);
        this.expandedFolders.add(folderId);
        folderId = folder.parentId;
      } else {
        break;
      }
    }

    this.saveToLocalStorage();
    // 强制触发MobX更新
    this.expandedFolders = observable.set(Array.from(this.expandedFolders));
    console.log('Expanded path for selected document:', pathFolders);
  }

  // ✅ 拖拽文档到文件夹
  @action async moveDocumentToFolder(documentId, targetFolderId, insertIndex = null) {
    const document = this.documents.find(doc => doc.id === documentId);
    if (!document) return;

    const oldFolderId = document.folderId;
    
    // 如果目标文件夹不同，需要移动并重新排序
    if (oldFolderId !== targetFolderId) {
      // 计算新的order值
      let newOrder;
      if (insertIndex !== null) {
        const targetDocs = this.documentsInFolder(targetFolderId);
        if (insertIndex >= targetDocs.length) {
          newOrder = Math.max(0, ...targetDocs.map(doc => doc.order || 0)) + 1;
        } else {
          newOrder = (targetDocs[insertIndex] && targetDocs[insertIndex].order) || 1;
          // 为插入位置后的文档重新编号
          targetDocs.forEach((doc, index) => {
            if (index >= insertIndex) {
              this.updateDocument(doc.id, { order: (doc.order || index + 1) + 1 }, true);
            }
          });
        }
      } else {
        // 插入到文件夹末尾
        const maxOrder = Math.max(0, ...this.documentsInFolder(targetFolderId).map(doc => doc.order || 0));
        newOrder = maxOrder + 1;
      }

      // 更新文档的文件夹和排序
      await this.updateDocument(documentId, { 
        folderId: targetFolderId,
        order: newOrder
      });

      console.log(`文档"${document.title}"已移动到新文件夹并自动同步到服务器`);
    }
  }

  // ✅ 本地存储 - 支持多用户隔离
  @action saveToLocalStorage() {
    try {
      const { userManager } = require('../utils/api');
      const userId = userManager.getCurrentUserId();
      
      const data = {
        documents: this.documents,
        folders: this.folders,
        currentDocumentId: this.currentDocumentId,
        expandedFolders: Array.from(this.expandedFolders),
        selectedDocuments: Array.from(this.selectedDocuments),
        selectedFolders: Array.from(this.selectedFolders)
      };
      
      // 使用用户ID作为存储键的一部分，实现多用户数据隔离
      const storageKey = userId ? `documentManager_${userId}` : 'documentManager';
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('保存文档数据失败:', error);
      this.error = '保存失败';
    }
  }

  @action loadFromLocalStorage() {
    try {
      const { userManager } = require('../utils/api');
      const userId = userManager.getCurrentUserId();
      
      // 使用用户ID作为存储键的一部分，实现多用户数据隔离
      const storageKey = userId ? `documentManager_${userId}` : 'documentManager';
      const data = localStorage.getItem(storageKey);
      
      if (data) {
        const parsed = JSON.parse(data);
        
        // 加载文档并为没有order字段的文档添加order
        this.documents = (parsed.documents || []).map((doc, index) => ({
          ...doc,
          order: doc.order !== undefined ? doc.order : index + 1
        }));
        
        // 加载文件夹并为没有order字段的文件夹添加order
        this.folders = (parsed.folders || []).map((folder, index) => ({
          ...folder,
          order: folder.order !== undefined ? folder.order : index + 1
        }));
        
        this.currentDocumentId = parsed.currentDocumentId || null;
        this.expandedFolders = observable.set(parsed.expandedFolders || []);
        this.selectedDocuments = observable.set(parsed.selectedDocuments || []);
        this.selectedFolders = observable.set(parsed.selectedFolders || []);
        
        // ✅ 自动展开包含文档的文件夹
        this.folders.forEach(folder => {
          const folderDocs = this.documents.filter(doc => doc.folderId === folder.id);
          if (folderDocs.length > 0) {
            this.expandedFolders.add(folder.id);
          }
        });
        
        // 立即保存更新后的数据（包含order字段和展开状态）
        this.saveToLocalStorage();
      } else {
        // 如果没有当前用户的数据，清空所有状态
        this.clearAllData();
      }
    } catch (error) {
      console.error('加载文档数据失败:', error);
      this.error = '加载失败';
    }
  }

  // ✅ 工具方法
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // ✅ 搜索功能 - 增强版，包含内容片段
  searchDocuments(keyword) {
    if (!keyword.trim()) return [];
    
    const lowerKeyword = keyword.toLowerCase();
    const results = [];
    
    this.documents.forEach(doc => {
      const titleMatch = doc.title.toLowerCase().includes(lowerKeyword);
      const contentMatch = doc.content.toLowerCase().includes(lowerKeyword);
      
      if (titleMatch || contentMatch) {
        let snippet = '';
        let highlightInfo = {
          titleMatch,
          contentMatch
        };
        
        // 如果内容匹配，提取关键词周围的内容片段
        if (contentMatch) {
          const content = doc.content;
          const lowerContent = content.toLowerCase();
          const keywordIndex = lowerContent.indexOf(lowerKeyword);
          
          if (keywordIndex !== -1) {
            // 提取关键词前后的内容，大约150个字符
            const start = Math.max(0, keywordIndex - 75);
            const end = Math.min(content.length, keywordIndex + lowerKeyword.length + 75);
            
            let extractedText = content.substring(start, end);
            
            // 如果不是从头开始，添加省略号
            if (start > 0) {
              extractedText = '...' + extractedText;
            }
            // 如果不是到结尾，添加省略号
            if (end < content.length) {
              extractedText = extractedText + '...';
            }
            
            snippet = extractedText;
          }
        } else if (titleMatch && doc.content) {
          // 如果只有标题匹配，显示文档开头内容
          snippet = doc.content.length > 100 ? 
            doc.content.substring(0, 100) + '...' : 
            doc.content;
        }
        
        results.push({
          ...doc,
          snippet,
          highlightInfo
        });
      }
    });
    
    // 按相关性排序：标题匹配优先，然后按更新时间
    return results.sort((a, b) => {
      if (a.highlightInfo.titleMatch && !b.highlightInfo.titleMatch) return -1;
      if (!a.highlightInfo.titleMatch && b.highlightInfo.titleMatch) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }

  // ✅ 搜索文件夹
  searchFolders(keyword) {
    if (!keyword.trim()) return [];
    
    const lowerKeyword = keyword.toLowerCase();
    return this.folders.filter(folder => 
      folder.name.toLowerCase().includes(lowerKeyword)
    );
  }

  // ✅ 综合搜索
      searchAll(keyword) {
        if (!keyword.trim()) return { documents: [], folders: [] };
        
        return {
            documents: this.searchDocuments(keyword),
      folders: this.searchFolders(keyword)
    };
  }

  // ✅ 专门的排序同步方法
  @action async syncOrderToServer() {
    try {
      const { userManager, documentAPI } = require('../utils/api');
      if (!userManager.isLoggedIn()) {
        console.warn('用户未登录，跳过排序同步');
        return;
      }

      // 准备文档排序数据
      const documentsOrder = this.documents.map(doc => ({
        id: doc.id,
        order: doc.order || 1,
        folderId: doc.folderId || null
      }));

      // 准备文件夹排序数据
      const foldersOrder = this.folders.map(folder => ({
        id: folder.id,
        order: folder.order || 1,
        parentId: folder.parentId || null
      }));

      // 调用批量排序API
      const result = await documentAPI.updateOrder(documentsOrder, foldersOrder);
      
      if (result.success) {
        console.log('排序同步成功:', result.message);
        return result;
      }
    } catch (error) {
      console.error('排序同步失败:', error);
      throw error;
    }
  }

  // ✅ 实时同步到服务器的通用方法
  @action async syncToServerIfLoggedIn() {
    try {
      const { userManager } = require('../utils/api');
      if (userManager.isLoggedIn()) {
        // 批量保存未同步的文档到服务器
        const unsyncedDocuments = this.documents.filter(doc => !doc.serverSynced);
        if (unsyncedDocuments.length > 0) {
          await this.batchSaveToServer();
          console.log('结构变更已自动同步到服务器');
        }
      }
    } catch (error) {
      console.warn('自动同步失败，将在下次同步时重试:', error);
    }
  }

  // ✅ 错误处理
  @action clearError() {
    this.error = null;
  }

  // ✅ 清空所有数据（用于用户切换）
  @action clearAllData() {
    this.documents.length = 0;
    this.folders.length = 0;
    this.currentDocumentId = null;
    this.expandedFolders.clear();
    this.selectedDocuments.clear();
    this.selectedFolders.clear();
    
    // 重置操作状态
    this.loading = false;
    this.saving = false;
    this.syncing = false;
    this.uploadProgress = 0;
    this.error = null;
    
    // 触发内容更新为空
    if (this.onContentChange) {
      this.onContentChange('');
    }
  }

  // ✅ 清空浏览器中的文档显示（用户登出时调用）
  @action clearBrowserDocuments() {
    // 清空文档数据，但不重置其他状态
    this.clearAllData();
    
    // 清空本地存储中的文档数据（所有用户）
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('documentManager')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('浏览器文档数据已清空');
  }

  // ✅ 用户切换时的数据处理
  @action async switchUser(newUserId) {
    try {
      this.loading = true;
      
      // 1. 清空当前用户数据
      this.clearAllData();
      
      // 2. 加载新用户的本地数据
      this.loadFromLocalStorage();
      
      // 3. 如果有服务器连接，尝试从服务器加载
      const { userManager } = require('../utils/api');
      if (userManager.isLoggedIn() && this.serverConnected) {
        try {
          await this.loadFromServer();
          console.log(`已切换到用户 ${newUserId} 并从服务器加载数据`);
        } catch (error) {
          console.warn('从服务器加载数据失败，使用本地数据:', error);
        }
      } else {
        console.log(`已切换到用户 ${newUserId}，使用本地数据`);
      }
      
      this.loading = false;
    } catch (error) {
      console.error('用户切换失败:', error);
      this.error = '用户切换失败';
      this.loading = false;
    }
  }

  // ✅ 服务器同步功能
  @action async saveToServer(documentId) {
    try {
      this.saving = true;
      this.error = null;
      
      // 检查用户是否已登录
      const { userManager } = require('../utils/api');
      if (!userManager.isLoggedIn()) {
        console.warn('用户未登录，跳过服务器同步');
        return null; // 优雅地返回，不抛出错误
      }
      
      const document = this.documents.find(doc => doc.id === documentId);
      if (!document) {
        console.warn('本地文档不存在，跳过服务器同步，文档ID:', documentId);
        return null; // 优雅地返回，不抛出错误
      }
      
      let result;
      
      // 检查文档是否已经在服务器上存在
      if (document.serverSynced === false && !document.lastSyncTime) {
        // 新建文档，需要先创建
        console.log('文档未同步过，使用创建API');
        result = await documentAPI.createDocument(document);
      } else {
        // 已存在文档，使用更新API
        console.log('文档已存在，使用更新API');
        result = await documentAPI.updateDocument(documentId, document);
      }
      
      if (result && result.success) {
        // 更新本地文档的服务器同步状态，跳过服务器同步避免递归
        this.updateDocument(documentId, { 
          lastSyncTime: new Date().toISOString(),
          serverSynced: true 
        }, true); // 传入 true 跳过服务器同步
        console.log('文档保存到服务器成功:', result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, '保存到服务器失败');
      console.error('保存到服务器失败:', error);
      // 只在用户主动操作时设置错误信息，自动保存失败不显示错误
      if (!this.autoSaveMode) {
        this.error = errorMessage;
      }
      // 不再抛出错误，避免影响用户输入
      return null;
    } finally {
      this.saving = false;
    }
  }

  @action async createDocumentOnServer(documentData) {
    try {
      this.saving = true;
      this.error = null;
      
      const result = await documentAPI.createDocument(documentData);
      
      if (result.success) {
        const serverDocument = result.data;
        
        // 添加到本地存储
        this.documents.push({
          ...serverDocument,
          serverSynced: true,
          lastSyncTime: new Date().toISOString()
        });
        
        this.currentDocumentId = serverDocument.id;
        this.saveToLocalStorage();
        
        console.log('文档创建成功:', result.message);
        return serverDocument;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, '创建文档失败');
      this.error = errorMessage;
      console.error('创建文档失败:', error);
      throw error;
    } finally {
      this.saving = false;
    }
  }

  @action async deleteDocumentFromServer(documentId) {
    try {
      this.saving = true;
      this.error = null;
      
      const result = await documentAPI.deleteDocument(documentId);
      
      if (result.success) {
        console.log('文档删除成功:', result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, '删除文档失败');
      this.error = errorMessage;
      console.error('删除文档失败:', error);
      throw error;
    } finally {
      this.saving = false;
    }
  }

  @action async loadFromServer() {
    try {
      this.loading = true;
      this.error = null;
      
      // 并行加载文档和文件夹
      const [documentsResult, foldersResult] = await Promise.all([
        documentAPI.getDocuments(),
        folderAPI.getFolders().catch(error => {
          console.warn('加载文件夹失败:', error);
          return { success: true, data: [] }; // 文件夹加载失败不影响文档加载
        })
      ]);
      
      if (documentsResult.success) {
        const serverDocuments = documentsResult.data;
        const serverFolders = foldersResult.success ? foldersResult.data : [];
        
        // 更新本地文档列表，确保按order字段排序
        const updatedDocuments = serverDocuments
          .map(doc => ({
            ...doc,
            order: doc.order || 1, // 确保有order字段
            serverSynced: true,
            lastSyncTime: new Date().toISOString()
          }))
          .sort((a, b) => (a.order || 1) - (b.order || 1)); // 按order排序
        
        // 更新本地文件夹列表，确保按order字段排序
        const updatedFolders = serverFolders
          .map(folder => ({
            ...folder,
            order: folder.order || 1, // 确保有order字段
            createdAt: new Date(folder.createdAt),
            updatedAt: new Date(folder.updatedAt)
          }))
          .sort((a, b) => (a.order || 1) - (b.order || 1)); // 按order排序
        
        // 清空现有数组并添加新数据
        this.documents.length = 0;
        this.documents.push(...updatedDocuments);
        
        this.folders.length = 0;
        this.folders.push(...updatedFolders);
        
        console.log('数据已更新:', this.documents.length, '个文档,', this.folders.length, '个文件夹');
        
        // ✅ 自动展开包含文档的文件夹
        this.folders.forEach(folder => {
          const folderDocs = this.documents.filter(doc => doc.folderId === folder.id);
          if (folderDocs.length > 0) {
            this.expandedFolders.add(folder.id);
          }
        });
        
        // 设置当前文档并确保内容更新
        if (this.documents.length > 0 && !this.currentDocumentId) {
          const firstDoc = this.documents[0];
          this.setCurrentDocument(firstDoc.id);
          
          // 强制触发内容更新
          if (this.onContentChange && firstDoc.content !== undefined) {
            this.onContentChange(firstDoc.content);
          }
        }
        
        this.saveToLocalStorage();
        this.serverConnected = true;
        
        console.log(`从服务器加载了 ${serverDocuments.length} 个文档和 ${serverFolders.length} 个文件夹`);
        return documentsResult;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, '从服务器加载失败');
      this.error = errorMessage;
      this.serverConnected = false;
      console.error('从服务器加载失败:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  // ✅ 用户登录后加载服务器文档
  @action async loadServerDocuments() {
    try {
      console.log('开始后台同步服务器文档...');
      this.syncing = true; // 使用syncing状态而不是loading，不阻塞界面
      
      // 首先检查服务器连接
      this.serverConnected = await checkNetworkConnection();
      
      if (this.serverConnected) {
        console.log('服务器连接正常，开始同步文档');
        
        // 保存当前本地文档的备份
        const localDocuments = [...this.documents];
        const localFolders = [...this.folders];
        
        try {
          await this.loadFromServer();
          console.log('服务器文档同步完成，当前文档数量:', this.documents.length);
          
          // 如果服务器没有文档，但本地有文档，保持本地文档
          if (this.documents.length === 0 && localDocuments.length > 0) {
            console.log('服务器无文档，保持本地文档显示');
            this.documents = localDocuments;
            this.folders = localFolders;
          }
        } catch (serverError) {
          // 服务器加载失败，恢复本地文档
          console.warn('服务器文档加载失败，保持本地文档:', serverError);
          this.documents = localDocuments;
          this.folders = localFolders;
        }
        
      } else {
        console.warn('服务器连接检查失败，保持当前本地文档显示');
      }
    } catch (error) {
      console.warn('后台同步失败，用户可继续使用本地功能:', error);
      // 后台同步失败不显示错误给用户，不影响用户体验
    } finally {
      this.syncing = false;
    }
  }

  @action async syncWithServer() {
    try {
      this.syncing = true;
      this.error = null;
      
      const result = await syncHelper.uploadLocalData();
      
      if (result.success) {
        // 上传成功后，从服务器重新加载数据
        await this.loadFromServer();
        console.log('同步完成:', result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, '同步失败');
      this.error = errorMessage;
      console.error('同步失败:', error);
      throw error;
    } finally {
      this.syncing = false;
    }
  }

  @action async batchSaveToServer() {
    try {
      this.saving = true;
      this.error = null;
      
      const unsyncedDocuments = this.documents.filter(doc => !doc.serverSynced);
      
      if (unsyncedDocuments.length === 0) {
        console.log('所有文档已同步到服务器');
        return { success: true, message: '所有文档已同步' };
      }
      
      const result = await documentAPI.batchSaveDocuments(unsyncedDocuments);
      
      if (result.success) {
        // 标记所有文档为已同步
        const now = new Date().toISOString();
        this.documents.forEach(doc => {
          if (!doc.serverSynced) {
            doc.serverSynced = true;
            doc.lastSyncTime = now;
          }
        });
        
        this.saveToLocalStorage();
        console.log('批量保存成功:', result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, '批量保存失败');
      this.error = errorMessage;
      console.error('批量保存失败:', error);
      throw error;
    } finally {
      this.saving = false;
    }
  }

  @action async uploadFile(file) {
    try {
      this.uploadProgress = 0;
      this.error = null;
      
      const result = await uploadAPI.uploadFile(file, (progress) => {
        this.uploadProgress = progress;
      });
      
      if (result.success) {
        const importedDocuments = result.data;
        
        // 添加导入的文档到本地
        importedDocuments.forEach(doc => {
          this.documents.push({
            ...doc,
            serverSynced: true,
            lastSyncTime: new Date().toISOString()
          });
        });
        
        this.saveToLocalStorage();
        
        if (importedDocuments.length > 0 && !this.currentDocumentId) {
          this.currentDocumentId = importedDocuments[0].id;
        }
        
        console.log('文件上传成功:', result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, '文件上传失败');
      this.error = errorMessage;
      console.error('文件上传失败:', error);
      throw error;
    } finally {
      this.uploadProgress = 0;
    }
  }

  @action async searchOnServer(keyword) {
    try {
      this.loading = true;
      this.error = null;
      
      const result = await documentAPI.searchDocuments(keyword);
      
      if (result.success) {
        console.log(`服务器搜索完成，找到 ${result.data.length} 个结果`);
        return result.data;
      }
      
      return [];
    } catch (error) {
      const errorMessage = handleApiError(error, '搜索失败');
      this.error = errorMessage;
      console.error('搜索失败:', error);
      return [];
    } finally {
      this.loading = false;
    }
  }

  @action async exportAllDocuments() {
    try {
      this.loading = true;
      this.error = null;
      
      const result = await documentAPI.exportDocuments();
      
      if (result.success) {
        console.log('导出成功:', result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, '导出失败');
      this.error = errorMessage;
      console.error('导出失败:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  // ✅ 自动保存功能
  @action enableAutoSave(intervalMs = 30000) {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    this.autoSaveInterval = setInterval(async () => {
      try {
        const unsyncedDocuments = this.documents.filter(doc => !doc.serverSynced);
        if (unsyncedDocuments.length > 0) {
          console.log(`自动保存：发现 ${unsyncedDocuments.length} 个未同步文档`);
          await this.batchSaveToServer();
        }
      } catch (error) {
        console.warn('自动保存失败:', error);
      }
    }, intervalMs);
    
    console.log(`自动保存已启用，间隔：${intervalMs / 1000}秒`);
  }

  @action disableAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
      console.log('自动保存已禁用');
    }
  }

  // ✅ 计算属性 - 同步状态
  @computed get unsyncedCount() {
    return this.documents.filter(doc => !doc.serverSynced).length;
  }

  @computed get totalDocuments() {
    return this.documents.length;
  }

  @computed get syncStatus() {
    if (this.syncing) return 'syncing';
    if (this.saving) return 'saving';
    if (this.loading) return 'loading';
    if (!this.serverConnected) return 'offline';
    if (this.unsyncedCount > 0) return 'pending';
    return 'synced';
  }

  // ✅ 生命周期管理
  destroy() {
    this.disableAutoSave();
  }

  // ✅ 选择状态管理方法
  @action toggleDocumentSelection(documentId) {
    if (this.selectedDocuments.has(documentId)) {
      this.selectedDocuments.delete(documentId);
    } else {
      this.selectedDocuments.add(documentId);
    }
    this.saveToLocalStorage();
  }

  @action toggleFolderSelection(folderId) {
    if (this.selectedFolders.has(folderId)) {
      this.selectedFolders.delete(folderId);
    } else {
      this.selectedFolders.add(folderId);
    }
    this.saveToLocalStorage();
  }

  @action selectAllDocuments() {
    this.documents.forEach(doc => {
      this.selectedDocuments.add(doc.id);
    });
    this.saveToLocalStorage();
  }

  @action selectAllFolders() {
    this.folders.forEach(folder => {
      this.selectedFolders.add(folder.id);
    });
    this.saveToLocalStorage();
  }

  @action clearAllSelection() {
    this.selectedDocuments.clear();
    this.selectedFolders.clear();
    this.saveToLocalStorage();
  }

  @action expandSelectedFolders() {
    // 展开所有选中的文件夹及其父文件夹路径
    this.selectedFolders.forEach(folderId => {
      // 展开选中文件夹
      this.expandedFolders.add(folderId);
      
      // 展开其父文件夹路径
      const folder = this.getFolder(folderId);
      let parentId = folder ? folder.parentId : null;
      while (parentId) {
        this.expandedFolders.add(parentId);
        const parentFolder = this.getFolder(parentId);
        parentId = parentFolder ? parentFolder.parentId : null;
      }
    });
    
    this.saveToLocalStorage();
    // 强制触发MobX更新
    this.expandedFolders = observable.set(Array.from(this.expandedFolders));
  }
}

export const documentManagerStore = new DocumentManagerStore(); 