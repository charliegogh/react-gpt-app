import client from './model'
import { copyToClipboard } from '@/utils'

interface ChatMessage {
  id: string | number;
  role: string;
  content: string;
  loading?: boolean;
  reloadParams?: any | object;
}

class Chat extends client {
  public chatMessages: ChatMessage[]
  private currentChatMessageId: string | number
  private field: HTMLInputElement | HTMLTextAreaElement | null
  private sendBtn: HTMLInputElement | HTMLTextAreaElement | null
  private inputValue: string
  private events: string[]
  public onMessagesChanged: (messages: ChatMessage[]) => void
  private $onCallback: (e: any) => void

  constructor(options: any) {
    super()
    this.currentChatMessageId = '1'
    this.chatMessages = [
      {
        id: '1',
        role: 'system',
        content: '请点击查看',
        loading: false
      }
    ]
    this.$onCallback = this._$on
    this.inputValue = options?.inputValue || ''

    this.field = options?.field || null
    this.sendBtn = options?.sendBtn || null
    this.onMessagesChanged = options?.onMessagesChanged || (() => {
    })

    this.handleEvent = this.handleEvent.bind(this)

    if (this.field) {
      this.field.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement
        this.inputValue = target.value
      })
      this.field.addEventListener('keydown', (e: any) => {
        if (e.keyCode === 13) {
          e.preventDefault()
          this.dispatchEvent('send')
        }
      })
    }

    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => {
        this.dispatchEvent('send')
      })
    }

    this.events = [
      'send'
    ]
    for (let i = 0, len = this.events.length; i < len; i++) {
      window.addEventListener(this.events[i], this.handleEvent)
    }
  }

  dispatchEvent(type: string) {
    const event = document.createEvent('CustomEvent')
    event.initCustomEvent(`${type}`, true, true, {
      type
    })
    return window.dispatchEvent(event)
  }

  async handleEvent() {
    if ((this.inputValue ?? '') === '') {
      return
    }
    await this.handleChat()
    this.resetField()
  }

  async handleChat() {
    const id = new Date().getTime()
    const chat: ChatMessage[] = [
      {
        id: id + '_user',
        role: 'user',
        content: this.inputValue,
        loading: false
      },
      {
        id: id,
        role: 'assistant',
        content: '',
        loading: true
      }
    ]
    this.currentChatMessageId = id
    this.handleMessages(chat)
    await this._$emit()
  }

  async _$emit() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.$emit(this.chatMessages.filter(_ => !_.loading))
    this.resetScrollPosition(false, 'chat')
  }
  async handleChatReloadHz(id: any) {
    const targetMessage: any = this.chatMessages.find(_ => _.id === id)
    this.inputValue = targetMessage.ask
    const _id = new Date().getTime()
    const chat = [
      {
        id: _id + '_user',
        role: 'user',
        content: this.inputValue,
        reloadParams: targetMessage.reloadParams
      },
      {
        id: _id,
        role: 'assistant',
        content: '',
        loading: true,
        ask: targetMessage.ask,
        reloadParams: targetMessage.reloadParams
      }
    ]
    this.currentChatMessageId = _id
    this.handleMessages(chat)
    await this._$emit()
  }

  async handleChatReload(id: any) {
    const targetMessage: any = this.chatMessages.find(_ => _.id === id)
    const _id = new Date().getTime()
    const chat = [
      {
        id: _id + '_user',
        role: 'user',
        content: targetMessage.content
      },
      {
        id: _id,
        role: 'assistant',
        content: '',
        loading: true
      }
    ]
    this.currentChatMessageId = _id
    this.handleMessages(chat)
    await this._$emit()
  }

  async handleChatStop(id:any) {
    const targetMessage: any = this.chatMessages.find(_ => _.id === id)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.onClose()
    if (targetMessage) {
      targetMessage.loading = false
      console.log(targetMessage)
    }
    this.onMessagesChanged(this.chatMessages)
    this.resetScrollPosition(false, 'chat')
  }

  handleMessages(e: ChatMessage[], reset?: boolean) {
    this.chatMessages = reset ? e : this.chatMessages.concat(e)
    this.onMessagesChanged(this.chatMessages)
  }

  _$on(e: any) {
    const targetMessage: ChatMessage | undefined = this.chatMessages.find(_ => _.id === this.currentChatMessageId)
    if (!targetMessage) {
      return
    }
    const rs = e.payload?.choices?.text[0].content
    if (rs) {
      targetMessage.content += rs
      const status = e.payload?.choices?.status
      if (status === 2) {
        targetMessage.loading = false
      }
    }
    this.handleMessages([])
    this.resetScrollPosition(true, 'false')
  }

  handleCopy(record: string, cb: () => void) {
    copyToClipboard(record, () => {
      cb()
    })
  }

  resetField() {
    this.inputValue = ''
    this.changeField()
  }

  changeField() {
    if (this.field) {
      this.field.value = ''
      const event2 = new Event('input', {
        bubbles: true,
        cancelable: true
      })
      this.field.dispatchEvent(event2)
      this.field.focus()
    }
  }

  destroy() {
    for (let i = 0, len = this.events.length; i < len; i++) {
      window.removeEventListener(this.events[i], this.handleEvent)
    }
    if (this.field) {
      this.field.removeEventListener('input', () => {
      })
      this.field.removeEventListener('keydown', () => {
      })
    }
    if (this.sendBtn) {
      this.sendBtn.removeEventListener('click', () => {
      })
    }
    this.handleMessages([])
  }

  resetScrollPosition(on = false, behavior:any) {
    function scrollTo() {
      const el = document.querySelector('.chat-wrapper') as HTMLElement | null
      if (!el) return
      const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight
      if (on && distanceToBottom > 30) {
        return
      }
      if (behavior === 'behavior') {
        el.scrollTo({
          top: el.scrollHeight,
          // @ts-ignore
          behavior: 'behavior'
        })
        return
      }
      el.scrollTop = el.scrollHeight
    }

    setTimeout(() => {
      scrollTo()
    }, on ? 0 : 200)
  }
}

export default Chat
