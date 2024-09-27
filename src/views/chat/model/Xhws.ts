import CryptoJS from 'crypto-js'

const APPID = 'adf1504e'
const API_SECRET = 'ZGU5ZTM2NzI1YmNlNjI3OWE2MTdjYThm'
const API_KEY = '9b2b0533045fd869b3a889c13cf68500'
function getWebsocketUrl(): Promise<string> {
  return new Promise((resolve) => {
    const { host } = window.location
    const date = new Date().toUTCString()
    const algorithm = 'hmac-sha256'
    const headers = 'host date request-line'
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2.1/chat HTTP/1.1`
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, API_SECRET)
    const signature = CryptoJS.enc.Base64.stringify(signatureSha)
    const authorizationOrigin = `api_key="${API_KEY}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    const authorization = btoa(authorizationOrigin)
    const URL = `wss://spark-api.xf-yun.com/v2.1/chat?authorization=${authorization}&date=${date}&host=${host}`
    resolve(URL)
  })
}
interface Message {
  id: string | number,
  role: string;
  content: string;
}
class WebSocketClient {
  socket: WebSocket | null
  text: Message[]
  $onCallback: ((data: any) => void) | null
  status: string

  constructor() {
    this.socket = null
    this.text = []
    this.$onCallback = null
    this.status = 'init'
  }

  setStatus(status: string): void {
    this.status = status
  }

  async connect(): Promise<void> {
    this.setStatus('ttsing')
    const URL: string = await getWebsocketUrl()
    if ('WebSocket' in window) {
      this.socket = new WebSocket(URL)
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

  async $emit(text?:Message[]): Promise<void> {
    if (text) this.text = text
    if (['init', 'endPlay', 'errorTTS', 'error', 'close'].includes(this.status)) {
      await this.connect()
      console.log('WebSocket is not connected. Reconnecting...')
      return
    }
    const params = {
      header: {
        app_id: APPID,
        uid: '1'
      },
      parameter: {
        chat: {
          domain: 'generalv2',
          temperature: 0.5,
          max_tokens: 1024
        }
      },
      payload: {
        message: {
          text: this.text
        }
      }
    }
    if (this.socket) this.socket.send(JSON.stringify(params))
  }

  onMessage(e: any): void {
    const rs = JSON.parse(e)
    if (rs.header.code === 0 && rs.header.status === 2) {
      this.setStatus('init')
      this.onClose()
    }
    if (typeof this.$onCallback === 'function') {
      this.$onCallback(JSON.parse(e))
    }
  }

  $on(callback: (data: any) => void): void {
    this.$onCallback = callback
  }

  onClose(): void {
    if (this.socket) {
      this.setStatus('close')
      this.socket.close()
    }
  }
}

export default WebSocketClient
