/*import { Injectable } from '@angular/core';
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

  sendMessage(payload: any): Observable<any> {
  return this.http.post(
    'http://localhost:5000/api/Contact', // <-- your real contact endpoint
    payload
  );
}

}*/
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  jobTitle?: string;
  department?: string;
  reportTo?: string;
  phoneNumber?: string;
  organization?: string;
  location?: string;
  profilePhotoUrl?: string;
    userName?: string; 
    employeeId: number;

}
export const TRANSLATIONS: any = {
  English: {
    dashboard: 'Dashboard',
    searchPlaceholder: 'Search tasks, notes...',
    accountSettings: 'Account Settings',
    changePassword: 'Change Password',
    updateEmail: 'Update Email',
    preferences: 'Preferences',
    logout: 'Logout',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    save: 'Save',
    languageLabel: 'Language'
  },
  Arabic: {
    dashboard: 'لوحة التحكم',
    searchPlaceholder: 'ابحث عن المهام والملاحظات...',
    accountSettings: 'إعدادات الحساب',
    changePassword: 'تغيير كلمة المرور',
    updateEmail: 'تحديث البريد الإلكتروني',
    preferences: 'التفضيلات',
    logout: 'تسجيل الخروج',
    oldPassword: 'كلمة المرور القديمة',
    newPassword: 'كلمة المرور الجديدة',
    save: 'حفظ',
    languageLabel: 'اللغة'
  }
};


export interface RegisterRequest {
  fullName: string;
  email: string;
  passwordHash: string;
  jobTitle?: string;
  department?: string;
  reportTo?: string;
  phoneNumber?: string;
  contactDetails?: string;
  organization?: string;
  location?: string;
  profilePhotoUrl?: string;
}


export interface LoginRequest {
  email: string;
  passwordHash: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserProfile;
}

export interface CalendarEvent {
  notes: string | undefined;
  id?: number;
  title: string;
  start: Date;
  end?: Date;
  videoCallLink?: string;    
}
export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  employeeId?: number; // if you need it to link notes to employees
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  
  private http = inject(HttpClient);

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private authApiUrl = `${environment.apiUrl}/auth`;
  private usersApiUrl = `${environment.apiUrl}/users`;
  private calendarApiUrl = `${environment.apiUrl}/calendar`;
  private notesApiUrl = `${environment.apiUrl}/notes`;
  private sidebarVisible = new BehaviorSubject<boolean>(true);
  sidebarVisible$ = this.sidebarVisible.asObservable();
  private notificationsSource = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSource.asObservable();
  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user: UserProfile = JSON.parse(userJson);
      this.currentUserSubject.next(user);
    }
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(`${this.authApiUrl}/register`, userData, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            this.setUserAndToken(response);
          }
        }),
        catchError(error => throwError(() => this.handleError(error)))
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(`${this.authApiUrl}/login`, credentials, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            this.setUserAndToken(response);
          }
        }),
        catchError(error => throwError(() => this.handleError(error)))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !!this.currentUserSubject.value;
  }



  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  getProfile(): Observable<UserProfile> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserProfile>(`${this.usersApiUrl}/profile`, { headers })
      .pipe(
        tap(user => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError(error => throwError(() => this.handleError(error)))
      );
  }

  private setUserAndToken(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    if (response.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    }
  }

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
 getEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(this.calendarApiUrl);
  }

  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(this.calendarApiUrl, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.calendarApiUrl}/${id}`);
  }

  getNotes(): Observable<Note[]> {
  return this.http.get<Note[]>(`${this.notesApiUrl}`);
}

addNote(noteData: any) {
  return this.http.post(`${this.notesApiUrl}`, noteData);
}

updateNote(noteData: any) {
  return this.http.put(`${this.notesApiUrl}/${noteData.id}`, noteData);
}

deleteNote(noteId: number) {
  return this.http.delete(`${this.notesApiUrl}/${noteId}`);
}

toggleSidebar() {
    this.sidebarVisible.next(!this.sidebarVisible.value);
  }

  addNotification(icon: string, message: string) {
    const newNoti = {
      id: Date.now(),
      icon: icon,
      message: message,
      time: new Date(),
      isRead: false
    };
    
    // Add new notification to the beginning of the array
    const updatedNotis = [newNoti, ...this.notificationsSource.value];
    this.notificationsSource.next(updatedNotis);
  }

  clearNotifications() {
    this.notificationsSource.next([]);
  }
  // 1. Helper to get the number of unread notifications
getUnreadCount(): number {
  return this.notificationsSource.value.filter(n => !n.isRead).length;
}

// 2. The missing function to mark them as read
markAllAsRead(): void {
  const currentNotis = this.notificationsSource.value.map(n => ({
    ...n,
    isRead: true
  }));
  this.notificationsSource.next(currentNotis);
}
  
}