import { getURLParams } from './utils'
export const dmOptions = [
  {
    label: '华知',
    value: '0',
    code: 'Xws'
  },
  // {
  //   label: '星火',
  //   value: '2',
  //   code: 'Xhws'
  // },
  {
    label: 'Kimi',
    value: '3',
    code: 'Kimi'
  }
  // {
  //   label: '智谱AI',
  //   value: '4',
  //   code: 'ZPClient'
  // },
  // {
  //   label: '百川AI',
  //   value: '6',
  //   code: 'BaiChuanClient'
  // },
  // {
  //   label: '扣子AI',
  //   value: '7',
  //   code: 'CozeClient'
  // }
]
export const dmParams = getURLParams('dm') || '0'

