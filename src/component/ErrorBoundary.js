import React from 'react';
import { Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            width: '100%'
          }}>
            <h2 style={{ color: '#ff4d4f', marginBottom: '16px' }}>
              😵 应用出现了错误
            </h2>
            <p style={{ marginBottom: '24px', color: '#666' }}>
              抱歉，应用遇到了一个意外错误。您可以尝试刷新页面或重置应用状态。
            </p>
            
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <details style={{ 
                backgroundColor: '#f8f8f8', 
                padding: '16px', 
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  查看错误详情
                </summary>
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </div>
              </details>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button type="primary" onClick={this.handleReload}>
                刷新页面
              </Button>
              <Button onClick={this.handleReset}>
                重试
              </Button>
            </div>
            
            <p style={{ 
              marginTop: '24px', 
              fontSize: '12px', 
              color: '#999',
              borderTop: '1px solid #eee',
              paddingTop: '16px'
            }}>
              如果问题持续存在，请尝试清除浏览器缓存或联系技术支持
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;