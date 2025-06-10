export class BoardController {
    private boards: { id: number; title: string; lists: any[] }[] = [
        {
            id: 1,
            title: 'Sample Board',
            lists: [
                {
                    id: 'list-1',
                    title: 'To Do',
                    cards: [
                        { id: 'card-1', title: 'First Task', description: 'This is your first task.' },
                        { id: 'card-2', title: 'Second Task', description: 'This is your second task.' }
                    ]
                },
                {
                    id: 'list-2',
                    title: 'In Progress',
                    cards: [
                        { id: 'card-3', title: 'Third Task', description: 'This task is in progress.' }
                    ]
                }
            ]
        }
    ];
    private nextId: number = 2;

    public getBoards(req: any, res: any) {
        res.json(this.boards);
    }

    public createBoard(req: any, res: any) {
        const { title } = req.body;
        const newBoard = { id: this.nextId++, title, lists: [] };
        this.boards.push(newBoard);
        res.status(201).json(newBoard);
    }
}