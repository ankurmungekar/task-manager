# Task Manager

This project is a simple task management application, built using React with TypeScript for the frontend and Node.js with Express for the backend. The application allows users to create boards, lists, and draggable cards to manage their tasks effectively.

## Project Structure

The project is divided into two main parts: the backend and the frontend.

### Backend

The backend is built with Node.js and Express. It handles API requests related to boards, lists, and cards.

- **src/app.ts**: Entry point of the backend application.
- **src/controllers/**: Contains controllers for handling requests.
  - `boardController.ts`: Manages board-related requests.
  - `listController.ts`: Manages list-related requests.
  - `cardController.ts`: Manages card-related requests.
- **src/models/**: Defines data models.
  - `board.ts`: Represents a board.
  - `list.ts`: Represents a list.
  - `card.ts`: Represents a card.
- **src/routes/**: Sets up API routes.
  - `boardRoutes.ts`: Routes for board-related requests.
  - `listRoutes.ts`: Routes for list-related requests.
  - `cardRoutes.ts`: Routes for card-related requests.
- **src/types/**: Contains TypeScript interfaces for data structures.
- **package.json**: Lists dependencies and scripts.
- **tsconfig.json**: TypeScript configuration file.
- **README.md**: Documentation for the backend.

### Frontend

The frontend is built with React and TypeScript. It provides a user interface for interacting with the task management features.

- **src/components/**: Contains React components.
  - `Board.tsx`: Renders a board with lists and cards.
  - `List.tsx`: Renders a list of cards with drag-and-drop functionality.
  - `Card.tsx`: Represents an individual card.
- **src/App.tsx**: Main application component.
- **src/index.tsx**: Entry point of the React application.
- **src/types/**: Contains TypeScript interfaces for frontend data structures.
- **package.json**: Lists dependencies and scripts.
- **tsconfig.json**: TypeScript configuration file.
- **README.md**: Documentation for the frontend.

## Features

- Create and manage boards.
- Add lists to boards.
- Create draggable cards within lists.
- Intuitive user interface for task management.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository.
2. Navigate to the `backend` directory and install dependencies:
   ```
   cd backend
   npm install
   ```
3. Navigate to the `frontend` directory and install dependencies:
   ```
   cd frontend
   npm install
   ```
4. Start the backend server:
   ```
   cd backend
   npm start
   ```
5. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.
