import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Board from './components/Board';
import { Board as BoardType } from './types';

const App: React.FC = () => {
    const [boards, setBoards] = useState<BoardType[]>([]);
    const [lists, setLists] = useState<BoardType["lists"]>([]);

    useEffect(() => {
        const fetchBoards = async () => {
            const response = await fetch('/api/boards');
            const data = await response.json();
            setBoards(data);
            if (data.length > 0) setLists(data[0].lists);
        };

        fetchBoards();
    }, []);

    const onDragEnd = async (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Update UI immediately
        setLists(prevLists => {
            const listsCopy = [...prevLists];
            const sourceListIdx = listsCopy.findIndex(l => l.id === source.droppableId);
            const destListIdx = listsCopy.findIndex(l => l.id === destination.droppableId);
            if (sourceListIdx === -1 || destListIdx === -1) return prevLists;
            const sourceCards = Array.from(listsCopy[sourceListIdx].cards);
            const [movedCard] = sourceCards.splice(source.index, 1);
            if (!movedCard) return prevLists;
            if (sourceListIdx === destListIdx) {
                sourceCards.splice(destination.index, 0, movedCard);
                listsCopy[sourceListIdx] = { ...listsCopy[sourceListIdx], cards: sourceCards };
            } else {
                const destCards = Array.from(listsCopy[destListIdx].cards);
                destCards.splice(destination.index, 0, movedCard);
                listsCopy[sourceListIdx] = { ...listsCopy[sourceListIdx], cards: sourceCards };
                listsCopy[destListIdx] = { ...listsCopy[destListIdx], cards: destCards };
            }
            return listsCopy;
        });

        // Persist to backend
        const boardId = boards[0]?.id;
        if (boardId) {
            await fetch(`/api/boards/${boardId}/move-card`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceListId: source.droppableId,
                    destListId: destination.droppableId,
                    sourceIndex: source.index,
                    destIndex: destination.index
                })
            });
            // Fetch updated board data
            const response = await fetch('/api/boards');
            const data = await response.json();
            setBoards(data);
            if (data.length > 0) setLists(data[0].lists);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="App">
                {boards.length > 0 && (
                    <Board board={boards[0]} lists={lists} setLists={setLists} />
                )}
            </div>
        </DragDropContext>
    );
};

export default App;