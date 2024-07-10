import React, { useEffect, useState } from "react";
import Header from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { usePieceColor } from "../../contextproviders/pieceColor/PieceColorContext";
import Chessboard from "../../components/chessboard/Chessboard";
import './Game.css';
import { useSocket } from "../../contextproviders/socket/SocketContext";

const Game = () => {
    const { pieceColor } = usePieceColor();
    const [isValid, setIsValid] = useState(false);
    const [isPlayerTurn, setIsPlayerTurn] = useState(pieceColor === 'white');
    const [statusMessage, setStatusMessage] = useState("");
    const [difficulty, setDifficulty] = useState(() => {
        const savedDifficulty = localStorage.getItem('difficulty');
        return savedDifficulty ? savedDifficulty : '';
    });    const { socket } = useSocket()

    useEffect (()=> {
        if(isPlayerTurn){
            setStatusMessage("Your move!")
        } else {
            setStatusMessage("Robot's move! Keep our hand of the board, or it will get very angry");
        }
    },[isPlayerTurn])

    useEffect (()=> {
        try {
            socket?.emit('getDifficulty');
            socket?.on('getDifficulty', (difficulty) => {
                setDifficulty(capitalizeFirstLetter(difficulty))
            })
        } catch (error) {
            console.log(error)
        }
        localStorage.setItem('difficulty', difficulty);

    },[difficulty])


    const handleConfirmMove =  async () => {
        if (isValid) {
            // Logic to handle move confirmation
            setIsPlayerTurn(false);
            await new Promise(r => setTimeout(r, 3000));
            setIsPlayerTurn(true)

 
        }
    };

    return (
        <div id="header-container" className="gradientBackground">
            <Header />
            <div id="content-container">
                <div id="left-panel">
                    <div id="opponent-info">
                        <div className="avatar"></div>
                        <div className="opponent-details">
                            <h2>CHESS ROBOT</h2>
                            <p>{difficulty}</p>
                        </div>
                    </div>
                    <div id="chessboard-container">
                        <Chessboard setIsValid={setIsValid} pieceColor={pieceColor} />
                    </div>
                    <div id="player-info">
                        <div className="avatar"></div>
                        <div className="player-details">
                            <h2>YOU</h2>
                            <p>Mortal</p>
                        </div>
                    </div>
                </div>
                <div id="right-panel">
                    <div id="status-message">
                        <p>{statusMessage}</p>
                    </div>
                    <div id="buttons-container">
                        <button className="resign-button">RESIGN</button>
                        <button className="confirm-button" onClick={handleConfirmMove}>CONFIRM MOVE</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

    function capitalizeFirstLetter(str: string): string {
        if (str.length === 0) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

export default Game;