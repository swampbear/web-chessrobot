import React, { useEffect, useState } from 'react';import './App.css';
import io, { Socket } from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import { SocketProvider } from './contextproviders/socket/SocketContext';
import { PieceColorProvider } from './contextproviders/pieceColor/PieceColorContext';

import Selection from './pages/selection/Selection';
import BoardConfig from './pages/boardconfig/BoardConfig'
import Game from './pages/game/Game'
import Header from './components/header/Header';
import { Footer } from './components/footer/Footer';



function App() {
  const[socketInstance, setSocketInstance] = useState<Socket | null>(null);
  useEffect(() => {
    try {
      const socket = io('http://127.0.0.1:8080')

    setSocketInstance(socket);

    socket.on('connect', () => {
        console.log("Connected to flask-socket")
        socket.emit('message', { data: "I'm connected!" });
    });
    socket.on('json', (msg) => {
        console.log('JSON recieved:', msg);
    });
    return () => {
        socket.disconnect();  
    };
    } catch (error) {
      console.error(error)
    }
}, []);

  return (
    <BrowserRouter>
    <SocketProvider socket={socketInstance}>
      <PieceColorProvider>
          <Routes>
              <Route index element={<Home/>}/>
              <Route path='/selection' Component={Selection}/>
              <Route path='/boardconfig' Component={BoardConfig}/>
              <Route path='/game' Component={Game}/>
          </Routes>
          <Footer/>
        </PieceColorProvider>
    </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
