# Backend

This is the backend for the task management application built using Node.js and Express with TypeScript.

## Project Structure

- **src/**: Contains the source code for the backend application.
  - **controllers/**: Contains the controllers for handling requests.
    - `boardController.ts`: Handles board-related requests.
    - `listController.ts`: Handles list-related requests.
    - `cardController.ts`: Handles card-related requests.
  - **models/**: Contains the data models.
    - `board.ts`: Defines the Board model.
    - `list.ts`: Defines the List model.
    - `card.ts`: Defines the Card model.
  - **routes/**: Contains the route definitions.
    - `boardRoutes.ts`: Sets up routes for board-related requests.
    - `listRoutes.ts`: Sets up routes for list-related requests.
    - `cardRoutes.ts`: Sets up routes for card-related requests.
  - `app.ts`: Entry point of the application, initializes Express and middleware.
  - **types/**: Contains TypeScript interfaces for data structures.
    - `index.ts`: Exports interfaces for Board, List, and Card.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd task-manager/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Compile TypeScript:
   ```
   npm run build
   ```

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

- **Boards**
  - `GET /boards`: Retrieve all boards.
  - `POST /boards`: Create a new board.

- **Lists**
  - `GET /lists`: Retrieve all lists for a specific board.
  - `POST /lists`: Create a new list for a specific board.

- **Cards**
  - `GET /cards`: Retrieve all cards for a specific list.
  - `POST /cards`: Create a new card for a specific list.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.
