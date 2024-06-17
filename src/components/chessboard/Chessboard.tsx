import React, { useRef } from 'react';
import './Chessboard.css';
import Tile from '../tile/Tile';
import { off } from 'process';

const horizontal = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const vertical = [1, 2, 3, 4, 5, 6, 7, 8];

interface Piece {
    image: string;
    x: number;
    y: number;
}

const pieces: Piece[] = [];


for(let p = 0; p<2; p++){
    const type = p === 0 ? 'd' : 'l';
    const y = p === 0 ? 7 : 0;
    
    pieces.push({image: `./assets/images/Chess_r${type}t60.png`, x: 0, y})
    pieces.push({image: `./assets/images/Chess_n${type}t60.png`, x: 1, y})
    pieces.push({image: `./assets/images/Chess_b${type}t60.png`, x: 2, y})
    pieces.push({image: `./assets/images/Chess_q${type}t60.png`, x: 3, y})
    pieces.push({image: `./assets/images/Chess_k${type}t60.png`, x: 4, y})
    pieces.push({image: `./assets/images/Chess_b${type}t60.png`, x: 5, y})
    pieces.push({image: `./assets/images/Chess_n${type}t60.png`, x: 6, y})
    pieces.push({image: `./assets/images/Chess_r${type}t60.png`, x: 7, y})
    
    for(let i =0 ; i<8 ; i++){
        pieces.push({image: `./assets/images/Chess_p${type}t60.png`, x: i, y: p === 0 ? 6 : 1})
    }
    
}


export default function Chessboard() {
    const chessBoardRef = useRef<HTMLDivElement>(null);
    
    let board = [];
    let activePiece: HTMLElement | null = null;
    
    function grabPiece(e: React.MouseEvent){
        const target = e.target as HTMLElement;
        if(target.classList.contains('chess-piece')){
            const x = e.clientX - 25;
            const y = e.clientY - 25;
            target.style.position = 'absolute';
            target.style.left = `${x}px`;
            target.style.top = `${y}px`;
    
            activePiece = target;
        }
    }
    
    function movePiece(e: React.MouseEvent){
        const chessBoard = chessBoardRef.current;
        if(activePiece && chessBoard){
            const minX = chessBoard.offsetLeft - 25;
            const minY = chessBoard.offsetTop - 25;
            const maxX = chessBoard.offsetLeft + chessBoard.clientWidth - 25;
            const maxY = chessBoard.offsetTop + chessBoard.clientHeight - 25;
            const x = e.clientX - 25;
            const y = e.clientY - 25;
            
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
        if(activePiece){
            activePiece = null;
        }
    
    }
    
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

    return (
  
        <div 
        onMouseUp={e=> dropPiece(e)} 
        onMouseMove={e => movePiece(e)} 
        onMouseDown={e => grabPiece(e)} 
        id="chessboard"
        ref={chessBoardRef}
        >


            {board}
        </div>)
}