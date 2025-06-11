import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const usersFilePath = path.join(__dirname, '../../users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthController {
    private async readUsers(): Promise<User[]> {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    }

    private async writeUsers(users: User[]): Promise<void> {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    }

    public async signup(req: any, res: any) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }
        const users = await this.readUsers();
        if (users.find(u => u.username === username)) {
            return res.status(409).json({ error: 'Username already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: User = {
            id: Date.now().toString(),
            username,
            password: hashedPassword
        };
        users.push(newUser);
        await this.writeUsers(users);
        res.status(201).json({ message: 'User created successfully.' });
    }

    public async login(req: any, res: any) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }
        const users = await this.readUsers();
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    }
}
