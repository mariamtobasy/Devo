import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { AuthService } from '../../../services/authService';
import { Observable } from 'rxjs';

/* ================= CREATE DTO ================= */
export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignedToUserId?: number;
  dueDate?: string;
  pinned?: boolean;
  teamId: number; // ✅ backend expects this
}

/* ================= READ DTO ================= */
export interface TaskDto {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedToUserId?: number;
  dueDate?: string;
  pinned?: boolean;

  // optional, returned by backend sometimes
  team?: {
    id: number;
    name: string;
    description: string;
    members: any[];
    tasks: any[];
  };
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private base = `${environment.apiUrl}/teams`;

  /* ================= HEADERS ================= */
  private opts() {
    const token = this.auth.getToken();
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }

  /* ================= LIST ================= */
  list(teamId: number): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(
      `${this.base}/${teamId}/tasks`,
      this.opts()
    );
  }

  /* ================= CREATE (FIXED) ================= */
  create(teamId: number, task: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(
      `${this.base}/${teamId}/tasks`,
      task,
      this.opts()
    );
  }

  /* ================= UPDATE ================= */
  update(teamId: number, taskId: number, task: TaskDto): Observable<TaskDto> {
    return this.http.put<TaskDto>(
      `${this.base}/${teamId}/tasks/${taskId}`,
      task,
      this.opts()
    );
  }

  /* ================= DELETE ================= */
  delete(teamId: number, taskId: number) {
    return this.http.delete(
      `${this.base}/${teamId}/tasks/${taskId}`,
      this.opts()
    );
  }


  
}