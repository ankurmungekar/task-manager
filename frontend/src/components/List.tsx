import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import { List as ListType } from '../types';

interface ListProps {
  list: ListType;
  index: number;
  lists: ListType[];
  setLists: React.Dispatch<React.SetStateAction<ListType[]>>;
}

const AddCardModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: { title: string; description: string; dueDate: string }) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, dueDate });
    setTitle('');
    setDescription('');
    setDueDate('');
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 border border-blue-100 animate-fade-in">
        <h3 className="text-xl font-bold mb-5 text-blue-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add New Card
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-3 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full mb-3 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input
            className="w-full mb-5 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-1 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const List: React.FC<ListProps> = ({ list, index, lists, setLists }) => {
  const [showModal, setShowModal] = useState(false);

  // Only show + button on the first list
  const showAddCard = index === 0;

  const handleAddCard = async (card: { title: string; description: string; dueDate: string }) => {
    try {
      const response = await fetch(`/api/boards/1/lists/${list.id}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card),
      });
      if (!response.ok) throw new Error('Failed to add card');
      const newCard = await response.json();
      setLists(lists => lists.map(l => l.id === list.id ? { ...l, cards: [...l.cards, newCard] } : l));
    } catch (err) {
      alert('Error adding card.');
    }
  };

  return (
    <Droppable droppableId={list.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-white rounded-2xl shadow-lg p-6 w-80 mr-4 flex-shrink-0 border border-blue-100 hover:shadow-2xl transition-all duration-200"
        >
          <h3 className="text-lg font-bold mb-5 text-blue-700 tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            {list.title}
          </h3>
          {showAddCard && (
            <>
              <button
                className="mb-3 px-3 py-1 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center gap-1"
                onClick={() => setShowModal(true)}
              >
                <span className="text-lg">+</span> Add Card
              </button>
              <AddCardModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAddCard}
              />
            </>
          )}
          {list.cards.map((card, cardIndex) => (
            <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Card card={card} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default List;