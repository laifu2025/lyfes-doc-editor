/**
 * Lyfe's Doc Editor - 后端服务器
 * 
 * 专为中文开发者设计的智能 Markdown 编辑器后端服务
 * 支持云端同步与多平台发布
 * 
 * @author Lyfe
 * @version 1.0.0
 * @license GPL-3.0
 * @repository https://github.com/laifu2025/lyfes-doc-editor
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3002;

// 创建必要的目录
const DOCUMENTS_DIR = path.join(__dirname, 'documents');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const TRASH_DIR = path.join(__dirname, 'trash');

// 确保目录存在
fs.ensureDirSync(DOCUMENTS_DIR);
fs.ensureDirSync(UPLOADS_DIR);
fs.ensureDirSync(TRASH_DIR);

// ✅ 中间件配置 - 开发环境禁用CSP以避免图片加载问题
app.use(helmet({
    contentSecurityPolicy: false, // 在开发环境禁用CSP
    crossOriginResourcePolicy: false, // 禁用CORP
    crossOriginOpenerPolicy: false // 禁用COOP
})); // 安全头设置
app.use(compression()); // 启用gzip压缩
app.use(morgan('combined')); // 日志记录

// ✅ CORS 配置 - 添加更详细的配置
app.use(cors({
    origin: function (origin, callback) {
        // 允许的域名列表
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'https://laifu2025.github.io'
        ];

        // 在开发环境中，如果没有origin（比如Postman），也允许
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// ✅ 手动添加CORS预检处理
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ 静态文件CORS预检处理
app.options('/uploads/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(200);
});

// ✅ 静态文件调试中间件
app.use('/uploads', (req, res, next) => {
    console.log(`📁 静态文件请求: ${req.method} ${req.url}`);
    console.log(`📁 完整路径: ${path.join(UPLOADS_DIR, req.url)}`);
    console.log(`📁 文件是否存在: ${fs.existsSync(path.join(UPLOADS_DIR, req.url))}`);
    console.log(`📁 请求头 Origin: ${req.get('Origin')}`);
    next();
});

// ✅ 静态文件服务 - 用于图片访问
app.use('/uploads', express.static(UPLOADS_DIR, {
    // 设置缓存，图片文件可以缓存更久
    maxAge: '7d',
    // 启用ETag
    etag: true,
    // 启用Last-Modified
    lastModified: true,
    // 设置正确的MIME类型和CORS头
    setHeaders: (res, filePath) => {
        // 添加完整的CORS头
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.set('Access-Control-Allow-Credentials', 'false');
        res.set('Access-Control-Max-Age', '86400');

        // 添加缓存控制头
        res.set('Cache-Control', 'public, max-age=604800'); // 7天缓存

        // 根据文件扩展名设置正确的Content-Type
        const ext = path.extname(filePath).toLowerCase();
        switch (ext) {
            case '.png':
                res.set('Content-Type', 'image/png');
                break;
            case '.jpg':
            case '.jpeg':
                res.set('Content-Type', 'image/jpeg');
                break;
            case '.gif':
                res.set('Content-Type', 'image/gif');
                break;
            case '.webp':
                res.set('Content-Type', 'image/webp');
                break;
            case '.svg':
                res.set('Content-Type', 'image/svg+xml');
                break;
            default:
                res.set('Content-Type', 'application/octet-stream');
        }

        console.log(`📁 返回文件: ${filePath}, Content-Type: ${res.get('Content-Type')}`);
    }
}));

// ✅ 文件上传配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueId}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB限制
    },
    fileFilter: (req, file, cb) => {
        // 允许的文件类型
        const allowedTypes = /\.(md|txt|json)$/i;
        if (allowedTypes.test(file.originalname)) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传 .md、.txt、.json 文件'));
        }
    }
});

// ✅ 图片上传配置
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.params.userId;
        const imageDir = path.join(UPLOADS_DIR, userId, 'images');
        fs.ensureDirSync(imageDir);
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        const timestamp = Date.now();
        cb(null, `${timestamp}_${uniqueId}${ext}`);
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB限制，图片文件一般较小
    },
    fileFilter: (req, file, cb) => {
        // 允许的图片文件类型
        const allowedTypes = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
        const allowedMimeTypes = /^image\/(jpeg|png|gif|webp|svg\+xml)$/i;

        if (allowedTypes.test(file.originalname) && allowedMimeTypes.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件 (jpg, jpeg, png, gif, webp, svg)'));
        }
    }
});

// ✅ 工具函数
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 获取安全的文件名（移除特殊字符）
const getSafeFileName = (title) => {
    return title
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // 移除不安全字符
        .replace(/\s+/g, '_') // 空格替换为下划线
        .substring(0, 50); // 限制长度
};

const getDocumentMetaPath = (userId, documentId) => {
    return path.join(DOCUMENTS_DIR, userId, 'meta', `${documentId}.json`);
};

const getDocumentContentPath = async (userId, documentId, title, folderId = null) => {
    const safeFileName = getSafeFileName(title);
    const basePath = await getFolderFullPath(userId, folderId);
    return path.join(basePath, `${safeFileName}_${documentId}.md`);
};

const getUserDocumentsDir = (userId) => {
    return path.join(DOCUMENTS_DIR, userId);
};

const getUserMetaDir = (userId) => {
    return path.join(DOCUMENTS_DIR, userId, 'meta');
};

const getUserContentDir = (userId) => {
    return path.join(DOCUMENTS_DIR, userId, 'documents');
};

const getFolderMetaPath = (userId, folderId) => {
    return path.join(DOCUMENTS_DIR, userId, 'folders', `${folderId}.json`);
};

const getUserFoldersDir = (userId) => {
    return path.join(DOCUMENTS_DIR, userId, 'folders');
};

// ✅ 回收站相关工具函数
const getUserTrashDir = (userId) => {
    return path.join(TRASH_DIR, userId);
};

const getTrashItemPath = (userId, itemId) => {
    return path.join(TRASH_DIR, userId, `${itemId}.json`);
};

// 移动文档到回收站
const moveDocumentToTrash = async (userId, documentId, meta, contentPath) => {
    const trashDir = getUserTrashDir(userId);
    await fs.ensureDir(trashDir);

    const trashItem = {
        id: documentId,
        type: 'document',
        originalData: meta,
        deletedAt: new Date().toISOString(),
        originalContentPath: contentPath
    };

    const trashItemPath = getTrashItemPath(userId, documentId);
    await fs.writeJson(trashItemPath, trashItem, { spaces: 2 });

    console.log(`📁 文档 ${documentId} 已移动到回收站`);
};

// 移动文件夹到回收站
const moveFolderToTrash = async (userId, folderId, folderData) => {
    const trashDir = getUserTrashDir(userId);
    await fs.ensureDir(trashDir);

    const trashItem = {
        id: folderId,
        type: 'folder',
        originalData: folderData,
        deletedAt: new Date().toISOString()
    };

    const trashItemPath = getTrashItemPath(userId, folderId);
    await fs.writeJson(trashItemPath, trashItem, { spaces: 2 });

    console.log(`📁 文件夹 ${folderId} 已移动到回收站`);
};

// 获取文件夹在文件系统中的实际路径
const getFolderPath = (userId, folderId, folderName) => {
    const safeFileName = getSafeFileName(folderName);
    return path.join(DOCUMENTS_DIR, userId, 'documents', safeFileName);
};

// 根据文件夹层级获取完整路径
const getFolderFullPath = async (userId, folderId) => {
    if (!folderId) {
        return getUserContentDir(userId);
    }

    const folderMetaPath = getFolderMetaPath(userId, folderId);
    if (!(await fs.pathExists(folderMetaPath))) {
        return getUserContentDir(userId);
    }

    const folderMeta = await fs.readJson(folderMetaPath);
    const parentPath = await getFolderFullPath(userId, folderMeta.parentId);
    const safeFileName = getSafeFileName(folderMeta.name);

    return path.join(parentPath, safeFileName);
};

// ✅ API路由

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// ✅ 获取用户所有文档
app.get('/api/documents/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userDir = getUserDocumentsDir(userId);
        const metaDir = getUserMetaDir(userId);
        const contentDir = getUserContentDir(userId);

        // 确保用户目录存在
        await fs.ensureDir(userDir);
        await fs.ensureDir(metaDir);
        await fs.ensureDir(contentDir);

        const files = await fs.readdir(metaDir);
        const documents = [];

        for (const file of files) {
            if (path.extname(file) === '.json') {
                try {
                    const metaPath = path.join(metaDir, file);
                    const meta = await fs.readJson(metaPath);

                    // 读取对应的markdown文件内容
                    const contentPath = await getDocumentContentPath(userId, meta.id, meta.title, meta.folderId);
                    let content = '';

                    if (await fs.pathExists(contentPath)) {
                        content = await fs.readFile(contentPath, 'utf8');
                    }

                    // 组合完整的文档数据
                    const document = {
                        ...meta,
                        content: content,
                        filePath: contentPath
                    };

                    documents.push(document);
                } catch (error) {
                    console.error(`读取文档 ${file} 失败:`, error);
                }
            }
        }

        // 按更新时间排序
        documents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        res.json({
            success: true,
            data: documents,
            total: documents.length
        });

    } catch (error) {
        console.error('获取文档列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取文档列表失败',
            error: error.message
        });
    }
});

// ✅ 获取单个文档
app.get('/api/documents/:userId/:documentId', async (req, res) => {
    try {
        const { userId, documentId } = req.params;
        const metaPath = getDocumentMetaPath(userId, documentId);

        if (!(await fs.pathExists(metaPath))) {
            return res.status(404).json({
                success: false,
                message: '文档不存在'
            });
        }

        const meta = await fs.readJson(metaPath);

        // 读取markdown文件内容
        const contentPath = await getDocumentContentPath(userId, documentId, meta.title, meta.folderId);
        let content = '';

        if (await fs.pathExists(contentPath)) {
            content = await fs.readFile(contentPath, 'utf8');
        }

        const document = {
            ...meta,
            content: content,
            filePath: contentPath
        };

        res.json({
            success: true,
            data: document
        });

    } catch (error) {
        console.error('获取文档失败:', error);
        res.status(500).json({
            success: false,
            message: '获取文档失败',
            error: error.message
        });
    }
});

// ✅ 创建新文档
app.post('/api/documents/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, content, folderId, theme } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: '文档标题不能为空'
            });
        }

        const documentId = generateId();
        const now = new Date().toISOString();
        const cleanTitle = title.trim();
        const documentContent = content || '';

        // 创建文档元数据（不包含content）
        const meta = {
            id: documentId,
            title: cleanTitle,
            folderId: folderId || null,
            theme: theme || 'normal',
            userId,
            createdAt: now,
            updatedAt: now,
            wordCount: documentContent.length
        };

        const userDir = getUserDocumentsDir(userId);
        const metaDir = getUserMetaDir(userId);
        const contentDir = getUserContentDir(userId);
        const foldersDir = getUserFoldersDir(userId);

        // 确保目录存在
        await fs.ensureDir(userDir);
        await fs.ensureDir(metaDir);
        await fs.ensureDir(contentDir);
        await fs.ensureDir(foldersDir);

        // 确保文档所在的文件夹目录存在
        const documentFolderPath = await getFolderFullPath(userId, folderId);
        await fs.ensureDir(documentFolderPath);

        // 保存元数据
        const metaPath = getDocumentMetaPath(userId, documentId);
        await fs.writeJson(metaPath, meta, { spaces: 2 });

        // 保存markdown内容到单独的文件
        const contentPath = await getDocumentContentPath(userId, documentId, cleanTitle, folderId);
        await fs.writeFile(contentPath, documentContent, 'utf8');

        // 返回完整的文档数据
        const document = {
            ...meta,
            content: documentContent,
            filePath: contentPath
        };

        res.status(201).json({
            success: true,
            data: document,
            message: '文档创建成功'
        });

    } catch (error) {
        console.error('创建文档失败:', error);
        res.status(500).json({
            success: false,
            message: '创建文档失败',
            error: error.message
        });
    }
});

// ✅ 批量更新文档排序 - 必须放在单个文档更新路由之前
app.put('/api/documents/:userId/reorder', async (req, res) => {
    try {
        const { userId } = req.params;
        const { documents = [], folders = [] } = req.body;

        if (!Array.isArray(documents) && !Array.isArray(folders)) {
            return res.status(400).json({
                success: false,
                message: '请提供要排序的文档或文件夹数组'
            });
        }

        console.log(`📝 开始批量排序更新: ${documents.length} 个文档, ${folders.length} 个文件夹`);

        let updatedCount = 0;

        // 批量更新文档排序
        if (Array.isArray(documents) && documents.length > 0) {
            for (const docUpdate of documents) {
                const { id, order, folderId } = docUpdate;

                if (!id || order === undefined) {
                    console.warn(`跳过无效的文档更新: id=${id}, order=${order}`);
                    continue;
                }

                const metaPath = getDocumentMetaPath(userId, id);

                if (await fs.pathExists(metaPath)) {
                    try {
                        const existingMeta = await fs.readJson(metaPath);
                        const updatedMeta = {
                            ...existingMeta,
                            order: Number(order),
                            folderId: folderId !== undefined ? folderId : existingMeta.folderId,
                            updatedAt: new Date().toISOString()
                        };

                        await fs.writeJson(metaPath, updatedMeta, { spaces: 2 });
                        updatedCount++;
                        console.log(`✅ 更新文档 ${id} 排序成功: order=${order}`);
                    } catch (error) {
                        console.error(`更新文档 ${id} 排序失败:`, error);
                    }
                } else {
                    console.warn(`⚠️ 文档 ${id} 不存在，跳过排序更新`);
                }
            }
        }

        // 批量更新文件夹排序
        if (Array.isArray(folders) && folders.length > 0) {
            for (const folderUpdate of folders) {
                const { id, order, parentId } = folderUpdate;

                if (!id || order === undefined) {
                    console.warn(`跳过无效的文件夹更新: id=${id}, order=${order}`);
                    continue;
                }

                const folderMetaPath = getFolderMetaPath(userId, id);

                if (await fs.pathExists(folderMetaPath)) {
                    try {
                        const existingFolder = await fs.readJson(folderMetaPath);
                        const updatedFolder = {
                            ...existingFolder,
                            order: Number(order),
                            parentId: parentId !== undefined ? parentId : existingFolder.parentId,
                            updatedAt: new Date().toISOString()
                        };

                        await fs.writeJson(folderMetaPath, updatedFolder, { spaces: 2 });
                        updatedCount++;
                        console.log(`✅ 更新文件夹 ${id} 排序成功: order=${order}`);
                    } catch (error) {
                        console.error(`更新文件夹 ${id} 排序失败:`, error);
                    }
                } else {
                    console.warn(`⚠️ 文件夹 ${id} 不存在，跳过排序更新`);
                }
            }
        }

        res.json({
            success: true,
            message: `成功更新 ${updatedCount} 个项目的排序`,
            updatedCount
        });

    } catch (error) {
        console.error('批量排序更新失败:', error);
        res.status(500).json({
            success: false,
            message: '批量排序更新失败',
            error: error.message
        });
    }
});

// ✅ 更新文档
app.put('/api/documents/:userId/:documentId', async (req, res) => {
    try {
        const { userId, documentId } = req.params;
        const updates = req.body;

        const metaPath = getDocumentMetaPath(userId, documentId);

        if (!(await fs.pathExists(metaPath))) {
            return res.status(404).json({
                success: false,
                message: '文档不存在'
            });
        }

        const existingMeta = await fs.readJson(metaPath);
        const now = new Date().toISOString();

        // 分离content和其他元数据
        const { content, ...metaUpdates } = updates;

        // 更新元数据
        const updatedMeta = {
            ...existingMeta,
            ...metaUpdates,
            updatedAt: now,
            wordCount: content !== undefined ? content.length : existingMeta.wordCount
        };

        // 如果标题或文件夹改变了，需要重命名/移动文件
        const titleChanged = metaUpdates.title && metaUpdates.title !== existingMeta.title;
        const folderChanged = metaUpdates.folderId !== undefined && metaUpdates.folderId !== existingMeta.folderId;
        const oldContentPath = await getDocumentContentPath(userId, documentId, existingMeta.title, existingMeta.folderId);
        const newContentPath = (titleChanged || folderChanged) ?
            await getDocumentContentPath(userId, documentId, metaUpdates.title || existingMeta.title, metaUpdates.folderId !== undefined ? metaUpdates.folderId : existingMeta.folderId) :
            oldContentPath;

        // 如果文件夹改变了，确保新文件夹目录存在
        if (folderChanged) {
            const newFolderPath = await getFolderFullPath(userId, metaUpdates.folderId);
            await fs.ensureDir(newFolderPath);
        }

        // 保存更新后的元数据
        await fs.writeJson(metaPath, updatedMeta, { spaces: 2 });

        // 处理内容文件
        if (content !== undefined) {
            // 如果标题或文件夹改变了，先删除旧文件
            if ((titleChanged || folderChanged) && await fs.pathExists(oldContentPath)) {
                await fs.remove(oldContentPath);
            }

            // 保存新内容
            await fs.writeFile(newContentPath, content, 'utf8');
        } else if (titleChanged || folderChanged) {
            // 只改标题或文件夹，移动文件
            if (await fs.pathExists(oldContentPath)) {
                await fs.move(oldContentPath, newContentPath);
            }
        }

        // 读取当前内容（如果没有提供新内容）
        let currentContent = content;
        if (currentContent === undefined && await fs.pathExists(newContentPath)) {
            currentContent = await fs.readFile(newContentPath, 'utf8');
        }

        const updatedDocument = {
            ...updatedMeta,
            content: currentContent || '',
            filePath: newContentPath
        };

        res.json({
            success: true,
            data: updatedDocument,
            message: '文档更新成功'
        });

    } catch (error) {
        console.error('更新文档失败:', error);
        res.status(500).json({
            success: false,
            message: '更新文档失败',
            error: error.message
        });
    }
});

// ✅ 删除文档（移动到回收站）
app.delete('/api/documents/:userId/:documentId', async (req, res) => {
    try {
        const { userId, documentId } = req.params;
        const { permanent = false } = req.query; // 支持永久删除参数
        const metaPath = getDocumentMetaPath(userId, documentId);

        if (!(await fs.pathExists(metaPath))) {
            return res.status(404).json({
                success: false,
                message: '文档不存在'
            });
        }

        // 读取元数据以获取文档信息
        const meta = await fs.readJson(metaPath);
        const contentPath = await getDocumentContentPath(userId, documentId, meta.title, meta.folderId);

        if (permanent === 'true') {
            // 永久删除
            await fs.remove(metaPath);
            if (await fs.pathExists(contentPath)) {
                await fs.remove(contentPath);
            }

            res.json({
                success: true,
                message: '文档已永久删除'
            });
        } else {
            // 移动到回收站
            await moveDocumentToTrash(userId, documentId, meta, contentPath);

            // 从原位置删除文件
            await fs.remove(metaPath);
            if (await fs.pathExists(contentPath)) {
                await fs.remove(contentPath);
            }

            res.json({
                success: true,
                message: '文档已移动到回收站'
            });
        }

    } catch (error) {
        console.error('删除文档失败:', error);
        res.status(500).json({
            success: false,
            message: '删除文档失败',
            error: error.message
        });
    }
});

// ✅ 批量保存文档
app.post('/api/documents/:userId/batch', async (req, res) => {
    try {
        const { userId } = req.params;
        const { documents } = req.body;

        if (!Array.isArray(documents)) {
            return res.status(400).json({
                success: false,
                message: '文档数据格式错误'
            });
        }

        const userDir = getUserDocumentsDir(userId);
        await fs.ensureDir(userDir);

        const results = [];

        for (const doc of documents) {
            try {
                const documentId = doc.id || generateId();
                const now = new Date().toISOString();

                const document = {
                    ...doc,
                    id: documentId,
                    userId,
                    updatedAt: now,
                    createdAt: doc.createdAt || now,
                    wordCount: doc.content ? doc.content.length : 0
                };

                const documentPath = getDocumentPath(userId, documentId);
                await fs.writeJson(documentPath, document, { spaces: 2 });

                results.push({
                    id: documentId,
                    title: document.title,
                    success: true
                });

            } catch (error) {
                results.push({
                    id: doc.id || 'unknown',
                    title: doc.title || 'unknown',
                    success: false,
                    error: error.message
                });
            }
        }

        const successCount = results.filter(r => r.success).length;

        res.json({
            success: true,
            data: results,
            message: `批量保存完成，成功：${successCount}/${documents.length}`
        });

    } catch (error) {
        console.error('批量保存失败:', error);
        res.status(500).json({
            success: false,
            message: '批量保存失败',
            error: error.message
        });
    }
});

// ✅ 图片上传
app.post('/api/upload-image/:userId', imageUpload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '没有上传图片'
            });
        }

        const { userId } = req.params;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/${userId}/images/${req.file.filename}`;

        // 记录上传信息（可选）
        const uploadInfo = {
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadedAt: new Date().toISOString(),
            url: imageUrl
        };

        console.log(`📷 图片上传成功: ${req.file.filename} (${req.file.size} bytes)`);

        res.json({
            success: true,
            data: {
                url: imageUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size
            },
            message: '图片上传成功'
        });

    } catch (error) {
        console.error('图片上传失败:', error);

        // 清理临时文件
        if (req.file) {
            try {
                await fs.remove(req.file.path);
            } catch (cleanupError) {
                console.error('清理临时文件失败:', cleanupError);
            }
        }

        res.status(500).json({
            success: false,
            message: '图片上传失败',
            error: error.message
        });
    }
});

// ✅ 文件上传
app.post('/api/upload/:userId', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '没有上传文件'
            });
        }

        const { userId } = req.params;
        const filePath = req.file.path;

        // 读取文件内容
        const fileContent = await fs.readFile(filePath, 'utf8');

        // 根据文件类型处理
        let documents = [];

        if (path.extname(req.file.originalname) === '.json') {
            // JSON格式的文档数据
            try {
                const jsonData = JSON.parse(fileContent);
                documents = Array.isArray(jsonData) ? jsonData : [jsonData];
            } catch (error) {
                throw new Error('JSON文件格式错误');
            }
        } else {
            // Markdown或文本文件
            const title = path.basename(req.file.originalname, path.extname(req.file.originalname));
            documents = [{
                title,
                content: fileContent,
                folderId: null,
                theme: 'normal'
            }];
        }

        // 保存文档
        const userDir = getUserDocumentsDir(userId);
        await fs.ensureDir(userDir);

        const savedDocuments = [];

        for (const doc of documents) {
            const documentId = generateId();
            const now = new Date().toISOString();

            const document = {
                id: documentId,
                title: doc.title || '未命名文档',
                content: doc.content || '',
                folderId: doc.folderId || null,
                theme: doc.theme || 'normal',
                userId,
                createdAt: now,
                updatedAt: now,
                wordCount: doc.content ? doc.content.length : 0
            };

            const documentPath = getDocumentPath(userId, documentId);
            await fs.writeJson(documentPath, document, { spaces: 2 });

            savedDocuments.push(document);
        }

        // 删除临时文件
        await fs.remove(filePath);

        res.json({
            success: true,
            data: savedDocuments,
            message: `成功导入 ${savedDocuments.length} 个文档`
        });

    } catch (error) {
        console.error('文件上传失败:', error);

        // 清理临时文件
        if (req.file) {
            try {
                await fs.remove(req.file.path);
            } catch (cleanupError) {
                console.error('清理临时文件失败:', cleanupError);
            }
        }

        res.status(500).json({
            success: false,
            message: '文件上传失败',
            error: error.message
        });
    }
});

// ✅ 搜索文档
app.get('/api/search/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { q: keyword, limit = 20 } = req.query;

        if (!keyword || !keyword.trim()) {
            return res.status(400).json({
                success: false,
                message: '搜索关键词不能为空'
            });
        }

        const userDir = getUserDocumentsDir(userId);

        if (!(await fs.pathExists(userDir))) {
            return res.json({
                success: true,
                data: [],
                total: 0
            });
        }

        const files = await fs.readdir(userDir);
        const searchResults = [];
        const lowerKeyword = keyword.toLowerCase();

        for (const file of files) {
            if (path.extname(file) === '.json') {
                try {
                    const filePath = path.join(userDir, file);
                    const document = await fs.readJson(filePath);

                    // 搜索标题和内容
                    if (document.title.toLowerCase().includes(lowerKeyword) ||
                        document.content.toLowerCase().includes(lowerKeyword)) {

                        // 添加匹配高亮信息
                        const titleMatch = document.title.toLowerCase().includes(lowerKeyword);
                        const contentMatch = document.content.toLowerCase().includes(lowerKeyword);

                        searchResults.push({
                            ...document,
                            matchType: titleMatch ? 'title' : 'content',
                            snippet: contentMatch ?
                                document.content.substring(0, 200) + '...' :
                                document.content.substring(0, 100)
                        });
                    }
                } catch (error) {
                    console.error(`搜索文档 ${file} 失败:`, error);
                }
            }
        }

        // 按相关性排序（标题匹配优先）
        searchResults.sort((a, b) => {
            if (a.matchType === 'title' && b.matchType !== 'title') return -1;
            if (a.matchType !== 'title' && b.matchType === 'title') return 1;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        // 限制结果数量
        const limitedResults = searchResults.slice(0, parseInt(limit));

        res.json({
            success: true,
            data: limitedResults,
            total: searchResults.length,
            keyword
        });

    } catch (error) {
        console.error('搜索失败:', error);
        res.status(500).json({
            success: false,
            message: '搜索失败',
            error: error.message
        });
    }
});

// ✅ ==== 文件夹管理 API ====

// 获取用户所有文件夹
app.get('/api/folders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const foldersDir = getUserFoldersDir(userId);

        // 确保文件夹目录存在
        await fs.ensureDir(foldersDir);

        const files = await fs.readdir(foldersDir);
        const folders = [];

        for (const file of files) {
            if (path.extname(file) === '.json') {
                try {
                    const folderPath = path.join(foldersDir, file);
                    const folder = await fs.readJson(folderPath);
                    folders.push(folder);
                } catch (error) {
                    console.error(`读取文件夹 ${file} 失败:`, error);
                }
            }
        }

        // 按创建时间排序
        folders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.json({
            success: true,
            data: folders,
            total: folders.length
        });

    } catch (error) {
        console.error('获取文件夹列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取文件夹列表失败',
            error: error.message
        });
    }
});

// 创建文件夹
app.post('/api/folders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, parentId } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: '文件夹名称不能为空'
            });
        }

        const folderId = generateId();
        const now = new Date().toISOString();
        const cleanName = name.trim();

        // 创建文件夹元数据
        const folder = {
            id: folderId,
            name: cleanName,
            parentId: parentId || null,
            userId,
            createdAt: now,
            updatedAt: now
        };

        const userDir = getUserDocumentsDir(userId);
        const foldersDir = getUserFoldersDir(userId);

        // 确保目录存在
        await fs.ensureDir(userDir);
        await fs.ensureDir(foldersDir);

        // 保存文件夹元数据
        const folderMetaPath = getFolderMetaPath(userId, folderId);
        await fs.writeJson(folderMetaPath, folder, { spaces: 2 });

        // 创建实际的文件夹目录
        const folderPath = await getFolderFullPath(userId, folderId);
        await fs.ensureDir(folderPath);

        res.status(201).json({
            success: true,
            data: folder,
            message: '文件夹创建成功'
        });

    } catch (error) {
        console.error('创建文件夹失败:', error);
        res.status(500).json({
            success: false,
            message: '创建文件夹失败',
            error: error.message
        });
    }
});

// 更新文件夹
app.put('/api/folders/:userId/:folderId', async (req, res) => {
    try {
        const { userId, folderId } = req.params;
        const updates = req.body;

        const folderMetaPath = getFolderMetaPath(userId, folderId);

        if (!(await fs.pathExists(folderMetaPath))) {
            return res.status(404).json({
                success: false,
                message: '文件夹不存在'
            });
        }

        const existingFolder = await fs.readJson(folderMetaPath);
        const now = new Date().toISOString();

        // 检查是否需要重命名实际文件夹
        const nameChanged = updates.name && updates.name !== existingFolder.name;
        const parentChanged = updates.parentId !== undefined && updates.parentId !== existingFolder.parentId;

        const oldFolderPath = await getFolderFullPath(userId, folderId);

        // 更新元数据
        const updatedFolder = {
            ...existingFolder,
            ...updates,
            updatedAt: now
        };

        await fs.writeJson(folderMetaPath, updatedFolder, { spaces: 2 });

        // 如果名称或父级改变，需要移动实际文件夹
        if (nameChanged || parentChanged) {
            const newFolderPath = await getFolderFullPath(userId, folderId);

            if (await fs.pathExists(oldFolderPath) && oldFolderPath !== newFolderPath) {
                // 确保新路径的父目录存在
                await fs.ensureDir(path.dirname(newFolderPath));

                // 移动文件夹
                await fs.move(oldFolderPath, newFolderPath);
            }
        }

        res.json({
            success: true,
            data: updatedFolder,
            message: '文件夹更新成功'
        });

    } catch (error) {
        console.error('更新文件夹失败:', error);
        res.status(500).json({
            success: false,
            message: '更新文件夹失败',
            error: error.message
        });
    }
});

// 删除文件夹（移动到回收站）
app.delete('/api/folders/:userId/:folderId', async (req, res) => {
    try {
        const { userId, folderId } = req.params;
        const { permanent = false } = req.query; // 支持永久删除参数
        const folderMetaPath = getFolderMetaPath(userId, folderId);

        if (!(await fs.pathExists(folderMetaPath))) {
            return res.status(404).json({
                success: false,
                message: '文件夹不存在'
            });
        }

        const folder = await fs.readJson(folderMetaPath);
        const folderPath = await getFolderFullPath(userId, folderId);

        if (permanent === 'true') {
            // 永久删除
            await fs.remove(folderMetaPath);

            if (await fs.pathExists(folderPath)) {
                await fs.remove(folderPath);
            }

            res.json({
                success: true,
                message: '文件夹已永久删除'
            });
        } else {
            // 移动到回收站
            await moveFolderToTrash(userId, folderId, folder);

            // 从原位置删除
            await fs.remove(folderMetaPath);

            if (await fs.pathExists(folderPath)) {
                try {
                    await fs.remove(folderPath);
                } catch (error) {
                    console.warn(`删除文件夹实体 ${folderPath} 失败:`, error);
                }
            }

            res.json({
                success: true,
                message: '文件夹已移动到回收站'
            });
        }

    } catch (error) {
        console.error('删除文件夹失败:', error);
        res.status(500).json({
            success: false,
            message: '删除文件夹失败',
            error: error.message
        });
    }
});



// ✅ 导出所有文档
app.get('/api/export/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { format = 'json' } = req.query;

        const userDir = getUserDocumentsDir(userId);

        if (!(await fs.pathExists(userDir))) {
            return res.status(404).json({
                success: false,
                message: '用户文档不存在'
            });
        }

        const files = await fs.readdir(userDir);
        const documents = [];

        for (const file of files) {
            if (path.extname(file) === '.json') {
                try {
                    const filePath = path.join(userDir, file);
                    const content = await fs.readJson(filePath);
                    documents.push(content);
                } catch (error) {
                    console.error(`读取文档 ${file} 失败:`, error);
                }
            }
        }

        // 按创建时间排序
        documents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${userId}_documents_${Date.now()}.json"`);
            res.json(documents);
        } else {
            res.status(400).json({
                success: false,
                message: '不支持的导出格式'
            });
        }

    } catch (error) {
        console.error('导出失败:', error);
        res.status(500).json({
            success: false,
            message: '导出失败',
            error: error.message
        });
    }
});

// ✅ ==== 回收站管理 API ====

// 获取回收站内容
app.get('/api/trash/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const trashDir = getUserTrashDir(userId);

        if (!(await fs.pathExists(trashDir))) {
            return res.json({
                success: true,
                data: [],
                total: 0
            });
        }

        const files = await fs.readdir(trashDir);
        const trashItems = [];

        for (const file of files) {
            if (path.extname(file) === '.json') {
                try {
                    const itemPath = path.join(trashDir, file);
                    const item = await fs.readJson(itemPath);
                    trashItems.push(item);
                } catch (error) {
                    console.error(`读取回收站项目 ${file} 失败:`, error);
                }
            }
        }

        // 按删除时间排序（最新删除的在前）
        trashItems.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

        res.json({
            success: true,
            data: trashItems,
            total: trashItems.length
        });

    } catch (error) {
        console.error('获取回收站内容失败:', error);
        res.status(500).json({
            success: false,
            message: '获取回收站内容失败',
            error: error.message
        });
    }
});

// 从回收站恢复文档或文件夹
app.post('/api/trash/:userId/:itemId/restore', async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        const trashItemPath = getTrashItemPath(userId, itemId);

        if (!(await fs.pathExists(trashItemPath))) {
            return res.status(404).json({
                success: false,
                message: '回收站中找不到该项目'
            });
        }

        const trashItem = await fs.readJson(trashItemPath);

        if (trashItem.type === 'document') {
            // 恢复文档
            const { originalData } = trashItem;
            const metaPath = getDocumentMetaPath(userId, itemId);
            const contentPath = await getDocumentContentPath(userId, itemId, originalData.title, originalData.folderId);

            // 确保目标目录存在
            await fs.ensureDir(path.dirname(metaPath));
            await fs.ensureDir(path.dirname(contentPath));

            // 恢复元数据
            await fs.writeJson(metaPath, originalData, { spaces: 2 });

            // 恢复内容文件（如果有的话）
            if (trashItem.originalContentPath && await fs.pathExists(trashItem.originalContentPath)) {
                await fs.copy(trashItem.originalContentPath, contentPath);
            }

            // 从回收站删除
            await fs.remove(trashItemPath);

            res.json({
                success: true,
                message: '文档恢复成功'
            });

        } else if (trashItem.type === 'folder') {
            // 恢复文件夹
            const { originalData } = trashItem;
            const folderMetaPath = getFolderMetaPath(userId, itemId);

            // 确保目标目录存在
            await fs.ensureDir(path.dirname(folderMetaPath));

            // 恢复文件夹元数据
            await fs.writeJson(folderMetaPath, originalData, { spaces: 2 });

            // 重新创建文件夹目录
            const folderPath = await getFolderFullPath(userId, itemId);
            await fs.ensureDir(folderPath);

            // 从回收站删除
            await fs.remove(trashItemPath);

            res.json({
                success: true,
                message: '文件夹恢复成功'
            });
        } else {
            res.status(400).json({
                success: false,
                message: '未知的项目类型'
            });
        }

    } catch (error) {
        console.error('恢复项目失败:', error);
        res.status(500).json({
            success: false,
            message: '恢复项目失败',
            error: error.message
        });
    }
});

// 永久删除回收站中的项目
app.delete('/api/trash/:userId/:itemId', async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        const trashItemPath = getTrashItemPath(userId, itemId);

        if (!(await fs.pathExists(trashItemPath))) {
            return res.status(404).json({
                success: false,
                message: '回收站中找不到该项目'
            });
        }

        const trashItem = await fs.readJson(trashItemPath);

        // 删除原始内容文件（如果存在）
        if (trashItem.originalContentPath && await fs.pathExists(trashItem.originalContentPath)) {
            await fs.remove(trashItem.originalContentPath);
        }

        // 从回收站删除
        await fs.remove(trashItemPath);

        res.json({
            success: true,
            message: '项目已永久删除'
        });

    } catch (error) {
        console.error('永久删除项目失败:', error);
        res.status(500).json({
            success: false,
            message: '永久删除项目失败',
            error: error.message
        });
    }
});

// 清空回收站
app.delete('/api/trash/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const trashDir = getUserTrashDir(userId);

        if (await fs.pathExists(trashDir)) {
            const files = await fs.readdir(trashDir);

            for (const file of files) {
                if (path.extname(file) === '.json') {
                    try {
                        const itemPath = path.join(trashDir, file);
                        const trashItem = await fs.readJson(itemPath);

                        // 删除原始内容文件（如果存在）
                        if (trashItem.originalContentPath && await fs.pathExists(trashItem.originalContentPath)) {
                            await fs.remove(trashItem.originalContentPath);
                        }

                        // 删除回收站项目
                        await fs.remove(itemPath);
                    } catch (error) {
                        console.error(`清理回收站项目 ${file} 失败:`, error);
                    }
                }
            }
        }

        res.json({
            success: true,
            message: '回收站已清空'
        });

    } catch (error) {
        console.error('清空回收站失败:', error);
        res.status(500).json({
            success: false,
            message: '清空回收站失败',
            error: error.message
        });
    }
});

// ✅ 静态文件服务（用于提供上传的文件）
app.use('/uploads', express.static(UPLOADS_DIR));

// ✅ 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);

    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: '文件大小超过10MB限制'
            });
        }
    }

    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? error.message : '未知错误'
    });
});

// ✅ 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在'
    });
});

// ✅ 启动服务器
app.listen(PORT, () => {
    console.log(`✅ 服务器运行在端口 ${PORT}`);
    console.log(`📁 文档存储目录: ${DOCUMENTS_DIR}`);
    console.log(`📁 上传文件目录: ${UPLOADS_DIR}`);
    console.log(`🌐 健康检查: http://localhost:${PORT}/api/health`);
}); 