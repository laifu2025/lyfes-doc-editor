import axios from 'axios';

// ✅ API配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

// 创建axios实例
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30秒超时
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 支持cookies
});

// ✅ 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        // 添加请求时间戳，用于调试
        config.metadata = { startTime: new Date() };

        // 如果有token，添加到header中
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`🚀 API请求: ${config.method && config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('请求拦截器错误:', error);
        return Promise.reject(error);
    }
);

// ✅ 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        // 计算请求耗时
        const endTime = new Date();
        const duration = endTime - response.config.metadata.startTime;

        console.log(`✅ API响应: ${response.config.url} (${duration}ms)`, response.data);
        return response;
    },
    (error) => {
        const { response, config } = error;

        if (config && config.metadata) {
            const endTime = new Date();
            const duration = endTime - config.metadata.startTime;
            console.error(`❌ API错误: ${config.url} (${duration}ms)`, error);
        }

        // 统一错误处理
        if (response) {
            const { status, data } = response;

            switch (status) {
                case 401:
                    // 未授权，清除本地token
                    localStorage.removeItem('auth_token');
                    console.error('用户未授权，请重新登录');
                    break;
                case 403:
                    console.error('无权限访问该资源');
                    break;
                case 404:
                    console.error('请求的资源不存在');
                    break;
                case 500:
                    console.error('服务器内部错误');
                    break;
                default:
                    console.error(`请求失败: ${data && data.message ? data.message : '未知错误'}`);
            }

            return Promise.reject({
                status,
                message: data && data.message ? data.message : '请求失败',
                data: data
            });
        } else if (error.code === 'ECONNABORTED') {
            return Promise.reject({
                status: 0,
                message: '请求超时，请检查网络连接'
            });
        } else {
            return Promise.reject({
                status: 0,
                message: '网络错误，请检查网络连接'
            });
        }
    }
);

// ✅ 工具函数
const getUserId = () => {
    // 优先使用用户登录时设置的user_id
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        // 如果没有用户ID，使用默认的访客ID
        userId = 'guest_' + Date.now();
        localStorage.setItem('user_id', userId);
        console.warn('使用访客模式，数据仅保存在本地');
    }
    return userId;
};

// ✅ 用户管理工具
export const userManager = {
    // 获取当前用户名
    getCurrentUsername() {
        return localStorage.getItem('username') || '';
    },

    // 获取当前用户ID
    getCurrentUserId() {
        return localStorage.getItem('user_id') || '';
    },

    // 用户登录（设置用户名）
    login(username) {
        if (!username || !username.trim()) {
            throw new Error('用户名不能为空');
        }

        const cleanUsername = username.trim();
        // 使用用户名作为用户ID，确保相同用户名的用户能访问相同数据
        const userId = 'user_' + cleanUsername.toLowerCase().replace(/[^a-z0-9]/g, '_');

        localStorage.setItem('username', cleanUsername);
        localStorage.setItem('user_id', userId);

        return { username: cleanUsername, userId };
    },

    // 用户登出
    logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
    },

    // 检查是否已登录
    isLoggedIn() {
        return !!localStorage.getItem('username');
    }
};

// ✅ 文档API
export const documentAPI = {
    // 获取所有文档
    async getDocuments() {
        const userId = getUserId();
        const response = await apiClient.get(`/documents/${userId}`);
        return response.data;
    },

    // 获取单个文档
    async getDocument(documentId) {
        const userId = getUserId();
        const response = await apiClient.get(`/documents/${userId}/${documentId}`);
        return response.data;
    },

    // 创建文档
    async createDocument(documentData) {
        const userId = getUserId();
        const response = await apiClient.post(`/documents/${userId}`, documentData);
        return response.data;
    },

    // 更新文档
    async updateDocument(documentId, updates) {
        const userId = getUserId();
        const response = await apiClient.put(`/documents/${userId}/${documentId}`, updates);
        return response.data;
    },

    // 删除文档（移动到回收站）
    async deleteDocument(documentId, permanent = false) {
        const userId = getUserId();
        const url = `/documents/${userId}/${documentId}${permanent ? '?permanent=true' : ''}`;
        const response = await apiClient.delete(url);
        return response.data;
    },

    // 批量保存文档
    async batchSaveDocuments(documents) {
        const userId = getUserId();
        const response = await apiClient.post(`/documents/${userId}/batch`, { documents });
        return response.data;
    },

    // 批量更新排序
    async updateOrder(documents = [], folders = []) {
        const userId = getUserId();
        const response = await apiClient.put(`/documents/${userId}/reorder`, {
            documents,
            folders
        });
        return response.data;
    },

    // 搜索文档
    async searchDocuments(keyword, limit = 20) {
        const userId = getUserId();
        const response = await apiClient.get(`/search/${userId}`, {
            params: { q: keyword, limit }
        });
        return response.data;
    },

    // 导出所有文档
    async exportDocuments(format = 'json') {
        const userId = getUserId();
        const response = await apiClient.get(`/export/${userId}`, {
            params: { format },
            responseType: 'blob' // 重要：告诉axios这是二进制数据
        });

        // 创建下载链接
        const blob = new Blob([response.data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `documents_${userId}_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true, message: '导出成功' };
    }
};

