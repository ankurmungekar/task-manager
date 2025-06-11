import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
    card: CardType;
    onDelete: (cardId: string) => void;
}

const Card: React.FC<CardProps> = ({ card, onDelete }) => {
    return (
        <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow p-5 mb-4 border border-blue-100 hover:shadow-xl transition-all duration-200 relative">
            <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold z-10"
                title="Delete card"
                onClick={() => onDelete(card.id)}
            >
                ×
            </button>
            <h4 className="font-semibold text-blue-900 mb-1 text-base flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" /></svg>
              {card.title}
            </h4>
            {card.description && <p className="text-gray-600 text-sm mb-1">{card.description}</p>}
            {card.dueDate && (
                <p className="text-xs text-blue-700 mt-2 font-medium">Due: {new Date(card.dueDate).toLocaleDateString()}</p>
            )}
        </div>
    );
};

export default Card;