import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/authService';// to get token if needed
export interface TeamDto {
  id?: number;
  name: string;
  description: string;
  members?: any[]; 
  tasks?: any[];   
  chatMessages?: any[]; // This should be an array, not TeamDto
  createdAt?: string;
}


// teams.service.ts
export interface CreateTeamDto {
  name: string;
  description: string;
  members?: any[];     
  tasks?: any[];       
  chatMessages?: any[]; 
}

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  
  // Ensure this matches your Controller Route: [Route("api/[controller]")]
  private base = `${environment.apiUrl}/Teams`; 

  private getHeaders() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  list(): Observable<TeamDto[]> { 
    return this.http.get<TeamDto[]>(this.base, this.getHeaders()); 
  }

  create(team: CreateTeamDto): Observable<TeamDto> {
    // Log exactly what is being sent to debug the 400 error
    console.log('Sending to Backend:', team);
    return this.http.post<TeamDto>(this.base, team, this.getHeaders());
  }

  delete(id: number) { 
    return this.http.delete(`${this.base}/${id}`, this.getHeaders()); 
  }
}