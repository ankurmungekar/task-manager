import { Router } from 'express';
import { BoardController } from '../controllers/boardController';

const router = Router();
const boardController = new BoardController();

export function setBoardRoutes(app: Router) {
    app.get('/api/boards', boardController.getBoards.bind(boardController));
    app.post('/api/boards', boardController.createBoard.bind(boardController));
    app.post('/api/boards/:boardId/lists', boardController.addListToBoard.bind(boardController));
    app.post('/api/boards/:boardId/lists/:listId/cards', boardController.addCardToList.bind(boardController));
    app.patch('/api/boards/:boardId/move-card', boardController.moveCard.bind(boardController));
    app.delete('/api/boards/:boardId/lists/:listId/cards/:cardId', boardController.deleteCardFromList.bind(boardController));
    app.delete('/api/boards/:boardId/lists/:listId', boardController.deleteListFromBoard.bind(boardController));
}