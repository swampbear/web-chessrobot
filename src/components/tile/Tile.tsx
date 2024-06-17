import React from 'react';
import './Tile.css';
interface Props {
    image?: string;
    number: number;
}
export default function Tile({number, image}: Props) {
    let isEven = number % 2 === 0;
    return (
    <div className={`tile ${isEven ? 'white-tile' : 'black-tile'}`}>
        {image && <div style={{backgroundImage: `url(${image})`}} className='chess-piece'> </div>}
    </div>)

}