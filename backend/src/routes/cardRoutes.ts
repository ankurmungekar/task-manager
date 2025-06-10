import { Router } from 'express';
import { CardController } from '../controllers/cardController';

export const setCardRoutes = (app: Router) => {
    const cardController = new CardController();

    app.get('/api/cards', cardController.getCards.bind(cardController));
    app.post('/api/cards', cardController.createCard.bind(cardController));
};