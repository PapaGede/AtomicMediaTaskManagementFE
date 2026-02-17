# Atomic Media Task Management - Frontend

A task management web application built with Angular 16 and Angular Material. This frontend provides a full-featured interface for creating, viewing, editing, and deleting tasks with advanced filtering, sorting, and pagination.

## Tech Stack

- **Framework:** Angular 16.2
- **UI Library:** Angular Material 16.2
- **Language:** TypeScript 5.1
- **Styling:** SCSS
- **State Management:** RxJS BehaviorSubjects
- **Unit Testing:** Jest with jest-preset-angular
- **E2E Testing:** Playwright
- **Build Tool:** Angular CLI

## Prerequisites

- Node.js (v16+)
- npm (v8+)
- Angular CLI (`npm install -g @angular/cli@16`)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload on file changes.

### Backend API

The frontend expects a REST API running at `http://localhost:8080/api`. Configure this in `src/environments/environment.ts`.

## Project Structure

```
src/
├── app/
│   ├── core/                          # Singleton services and models
│   │   ├── interceptors/
│   │   │   └── error.interceptor.ts   # Global HTTP error handling
│   │   ├── models/
│   │   │   └── task.model.ts          # Task, TaskPage, TaskFilter interfaces
│   │   └── services/
│   │       └── task.service.ts        # Task CRUD and state management
│   ├── features/                      # Feature modules
│   │   └── tasks/
│   │       ├── task-list/             # Paginated task table with filters
│   │       ├── task-form/             # Create/edit task form
│   │       └── task-detail/           # Task detail view
│   ├── shared/                        # Reusable components
│   │   ├── components/
│   │   │   └── confirm-dialog/        # Confirmation dialog for deletions
│   │   └── shared.module.ts
│   ├── app.module.ts                  # Root module
│   ├── app-routing.module.ts          # Route definitions
│   └── app.component.*                # Root component with toolbar
├── environments/                      # Environment configs
│   ├── environment.ts                 # Development (localhost:8080)
│   └── environment.prod.ts            # Production (/api)
├── styles.scss                        # Global styles
├── index.html                         # HTML entry point
└── main.ts                            # Angular bootstrap
```

## Features

### Task List
- Material data table with sortable columns (title, assigned to, status, due date)
- Server-side pagination with configurable page sizes (5, 10, 25, 50)
- Search with 300ms debounce
- Filter by completion status (All / Completed / Pending)
- Date range filtering (due date from/to)
- Inline toggle for task completion status
- Edit and delete actions per row

### Task Form
- Create and edit modes with auto-detection via route parameters
- Reactive form validation (title required, max 100 characters)
- Date picker for due dates
- Completion checkbox (edit mode only)
- Loading spinner during async operations

### Task Detail
- Full task view with status chip, due date, assignee, and description
- Creation and last updated timestamps
- Edit and delete actions with confirmation dialog

### Error Handling
- Global HTTP error interceptor
- User-friendly snackbar notifications for connection, validation, and server errors

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/tasks` | TaskListComponent | Task list with filters |
| `/tasks/new` | TaskFormComponent | Create new task |
| `/tasks/:id` | TaskDetailComponent | View task details |
| `/tasks/:id/edit` | TaskFormComponent | Edit existing task |

## API Endpoints

The frontend communicates with the following REST API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (with query params for filtering/pagination) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/toggle` | Toggle completion status |

### Query Parameters (GET /api/tasks)

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (1-indexed) |
| `size` | number | Page size |
| `sortBy` | string | Sort field (title, dueDate, completed, createdAt, assignedTo) |
| `sortDir` | string | Sort direction (asc, desc) |
| `search` | string | Search by title |
| `completed` | boolean | Filter by completion status |
| `dueDateFrom` | string | Filter due date from (ISO format) |
| `dueDateTo` | string | Filter due date to (ISO format) |

## Running Tests

### Unit Tests

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

### E2E Tests

Requires the dev server and backend to be running:

```bash
npm run e2e
```

## Build

```bash
ng build
```

Production build artifacts are output to `dist/frontend/` with optimized bundles and content hashing.

## Environment Configuration

| Variable | Development | Production |
|----------|-------------|------------|
| `apiUrl` | `http://localhost:8080/api` | `/api` |
| `production` | `false` | `true` |

## AI Disclosure

The user interface design, CSS styling, tests and README in this project were generated with the assistance of AI (Claude by Anthropic). All application logic, architecture decisions, and code review remain the responsibility of the project maintainers.
