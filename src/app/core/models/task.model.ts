export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskPage {
  content: Task[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TaskFilter {
  completed?: boolean;
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
  sortBy?: 'title' | 'dueDate' | 'completed' | 'createdAt' | 'assignedTo';
  sortDir?: 'asc' | 'desc';
  page?: number;
  size?: number;
}
