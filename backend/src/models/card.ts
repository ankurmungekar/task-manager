export interface Card {
    id: string;
    title: string;
    description: string;
    dueDate?: string; // ISO date string
}