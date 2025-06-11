import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Board from './components/Board';
import { Board as BoardType } from './types';
import Login from './components/Login';
import Signup from './components/Signup';
import { jwtDecode } from 'jwt-decode';

const App: React.FC = () => {
    const [boards, setBoards] = useState<BoardType[]>([]);
    const [lists, setLists] = useState<BoardType["lists"]>([]);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [showSignup, setShowSignup] = useState(false);
    const [username, setUsername] = useState<string | null>(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                return decoded.username;
            } catch {
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        if (!token) return;
        const fetchBoards = async () => {
            const response = await fetch('/api/boards', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setBoards(data);
            if (data.length > 0) setLists(data[0].lists);
        };
        fetchBoards();
    }, [token]);

    const handleLogin = (jwt: string) => {
        setToken(jwt);
        localStorage.setItem('token', jwt);
        try {
            const decoded: any = jwtDecode(jwt);
            setUsername(decoded.username);
            localStorage.setItem('username', decoded.username);
        } catch {
            setUsername(null);
        }
    };

    const handleLogout = () => {
        setToken(null);
        setUsername(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    };

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
            const token = localStorage.getItem('token');
            await fetch(`/api/boards/${boardId}/move-card`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    sourceListId: source.droppableId,
                    destListId: destination.droppableId,
                    sourceIndex: source.index,
                    destIndex: destination.index
                })
            });
            // Fetch updated board data
            const response = await fetch('/api/boards', {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            const data = await response.json();
            setBoards(data);
            if (data.length > 0) setLists(data[0].lists);
        }
    };

    if (!token) {
        return showSignup ? (
            <Signup onSignup={() => setShowSignup(false)} setShowSignup={setShowSignup} />
        ) : (
            <Login onLogin={handleLogin} setShowSignup={setShowSignup} />
        );
    }

    // Show create board screen if user has no boards
    if (boards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
                <div className="bg-white p-8 rounded shadow w-96 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-6 text-blue-700">No Boards Found</h2>
                    <p className="mb-6 text-gray-600 text-center">You don't have any boards or lists yet. Create your first board to get started!</p>
                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        onClick={async () => {
                            const title = prompt('Enter board title:');
                            if (title && title.trim()) {
                                const response = await fetch('/api/boards', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ title })
                                });
                                if (response.ok) {
                                    const newBoard = await response.json();
                                    setBoards([newBoard]);
                                    setLists([]);
                                } else {
                                    alert('Failed to create board');
                                }
                            }
                        }}
                    >Create Board</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end items-center p-4 gap-4">
                {username && (
                    <span className="text-blue-900 font-semibold text-lg">Hello, {username}</span>
                )}
                <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={handleLogout}>Logout</button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="App">
                    {boards.length > 0 && (
                        <Board board={boards[0]} lists={lists} setLists={setLists} />
                    )}
                </div>
            </DragDropContext>
        </>
    );
};

export default App;