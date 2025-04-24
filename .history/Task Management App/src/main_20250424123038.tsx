import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ConfigProvider, App as AntdApp } from 'antd'; // 👉 import มาเพิ่ม

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <AntdApp> {/* 👈 wrap App ด้วย Ant Design App */}
        <App />
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
);

