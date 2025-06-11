import { promises as fs } from 'fs';
import path from 'path';

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
            res.json(boards);
        } catch (err) {
            res.status(500).json({ error: 'Failed to read boards data.' });
        }
    }

    public async createBoard(req: any, res: any) {
        try {
            const { title } = req.body;
            const boards = await this.readBoards();
            const nextId = boards.length > 0 ? Math.max(...boards.map((b: any) => b.id)) + 1 : 1;
            const newBoard = { id: nextId, title, lists: [] };
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
            const board = boards.find((b: any) => b.id.toString() === boardId);
            if (!board) {
                return res.status(404).json({ error: 'Board not found.' });
            }
            const newList = {
                id: Date.now().toString(),
                title,
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
            const board = boards.find((b: any) => b.id.toString() === boardId);
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
            const boards = await this.readBoards();
            const board = boards.find((b: any) => b.id.toString() === boardId);
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
}