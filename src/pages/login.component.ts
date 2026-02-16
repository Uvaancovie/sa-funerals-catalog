import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-safs-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-safs-gold">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-safs-dark mb-2">Welcome Back</h1>
            <p class="text-sm text-gray-500">Sign in to access your account</p>
          </div>

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-800">{{ errorMessage() }}</p>
            </div>
          }

          <!-- Login Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all"
                placeholder="your@email.com">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all"
                placeholder="Enter your password">
            </div>

            <button 
              type="submit" 
              [disabled]="isLoading()"
              class="w-full bg-safs-dark text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              } @else {
                Sign In
              }
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Don't have an account? 
              <a routerLink="/register" class="text-safs-gold font-bold hover:underline ml-1">Register Now</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = '';
    password = '';
    isLoading = signal(false);
    errorMessage = signal('');

    onSubmit() {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.authService.login(this.email, this.password).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                // Redirect based on role
                if (response.user.role === 'admin') {
                    this.router.navigate(['/admin']);
                } else {
                    this.router.navigate(['/catalog']);
                }
            },
            error: (error) => {
                this.isLoading.set(false);
                this.errorMessage.set(error.error?.error || 'Login failed. Please check your credentials.');
            }
        });
    }
}
