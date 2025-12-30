import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MyListTask {
  myListTaskId: number;
  title: string;
  description?: string;
  time: string;
  priority: 'urgent' | 'medium' | 'low';
  isCompleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MyListService {
  private apiUrl = 'http://localhost:5000/api/mylist'; // adjust if needed

  constructor(private http: HttpClient) {}

  getTasks(): Observable<MyListTask[]> {
    return this.http.get<MyListTask[]>(this.apiUrl);
  }

  addTask(task: Partial<MyListTask>): Observable<MyListTask> {
    return this.http.post<MyListTask>(this.apiUrl, task);
  }

  updateTask(task: MyListTask): Observable<MyListTask> {
    return this.http.put<MyListTask>(`${this.apiUrl}/${task.myListTaskId}`, task);
  }

  deleteTask(myListTaskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${myListTaskId}`);
  }
}