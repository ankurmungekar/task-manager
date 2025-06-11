import React from 'react';
import List from './List';
import { Board as BoardType } from '../types';

interface BoardProps {
  board: BoardType;
  lists: BoardType["lists"];
  setLists: React.Dispatch<React.SetStateAction<BoardType["lists"]>>;
}

const Board: React.FC<BoardProps> = ({ board, lists, setLists }) => {
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
        setLists(prev => [...prev, newList]);
      } catch (err) {
        alert('Error adding list.');
      }
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-blue-900 tracking-tight drop-shadow-sm flex items-center gap-2">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M4 11h16" /></svg>
          {board.title}
        </h2>
        <button
          className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
          onClick={handleAddList}
        >
          <span className="text-lg">+</span> Add Bucket
        </button>
        <div className="flex flex-row overflow-x-auto pb-4 gap-6">
          {lists.map((list, index) => (
            <List
              key={list.id}
              list={list}
              index={index}
              lists={lists}
              setLists={setLists}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;