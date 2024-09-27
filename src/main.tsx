import { createRoot } from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

const rootElement = document.getElementById('root') as HTMLElement
const root = createRoot(rootElement)

root.render(
  <HashRouter>
    <ConfigProvider locale={zhCN}>
      <App/>
    </ConfigProvider>
  </HashRouter>
)
