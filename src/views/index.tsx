import Log from './log'
import Chat from './chat'
import NavBar from './NavBar'
import { Row, Col } from 'antd'
import { useRef } from 'react'
function App() {
  const chatRef = useRef<any>(null)
  const handleChatMessages = (record: any) => {
    chatRef.current.handleChatMessages(record)
  }
  return (
    <div className='w-full h-[100vh] flex flex-col'>
      <NavBar/>
      <Row className='flex-1 overflow-auto h-full'>
        <Col span={16}
          className='h-full flex'
        >
          <div className='flex-1 overflow-auto'>
            <Log
              handleChatMessages={handleChatMessages}
            />
          </div>
        </Col>
        <Col span={8}
          className='h-full flex'
        >
          <div className='flex-1 overflow-auto'>
            <Chat ref={chatRef}/>
          </div>
        </Col>
      </Row>
    </div>
  )
}
export default App
