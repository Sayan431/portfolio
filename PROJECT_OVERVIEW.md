# DevHub Project Overview

## What is DevHub?

DevHub (Developer App) is a full-stack web application tailored specifically for developers. It serves as a centralized hub to streamline the daily developer workflow by providing essential tools and utilities in one unified interface.

## Core Features (What it does)

The application currently supports the following core functionalities:
- **Snippets Manager**: Save, organize, and retrieve code snippets with language-specific tags.
- **Task Tracker**: Manage to-dos, set priorities, and track the status of your ongoing work.
- **Notes**: A dedicated space to jot down ideas, project documentation, or quick thoughts.
- **API Tester**: A built-in utility to test REST API endpoints (a lightweight alternative to tools like Postman or Insomnia).

### Upcoming Features
Based on the project roadmap, DevHub is being expanded to include:
- **Global Search**: Quick navigation using a `Ctrl+K` command palette.
- **Live Markdown Previewer**: For writing and previewing documentation.
- **JSON Formatter & Validator**: To quickly format and validate JSON payloads.
- **Bookmark Manager**: To keep track of important links.
- **Pomodoro Timer**: To maintain focus during coding sessions.
- **Environment Variables Manager**: To manage `.env` configurations.
- **Project Manager**: To organize work by project.
- **Changelog Tracker**: To keep a log of changes and updates.

## Architecture (How it works)

DevHub operates on a decoupled client-server architecture, allowing the frontend and backend to run independently.

### Frontend
- **Tech Stack**: React + Vite
- **Functionality**: Provides a highly responsive, dynamic single-page application (SPA). It handles the presentation layer, user interactions, and makes asynchronous REST API calls to the backend to fetch or mutate data.
- **Setup**: Managed via Node.js and `npm`.

### Backend
- **Tech Stack**: FastAPI (Python 3.8+)
- **Functionality**: Serves as the core engine. It exposes a series of RESTful API endpoints that the frontend consumes. It handles data processing, business logic, and in-memory storage for the various entities (Snippets, Tasks, Notes, Bookmarks, etc.).
- **API Documentation**: FastAPI automatically generates interactive OpenAPI (Swagger) documentation, accessible at `http://localhost:8000/docs`.

## Getting Started

To run the project locally, you need both Node.js and Python installed.

1. **Start the Backend**: Run the provided `start-backend.ps1` script (or activate a virtual environment and run `python main.py` in the `backend` directory). The server runs on `http://localhost:8000`.
2. **Start the Frontend**: Run the provided `start-frontend.ps1` script (or run `npm install` and `npm run dev` in the `frontend` directory).
