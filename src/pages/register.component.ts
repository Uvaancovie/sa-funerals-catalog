import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-safs-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-safs-dark">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-safs-dark mb-2">Create Account</h1>
            <p class="text-sm text-gray-500">Register to access wholesale pricing</p>
          </div>

          <!-- Success Message -->
          @if (successMessage()) {
            <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-800 font-medium">{{ successMessage() }}</p>
              <p class="text-xs text-green-600 mt-1">Please wait for admin approval to access pricing.</p>
            </div>
          }

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-800">{{ errorMessage() }}</p>
            </div>
          }

          <!-- Registration Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Company Name *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.companyName" 
                name="companyName"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all"
                placeholder="Your Company Ltd">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Contact Person *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.contactPerson" 
                name="contactPerson"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all"
                placeholder="John Doe">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address *</label>
              <input 
                type="email" 
                [(ngModel)]="formData.email" 
                name="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all"
                placeholder="john@company.com">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone Number *</label>
              <input 
                type="tel" 
                [(ngModel)]="formData.phone" 
                name="phone"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all"
                placeholder="+27 11 123 4567">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Physical Address</label>
              <textarea 
                [(ngModel)]="formData.address" 
                name="address"
                rows="2"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all resize-none"
                placeholder="123 Main Street, Johannesburg"></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Password *</label>
              <input 
                type="password" 
                [(ngModel)]="formData.password" 
                name="password"
                required
                minlength="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all"
                placeholder="Minimum 6 characters">
            </div>

            <button 
              type="submit" 
              [disabled]="isLoading()"
              class="w-full bg-safs-gold text-safs-dark font-bold py-4 rounded-lg hover:bg-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              } @else {
                Create Account
              }
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Already have an account? 
              <a routerLink="/login" class="text-safs-gold font-bold hover:underline ml-1">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    formData = {
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    };

    isLoading = signal(false);
    errorMessage = signal('');
    successMessage = signal('');

    onSubmit() {
        this.isLoading.set(true);
        this.errorMessage.set('');
        this.successMessage.set('');

        this.authService.register(this.formData).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                this.successMessage.set('Registration successful!');
                // Reset form
                this.formData = {
                    companyName: '',
                    contactPerson: '',
                    email: '',
                    phone: '',
                    address: '',
                    password: ''
                };
            },
            error: (error) => {
                this.isLoading.set(false);
                this.errorMessage.set(error.error?.error || 'Registration failed. Please try again.');
            }
        });
    }
}
