import React, { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const socket = useRef(null); // Use useRef for sockets to avoid unnecessary re-renders

  const msgRef = useRef(null);
  const areaRef = useRef(null);
  const [messages, setMessages] = useState([]); // Use useState for message state

  useEffect(() => {
    socket.current = io('http://localhost:3000', { transports: ['websocket', 'polling'] });

    socket.current.on('message', (message, id) => {
      if (id !== socket.current.id) {
        setMessages((prevMessages) => [...prevMessages, { message, senderId: id }]);
      }
    });

    return () => socket.current.disconnect(); // Cleanup on unmount
  }, []);

  const clickHandle = () => {
    const msg = msgRef.current.value;

    socket.current.emit('user-message', msg);
    setMessages((prevMessages) => [...prevMessages, { message: msg, senderId: socket.current.id }]);
    msgRef.current.value = '';
  };

  return (
    <>
      <div className="heading mt-5 mb-10 ml-15 mr-15 w-100 h-10 rounded text-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Chatt</h1>
      </div>
      <div id="area" ref={areaRef} className="container bg-slate-200 message-list">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.senderId === socket.current.id ? 'message self' : 'message other'}
          >
            {message.message}
          </div>
        ))}
      </div>
      <div className="msg-btn mt-10">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <input
              type="text"
              ref={msgRef}
              id="message"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type Here ...."
              required
            />
          </div>
        </div>
        <button type="submit" id="send" onClick={clickHandle} className="text-white bg-blue-700 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Submit
        </button>
      </div>
    </>
  );
}

export default App;
