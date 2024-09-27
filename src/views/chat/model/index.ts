import { dmOptions, dmParams } from '@/options'

const dm = dmOptions.find((i:any) => i.value === dmParams)
if (!dm) {
  throw new Error('dm not found')
}
// @ts-ignore
const modules = import.meta.glob('./*.ts', { eager: true })
// 获取模块的默认导出
// @ts-ignore
const WebSocketClient = modules[`./${dm.code}.ts`].default

if (!WebSocketClient) {
  throw new Error(`Module './${dm.code}.ts' not found`)
}

export default WebSocketClient
