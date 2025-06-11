import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

export function setAuthRoutes(app: Router) {
    app.post('/api/auth/signup', authController.signup.bind(authController));
    app.post('/api/auth/login', authController.login.bind(authController));
}
