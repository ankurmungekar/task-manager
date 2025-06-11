import React from 'react';
import List from './List';
import { Board as BoardType } from '../types';

interface BoardProps {
  board: BoardType;
}

const Board: React.FC<BoardProps> = ({ board }) => {
  return (
    <div className="p-8 min-h-screen bg-blue-50">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">{board.title}</h2>
      <div className="flex flex-row overflow-x-auto pb-4">
        {board.lists.map((list, index) => (
          <List key={list.id} list={list} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Board;