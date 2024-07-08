import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import Chessboard from '../../components/chessboard/Chessboard';
import './BoardConfig.css';
import { useSocket } from '../../socket/SocketContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BoardConfig: React.FC = () => {
    const { socket } = useSocket();
    const [isValid, setIsValid] = useState<boolean>(false);
    const [pieceColor, setPieceColor] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    

    useEffect(() => {
        function fetchPieceColor() {
            socket?.emit('getColor');
            socket?.on('getColor', (color: string) => {
                
                setPieceColor(color);
                setLoading(false);
            });
        }

        fetchPieceColor();

        return () => {
            socket?.off('getColor');
        };
    }, [socket]);


    function handleStartGameClick(){
        if(isValid){
            //TODO implemnt routing to game page
            toast.success("Evrything is set up correctly")
        } else{
            toast.error("The board is not set up correctly. Make sure that all peices are placed in ther correct place.")
        }
    }

    return (
        <div id='header-container' className="gradientBackground">
            <Header />
            <h1>Your board should look like this: </h1>
            <br />
            <div id="boardconfig">
                <div id="chessboard-container">
                    {loading ? (
                        <div className="spinner">
                            <div></div>
                            <div></div>
                        </div>
                    ) : (
                        <>
                            <Chessboard setIsValid={setIsValid} pieceColor={pieceColor} />
                            <div id="robot-label">ROBOT</div>
                            <div id="you-label">YOU</div>
                        </>
                    )}
                </div>
            </div>
            <h1>Press START GAME when you are done configuring.</h1>
            <button id="start-game-button" onClick={handleStartGameClick}>START GAME</button>
            <ToastContainer/>
            <Footer />
        </div>
    );
}

export default BoardConfig;