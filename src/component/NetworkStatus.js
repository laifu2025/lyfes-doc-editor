import React, { useState, useEffect } from 'react';
import { Alert } from 'antd';
import { checkNetworkConnection } from '../utils/api';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverConnected, setServerConnected] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkServerConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setServerConnected(false);
      setShowAlert(true);
    };

    const checkServerConnection = async () => {
      try {
        const connected = await checkNetworkConnection();
        setServerConnected(connected);
        if (!connected && isOnline) {
          setShowAlert(true);
        } else if (connected) {
          setShowAlert(false);
        }
      } catch (error) {
        setServerConnected(false);
        if (isOnline) {
          setShowAlert(true);
        }
      }
    };

    // 初始检查
    checkServerConnection();

    // 监听网络状态变化
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 定期检查服务器连接（每30秒）
    const interval = setInterval(checkServerConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  if (!showAlert) {
    return null;
  }

  const getAlertMessage = () => {
    if (!isOnline) {
      return {
        type: 'error',
        message: '网络连接已断开',
        description: '请检查您的网络连接。在离线状态下，您的编辑内容将仅保存在本地。'
      };
    } else if (!serverConnected) {
      return {
        type: 'warning',
        message: '服务器连接失败',
        description: '无法连接到服务器，云端同步功能暂时不可用。您的编辑内容将保存在本地，连接恢复后会自动同步。'
      };
    }
    return null;
  };

  const alertConfig = getAlertMessage();
  
  if (!alertConfig) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <Alert
        type={alertConfig.type}
        message={alertConfig.message}
        description={alertConfig.description}
        showIcon
        closable
        onClose={() => setShowAlert(false)}
        style={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '6px'
        }}
      />
    </div>
  );
};

export default NetworkStatus;