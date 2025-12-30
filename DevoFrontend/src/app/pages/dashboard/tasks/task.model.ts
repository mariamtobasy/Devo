// src/app/pages/dashboard/tasks/task.model.ts
export interface Task {
  id: number;
  title: string;
  description: string;
  tags: string[];
  assignedBy: string;         // manager email
  assignedTo: string;         // employee email
  status: 'todo' | 'in-progress' | 'review' | 'done';
  createdAt?: string; // ISO string from backend
  dueDate?: string;  // ISO string or formatted

}

// src/app/pages/dashboard/tasks/task.model.ts

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  tags: string[];
  status: 'Todo' | 'InProgress' | 'Review' | 'Done';
  assignedBy: string;
  assignedTo: string;
  createdAt: string;
  dueDate?: string;
}

