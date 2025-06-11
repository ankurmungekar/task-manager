import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
    card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
    return (
        <div className="bg-white rounded shadow p-4 mb-3 border border-gray-200 hover:shadow-lg transition">
            <h4 className="font-semibold text-gray-800 mb-1">{card.title}</h4>
            {card.description && <p className="text-gray-600 text-sm">{card.description}</p>}
            {card.dueDate && (
                <p className="text-xs text-blue-700 mt-2">Due: {new Date(card.dueDate).toLocaleDateString()}</p>
            )}
        </div>
    );
};

export default Card;