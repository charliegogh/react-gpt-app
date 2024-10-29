import Chat from './App'
import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import { message } from 'antd'
import { Markdown } from './markdown'

function getDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
const ChatComponent = (props:any, ref:any) => {
  const [chat, setChat] = useState<any | null>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleMessageSubmit(e)
    }
  }

  const handleChatMessages = (record: any) => {
    chat.handleChat()
    chat.resetScrollPosition()
  }

  const handleChatReload = (e:any) => {
    chat.handleChatReload(e.id)
  }
  const handleCopy = (e:string) => {
    chat.handleCopy(e, () => {
      message.success('复制成功')
    })
  }
  const handleChatStop = (e:any) => {
    chat.handleChatStop(e.id)
  }

  useEffect(() => {
    const field = document.querySelector('#chat-input') as HTMLInputElement | HTMLTextAreaElement
    const sendBtn = document.querySelector('#chat-input-click') as HTMLInputElement | HTMLTextAreaElement
    if (field && sendBtn) {
      const chatInstance = new Chat({
        field,
        sendBtn,
        onMessagesChanged: (messages:any) => {
          setChatMessages([...messages])
        }
      })
      setChat(chatInstance)
      setChatMessages(chatInstance.chatMessages)
    }
    return () => {
      chat && chat.destroy()
    }
  }, [])

  useImperativeHandle(ref, () => ({
    handleChatMessages
  }))
  return (
    <div className='flex h-full w-full flex-col bg-token-main-surface-primary pb-4'>
      <div
        className='chat-wrapper flex-1 overflow-y-auto p-4 text-sm leading-6 text-slate-900 sm:text-base sm:leading-7'
      >
        {chatMessages.map((message) => (
          <div key={message.id} className='w-full flex mb-4'>
            <div className='flex-shrink-0 flex flex-col relative items-end mr-2'>
              <img
                className='rounded-full w-8 h-8'
                src='data:image/png;base64,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'
                alt=''
              />
            </div>
            <div className='relative flex w-full min-w-0 flex-col'>
              <div className={`${message.role === 'user' ? '' : 'border-radius--prompt px-2 py-4 bg-white sm:px-4'}`}>
                <Markdown
                  content={message.content}
                />

                {message.loading && <span className='typing'></span>}
                {
                  message.role === 'assistant'
                    ? message.loading
                      ? <div>
                        <div className='mt-4 flex align-middle'>
                          <div
                            className='mr-6 cursor-pointer text-xs items-center text-color--Primayblue_01'
                            onClick={() => handleChatStop(message)}
                          >
                            <i className='iconfont icon-NO-Outline mr-[4px]' />
                            停止生成
                          </div>
                        </div>
                      </div>
                      : <div className='flex mt-4 align-middle'>
                        <div
                          className='mr-6 cursor-pointer text-xs items-center text-color--Primayblue_01'
                          onClick={() => handleChatReload(message)}
                        >
                          <i className='iconfont icon-Refresh mr-[4px]' />
                            重新生成
                        </div>
                        <div
                          className='mr-6 cursor-pointer text-xs items-center text-color--Primayblue_01'
                          onClick={() => handleCopy(message.content)}
                        >
                          <i className='iconfont icon-Copy mr-[4px]' />
                          复制
                        </div>
                      </div>
                    : ''
                }
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='w-full'>
        <div className='text-base px-3 m-auto md:px-5 lg:px-1 xl:px-5'>
          <form
            ref={formRef}
            onSubmit={handleMessageSubmit}
          >
            <label htmlFor='chat-input' className='sr-only'>Enter your prompt</label>
            <div className='relative flex p-2 bg-white rounded-xl shadow-md'>
              <textarea
                id='chat-input'
                onKeyPress={handleKeyPress}
                className='block w-full resize-none rounded-xl border-none p-1 sm:text-base'
                placeholder='Enter your prompt'
                rows={1}
                required
              ></textarea>
              <button
                type='submit'
                id='chat-input-click'
                className='cursor-pointer bottom-2 right-2.5 rounded-lg bg-blue-700 p-2 font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                  <path d='M10 14l11 -11'></path>
                  <path
                    d='M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5'
                  ></path>
                </svg>
                <span className='sr-only'>Send message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default forwardRef(ChatComponent)
