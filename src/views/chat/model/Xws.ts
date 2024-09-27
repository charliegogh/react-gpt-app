import { wsAiPrefix } from '@/fetch/env'
class WebSocketClient {
  socket: WebSocket | null
  text: any
  $onCallback: ((data: any) => void) | null
  status: string
  doneMarker: string

  constructor() {
    this.socket = null
    this.text = []
    this.$onCallback = null
    this.status = 'init'
    this.doneMarker = '[DONE]'
  }

  setStatus(status: string): void {
    this.status = status
  }

  async connect(): Promise<void> {
    this.setStatus('ttsing')
    const URL = wsAiPrefix + `/ai/websocket/log`
    const token = 'zhtest'
    if ('WebSocket' in window) {
      this.socket = new WebSocket(URL, ['' + token + ''])
    } else if ('MozWebSocket' in window) {
      this.socket = ('MozWebSocket' in window) ? new (window as any).MozWebSocket(URL) : null
    } else {
      console.error('WebSocket is not supported in this browser.')
      return
    }
    if (this.socket) {
      this.socket.onopen = (e) => {
        this.$emit()
      }
      this.socket.onmessage = (e) => {
        this.onMessage(e.data)
      }
      this.socket.onerror = (e) => {
        console.log(e, 'socket error')
        this.setStatus('error')
      }
      this.socket.onclose = () => {
        this.onClose()
      }
    }
  }

  async $emit(text?:any): Promise<void> {
    if (text) this.text = text
    if (['init', 'endPlay', 'errorTTS', 'error', 'close'].includes(this.status)) {
      await this.connect()
      console.log('WebSocket is not connected. Reconnecting...')
      return
    }
    if (this.socket) {
      const last = this.text[this.text.length - 1]
      console.log(last)
      this.socket.send(JSON.stringify(last.reloadParams ? {
        id: last.reloadParams.id,
        date: last.reloadParams.date,
        finalSendToAi: last.reloadParams.finalSendToAi
      } : text))
    }
  }

  onMessage(e: any): void {
    const rs = JSON.parse(e || '{}')
    let text = rs.content
    const isDone = text.includes(this.doneMarker)
    if (isDone) {
      text = text.replace(this.doneMarker, '﻿')
    }
    const data = {
      header: {
        code: 0
      },
      payload: {
        choices: {
          status: isDone ? 2 : 0,
          text: [{ content: text }],
          hzId: rs.hzId
        }
      }
    }
    if (typeof this.$onCallback === 'function') {
      this.$onCallback(data)
    }
  }
  onClose(): void {
    console.log('~~~~~~~')
    if (this.socket) {
      this.setStatus('close')
      this.socket.close()
    }
  }
}

export default WebSocketClient
