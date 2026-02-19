import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin-signin',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-safs-dark mb-2">Admin Sign In</h1>
            <p class="text-sm text-gray-500">Sign in with admin credentials to manage customers</p>
          </div>

          @if (errorMessage()) {
            <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-800">{{ errorMessage() }}</p>
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all"
                placeholder="admin@email.com">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all"
                placeholder="Enter admin password">
            </div>

            <button
              type="submit"
              [disabled]="isLoading()"
              class="w-full bg-safs-dark text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              @if (isLoading()) {
                Signing In...
              } @else {
                Sign In as Admin
              }
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Customer login?
              <a routerLink="/login" class="text-safs-gold font-bold hover:underline ml-1">Go to Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminSignInComponent {
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
                if (response.user.role !== 'admin') {
                    this.authService.logout();
                    this.errorMessage.set('Admin access required for this page.');
                    return;
                }
                this.router.navigate(['/admin']);
            },
            error: (error) => {
                this.isLoading.set(false);
                this.errorMessage.set(error.error?.error || 'Login failed. Please check your credentials.');
            }
        });
    }
}
