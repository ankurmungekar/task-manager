export interface Board {
    id: string;
    title: string;
    userId: string; // user who owns the board
    collaborators: string[]; // user IDs of collaborators
    lists: List[];
}

export interface List {
    id: string;
    title: string;
    userId: string; // user who owns the list
    cards: Card[];
}

export interface Card {
    id: string;
    title: string;
    description: string;
    dueDate?: string; // ISO date string
    userId: string; // user who owns the card
}