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
          className="list"
        >
          <h3>{list.title}</h3>
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