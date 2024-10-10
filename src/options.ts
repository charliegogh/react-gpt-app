import { getURLParams } from './utils'
export const dmOptions = [
  {
    label: '华知',
    value: '0',
    code: 'Xws'
  },
  {
    label: 'Kimi',
    value: '3',
    code: 'Kimi'
  },
  {
    label: 'Tecent',
    value: '4',
    code: 'Tecent'
  }
]
export const dmParams = getURLParams('dm') || '4'

