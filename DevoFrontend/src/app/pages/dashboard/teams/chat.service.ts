import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { AuthService } from '../../../services/authService';
import { Observable } from 'rxjs';

export interface ChatMessageDto {
  id?: number;
  teamId: number;
  senderUserId: number; // Added this
  senderName: string;
  text: string;         // Changed back to 'text'
  sentAt: string;       // Changed back to 'sentAt'
}
@Injectable({ providedIn: 'root' })
export class ChatService {
 
  getChatHistory(teamId: number) {
    throw new Error('Method not implemented.');
  }
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private base = `${environment.apiUrl}/teams`;

  private opts() {
    const token = this.auth.getToken();
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  list(teamId:number): Observable<ChatMessageDto[]> {
    return this.http.get<ChatMessageDto[]>(`${this.base}/${teamId}/chat`, this.opts());
  }

  send(teamId:number, msg: ChatMessageDto) {
    return this.http.post(`${this.base}/${teamId}/chat`, msg, this.opts());
  }

  delete(teamId: number, messageId: number) {
  // FIX: Make sure you aren't adding "Teams" again if it's already in the apiUrl
  return this.http.delete(`${this.base}/${teamId}/chat/${messageId}`);
}
}