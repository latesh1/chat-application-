import { useEffect, useState, useRef } from 'react';

function App() {
  const [message, setMessages] = useState(["websocket storing real time chats", "hello"]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // should be ws:// not http://
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    }
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }
  }, []);

  return (
    <div className='h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col'>
      {/* Header */}
      <div className='bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4'>
        <h1 className='text-white text-xl font-semibold'>Chat Room</h1>
        <div className='flex items-center mt-2'>
          <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
          <span className='text-gray-300 text-sm ml-2'>Connected</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {message.map((message, idx) =>
          <div key={idx} className='flex justify-start'>
            <div className='max-w-xs lg:max-w-md'>
              <div className='bg-white/95 backdrop-blur-sm text-gray-800 rounded-2xl px-4 py-3 shadow-lg border border-gray-200/50'>
                <p className='text-sm leading-relaxed'>{message}</p>
              </div>
              <div className='text-xs text-gray-400 mt-1 px-2'>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className='bg-gray-800/70 backdrop-blur-sm border-t border-gray-700 p-4'>
        <div className='max-w-4xl mx-auto flex items-center space-x-3'>
          <div className='flex-1 relative'>
            <input 
              id="message" 
              className="w-full bg-gray-700/50 text-white placeholder-gray-400 rounded-full px-6 py-3 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
              placeholder="Type your message..."
            />
          </div>
          <button
            onClick={() => {
              const message = (document.getElementById("message") as HTMLInputElement)?.value;
              (wsRef.current as WebSocket).send(JSON.stringify({
                type: "chat",
                payload: {
                  message: message
                }
              }))
            }}
            className='bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App;