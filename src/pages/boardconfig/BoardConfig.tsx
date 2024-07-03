import React, { useState } from 'react';
import Header from '../../components/header/Header';
import { ToastContainer } from 'react-toastify';
import { Footer } from '../../components/footer/Footer';
import Chessboard from '../../components/chessboard/Chessboard';
import './BoardConfig.css';

const BoardConfig: React.FC = () => {

    return(
        <div id="boardconfig" className="gradientBackground">
        <Header />
        <div className="container">
            <section id='chessboard-container'>
                <Chessboard/>
            </section>
        </div>
        <Footer />
    </div>  
    );
}

export default BoardConfig;

