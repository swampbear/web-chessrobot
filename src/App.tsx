import React from 'react';
import './App.css';
import Chessboard from './components/chessboard/Chessboard';
import Header from './components/header/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route index element={<Home/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
