
import { useEffect, useRef, useState } from 'react'


function App() {
  const inputRef=useRef<HTMLInputElement>()
  const [messages,setMessages]=useState(['hey hello','welcome'])
  const wsRef=useRef<WebSocket>()


  const sendMessage=()=>{
    //@ts-ignore
    wsRef.current.send(JSON.stringify({
      type:"chat",
      payload:{
        //@ts-ignore
        message:inputRef.current.value
      }
    }))
  }
  useEffect(()=>{
    const ws= new WebSocket("ws://localhost:8080")
    
    
      ws.onmessage=(msg)=>{
       setMessages((messages) =>[...messages,msg.data])
      }
      wsRef.current=ws
      
      ws.onopen=()=>{
        ws.send(JSON.stringify({
          type:"join",
          payload:{
            roomId:"room"
          }
        }))
      }

      return ()=>{
        ws.close()
      }
  },[])
  

  return (
    <>
     <div className=' h-[100vh] bg-black'>
      <br></br>
      <div className='h-[85vh]'>
        {
          messages.map((message)=>{
            return(
              <div className=' m-8'>
              <span className='bg-white rounded-md p-2'>{message}</span>
            </div>
            )
          })
        }
      </div>
      <div className='p-2 m-2'>
          <input type="text" className='rounded-md p-2 w-96' ref={inputRef} placeholder='Message' />
          <button className='rounded-md border-2 border-white text-white bg-purple-500 p-1 m-2 h-8 w-16 text-center shadow-white' onClick={sendMessage}>
            Send
          </button>
          
      </div>
     </div>
    </>
  )
}

export default App
