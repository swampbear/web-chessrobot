import React from 'react';
import Header from '../../components/header/Header';
import { ToastContainer } from 'react-toastify';
import { Footer } from '../../components/footer/Footer';
import Chessboard from '../../components/chessboard/Chessboard';
import './BoardConfig.css';
import { useSocket } from '../../socket/SocketContext';

const BoardConfig: React.FC = () => {
    const { socket } = useSocket();

    return (
        <div className='header-container'>
            <Header />
                <h1>Your board should look like this: </h1>
                <br />
        <div id="boardconfig">
            

            <div id="chessboard-container">
                <Chessboard />
            </div>
            <div className="player-container">
                <h2 className='instruction-text'>
                    <br />
                    <br />
                    (ROBOT)
                </h2>
                <section className='space-between-players'></section>
                
                <h2 className='instruction-text'>
                    (YOU) <br /> <br />
                </h2>
            </div>
        </div>
                    <h1>Press START GAME when you are done configuring.</h1>
                <button id="start-game-button">START GAME</button>
            <Footer />
        </div>
    );
}

export default BoardConfig;