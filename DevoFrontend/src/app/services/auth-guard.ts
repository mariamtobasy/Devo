import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // You could also decode/verify the JWT here if needed
    return true; // Allow navigation
  } else {
    router.navigate(['/login']); // Redirect to login if no token
    return false;
  }
};
