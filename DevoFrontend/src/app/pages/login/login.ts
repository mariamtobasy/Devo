import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/authService';
//import { UserService } from '../user.service';
//import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
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
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class Login implements OnInit, OnDestroy {
  // --- Dependency Injection ---
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  // private socialAuthService = inject(SocialAuthService);

  // --- State Variables ---
  title = 'Login Page';
  email = '';
  password = '';
  userId!: string;
  isLoading = false;
  errorMessage = '';
  isGoogleLoading = false;
  loggedIn = false;
  showPassword = false;
   rememberMe = false;
   
  // Optional social login
  // user: SocialUser | null = null;
  private authStateSubscription!: Subscription;

  // --- Lifecycle Hooks ---
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    console.log('User ID from URL:', this.userId);

    // Uncomment if using Google/Facebook login
    /*
    this.authStateSubscription = this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;

      if (this.loggedIn) {
        console.log('✅ Social login success:', user);
        this.router.navigate(['/dashboard']);
      }
    });
    */
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }

  // --- Validation Methods ---
  validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format.';
    return null;
  }
/*
  validatePassword(password: string): string | null {
    if (password.length < 7) return 'Password must be at least 7 characters long.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one symbol.';
    const numbers = password.match(/\d/g);
    if (!numbers || numbers.length < 3) return 'Password must contain at least 3 numbers.';
    return null;
  }*/

  // --- Main Form Submit ---
  onSubmit(): void {
    if (this.email && this.password) {
      this.isLoading = true;
      this.errorMessage = '';

      // Run validation
      const emailError = this.validateEmail(this.email);
      if (emailError) {
        this.errorMessage = emailError;
        this.isLoading = false;
        return;
      }

      /*const passwordError = this.validatePassword(this.password);
      if (passwordError) {
        this.errorMessage = passwordError;
        this.isLoading = false;
        return;
      }*/

      // If valid, login with backend
      this.loginWithBackend();
    } else {
      this.errorMessage = 'Please enter both email and password.';
    }
  }

// --- Backend Login ---
private loginWithBackend(): void {
  const credentials: LoginRequest = {
    email: this.email,
    passwordHash: this.password
  };

  console.log('📤 Sending login request:', credentials);

  this.authService.login(credentials).subscribe({
    next: (response) => {
      this.isLoading = false;
      console.log('✅ Login success:', response);

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        alert('Login successful!');
        this.router.navigate(['/dashboard']); 
      
      } else {
        this.errorMessage = response.message || 'Invalid credentials.';
      }
    },
    error: (error) => {
      this.isLoading = false;
      console.error('❌ Login error:', error);
      if (error?.status === 401) {
        this.errorMessage = 'Invalid email or password.';
      } else {
        this.errorMessage = 'Login failed. Please try again.';
      }
    }
  });
}

 
  // --- Social Logins (placeholders for now) ---
 /* signInWithGoogle(): void {
    console.log('Google sign-in clicked');
    this.isGoogleLoading = true;*/
    // Uncomment when integrated:
    /*
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(err => {
      console.error('Google sign-in failed:', err);
      this.isGoogleLoading = false;
    });
    */


 /* signInWithFacebook(): void {
    console.log('Facebook sign-in clicked');
    // this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithApple(): void {
    console.log('Apple sign-in clicked');
  }

  // --- Navigation ---
  goToRegister(): void {
    this.router.navigate(['/register']);
  }*/

  // Optional: Keep the existing submit alias
  submit() {
    this.onSubmit();
  }

  toggleShow() {
  this.showPassword = !this.showPassword;
}
}