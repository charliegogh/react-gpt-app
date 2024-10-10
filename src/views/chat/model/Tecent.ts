import ERROR from './ERROR'
type Callback = (data: any) => void

interface Message {
  role: string
  content: string
  action?: string
}

interface Options {
  Model: string
  Messages: Message[]
  Stream: boolean
}

class Client {
  private $onCallback: Callback | null = null
  private status = 'init'
  private content = ''
  private text: Message[] = []
  private controller: AbortController | null = null

  $on(callback: Callback): void {
    this.$onCallback = callback
  }

  async $emit(text?: Message[]): Promise<void> {
    this.setStatus('ttsing')
    if (this.controller) {
      this.controller.abort()
      this.controller = null
    }

    try {
      if (text) this.text = text
      // 创建一个新的 AbortController 实例
      this.controller = new AbortController()
      const signal = this.controller.signal

      const url = 'http://192.168.31.87:88/tecent'
      const data: Options = {
        Model: 'hunyuan-pro',
        // @ts-ignore
        Messages: this.text.map(i => {
          return {
            Role: i.role,
            Content: i.content
          }
        }),
        Stream: true
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        signal // 将 signal 传递给 fetch 请求
      })

      if (!response.ok) {
        const errorText = await response.text()
        const _errorText = JSON.parse(errorText)
        this.handleError({
          code: 10110,
          messages: _errorText.error.message || ERROR['请求异常']
        })
        throw new Error('Network response was not ok')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Reader is not available.')

      const decoder = new TextDecoder('utf-8')
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const jsonStr = line.replace('data: ', '')
            if (jsonStr === '[DONE]') {
              this.onMessage('﻿', true)
              return
            }
            const jsonData = JSON.parse(jsonStr)
            if (jsonData.Choices && jsonData.Choices[0] && jsonData.Choices[0].Delta && jsonData.Choices[0].Delta.Content) {
              this.onMessage(jsonData.Choices[0].Delta.Content)
            }
            if (jsonData.Choices[0].FinishReason === 'stop') {
              this.onMessage('﻿', true)
              return
            }
          }
        }
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log('Fetch aborted')
        this.onStop() // 处理请求被中止的情况
      }
    } finally {
      this.controller = null // 请求结束后重置 controller
    }
  }

  private handleError(e: { code: number; messages: string }): void {
    this.content = e ? e.messages : '请求异常'
    const data = {
      header: e || {
        code: 100100,
        messages: ERROR['请求异常']
      }
    }
    this.$onCallback?.(data)
    this.onClose()
  }

  private onMessage(text: string, isDone?: boolean): void {
    const data = {
      header: {
        code: 0
      },
      payload: {
        choices: {
          status: isDone ? 2 : 0,
          text: [
            {
              content: text
            }
          ]
        }
      }
    }

    this.$onCallback?.(data)
    this.content += text
    if (isDone) {
      this.onClose()
    }
  }

  private setStatus(status: string): void {
    this.status = status
  }

  private onClose(): void {
    this.setStatus('close')
    if (this.controller) {
      this.controller.abort()
    }
  }

  private onStop(): void {
    this.$onCallback?.({
      header: {
        code: 0
      },
      payload: {
        choices: {
          status: 2,
          text: [
            {
              content: this.content !== '' ? '' : '已停止生成'
            }
          ]
        }
      }
    })
    this.onClose()
  }
}

export default Client
