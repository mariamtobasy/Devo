// src/app/services/cookie.service.ts
/*import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MyCookieService {

  constructor(private cookieService: CookieService) { }

  // Set a cookie
  setCookie(name: string, value: string, days: number) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    this.cookieService.set(name, value, expiryDate, '/');
  }

  // Get a cookie
  getCookie(name: string): string {
    return this.cookieService.get(name);
  }

  // Delete a cookie
  deleteCookie(name: string) {
    this.cookieService.delete(name, '/');
  }

  // Check if cookie exists
  checkCookie(name: string): boolean {
    return this.cookieService.check(name);
  }
}*/