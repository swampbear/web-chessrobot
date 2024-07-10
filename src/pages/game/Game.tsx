import React, { useEffect, useState } from "react";
import Header from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { usePieceColor } from "../../contextproviders/pieceColor/PieceColorContext";
import Chessboard from "../../components/chessboard/Chessboard";
import './Game.css';
import { useSocket } from "../../contextproviders/socket/SocketContext";
import ErrorBoundary from "../../ErrorBoundary";

const Game = () => {
    const { pieceColor, setPieceColor } = usePieceColor();
    const [isValid, setIsValid] = useState(false);
    const [isPlayerTurn, setIsPlayerTurn] = useState(pieceColor === 'white');
    const [statusMessage, setStatusMessage] = useState("");
    const [difficulty, setDifficulty] = useState(() => {
        const savedDifficulty = localStorage.getItem('difficulty');
        return savedDifficulty ? savedDifficulty : '';
    });
    const [loading, setLoading] = useState(true); // Add loading state
    const { socket } = useSocket();

    useEffect(() => {
        const savedPieceColor = localStorage.getItem('pieceColor');
        if (savedPieceColor) {
            setPieceColor(savedPieceColor);
            setIsPlayerTurn(savedPieceColor === 'white');
        }
        setLoading(false);
    }, [setPieceColor]);

    useEffect(() => {
        if (isPlayerTurn) {
            setStatusMessage("Your move!");
        } else {
            setStatusMessage("Robot's move! Keep your hand off the board, or it will get very angry.");
        }
    }, [isPlayerTurn]);

    useEffect(() => {
        try {
            socket?.emit('getDifficulty');
            socket?.on('getDifficulty', (difficulty) => {
                const capitalizedDifficulty = capitalizeFirstLetter(difficulty);
                setDifficulty(capitalizedDifficulty);
                localStorage.setItem('difficulty', capitalizedDifficulty);
            });
        } catch (error) {
            console.log(error);
        }
    }, [socket]);

    useEffect(() => {
        if (pieceColor) {
            localStorage.setItem('pieceColor', pieceColor);
        }
    }, [pieceColor]);

    const handleConfirmMove = async () => {
        if (isValid) {
            setIsPlayerTurn(false);
            await new Promise(r => setTimeout(r, 3000));
            setIsPlayerTurn(true);
        }
    };

    if (loading) {
        return (
            <div id="header-container" className="gradientBackground">
                <Header />
                <div id="content-container">
                    <p>Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div id="header-container" className="gradientBackground">
            <Header />
            <div id="content-container">
                <div id="left-panel">
                    <div id="opponent-info">
                        <div id="opponent-avatar" className="avatar">
                            <img src="./assets/images/robotics_logo.jpg" alt="Opponent Avatar" />
                        </div>
                        <div className="opponent-details">
                            <h2>CHESS ROBOT</h2>
                            <p>{difficulty} difficulty</p>
                        </div>
                    </div>
                    <div id="chessboard-container">
                    <ErrorBoundary fallback="Error loading the chessboard">
                        <Chessboard setIsValid={setIsValid} />
                    </ErrorBoundary>

                    </div>
                    <div id="player-info">
                        <div id="player-avatar" className="avatar"></div>
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
};

export default Game;