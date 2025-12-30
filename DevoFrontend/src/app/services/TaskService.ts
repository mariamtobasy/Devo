import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../pages/dashboard/tasks/task.model'; // <-- your model
import { CreateTaskDto } from '../pages/dashboard/tasks/components/create-task/create-task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks() {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.get<Task[]>(this.apiUrl, { headers });
  }

 createTask(task: CreateTaskDto) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'   // 🔥 THIS WAS MISSING
  });

  return this.http.post<Task>(this.apiUrl, JSON.stringify(task), { headers });
}


updateTaskStatus(taskId: number, status: string) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  // Wrap in object with property 'newStatus' to match backend DTO
  return this.http.patch<Task>(
    `${this.apiUrl}/${taskId}/status`,
    { newStatus: status },   // ✅ MATCHES UpdateStatusDto
    { headers }
  );
}


}