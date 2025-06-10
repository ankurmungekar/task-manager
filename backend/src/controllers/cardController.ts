export class CardController {
    private cards: { id: string; title: string; description: string }[] = [
        { id: '1', title: 'Sample Card 1', description: 'This is the first sample card.' },
        { id: '2', title: 'Sample Card 2', description: 'This is the second sample card.' }
    ];

    public getCards(req: any, res: any) {
        res.json(this.cards);
    }

    public createCard(req: any, res: any) {
        const { title, description } = req.body;
        const newCard = { id: Date.now().toString(), title, description };
        this.cards.push(newCard);
        res.status(201).json(newCard);
    }
}