export interface Card {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  userId: string; // user who owns the board
  lists: List[];
  collaborators?: string[]; // user IDs of collaborators
}