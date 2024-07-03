import React, { useState } from 'react';
import './Selection.css';
import Header from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { useSocket } from '../../socket/SocketContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';


const Selection: React.FC = () => {
    const navigate = useNavigate()
    const { socket } = useSocket();
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

    const handleDifficultySelect = (difficulty: string) => {
        setSelectedDifficulty(difficulty);
    };

    const handlePieceSelect = (piece: string) => {
        setSelectedPiece(piece);
    };

    const handleNextPage = async () => {
        if (socket?.connected && selectedDifficulty && selectedPiece){
            socket.emit('json', {Conditions: {difficulty: selectedDifficulty, pieceColor: selectedPiece}})
            await new Promise(r => setTimeout(r, 500));
            navigate('/boardconfig');
        } else if(!socket?.connected){
            toast.error('You have diconnected from the robot, hae you tried turning it off and on again');
        } 
        else {
            toast.info("Please select both difficulty and pieces");
        }
    };

    return (
        <div id="selection" className="gradientBackground">
            <Header />
            <ToastContainer/>
            <div className="container">
                <section id="difficulty-container">
                    <h2 className="title">Choose Difficulty</h2>
                    <button
                        className={`difficulty-button ${selectedDifficulty === 'easy' ? 'easy selected' : ''}`}
                        onClick={() => handleDifficultySelect('easy')}
                    >
                        EASY
                    </button>
                    <button
                        className={`difficulty-button ${selectedDifficulty === 'medium' ? 'medium selected' : ''}`}
                        onClick={() => handleDifficultySelect('medium')}
                    >
                        MEDIUM
                    </button>
                    <button
                        className={`difficulty-button ${selectedDifficulty === 'hard' ? 'hard selected' : ''}`}
                        onClick={() => handleDifficultySelect('hard')}
                    >
                        HARD
                    </button>
                </section>
                <section id="pieces-container">
                    <h2 className="title">Choose Your Pieces</h2>
                    <button
                        className={`pieces-button ${selectedPiece === 'white' ? 'white selected' : ''}`}
                        onClick={() => handlePieceSelect('white')}
                    >
                        WHITE
                    </button>
                    <button
                        className={`pieces-button ${selectedPiece === 'black' ? 'black selected' : ''}`}
                        onClick={() => handlePieceSelect('black')}
                    >
                        BLACK
                    </button>
                </section>
                <section id="beforegame-container">
                    <h2 className="title">Before Starting The Game</h2>
                    <ul className="instructions-list">
                        <li>Make sure all the pieces are in their correct position</li>
                        <li>You will be able to see if it is your turn or the robot's turn on the screen</li>
                        <li>Be aware when it is the robot's turn to move, it is quite strong</li>
                    </ul>
                </section>
                <button className="next-button" onClick={handleNextPage}>NEXT</button>
            </div>
            <Footer />
        </div>
    );
}

export default Selection;