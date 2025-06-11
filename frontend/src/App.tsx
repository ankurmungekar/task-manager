import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Board from './components/Board';
import { Board as BoardType } from './types';

const App: React.FC = () => {
    const [boards, setBoards] = useState<BoardType[]>([]);

    useEffect(() => {
        const fetchBoards = async () => {
            const response = await fetch('/api/boards');
            const data = await response.json();
            setBoards(data);
        };

        fetchBoards();
    }, []);

    const onDragEnd = (result: DropResult) => {
        // Placeholder: implement drag-and-drop logic here
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="App">
                {boards.map(board => (
                    <Board key={board.id} board={board} />
                ))}
            </div>
        </DragDropContext>
    );
};

export default App;