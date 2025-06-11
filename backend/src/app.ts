import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setBoardRoutes } from './routes/boardRoutes';
import { setListRoutes } from './routes/listRoutes';
import { setCardRoutes } from './routes/cardRoutes';
import { setAuthRoutes } from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

setBoardRoutes(app);
setListRoutes(app);
setCardRoutes(app);
setAuthRoutes(app);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: { origin: '*' }
});

// Track online users per board
const onlineUsers: { [boardId: string]: Set<string> } = {};

io.on('connection', (socket) => {
    socket.on('joinBoard', ({ boardId, userId }) => {
        socket.join(`board_${boardId}`);
        if (!onlineUsers[boardId]) onlineUsers[boardId] = new Set();
        onlineUsers[boardId].add(userId);
        io.to(`board_${boardId}`).emit('onlineUsers', Array.from(onlineUsers[boardId]));
    });
    socket.on('leaveBoard', ({ boardId, userId }) => {
        socket.leave(`board_${boardId}`);
        if (onlineUsers[boardId]) {
            onlineUsers[boardId].delete(userId);
            io.to(`board_${boardId}`).emit('onlineUsers', Array.from(onlineUsers[boardId]));
        }
    });
    socket.on('boardUpdate', ({ boardId, data }) => {
        // Broadcast board changes to all collaborators
        socket.to(`board_${boardId}`).emit('boardUpdate', data);
    });
    socket.on('editingStatus', ({ boardId, itemId, username, editing }) => {
        // Broadcast editing status to all users in the board
        io.to(`board_${boardId}`).emit('editingStatus', { itemId, username, editing });
    });
    socket.on('disconnecting', () => {
        // Remove user from all boards they were in
        Object.keys(socket.rooms).forEach(room => {
            if (room.startsWith('board_')) {
                const boardId = room.replace('board_', '');
                // We don't have userId here, so frontend should always call leaveBoard before disconnect
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});