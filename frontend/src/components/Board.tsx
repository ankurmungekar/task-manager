import React, { useState } from 'react';
import List from './List';
import { Board as BoardType } from '../types';

interface BoardProps {
  board: BoardType;
}

const Board: React.FC<BoardProps> = ({ board }) => {
  const [lists, setLists] = useState(board.lists);

  const handleAddList = async () => {
    const title = prompt('Enter list title:');
    if (title && title.trim()) {
      try {
        const response = await fetch(`/api/boards/${board.id}/lists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        });
        if (!response.ok) throw new Error('Failed to add list');
        const newList = await response.json();
        setLists([...lists, newList]);
      } catch (err) {
        alert('Error adding list.');
      }
    }
  };

  return (
    <div className="p-8 min-h-screen bg-blue-50">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">{board.title}</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleAddList}
      >
        + Add List
      </button>
      <div className="flex flex-row overflow-x-auto pb-4">
        {lists.map((list, index) => (
          <List key={list.id} list={list} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Board;