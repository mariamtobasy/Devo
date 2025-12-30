
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './task.model';
import { TaskList } from './components/task-list/task-list';
import { CreateTask } from './components/create-task/create-task';
import { TaskService } from '../../../services/TaskService';
import { CreateTaskDto } from './components/create-task/create-task';
import { TaskResponse } from './task.model';
import { RecentService } from '../../../services/RecentService';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskList, CreateTask],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class Tasks {
  currentUserEmail = ''; // will set from backend if needed
  role: 'manager' | 'employee' = 'manager';
  showCreateModal = false;
  tasks: Task[] = []; // tasks from backend

  constructor(private taskService: TaskService,private recentService:RecentService) {}

  ngOnInit() {
    this.loadTasks();
  }

  mapStatusToBackend(status: Task['status']): string {
  switch (status) {
    case 'todo': return 'Todo';
    case 'in-progress': return 'InProgress';
    case 'review': return 'Review';
    case 'done': return 'Done';
    default: return 'Todo';
  }
}


  mapStatusFromBackend(status: string): Task['status'] {
    switch (status) {
      case 'Todo': return 'todo';
      case 'InProgress': return 'in-progress';
      case 'Review': return 'review';
      case 'Done': return 'done';
      default: return 'todo';
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks = res.map(t => ({
          id: t.id!,
          title: t.title,
          description: t.description,
          tags: t.tags ?? [],
          assignedBy: t.assignedBy,
          assignedTo: t.assignedTo,
          status: this.mapStatusFromBackend(t.status),
          createdAt: t.createdAt,
          dueDate: t.dueDate
        }));

        // Optional: set current user email if the backend sends it
        if (this.tasks.length > 0) {
          this.currentUserEmail = this.tasks[0].assignedBy; // or get from auth service
        }
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  openCreate() {
    this.showCreateModal = true;
  }

onTaskCreated(task: CreateTaskDto) {
  const payload = {
    title: task.title,
    description: task.description,
    tags: task.tags,
    status: task.status,
    assignedToEmail: task.assignedToEmail // ✅ CORRECT
  };

   // Call the service to add to recent
  this.recentService.add(`Created task: "${task.title}"`);


  console.log('AssignedTo before payload:', payload.assignedToEmail);

  this.taskService.createTask(payload).subscribe({
  next: (res) => {
    this.tasks.push({
      ...res,
      status: this.mapStatusFromBackend(res.status)
    });
    this.showCreateModal = false;
  },
  error: (err) => console.error('Failed to create task', err)
});

}


 updateTaskStatus(task: Task) {
  const backendStatus = this.mapStatusToBackend(task.status);
  console.log('Updating task', task.id, 'to status', backendStatus);

  this.taskService.updateTaskStatus(task.id!, backendStatus)
    .subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Failed to update task status', err)
    });
}


}
