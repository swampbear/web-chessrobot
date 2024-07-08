import React, {useEffect, useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../tile/Tile';
import { useSocket } from '../../socket/SocketContext';


let horizontal = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
let vertical = [8,7,6,5,4,3,2,1];

interface Piece {
    image: string;
    x: number;
    y: number;
}

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




export default function Chessboard() {
    const[isPlayingWhite, setIsPlayingWhite] = useState(true)
    const[correctBoardFEN, setCorrectBoardFen] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR') //should be fed from chessapi through socket
    const[currentBoardFEN, setCurrentBoardFEN] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR') //should be fed from the board irl through socket
    const chessBoardRef = useRef<HTMLDivElement>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const {socket} = useSocket()

    let board = [];
    let frameHorizontal = null;
    let frameVertical = null;

    useEffect (()=> {
        async function fetchPieceColor() {
            socket?.emit('isWhite');
            socket?.on('isWhite', (isWhite) => {
                setIsPlayingWhite(isWhite);
                }) 
        }
        fetchPieceColor()
        drawCoordinateAxis();
        drawPieces();
        console.log('isPlayingWhite updated value:', isPlayingWhite);

    },[isPlayingWhite]);
    


    function setUpPositionFromFEN(FEN: string){
        const fen = FEN;
        const rows = fen.split('/');
        const pieces: Piece[] = [];
        
        for(let i = 0; i<rows.length; i++){
            const row = rows[i];
            let x = 0;
            for(let j = 0; j<row.length; j++){
                const char = row[j];
                if(isNaN(parseInt(char))){
                    let isLowerCase = char === char.toLowerCase();
                    if(isLowerCase){
                        pieces.push({image: `./assets/images/Chess_${char}dt60.png`, x, y: 7 - i})
                    }
                    else {
                        const lightChar = char.toLowerCase();
                        pieces.push({image: `./assets/images/Chess_${lightChar}lt60.png`, x, y: 7 - i})
                    }
                    x++;
                } else {
                    x += parseInt(char);
                }
            }
        }
        setPieces(pieces);
        setCurrentBoardFEN(FEN)
    }


    function getFENFromPosition(){
    let fen = '';
    for(let i = 7; i>=0; i--){
        let empty = 0;
        for(let j = 0; j<8; j++){
            let piece = '';
            pieces.forEach(p => {
                if(p.x === j && p.y === i){
                    const pieceType = p.image.split('_')[1].split('t')[0][0];
                    const pieceColor = p.image.split('_')[1].split('t')[0][1]
                    if(pieceColor === 'l'){
                        piece = pieceType.toUpperCase();
                    }else{
                        piece = pieceType;
                    }
                }
            });
            if(piece){
                if(empty){
                    fen += empty;
                    empty = 0;
                }
                fen += piece;
            } else {
                empty++;
            }
        }
        if(empty){
            fen += empty;
        }
        if(i > 0){
            fen += '/';
        }
    }
    console.log(fen);
}

    function drawCoordinateAxis(){
        frameHorizontal = [];
        frameVertical = [];

        if(isPlayingWhite){
            if(vertical[0]!== 8){
                vertical.reverse();
            }
            if(horizontal[0]!== 'a'){
                horizontal.reverse()
            }
        } else {
            if(vertical[0]!== 1){
                vertical.reverse();
            }
            if(horizontal[0]!== 'h'){
                horizontal.reverse()
            }
        }

        for(let i = 0; i < 8; i++){
            frameVertical.push(<span> {vertical[i]} </span>)
            frameHorizontal.push(<span>{horizontal[i]}</span>)
        } 
    }
    function drawPieces(){
        if(isPlayingWhite){
            setUpPositionFromFEN(currentBoardFEN)
        } else{
            let reverseFen = currentBoardFEN.split('').reverse().join('');
            setCorrectBoardFen(reverseFen);
            setUpPositionFromFEN(reverseFen)
        }
    }

    function reverseFENString(FEN: string){
        setIsPlayingWhite(!isPlayingWhite)
        var fenReverse = FEN.split('').reverse().join('');
        drawCoordinateAxis()
        setCorrectBoardFen(fenReverse);
        setUpPositionFromFEN(fenReverse);
        
    }
    

    // Create the board
    for (let i = vertical.length-1; i >= 0; i--) {
        for (let j = 0; j < horizontal.length; j++) {
            const number = i + j + 2;
            let image = undefined;
            drawCoordinateAxis()
            pieces.forEach(p => {
                let pieceInPosition = p.x === j && p.y === i;
                if(pieceInPosition){
                    image = p.image;
                }
            });
            board.push(<Tile key={`${j}, ${i}`} image={image} number={number}/>);
         
        
    }
}


    // Render the board
    return (
        <div id='container'>
            <div id="frame">
                <section id="vertical-numbers">
                    {frameVertical}
                </section>
                <div id="chessboard" ref={chessBoardRef}>   
                    {board}
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






    // function grabPiece(e: React.MouseEvent){
    //     const chessBoard = chessBoardRef.current;
    //     const target = e.target as HTMLElement;
    //     if(target.classList.contains('chess-piece') && chessBoard){
    //         const gridX = Math.floor((e.clientX - chessBoard.offsetLeft) / 100);
    //         const gridY = Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100));
    //         setGridX(gridX);
    //         setGridY(gridY);

    //         const x = e.clientX - 50;
    //         const y = e.clientY - 50;
    //         target.style.position = 'absolute';
    //         target.style.left = `${x}px`;
    //         target.style.top = `${y}px`;
    
    //         setActivePiece(target);
    //     }
    // }
    
    // function movePiece(e: React.MouseEvent){
    //     const chessBoard = chessBoardRef.current;
    //     if(activePiece && chessBoard){
    //         const minX = chessBoard.offsetLeft - 25;
    //         const minY = chessBoard.offsetTop - 25;
    //         const maxX = chessBoard.offsetLeft + chessBoard.clientWidth - 75;
    //         const maxY = chessBoard.offsetTop + chessBoard.clientHeight - 75;
    //         const x = e.clientX - 50;
    //         const y = e.clientY - 50;
            
    //         if(x < minX){
    //             activePiece.style.left = `${minX}px`;
    //         } else if(x > maxX){
    //             activePiece.style.left = `${maxX}px`;
    //         } else {
    //             activePiece.style.left = `${x}px`;
    //         }

    //         if(y < minY){
    //             activePiece.style.top = `${minY}px`;
    //         } else if(y > maxY){
    //             activePiece.style.top = `${maxY}px`;
    //         } else {
    //             activePiece.style.top = `${y}px`;
    //         }
    //     }
    // }

    // function dropPiece(e: React.MouseEvent){
    //     const chessBoard = chessBoardRef.current;

    //     if(activePiece && chessBoard){
    //         const x = Math.floor((e.clientX - chessBoard.offsetLeft) / 100);
    //         const y = Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100));
    //         console.log(x, y);
    //         setPieces((value) => {
    //         const pieces = value.map(p => {
    //             if(p.x === gridX && p.y === gridY){
    //                 p.x = x;
    //                 p.y = y;
    //             }
    //             return p;       
    //     });
    //     return pieces;
    //     });
    //     setActivePiece(null);
    // }}


    // onMouseUp={e=> dropPiece(e)} 
        // onMouseMove={e => movePiece(e)} 
        // onMouseDown={e => grabPiece(e)} 

       // const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    // const [gridX, setGridX] = useState(0);
    // const [gridY, setGridY] = useState(0);