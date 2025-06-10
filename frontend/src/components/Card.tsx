import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
    card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
    return (
        <div className="card">
            <h4>{card.title}</h4>
            {card.description && <p>{card.description}</p>}
        </div>
    );
};

export default Card;