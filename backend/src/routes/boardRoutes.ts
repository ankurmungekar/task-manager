import { Router } from 'express';
import { BoardController, authenticateJWT } from '../controllers/boardController';

const router = Router();
const boardController = new BoardController();

export function setBoardRoutes(app: Router) {
    app.get('/api/boards', authenticateJWT, boardController.getBoards.bind(boardController));
    app.post('/api/boards', authenticateJWT, boardController.createBoard.bind(boardController));
    app.post('/api/boards/:boardId/lists', authenticateJWT, boardController.addListToBoard.bind(boardController));
    app.post('/api/boards/:boardId/lists/:listId/cards', authenticateJWT, boardController.addCardToList.bind(boardController));
    app.patch('/api/boards/:boardId/move-card', authenticateJWT, boardController.moveCard.bind(boardController));
    app.delete('/api/boards/:boardId/lists/:listId/cards/:cardId', authenticateJWT, boardController.deleteCardFromList.bind(boardController));
    app.delete('/api/boards/:boardId/lists/:listId', authenticateJWT, boardController.deleteListFromBoard.bind(boardController));
}