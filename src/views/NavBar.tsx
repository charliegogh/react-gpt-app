import { Select } from 'antd'
import { dmOptions, dmParams } from '../options'

function App() {
  const handleChange = (record: string) => {
    const currentUrl = window.location.href
    const [baseUrl, hash] = currentUrl.split('#')
    const url = new URL(baseUrl)
    const params = new URLSearchParams(url.search)
    params.set('dm', record)
    window.location.href = `${url.origin}${url.pathname}?${params.toString()}${hash ? '#' + hash : ''}`
  }
  return (
    <div className='sticky top-0 juice:p-3 mb-1.5 flex items-center justify-between z-10 h-14 px-4 bg-white shadow'>
      <div className='flex items-center text-lg	'>
        <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAAAXNSR0IArs4c6QAAA1pJREFUSEu9lU9oHFUcxz+/mZ3dnURhK96dIEpPsqJ4qFR2eihpY8vmpl4yAQ/1IEQPHjyYTS/Fk8nNg7h763EXirWIkBURxEa6NwNCd++lZM3GpJv989P3Zje72yRtCqEPHjPMMO/z+77vd35PeA5DngODZ4K8tq5ZF5qboTSepbgTQ17/WcuuR95xoaeEm+elelLQiSCv/qCRuBSdBJgpDo2/3pOZU4W8Uta6kyCwEHcAElY2QymcBPRUJdnfdLkHhdZDUI0BrmvVNDseM41QmuMgLeczpMnIpcqBb0+EnL2pQTpD3ZmGfgJ2d+FRawRSh9X7s/KZgdjFfcoIOQsVmvSpymxl/omQN77XkjPNgjMFMgVMQd+B7YfQ2Y8V1a+IXUN/zJdwWJjYPqEkFyuLx0LO3tAg6ccqLGQaxAf8+LrfhdYWa/cvy5Ku5zN0qKNkxiC/0Ccy23YsJPed1v95QKDJeFGjxACNGknTVJ+VjXOyOuHHT/ksPbJAQy5VDiJ+JOTCNxq5SYrGh+YD6JlEGSUG5NMgw/zdOakZwNu/ak5SBHffkdJxSTsEyS1pxnuJe/gEkgaSsL0F7Y4F1Tyf+d8/if/4bFkDb5q63UKHlT/ePTrShyAXruny/1UXjAfOYP8lBa1tajt7hLVCHNlsUQPPY510XIymaHYSzNQei3QctLExG2nQ7lA3RrsvxhDS1oPa3suE1cXRP/HW13HyjAo7DSjB6sbVONLjYwIyF2mpu89Ctw+uUfLCAOATVgcKzMfnrmvU7lC0BQwA5t5OIdz4cLKvHUDykWa7cM8s0mlDvxebLD7hnW8nu+7cmtZ7EGy3oN0eKbGKPKp/fizhkUrmIq0LBMOX+22azh5v3qlMAq5+pcvqUzDRNqHoAjst2DUwo8S3/S3c+HSkxiq5HGnkCkXTm4ZDYPFW6XAsr3yuJk0BKTBzCOsJtHZgr20j36h9OerSFvJ+pKabLg8BfVi7XZKlxw20xaQoWoDxYwgyMC9WZt79+wi2/uZMbTUOioUYP3pQVggEGrdKR58Vsx9p5JhzxQNnABoCDcCoMrOfZO32tVGR48ZnupBNQK1SmmzfEzH/QHOJBCTS0B1cD5LlWiXNyhdxNxjb+uOawek9f+qhdRqo/wDcviEojK5GGwAAAABJRU5ErkJggg=='/>
        <span className='ml-4'>研学智得AI</span>
      </div>
      <div>
        <span className='mr-2'>选择模型</span>
        <Select
          defaultValue={typeof dmParams === 'string' ? dmParams : undefined}
          style={{ width: 120 }}
          onChange={handleChange}
          options={dmOptions}
        />
      </div>
    </div>
  )
}

export default App
