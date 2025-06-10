export class ListController {
    private lists: { id: string; title: string; cards: any[] }[] = [];

    public getLists(req: any, res: any) {
        res.json(this.lists);
    }

    public createList(req: any, res: any) {
        const { title } = req.body;
        const newList = { id: Date.now().toString(), title, cards: [] };
        this.lists.push(newList);
        res.status(201).json(newList);
    }
}