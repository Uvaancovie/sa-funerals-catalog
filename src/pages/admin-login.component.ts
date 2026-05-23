import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- Header -->
          <div class="bg-safs-dark px-8 py-8 text-center border-b-4 border-safs-gold">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-safs-gold/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C5A059" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-white font-serif">Admin Portal</h1>
            <p class="text-white/60 text-sm mt-1">SA Funeral Supplies</p>
          </div>

          <!-- Form -->
          <div class="p-8">
            <form (ngSubmit)="login()" #loginForm="ngForm" class="flex flex-col gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-safs-gold text-sm"
                  placeholder="admin@example.com"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  [(ngModel)]="password"
                  name="password"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-safs-gold text-sm"
                  placeholder="••••••••"
                >
              </div>

              @if (loginError()) {
                <div class="text-red-500 text-sm font-semibold text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  Invalid email or password.
                </div>
              }

              <button
                type="submit"
                [disabled]="loginForm.invalid"
                class="w-full bg-safs-dark text-white px-6 py-4 rounded-xl font-bold hover:bg-safs-gold transition-colors disabled:opacity-50 shadow-md text-lg mt-2"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  private router = inject(Router);

  email = '';
  password = '';
  loginError = signal(false);

  private readonly ADMIN_EMAIL = 'itprojects@safuneral.co.za';
  private readonly ADMIN_PASSWORD = 'safs@01';

  login() {
    if (this.email === this.ADMIN_EMAIL && this.password === this.ADMIN_PASSWORD) {
      localStorage.setItem('safs_admin_auth', 'true');
      this.loginError.set(false);
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.loginError.set(true);
    }
  }
}
