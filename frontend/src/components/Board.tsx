import React, { useState, useEffect } from 'react';
import List from './List';
import { Board as BoardType } from '../types';
import { Socket } from 'socket.io-client';

interface BoardProps {
  board: BoardType;
  lists: BoardType["lists"];
  setLists: React.Dispatch<React.SetStateAction<BoardType["lists"]>>;
  socket?: Socket;
  username?: string;
}

const Board: React.FC<BoardProps> = ({ board, lists, setLists, socket, username }) => {
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [allUsers, setAllUsers] = useState<{id: string, username: string}[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [collaboratorUsers, setCollaboratorUsers] = useState<{id: string, username: string}[]>([]);
  const [ownerUser, setOwnerUser] = useState<{id: string, username: string} | null>(null);

  useEffect(() => {
    if (showCollaboratorModal) {
      // Fetch users from backend API
      fetch('/api/users')
        .then(res => res.json())
        .then(data => setAllUsers(data.map((u: any) => ({ id: u.id, username: u.username }))));
    }
  }, [showCollaboratorModal]);

  useEffect(() => {
    // Fetch all users and set owner and collaborators
    fetch('/api/users')
      .then(res => res.json())
      .then((users: {id: string, username: string}[]) => {
        // Set owner
        const owner = users.find(u => u.id === board.userId);
        setOwnerUser(owner || null);
        // Set collaborators
        if (board.collaborators && board.collaborators.length > 0) {
          setCollaboratorUsers(users.filter(u => (board.collaborators||[]).includes(u.id)));
        } else {
          setCollaboratorUsers([]);
        }
      });
  }, [board.userId, board.collaborators]);

  const handleAddList = async () => {
    const title = prompt('Enter list title:');
    if (title && title.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/boards/${board.id}/lists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
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

  const handleDeleteList = async (listId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/boards/${board.id}/lists/${listId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) throw new Error('Failed to delete list');
      setLists(prev => prev.filter(l => l.id !== listId));
    } catch (err) {
      alert('Error deleting list.');
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white font-sans">
      <div className="max-w-7xl mx-auto flex flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight drop-shadow-sm flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M4 11h16" /></svg>
              {board.title}
            </h2>
            <div className="flex items-center gap-4">
              {ownerUser && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Owner: {ownerUser.username}</span>
              )}
              {collaboratorUsers.length > 0 && (
                <span className="flex items-center gap-2">
                  <span className="font-medium text-blue-700">Collaborators:</span>
                  {collaboratorUsers.map(u => (
                    <span key={u.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{u.username}</span>
                  ))}
                </span>
              )}
            </div>
          </div>
          <button
            className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
            onClick={handleAddList}
          >
            <span className="text-lg">+</span> Add Bucket
          </button>
          {/* Collaborators section */}
          <div className="mb-6 flex items-center gap-4">
            <button
              className="px-4 py-1 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
              onClick={() => setShowCollaboratorModal(true)}
            >
              + Add Collaborator
            </button>
          </div>
          {/* Collaborator Modal */}
          {showCollaboratorModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-md shadow p-6 w-96 border border-blue-100">
                <h3 className="text-xl font-bold mb-4 text-blue-800">Add Collaborator</h3>
                <select
                  className="w-full mb-4 p-2 border border-blue-200 rounded"
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                >
                  <option value="">Select a user</option>
                  {allUsers.filter(u => u.username !== username && !(board.collaborators||[]).includes(u.id)).map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-1 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => setShowCollaboratorModal(false)}>Cancel</button>
                  <button
                    className="px-4 py-1 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
                    disabled={!selectedUserId}
                    onClick={async () => {
                      if (!selectedUserId) return;
                      try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`/api/boards/${board.id}/collaborators`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {})
                          },
                          body: JSON.stringify({ collaboratorId: selectedUserId })
                        });
                        if (!response.ok) {
                          const data = await response.json();
                          alert(data.error || 'Failed to add collaborator');
                          return;
                        }
                        alert('Collaborator added!');
                        setShowCollaboratorModal(false);
                        setSelectedUserId('');
                        // Optionally, refresh board data here
                      } catch (err) {
                        alert('Error adding collaborator.');
                      }
                    }}
                  >Add</button>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-row overflow-x-auto pb-4 gap-6">
            {lists.map((list, index) => (
              <List
                key={list.id}
                list={list}
                index={index}
                lists={lists}
                setLists={setLists}
                onDeleteList={handleDeleteList}
                boardId={board.id}
                socket={socket}
                username={username}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;