# Advanced Todo List Application

A feature-rich, full-stack todo list application built with React and Express. This application offers a modern UI with advanced task management capabilities including categories, priorities, filtering, and sorting.

![Advanced Todo List Application](https://via.placeholder.com/800x400?text=Advanced+Todo+List+App)

## Features

- Create, read, update, and delete tasks
- Set task priorities (High, Medium, Low)
- Assign categories (Work, Personal, Study, Health, Finance)
- Filter tasks by status, priority, and category
- Sort tasks by due date, priority, or title
- Responsive design for mobile, tablet, and desktop
- Search functionality to quickly find tasks

## Tech Stack

### Frontend
- React
- TanStack React Query for data fetching
- React Hook Form for form handling
- Tailwind CSS for styling
- Shadcn UI components
- Wouter for routing

### Backend
- Node.js with Express
- In-memory storage (easily replaceable with a database)
- Zod for data validation
- TypeScript for type safety

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/advanced-todo-list.git
   cd advanced-todo-list
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

Run the application in development mode:
```bash
npm run dev
```

This will start the development server on port 5000. You can access the application at http://localhost:5000.

### Production Build

To create a production build:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Project Structure

```
.
├── client/                  # Frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── layout/      # Layout components (Header, Footer)
│   │   │   ├── todo/        # Todo-specific components
│   │   │   └── ui/          # UI components (Shadcn)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and constants
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main React component
│   │   ├── index.css        # Global CSS styles
│   │   └── main.tsx         # Entry point for React application
│   └── index.html           # HTML template
├── server/                  # Backend application
│   ├── index.ts             # Express server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Data storage interface and implementation
│   └── vite.ts              # Vite server configuration
├── shared/                  # Shared code between frontend and backend
│   └── schema.ts            # Data models and validation schemas
└── various config files     # Configuration files for TypeScript, Tailwind, etc.
```

## API Endpoints

The application provides the following RESTful API endpoints:

### Todos

- **GET /api/todos**
  - Returns all todos
  - Response: 200 OK with array of todo objects

- **GET /api/todos/:id**
  - Returns a specific todo by ID
  - Response: 200 OK with todo object or 404 Not Found

- **POST /api/todos**
  - Creates a new todo
  - Request Body: Todo data (title, description, dueDate, priority, category)
  - Response: 201 Created with the new todo object

- **PATCH /api/todos/:id**
  - Updates an existing todo
  - Request Body: Updated todo fields
  - Response: 200 OK with updated todo object or 404 Not Found

- **DELETE /api/todos/:id**
  - Deletes a todo
  - Response: 204 No Content on success or 404 Not Found

## Data Models

### Todo

```typescript
{
  id: number;              // Auto-generated ID
  title: string;           // Task title (required)
  description: string;     // Task description (optional)
  dueDate: Date;           // Due date (optional)
  priority: 'high' | 'medium' | 'low';  // Priority level (required)
  category: 'work' | 'personal' | 'study' | 'health' | 'finance';  // Category (required)
  completed: boolean;      // Completion status (defaults to false)
  createdAt: Date;         // Creation timestamp (auto-generated)
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The ShadCN UI components library
- Tailwind CSS for the styling framework
- The React and Express communities for their excellent documentation