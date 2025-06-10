import { Router } from 'express';
import { BoardController } from '../controllers/boardController';

const router = Router();
const boardController = new BoardController();

export function setBoardRoutes(app: Router) {
    app.get('/api/boards', boardController.getBoards.bind(boardController));
    app.post('/api/boards', boardController.createBoard.bind(boardController));
}