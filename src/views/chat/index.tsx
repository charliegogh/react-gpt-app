import Prompt from './Prompt'
import { forwardRef, useImperativeHandle, useRef } from 'react'

function Chat(props: any, ref:any) {
  const promptRef = useRef<any>(null)
  const handleChatMessages = (record: any) => {
    promptRef.current.handleChatMessages(record)
  }
  useImperativeHandle(ref, () => ({
    handleChatMessages
  }))
  return (
    <Prompt
      ref={promptRef}
    />
  )
}

export default forwardRef(Chat)
