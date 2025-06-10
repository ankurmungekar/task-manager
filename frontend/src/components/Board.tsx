import React from 'react';
import List from './List';
import { Board as BoardType } from '../types';

interface BoardProps {
  board: BoardType;
}

const Board: React.FC<BoardProps> = ({ board }) => {
  return (
    <div className="board">
      <h2>{board.title}</h2>
      <div className="lists">
        {board.lists.map((list, index) => (
          <List key={list.id} list={list} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Board;