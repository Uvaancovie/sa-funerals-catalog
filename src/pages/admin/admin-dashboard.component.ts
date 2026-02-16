import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Customer {
    _id: string;
    email: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    status: 'pending' | 'approved' | 'declined';
    createdAt: string;
}

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Admin Header -->
      <div class="bg-safs-dark text-white shadow-lg">
        <div class="container mx-auto px-4 py-6">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold">Admin Portal</h1>
              <p class="text-sm text-gray-400">Customer Management System</p>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm">{{ authService.currentUser()?.email }}</span>
              <button (click)="logout()" class="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-sm font-bold">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 uppercase tracking-wider font-bold">Pending Approval</p>
                <p class="text-3xl font-black text-safs-gold mt-2">{{ pendingCount() }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 uppercase tracking-wider font-bold">Approved</p>
                <p class="text-3xl font-black text-green-600 mt-2">{{ approvedCount() }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 uppercase tracking-wider font-bold">Total Customers</p>
                <p class="text-3xl font-black text-safs-dark mt-2">{{ customers().length }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div class="flex border-b border-gray-200">
            <button 
              (click)="filterStatus.set('all')"
              [class.border-safs-gold]="filterStatus() === 'all'"
              [class.text-safs-gold]="filterStatus() === 'all'"
              class="px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 border-transparent hover:text-safs-gold transition-colors">
              All ({{ customers().length }})
            </button>
            <button 
              (click)="filterStatus.set('pending')"
              [class.border-yellow-500]="filterStatus() === 'pending'"
              [class.text-yellow-600]="filterStatus() === 'pending'"
              class="px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 border-transparent hover:text-yellow-600 transition-colors">
              Pending ({{ pendingCount() }})
            </button>
            <button 
              (click)="filterStatus.set('approved')"
              [class.border-green-500]="filterStatus() === 'approved'"
              [class.text-green-600]="filterStatus() === 'approved'"
              class="px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 border-transparent hover:text-green-600 transition-colors">
              Approved ({{ approvedCount() }})
            </button>
            <button 
              (click)="filterStatus.set('declined')"
              [class.border-red-500]="filterStatus() === 'declined'"
              [class.text-red-600]="filterStatus() === 'declined'"
              class="px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 border-transparent hover:text-red-600 transition-colors">
              Declined
            </button>
          </div>
        </div>

        <!-- Customers Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Company</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (customer of filteredCustomers(); track customer._id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="font-bold text-safs-dark">{{ customer.companyName }}</div>
                    <div class="text-xs text-gray-500">{{ customer.phone }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm">{{ customer.contactPerson }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ customer.email }}</td>
                  <td class="px-6 py-4">
                    @if (customer.status === 'pending') {
                      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Pending</span>
                    } @else if (customer.status === 'approved') {
                      <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Approved</span>
                    } @else {
                      <span class="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Declined</span>
                    }
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      @if (customer.status !== 'approved') {
                        <button 
                          (click)="updateStatus(customer._id, 'approved')"
                          class="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 transition-colors">
                          Approve
                        </button>
                      }
                      @if (customer.status !== 'declined') {
                        <button 
                          (click)="updateStatus(customer._id, 'declined')"
                          class="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition-colors">
                          Decline
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
    authService = inject(AuthService);
    private http = inject(HttpClient);
    private router = inject(Router);

    customers = signal<Customer[]>([]);
    filterStatus = signal<'all' | 'pending' | 'approved' | 'declined'>('all');

    pendingCount = signal(0);
    approvedCount = signal(0);

    ngOnInit() {
        // Check if user is admin
        if (!this.authService.isAdmin()) {
            this.router.navigate(['/']);
            return;
        }

        this.loadCustomers();
    }

    loadCustomers() {
        const headers = this.authService.getAuthHeaders();
        this.http.get<{ customers: Customer[] }>('/api/admin/customers', { headers })
            .subscribe({
                next: (response) => {
                    this.customers.set(response.customers);
                    this.updateCounts();
                },
                error: (error) => {
                    console.error('Failed to load customers:', error);
                }
            });
    }

    updateCounts() {
        const customers = this.customers();
        this.pendingCount.set(customers.filter(c => c.status === 'pending').length);
        this.approvedCount.set(customers.filter(c => c.status === 'approved').length);
    }

    filteredCustomers() {
        const filter = this.filterStatus();
        if (filter === 'all') return this.customers();
        return this.customers().filter(c => c.status === filter);
    }

    updateStatus(customerId: string, status: 'approved' | 'declined') {
        const headers = this.authService.getAuthHeaders();
        this.http.patch(`/api/admin/customers/${customerId}`, { status }, { headers })
            .subscribe({
                next: () => {
                    this.loadCustomers();
                },
                error: (error) => {
                    console.error('Failed to update status:', error);
                    alert('Failed to update customer status');
                }
            });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