// ✅ 文件夹API
export const folderAPI = {
    // 获取所有文件夹
    async getFolders() {
        const userId = getUserId();
        const response = await apiClient.get(`/folders/${userId}`);
        return response.data;
    },

    // 创建文件夹
    async createFolder(folderData) {
        const userId = getUserId();
        const response = await apiClient.post(`/folders/${userId}`, folderData);
        return response.data;
    },

    // 更新文件夹
    async updateFolder(folderId, updates) {
        const userId = getUserId();
        const response = await apiClient.put(`/folders/${userId}/${folderId}`, updates);
        return response.data;
    },

    // 删除文件夹（移动到回收站）
    async deleteFolder(folderId, permanent = false) {
        const userId = getUserId();
        const url = `/folders/${userId}/${folderId}${permanent ? '?permanent=true' : ''}`;
        const response = await apiClient.delete(url);
        return response.data;
    }
};

// ✅ 回收站API
export const trashAPI = {
    // 获取回收站内容
    async getTrashItems() {
        const userId = getUserId();
        const response = await apiClient.get(`/trash/${userId}`);
        return response.data;
    },

    // 从回收站恢复项目
    async restoreItem(itemId) {
        const userId = getUserId();
        const response = await apiClient.post(`/trash/${userId}/${itemId}/restore`);
        return response.data;
    },

    // 永久删除回收站中的项目
    async deleteItem(itemId) {
        const userId = getUserId();
        const response = await apiClient.delete(`/trash/${userId}/${itemId}`);
        return response.data;
    },

    // 清空回收站
    async emptyTrash() {
        const userId = getUserId();
        const response = await apiClient.delete(`/trash/${userId}`);
        return response.data;
    }
};

// ✅ 文件上传API
export const uploadAPI = {
    // 上传文件
    async uploadFile(file, onProgress) {
        const userId = getUserId();
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post(`/upload/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    onProgress(Math.round(progress));
                }
            }
        });

        return response.data;
    }
};

// ✅ 系统API
export const systemAPI = {
    // 健康检查
    async healthCheck() {
        const response = await apiClient.get('/health');
        return response.data;
    },

    // 获取用户ID
    getUserId() {
        return getUserId();
    },

    // 重置用户ID（用于测试或切换用户）
    resetUserId() {
        localStorage.removeItem('user_id');
        return getUserId();
    }
};

// ✅ 错误处理工具
export const handleApiError = (error, defaultMessage = '操作失败') => {
    console.error('API错误:', error);

    // 网络连接错误
    if (error && (error.status === 0 || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK')) {
        return '网络连接失败，请检查网络连接或稍后重试';
    }

    // 权限错误
    if (error && error.status === 403) {
        return '权限不足，请检查登录状态';
    }

    // 服务器错误
    if (error && error.status >= 500) {
        return '服务器暂时不可用，请稍后重试';
    }

    // 返回具体错误信息
    if (error && error.message) {
        return error.message;
    }

    return defaultMessage;
};

// ✅ 网络状态检查
export const checkNetworkConnection = async () => {
    try {
        await systemAPI.healthCheck();
        return true;
    } catch (error) {
        console.warn('网络连接检查失败:', error);
        return false;
    }
};

// ✅ 重试机制
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            lastError = error;

            // 如果是客户端错误（4xx），不重试
            if (error && error.status && error.status >= 400 && error.status < 500) {
                throw error;
            }

            // 最后一次重试失败，抛出错误
            if (i === maxRetries - 1) {
                throw error;
            }

            // 等待后重试
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }

    throw lastError;
};

// ✅ 本地存储与服务器同步工具
export const syncHelper = {
    // 上传本地数据到服务器
    async uploadLocalData() {
        try {
            const localData = localStorage.getItem('documentManager');
            if (!localData) {
                return { success: true, message: '没有本地数据需要上传' };
            }

            const parsed = JSON.parse(localData);
            const documents = parsed.documents || [];

            if (documents.length === 0) {
                return { success: true, message: '没有文档需要上传' };
            }

            const result = await documentAPI.batchSaveDocuments(documents);

            if (result.success) {
                // 上传成功后，可以选择清理本地数据
                console.log('本地数据上传成功:', result.message);
            }

            return result;
        } catch (error) {
            console.error('上传本地数据失败:', error);
            throw error;
        }
    },

    // 从服务器下载数据到本地
    async downloadServerData() {
        try {
            const result = await documentAPI.getDocuments();
            const serverDocuments = result.data || [];

            if (serverDocuments.length === 0) {
                return { success: true, message: '服务器没有数据' };
            }

            // 保存到本地存储
            const localData = {
                documents: serverDocuments,
                folders: [], // 如果需要支持文件夹，可以扩展API
                currentDocumentId: serverDocuments.length > 0 && serverDocuments[0].id ? serverDocuments[0].id : null,
                expandedFolders: []
            };

            localStorage.setItem('documentManager', JSON.stringify(localData));

            return {
                success: true,
                message: `成功下载 ${serverDocuments.length} 个文档`,
                count: serverDocuments.length
            };
        } catch (error) {
            console.error('下载服务器数据失败:', error);
            throw error;
        }
    }
};

export default apiClient; 