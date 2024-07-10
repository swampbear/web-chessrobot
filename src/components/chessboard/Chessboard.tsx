import React, {useEffect, useRef, useState } from 'react';
import './Chessboard.css';
import { useSocket } from '../../socket/SocketContext';
import { drawPieces, drawCoordinateAxis, getFENFromPosition, createBoard} from './utils';
import { Piece } from './Piece'

let horizontal = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
let vertical = [8,7,6,5,4,3,2,1];



type ChessboardProps = {
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
    pieceColor: string;
};

const initialBoardState: Piece[] = [];


for(let p = 0; p<2; p++){
    const type = p === 0 ? 'd' : 'l';
    const y = p === 0 ? 7 : 0;

    
    initialBoardState.push({image: `./assets/images/Chess_r${type}t60.png`, x: 0, y})
    initialBoardState.push({image: `./assets/images/Chess_n${type}t60.png`, x: 1, y})
    initialBoardState.push({image: `./assets/images/Chess_b${type}t60.png`, x: 2, y})
    initialBoardState.push({image: `./assets/images/Chess_q${type}t60.png`, x: 3, y})
    initialBoardState.push({image: `./assets/images/Chess_k${type}t60.png`, x: 4, y})
    initialBoardState.push({image: `./assets/images/Chess_b${type}t60.png`, x: 5, y})
    initialBoardState.push({image: `./assets/images/Chess_n${type}t60.png`, x: 6, y})
    initialBoardState.push({image: `./assets/images/Chess_r${type}t60.png`, x: 7, y})
    
    for(let i =0 ; i<8 ; i++){
        initialBoardState.push({image: `./assets/images/Chess_p${type}t60.png`, x: i, y: p === 0 ? 6 : 1})
    }
} 

const Chessboard = ({ setIsValid, pieceColor }: ChessboardProps) => {
    const[isPlayingWhite, setIsPlayingWhite] = useState(pieceColor === 'white')
    const[correctBoardFEN, setCorrectBoardFen] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR') //should be fed from chessapi through socket
    const[currentBoardFEN, setCurrentBoardFEN] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR') //should be fed from the board irl through socket
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const [frameHorizontal, setFrameHorizontal] = useState<JSX.Element[]>([]);
    const [frameVertical, setFrameVertical] = useState<JSX.Element[]>([]);
    const {socket} = useSocket()

    // Example of pgn format game
    // because the frontend does not contain any chesslogc, only the ability to visualize
    // i imagine needing a bit more information. like e2 -> e4. 
    //let moves = "1. €4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. 0-0 d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 (17. g3 ( Qh3 18. Neg5 Qf5 19. Nd4 Bxd4 20. cxd4) Qxf3) (17. Nfd2 18. Neg5 Qf5) 17. Nf6+ gx16 18. ext6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Ki8 24. Bxe7#"

    useEffect (()=> {
        try {
            setIsPlayingWhite(pieceColor === 'white');
        } catch (error) {
            console.error('Error setting isPlayingWhite', error)
        }
        drawCoordinateAxis(isPlayingWhite, vertical, horizontal, setFrameHorizontal, setFrameVertical);
        drawPieces(isPlayingWhite, currentBoardFEN, setPieces, setCurrentBoardFEN);
    },[isPlayingWhite]);

    useEffect (()=> {
        setIsValid(correctBoardFEN === currentBoardFEN);
    },[])


    // Render the board
    return (
        <div id='container'>
            <div id="frame">
                <section id="vertical-numbers">
                    {frameVertical}
                </section>
                <div id="chessboard">   
                    {createBoard(pieces, vertical, horizontal)}
                </div>   
                <section id="horizontal-letters">
                    {frameHorizontal}
                </section>
            </div>
                 {/* <button onClick={() => setUpPositionFromFEN('1r3r2/2qn2k1/p2p2pp/2pPp3/2P1P3/1P3NPP/1B1Q1PK1/3R1R2')}>Set up position</button>
                <button onClick={() => reverseFENString(currentBoardFEN)}>Reverse FEN</button>
                <button onClick={() => setUpPositionFromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR')}>Reset</button>
                <button onClick={() => getFENFromPosition()}>Get FEN</button> */}
         </div>
    )
}

export default Chessboard;