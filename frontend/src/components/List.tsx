import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import { List as ListType } from '../types';

interface ListProps {
  list: ListType;
  index: number;
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h3 className="text-lg font-bold mb-4">Add New Card</h3>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full mb-2 p-2 border rounded"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input
            className="w-full mb-4 p-2 border rounded"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const List: React.FC<ListProps> = ({ list, index }) => {
  const [cards, setCards] = useState(list.cards);
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
      setCards([...cards, newCard]);
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
          className="bg-gray-100 rounded-lg shadow-md p-4 w-72 mr-4 flex-shrink-0"
        >
          <h3 className="text-lg font-bold mb-4 text-gray-700">{list.title}</h3>
          {showAddCard && (
            <>
              <button
                className="mb-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setShowModal(true)}
              >
                + Add Card
              </button>
              <AddCardModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAddCard}
              />
            </>
          )}
          {cards.map((card, cardIndex) => (
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