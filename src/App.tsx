import React, { useEffect, useState } from 'react';import './App.css';
import Chessboard from './components/chessboard/Chessboard';
import io, { Socket } from 'socket.io-client';
import Header from './components/header/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import { SocketProvider } from './socket/SocketContext';
import Selection from './pages/selection/Selection';
import { NonNullChain } from 'typescript';

function App() {
  const[socketInstance, setSocketInstance] = useState<Socket | null>(null);
  useEffect(() => {
    const socket = io('http://127.0.0.1:8080')

    setSocketInstance(socket);

    socket.on('connect', () => {
        console.log("Connected to flask-socket")
        socket.emit('message', { data: "I'm connected!" });
    });
    socket.on('message', (msg) => {
        console.log('Message received from server:', msg);
    });
    return () => {
        socket.disconnect();  
    };
}, []);
  return (
    <BrowserRouter>
    <SocketProvider socket={socketInstance}>
      <Routes>
          <Route index element={<Home/>}/>
          <Route path='/selection' Component={Selection}/>
          </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
