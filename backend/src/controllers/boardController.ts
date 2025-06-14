import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

export class BoardController {
    private boardsFilePath = path.join(__dirname, '../../boards.json');

    private async readBoards() {
        const data = await fs.readFile(this.boardsFilePath, 'utf-8');
        return JSON.parse(data);
    }

    private async writeBoards(boards: any[]) {
        await fs.writeFile(this.boardsFilePath, JSON.stringify(boards, null, 2), 'utf-8');
    }

    public async getBoards(req: any, res: any) {
        try {
            const boards = await this.readBoards();
            const userId = req.user?.id;
            // Return boards where user is owner or collaborator
            const userBoards = boards.filter((b: any) => b.userId === userId || (b.collaborators && b.collaborators.includes(userId)));
            res.json(userBoards);
        } catch (err) {
            res.status(500).json({ error: 'Failed to read boards data.' });
        }
    }

    public async createBoard(req: any, res: any) {
        try {
            const { title } = req.body;
            const boards = await this.readBoards();
            const nextId = boards.length > 0 ? Math.max(...boards.map((b: any) => b.id)) + 1 : 1;
            const userId = req.user?.id;
            const newBoard = { id: nextId, title, userId, collaborators: [], lists: [] };
            boards.push(newBoard);
            await this.writeBoards(boards);
            res.status(201).json(newBoard);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create board.' });
        }
    }

    public async addListToBoard(req: any, res: any) {
        try {
            const boardId = req.params.boardId;
            const { title } = req.body;
            if (!title) {
                return res.status(400).json({ error: 'List title is required.' });
            }
            const boards = await this.readBoards();
            const userId = req.user?.id;
            const board = boards.find((b: any) => b.id.toString() === boardId && (b.userId === userId || (b.collaborators && b.collaborators.includes(userId))));
            if (!board) {
                return res.status(404).json({ error: 'Board not found.' });
            }
            const newList = {
                id: Date.now().toString(),
                title,
                userId,
                cards: [],
            };
            board.lists.push(newList);
            await this.writeBoards(boards);
            res.status(201).json(newList);
        } catch (err) {
            res.status(500).json({ error: 'Failed to add list to board.' });
        }
    }

    public async addCardToList(req: any, res: any) {
        try {
            const boardId = req.params.boardId;
            const listId = req.params.listId;
            const { title, description, dueDate } = req.body;
            if (!title) {
                return res.status(400).json({ error: 'Card title is required.' });
            }
            const boards = await this.readBoards();
            const userId = req.user?.id;
            const board = boards.find((b: any) => b.id.toString() === boardId && (b.userId === userId || (b.collaborators && b.collaborators.includes(userId))));
            if (!board) {
                return res.status(404).json({ error: 'Board not found.' });
            }
            const list = board.lists.find((l: any) => l.id === listId);
            if (!list) {
                return res.status(404).json({ error: 'List not found.' });
            }
            const newCard = {
                id: Date.now().toString(),
                title,
                description: description || '',
                dueDate: dueDate || '',
                userId,
            };
            list.cards.push(newCard);
            await this.writeBoards(boards);
            res.status(201).json(newCard);
        } catch (err) {
            res.status(500).json({ error: 'Failed to add card to list.' });
        }
    }

    public async moveCard(req: any, res: any) {
        try {
            const { boardId } = req.params;
            const { sourceListId, destListId, sourceIndex, destIndex } = req.body;
            const userId = req.user?.id;
            const boards = await this.readBoards();
            const board = boards.find((b: any) => b.id.toString() === boardId && (b.userId === userId || (b.collaborators && b.collaborators.includes(userId))));
            if (!board) return res.status(404).json({ error: 'Board not found.' });
            const sourceList = board.lists.find((l: any) => l.id === sourceListId);
            const destList = board.lists.find((l: any) => l.id === destListId);
            if (!sourceList || !destList) return res.status(404).json({ error: 'List not found.' });
            if (sourceIndex < 0 || sourceIndex >= sourceList.cards.length) return res.status(400).json({ error: 'Invalid source index.' });
            const [movedCard] = sourceList.cards.splice(sourceIndex, 1);
            if (!movedCard) return res.status(400).json({ error: 'Card not found at source index.' });
            destList.cards.splice(destIndex, 0, movedCard);
            await this.writeBoards(boards);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ error: 'Failed to move card.' });
        }
    }

    public async deleteCardFromList(req: any, res: any) {
        try {
            const { boardId, listId, cardId } = req.params;
            const userId = req.user?.id;
            const boards = await this.readBoards();
            const board = boards.find((b: any) => b.id.toString() === boardId && (b.userId === userId || (b.collaborators && b.collaborators.includes(userId))));
            if (!board) return res.status(404).json({ error: 'Board not found.' });
            const list = board.lists.find((l: any) => l.id === listId);
            if (!list) return res.status(404).json({ error: 'List not found.' });
            const cardIndex = list.cards.findIndex((c: any) => c.id === cardId);
            if (cardIndex === -1) return res.status(404).json({ error: 'Card not found.' });
            list.cards.splice(cardIndex, 1);
            await this.writeBoards(boards);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete card.' });
        }
    }

    public async deleteListFromBoard(req: any, res: any) {
        try {
            const { boardId, listId } = req.params;
            const userId = req.user?.id;
            const boards = await this.readBoards();
            const board = boards.find((b: any) => b.id.toString() === boardId && (b.userId === userId || (b.collaborators && b.collaborators.includes(userId))));
            if (!board) return res.status(404).json({ error: 'Board not found.' });
            const listIndex = board.lists.findIndex((l: any) => l.id === listId);
            if (listIndex === -1) return res.status(404).json({ error: 'List not found.' });
            board.lists.splice(listIndex, 1);
            await this.writeBoards(boards);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete list.' });
        }
    }

    // Add a collaborator to a board
    public async addCollaborator(req: any, res: any) {
        try {
            const { boardId } = req.params;
            const { collaboratorId } = req.body;
            const userId = req.user?.id;
            const boards = await this.readBoards();
            const board = boards.find((b: any) => b.id.toString() === boardId && b.userId === userId);
            if (!board) return res.status(404).json({ error: 'Board not found or not owned by you.' });
            if (!collaboratorId) return res.status(400).json({ error: 'collaboratorId is required.' });
            if (board.collaborators.includes(collaboratorId)) return res.status(409).json({ error: 'User is already a collaborator.' });
            board.collaborators.push(collaboratorId);
            await this.writeBoards(boards);
            res.status(200).json({ success: true, collaborators: board.collaborators });
        } catch (err) {
            res.status(500).json({ error: 'Failed to add collaborator.' });
        }
    }

    // Remove a collaborator from a board
    public async removeCollaborator(req: any, res: any) {
        try {
            const { boardId } = req.params;
            const { collaboratorId } = req.body;
            const userId = req.user?.id;
            const boards = await this.readBoards();
            const board = boards.find((b: any) => b.id.toString() === boardId && b.userId === userId);
            if (!board) return res.status(404).json({ error: 'Board not found or not owned by you.' });
            if (!collaboratorId) return res.status(400).json({ error: 'collaboratorId is required.' });
            board.collaborators = board.collaborators.filter((id: string) => id !== collaboratorId);
            await this.writeBoards(boards);
            res.status(200).json({ success: true, collaborators: board.collaborators });
        } catch (err) {
            res.status(500).json({ error: 'Failed to remove collaborator.' });
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateJWT(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
            if (err) return res.status(403).json({ error: 'Invalid token' });
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ error: 'No token provided' });
    }
}

export { authenticateJWT };