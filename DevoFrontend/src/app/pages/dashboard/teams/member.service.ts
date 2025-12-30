import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { AuthService } from '../../../services/authService';
import { Observable } from 'rxjs';

export interface MemberDto { id?: number; teamId?: number; userId: number; role: string; isOnline?: boolean; }

@Injectable({ providedIn: 'root' })
export class MembersService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private base = `${environment.apiUrl}/teams`;

  private opts() {
    const token = this.auth.getToken();
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  list(teamId: number): Observable<MemberDto[]> {
    return this.http.get<MemberDto[]>(`${this.base}/${teamId}/members`, this.opts());
  }
 add(teamId: number, payload: { userId: number; role: string }) {
  return this.http.post<MemberDto>(
    `${this.base}/${teamId}/members`,
    payload
  );
}
  remove(teamId: number, memberId: number) {
    return this.http.delete(`${this.base}/${teamId}/members/${memberId}`, this.opts());
  }
  update(teamId:number, memberId:number, payload:any) {
    return this.http.put(`${this.base}/${teamId}/members/${memberId}`, payload, this.opts());
  }
}