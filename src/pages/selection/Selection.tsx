import React, { useEffect, useState } from 'react';
import './Selection.css';
import io, { Socket } from 'socket.io-client';
import Header from '../../components/header/Header';
import Chessboard from '../../components/chessboard/Chessboard';
import { Footer } from '../../components/footer/Footer';
import { useSocket } from '../../socket/SocketContext';

const Selection: React.FC = () => {
    const { socket } = useSocket();

    const handleMessage = () => {
        if(socket){
            socket.emit('message', {data: "Message from Selection page"})
        }
    }

    return(
        <div id="selection" className='gradientBackground'>
            <Header />
            <div className="container">
                
            </div>
            <Footer />
        </div>
    )

}


export default Selection