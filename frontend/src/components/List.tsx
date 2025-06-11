import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import { List as ListType } from '../types';

interface ListProps {
  list: ListType;
  index: number;
}

const List: React.FC<ListProps> = ({ list, index }) => {
  return (
    <Droppable droppableId={list.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-gray-100 rounded-lg shadow-md p-4 w-72 mr-4 flex-shrink-0"
        >
          <h3 className="text-lg font-bold mb-4 text-gray-700">{list.title}</h3>
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