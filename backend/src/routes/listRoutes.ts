import { Router } from 'express';
import { ListController } from '../controllers/listController';

const router = Router();
const listController = new ListController();

export const setListRoutes = (app: Router) => {
    app.get('/lists', listController.getLists.bind(listController));
    app.post('/lists', listController.createList.bind(listController));
};