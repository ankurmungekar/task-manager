import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { promises as fs } from 'fs';
import path from 'path';

const router = Router();
const authController = new AuthController();

export function setAuthRoutes(app: Router) {
    app.post('/api/auth/signup', authController.signup.bind(authController));
    app.post('/api/auth/login', authController.login.bind(authController));
    // List all users (id and username only)
    app.get('/api/users', async (req, res) => {
        const usersFilePath = path.join(__dirname, '../../users.json');
        const data = await fs.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(data);
        res.json(users.map((u: any) => ({ id: u.id, username: u.username })));
    });
}
