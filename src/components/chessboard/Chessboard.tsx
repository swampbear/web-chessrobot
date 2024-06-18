import React, { useEffect, useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../tile/Tile';

const horizontal = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const vertical = [1, 2, 3, 4, 5, 6, 7, 8];

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
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const chessBoardRef = useRef<HTMLDivElement>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    
    let board = [];
    
    function grabPiece(e: React.MouseEvent){
        const chessBoard = chessBoardRef.current;
        const target = e.target as HTMLElement;
        if(target.classList.contains('chess-piece') && chessBoard){
            const gridX = Math.floor((e.clientX - chessBoard.offsetLeft) / 100);
            const gridY = Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100));
            setGridX(gridX);
            setGridY(gridY);

            const x = e.clientX - 50;
            const y = e.clientY - 50;
            target.style.position = 'absolute';
            target.style.left = `${x}px`;
            target.style.top = `${y}px`;
    
            setActivePiece(target);
        }
    }
    
    function movePiece(e: React.MouseEvent){
        const chessBoard = chessBoardRef.current;
        if(activePiece && chessBoard){
            const minX = chessBoard.offsetLeft - 25;
            const minY = chessBoard.offsetTop - 25;
            const maxX = chessBoard.offsetLeft + chessBoard.clientWidth - 75;
            const maxY = chessBoard.offsetTop + chessBoard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            
            if(x < minX){
                activePiece.style.left = `${minX}px`;
            } else if(x > maxX){
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if(y < minY){
                activePiece.style.top = `${minY}px`;
            } else if(y > maxY){
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }

    function dropPiece(e: React.MouseEvent){
        const chessBoard = chessBoardRef.current;

        if(activePiece && chessBoard){
            const x = Math.floor((e.clientX - chessBoard.offsetLeft) / 100);
            const y = Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100));
            console.log(x, y);
            setPieces((value) => {
            const pieces = value.map(p => {
                if(p.x === gridX && p.y === gridY){
                    p.x = x;
                    p.y = y;
                }
                return p;       
        });
        return pieces;
        });
        setActivePiece(null);
    }}


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
    console.log(fen);}


    // Create the board
    for (let i = vertical.length-1; i >= 0; i--) {
        for (let j = 0; j < horizontal.length; j++) {
            const number = i + j + 2;
            let image = undefined;
            
            pieces.forEach(p => {
                let pieceInPosition = p.x === j && p.y === i;
                if(pieceInPosition){
                    image = p.image;
                }
            });
            board.push(<Tile key={`${j}, ${i}`} image={image} number={number}/>
        );
    }
}

    // Render the board
    return (
        <div 
        onMouseUp={e=> dropPiece(e)} 
        onMouseMove={e => movePiece(e)} 
        onMouseDown={e => grabPiece(e)} 
        id="chessboard"
        ref={chessBoardRef}>   
            {board}

            <button onClick={() => setUpPositionFromFEN('1r3r2/2qn2k1/p2p2pp/2pPp3/2P1P3/1P3NPP/1B1Q1PK1/3R1R2')}>Set up position</button>
            <button onClick={() => getFENFromPosition()}>Get FEN</button>
        </div>   
    )
}