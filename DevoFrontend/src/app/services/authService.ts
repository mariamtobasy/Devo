import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  passwordHash: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/Auth'; // ✅ same as your backend

  constructor(private http: HttpClient) {}

  // ✅ Keep your existing Register method
  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload, { responseType: 'text' });
  }

  // ✅ Updated Login method (from your friend's version)
  login(credentials: LoginRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { headers })
      .pipe(
        tap(response => {
          if (response.token) {
            this.setUserAndToken(response);
          }
        }),
        catchError(error => throwError(() => this.handleError(error)))
      );
  }

  // ✅ Save token and user to localStorage
  private setUserAndToken(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    if (response.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }
  }

  // ✅ Retrieve token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Simple check if logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Logout and clear storage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  // ✅ Error handling (from your friend's code)
  private handleError(error: any): string {
    if (error.error instanceof ErrorEvent) {
      return `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          return error.error?.message || 'Bad request. Please check your input.';
        case 401:
          return 'Invalid email or password. Please try again.';
        case 409:
          return 'Email already exists. Please use a different email.';
        case 500:
          return 'Server error. Please try again later.';
        default:
                 return error.error?.message || 'An unexpected error occurred.';
      }
    }
  }
}