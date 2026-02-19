import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Customer {
  id: number;
  email: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  status: 'pending' | 'approved' | 'declined';
  role: 'admin' | 'customer';
  createdAt: string;
  address?: string;
}

type SortField = 'companyName' | 'email' | 'createdAt' | 'status';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
        <!-- Quick Actions -->
        <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            routerLink="/admin/products" 
            class="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div class="w-12 h-12 bg-safs-gold/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-safs-gold">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-safs-dark">Product Management</h3>
              <p class="text-xs text-gray-500">Create & manage products</p>
            </div>
          </a>
          <a 
            routerLink="/admin/wishlist" 
            class="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-safs-dark">Wishlist Analytics</h3>
              <p class="text-xs text-gray-500">Customer interests & demand</p>
            </div>
          </a>
          <a 
            routerLink="/admin/audit-logs" 
            class="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-safs-dark">Audit Logs</h3>
              <p class="text-xs text-gray-500">Login & logout compliance trail</p>
            </div>
          </a>
        </div>

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

        <!-- Create Customer Login -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 class="text-lg font-bold text-safs-dark mb-4">Create Customer Login</h2>

          @if (createErrorMessage()) {
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {{ createErrorMessage() }}
            </div>
          }

          @if (createSuccessMessage()) {
            <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              {{ createSuccessMessage() }}
            </div>
          }

          <form (ngSubmit)="createCustomerLogin()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              [(ngModel)]="newCustomer.companyName"
              name="companyName"
              required
              placeholder="Company Name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">

            <input
              type="text"
              [(ngModel)]="newCustomer.contactPerson"
              name="contactPerson"
              required
              placeholder="Contact Person"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">

            <input
              type="email"
              [(ngModel)]="newCustomer.email"
              name="email"
              required
              placeholder="Email Address"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">

            <input
              type="tel"
              [(ngModel)]="newCustomer.phone"
              name="phone"
              required
              placeholder="Phone Number"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">

            <input
              type="password"
              [(ngModel)]="newCustomer.password"
              name="password"
              required
              minlength="8"
              placeholder="Temporary Password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">

            <select
              [(ngModel)]="newCustomer.status"
              name="status"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>

            <input
              type="text"
              [(ngModel)]="newCustomer.address"
              name="address"
              placeholder="Address (Optional)"
              class="md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">

            <button
              type="submit"
              [disabled]="isCreatingCustomer()"
              class="md:col-span-2 px-6 py-3 bg-safs-dark text-white font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              @if (isCreatingCustomer()) {
                Creating Customer Login...
              } @else {
                Create Customer Login
              }
            </button>
          </form>
        </div>

        <!-- Search and Filter Bar -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-6">
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <!-- Search Input -->
            <div class="flex-1">
              <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  [(ngModel)]="searchTerm"
                  (ngModelChange)="onSearchChange()"
                  placeholder="Search by company, contact, email, or phone..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">
              </div>
            </div>
            <!-- Bulk Actions -->
            @if (selectedCustomers().size > 0) {
              <div class="flex gap-2">
                <button 
                  (click)="bulkApprove()"
                  class="px-4 py-3 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Approve ({{ selectedCustomers().size }})
                </button>
                <button 
                  (click)="bulkDecline()"
                  class="px-4 py-3 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Decline ({{ selectedCustomers().size }})
                </button>
                <button 
                  (click)="bulkDelete()"
                  class="px-4 py-3 bg-gray-700 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                  Delete ({{ selectedCustomers().size }})
                </button>
              </div>
            }
          </div>

          <!-- Filter Tabs -->
          <div class="flex border-b border-gray-200">
            <button 
              (click)="filterStatus.set('all')"
              [class.border-safs-gold]="filterStatus() === 'all'"
              [class.text-safs-gold]="filterStatus() === 'all'"
              class="px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 border-transparent hover:text-safs-gold transition-colors">
              All ({{ customers().length }})
            </button>
            <button 
              (click)="filterStatus.set('pending')"
              [class.border-yellow-500]="filterStatus() === 'pending'"
              [class.text-yellow-600]="filterStatus() === 'pending'"
              class="px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 border-transparent hover:text-yellow-600 transition-colors">
              Pending ({{ pendingCount() }})
            </button>
            <button 
              (click)="filterStatus.set('approved')"
              [class.border-green-500]="filterStatus() === 'approved'"
              [class.text-green-600]="filterStatus() === 'approved'"
              class="px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 border-transparent hover:text-green-600 transition-colors">
              Approved ({{ approvedCount() }})
            </button>
            <button 
              (click)="filterStatus.set('declined')"
              [class.border-red-500]="filterStatus() === 'declined'"
              [class.text-red-600]="filterStatus() === 'declined'"
              class="px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 border-transparent hover:text-red-600 transition-colors">
              Declined
            </button>
            <button 
              (click)="filterStatus.set('admin')"
              [class.border-purple-500]="filterStatus() === 'admin'"
              [class.text-purple-600]="filterStatus() === 'admin'"
              class="px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 border-transparent hover:text-purple-600 transition-colors">
              Admins ({{ adminsCount() }})
            </button>
          </div>
        </div>

        <!-- Customers Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left">
                    <input 
                      type="checkbox" 
                      (change)="toggleSelectAll($event)"
                      [checked]="isAllSelected()"
                      class="w-4 h-4 text-safs-gold border-gray-300 rounded focus:ring-safs-gold">
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-safs-gold transition-colors" (click)="sort('companyName')">
                    <div class="flex items-center gap-2">
                      Company
                      @if (sortField() === 'companyName') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.rotate-180]="sortDirection() === 'desc'">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      }
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-safs-gold transition-colors" (click)="sort('email')">
                    <div class="flex items-center gap-2">
                      Email
                      @if (sortField() === 'email') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.rotate-180]="sortDirection() === 'desc'">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      }
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-safs-gold transition-colors" (click)="sort('status')">
                    <div class="flex items-center gap-2">
                      Status
                      @if (sortField() === 'status') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.rotate-180]="sortDirection() === 'desc'">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      }
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-safs-gold transition-colors" (click)="sort('createdAt')">
                    <div class="flex items-center gap-2">
                      Created
                      @if (sortField() === 'createdAt') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.rotate-180]="sortDirection() === 'desc'">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      }
                    </div>
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (customer of paginatedCustomers(); track customer.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <input 
                        type="checkbox" 
                        [checked]="isSelected(customer.id)"
                        (change)="toggleSelect(customer.id)"
                        class="w-4 h-4 text-safs-gold border-gray-300 rounded focus:ring-safs-gold">
                    </td>
                    <td class="px-6 py-4">
                       <div class="font-bold text-safs-dark flex items-center gap-2">
                        {{ customer.companyName }}
                        @if (customer.role === 'admin') {
                          <span class="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] uppercase font-bold rounded-full border border-purple-200">Admin</span>
                        }
                      </div>
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
                    <td class="px-6 py-4 text-sm text-gray-600">
                      {{ formatDate(customer.createdAt) }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-1 justify-end">
                        <button 
                          (click)="viewCustomer(customer)"
                          title="View Details"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                        <button 
                          (click)="editCustomer(customer)"
                          title="Edit Customer"
                          class="p-2 text-safs-gold hover:bg-yellow-50 rounded transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                          </svg>
                        </button>
                        @if (customer.status !== 'approved') {
                          <button 
                            (click)="updateStatus(customer.id, 'approved')"
                            title="Approve"
                            class="p-2 text-green-600 hover:bg-green-50 rounded transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </button>
                        }
                        @if (customer.status !== 'declined') {
                          <button 
                            (click)="updateStatus(customer.id, 'declined')"
                            title="Decline"
                            class="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        }
                        <button 
                          (click)="deleteCustomer(customer.id, customer.companyName)"
                          title="Delete Customer"
                          class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                        @if (customer.role !== 'admin') {
                          <button 
                            (click)="updateRole(customer, 'admin')"
                            title="Promote to Admin"
                            class="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors group relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                            <span class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">Promote to Admin</span>
                          </button>
                        } @else {
                          <button 
                            (click)="updateRole(customer, 'customer')"
                            title="Demote to Customer"
                            class="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors group relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                               <circle cx="12" cy="12" r="10"></circle>
                               <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                            </svg>
                            <span class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">Demote to Customer</span>
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                      @if (searchTerm()) {
                        <div class="flex flex-col items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                          </svg>
                          <p class="font-bold">No customers found</p>
                          <p class="text-sm">Try adjusting your search or filters</p>
                        </div>
                      } @else {
                        <div class="flex flex-col items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <p class="font-bold">No customers yet</p>
                          <p class="text-sm">Create your first customer login above</p>
                        </div>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <div class="text-sm text-gray-600">
                Showing {{ ((currentPage() - 1) * pageSize()) + 1 }} to {{ Math.min(currentPage() * pageSize(), filteredAndSearchedCustomers().length) }} of {{ filteredAndSearchedCustomers().length }} customers
              </div>
              <div class="flex gap-2">
                <button 
                  (click)="previousPage()"
                  [disabled]="currentPage() === 1"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                @for (page of pageNumbers(); track page) {
                  <button 
                    (click)="goToPage(page)"
                    [class.bg-safs-gold]="page === currentPage()"
                    [class.text-white]="page === currentPage()"
                    [class.border-safs-gold]="page === currentPage()"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                    {{ page }}
                  </button>
                }
                <button 
                  (click)="nextPage()"
                  [disabled]="currentPage() === totalPages()"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          }
        </div>


      </div>



      <!-- View Customer Modal -->
      @if (viewingCustomer()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" (click)="closeViewModal()">
          <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-safs-dark">Customer Details</h2>
              <button (click)="closeViewModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</label>
                  <p class="mt-1 text-safs-dark font-bold">{{ viewingCustomer()?.companyName }}</p>
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Person</label>
                  <p class="mt-1 text-safs-dark">{{ viewingCustomer()?.contactPerson }}</p>
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                  <p class="mt-1 text-safs-dark">{{ viewingCustomer()?.email }}</p>
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                  <p class="mt-1 text-safs-dark">{{ viewingCustomer()?.phone }}</p>
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                  <div class="mt-1">
                    @if (viewingCustomer()?.status === 'pending') {
                      <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Pending</span>
                    } @else if (viewingCustomer()?.status === 'approved') {
                      <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Approved</span>
                    } @else {
                      <span class="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Declined</span>
                    }
                  </div>
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Role</label>
                  <div class="mt-1">
                    @if (viewingCustomer()?.role === 'admin') {
                      <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">Admin</span>
                    } @else {
                      <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">Customer</span>
                    }
                  </div>
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Created At</label>
                  <p class="mt-1 text-safs-dark">{{ formatDate(viewingCustomer()!.createdAt) }}</p>
                </div>
                @if (viewingCustomer()?.address) {
                  <div class="col-span-2">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
                    <p class="mt-1 text-safs-dark">{{ viewingCustomer()?.address }}</p>
                  </div>
                }
              </div>
            </div>
            <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-2">
              <button (click)="editCustomer(viewingCustomer()!)" class="px-4 py-2 bg-safs-gold text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors">
                Edit Customer
              </button>
              <button (click)="closeViewModal()" class="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Edit Customer Modal -->
      @if (editingCustomer()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" (click)="closeEditModal()">
          <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-safs-dark">Edit Customer</h2>
              <button (click)="closeEditModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form (ngSubmit)="saveCustomerEdit()" class="p-6 space-y-4">
              @if (editErrorMessage()) {
                <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {{ editErrorMessage() }}
                </div>
              }
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Company Name</label>
                  <input type="text" [(ngModel)]="editForm.companyName" name="companyName" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Contact Person</label>
                  <input type="text" [(ngModel)]="editForm.contactPerson" name="contactPerson" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Email</label>
                  <input type="email" [(ngModel)]="editForm.email" name="email" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone</label>
                  <input type="tel" [(ngModel)]="editForm.phone" name="phone" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Status</label>
                  <select [(ngModel)]="editForm.status" name="status"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
                <div class="col-span-2">
                  <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Address</label>
                  <input type="text" [(ngModel)]="editForm.address" name="address"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">
                </div>
              </div>
              <div class="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button type="button" (click)="closeEditModal()" class="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
                <button type="submit" [disabled]="isSavingEdit()" class="px-4 py-2 bg-safs-gold text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (isSavingEdit()) { Saving... } @else { Save Changes }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  Math = Math; // Expose Math to template

  customers = signal<Customer[]>([]);
  filterStatus = signal<'all' | 'pending' | 'approved' | 'declined' | 'admin'>('all'); // Add 'admin' filter
  searchTerm = signal('');
  sortField = signal<SortField>('createdAt');
  sortDirection = signal<SortDirection>('desc');
  currentPage = signal(1);
  pageSize = signal(10);
  selectedCustomers = signal(new Set<number>());

  viewingCustomer = signal<Customer | null>(null);
  editingCustomer = signal<Customer | null>(null);
  editForm: any = {};
  isSavingEdit = signal(false);
  editErrorMessage = signal('');

  newCustomer = {
    email: '',
    password: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    address: '',
    status: 'approved' as 'approved' | 'pending'
  };

  isCreatingCustomer = signal(false);
  createErrorMessage = signal('');
  createSuccessMessage = signal('');

  pendingCount = signal(0);
  approvedCount = signal(0);
  adminsCount = signal(0);


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
    // Fetch all users (customers and admins) for RBAC management
    this.http.get<{ customers: Customer[] }>('/api/admin/customers?role=all', { headers })
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
    this.adminsCount.set(customers.filter(c => c.role === 'admin').length);
  }

  filteredCustomers() {
    const filter = this.filterStatus();
    if (filter === 'all') return this.customers();
    if (filter === 'admin') return this.customers().filter(c => c.role === 'admin');
    return this.customers().filter(c => c.status === filter);
  }

  filteredAndSearchedCustomers() {
    let result = this.filteredCustomers();

    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(c =>
        c.companyName.toLowerCase().includes(search) ||
        c.contactPerson.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    const field = this.sortField();
    const direction = this.sortDirection();
    result = [...result].sort((a, b) => {
      let aVal: any = a[field];
      let bVal: any = b[field];

      if (field === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }

  paginatedCustomers() {
    const filtered = this.filteredAndSearchedCustomers();
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  }

  totalPages() {
    return Math.ceil(this.filteredAndSearchedCustomers().length / this.pageSize());
  }

  pageNumbers() {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, -1, total);
      } else if (current >= total - 2) {
        pages.push(1, -1, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }

    return pages;
  }

  onSearchChange() {
    this.currentPage.set(1);
    this.selectedCustomers.set(new Set());
  }

  sort(field: SortField) {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.selectedCustomers.set(new Set());
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.selectedCustomers.set(new Set());
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.selectedCustomers.set(new Set());
    }
  }

  toggleSelect(customerId: number) {
    const selected = new Set(this.selectedCustomers());
    if (selected.has(customerId)) {
      selected.delete(customerId);
    } else {
      selected.add(customerId);
    }
    this.selectedCustomers.set(selected);
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      const allIds = new Set(this.paginatedCustomers().map(c => c.id));
      this.selectedCustomers.set(allIds);
    } else {
      this.selectedCustomers.set(new Set());
    }
  }

  isSelected(customerId: number): boolean {
    return this.selectedCustomers().has(customerId);
  }

  isAllSelected(): boolean {
    const paginated = this.paginatedCustomers();
    if (paginated.length === 0) return false;
    return paginated.every(c => this.selectedCustomers().has(c.id));
  }

  bulkApprove() {
    if (this.selectedCustomers().size === 0) return;
    if (!confirm(`Approve ${this.selectedCustomers().size} customer(s) ? `)) return;

    const headers = this.authService.getAuthHeaders();
    const ids = Array.from(this.selectedCustomers());

    this.http.post('/api/admin/customers/bulk-update', {
      customerIds: ids,
      status: 'approved'
    }, { headers })
      .subscribe({
        next: () => {
          this.selectedCustomers.set(new Set());
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Bulk approve failed:', error);
          alert('Failed to approve customers');
        }
      });
  }

  bulkDecline() {
    if (this.selectedCustomers().size === 0) return;
    if (!confirm(`Decline ${this.selectedCustomers().size} customer(s) ? `)) return;

    const headers = this.authService.getAuthHeaders();
    const ids = Array.from(this.selectedCustomers());

    this.http.post('/api/admin/customers/bulk-update', {
      customerIds: ids,
      status: 'declined'
    }, { headers })
      .subscribe({
        next: () => {
          this.selectedCustomers.set(new Set());
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Bulk decline failed:', error);
          alert('Failed to decline customers');
        }
      });
  }

  bulkDelete() {
    if (this.selectedCustomers().size === 0) return;
    if (!confirm(`Are you sure you want to delete ${this.selectedCustomers().size} customer(s) ? This action cannot be undone.`)) return;

    const headers = this.authService.getAuthHeaders();
    const ids = Array.from(this.selectedCustomers());

    this.http.post('/api/admin/customers/bulk-delete', {
      customerIds: ids
    }, { headers })
      .subscribe({
        next: () => {
          this.selectedCustomers.set(new Set());
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Bulk delete failed:', error);
          alert('Failed to delete customers');
        }
      });
  }

  viewCustomer(customer: Customer) {
    this.viewingCustomer.set(customer);
  }

  closeViewModal() {
    this.viewingCustomer.set(null);
  }

  editCustomer(customer: Customer) {
    this.viewingCustomer.set(null);
    this.editingCustomer.set(customer);
    this.editForm = {
      id: customer.id,
      companyName: customer.companyName,
      contactPerson: customer.contactPerson,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      address: customer.address || ''
    };
    this.editErrorMessage.set('');
  }

  closeEditModal() {
    this.editingCustomer.set(null);
    this.editForm = {};
    this.editErrorMessage.set('');
  }

  saveCustomerEdit() {
    this.isSavingEdit.set(true);
    this.editErrorMessage.set('');

    const headers = this.authService.getAuthHeaders();
    this.http.put(`/api/admin/customers/${this.editForm.id}`, {
      companyName: this.editForm.companyName,
      contactPerson: this.editForm.contactPerson,
      email: this.editForm.email,
      phone: this.editForm.phone,
      status: this.editForm.status,
      address: this.editForm.address
    }, { headers })
      .subscribe({
        next: () => {
          this.isSavingEdit.set(false);
          this.closeEditModal();
          this.loadCustomers();
        },
        error: (error) => {
          this.isSavingEdit.set(false);
          this.editErrorMessage.set(error.error?.error || 'Failed to update customer');
        }
      });
  }

  deleteCustomer(customerId: number, companyName: string) {
    if (!confirm(`Are you sure you want to delete ${companyName}? This action cannot be undone.`)) {
      return;
    }

    const headers = this.authService.getAuthHeaders();
    this.http.delete(`/api/admin/customers/${customerId}`, { headers })
      .subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Failed to delete customer:', error);
          alert('Failed to delete customer');
        }
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  updateStatus(customerId: number, status: 'approved' | 'declined') {
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

  createCustomerLogin() {
    this.isCreatingCustomer.set(true);
    this.createErrorMessage.set('');
    this.createSuccessMessage.set('');

    const headers = this.authService.getAuthHeaders();
    this.http.post('/api/admin/customers', this.newCustomer, { headers })
      .subscribe({
        next: () => {
          this.isCreatingCustomer.set(false);
          this.createSuccessMessage.set('Customer login created successfully.');
          this.newCustomer = {
            email: '',
            password: '',
            companyName: '',
            contactPerson: '',
            phone: '',
            address: '',
            status: 'approved'
          };
          this.loadCustomers();
        },
        error: (error) => {
          this.isCreatingCustomer.set(false);
          this.createErrorMessage.set(error.error?.error || 'Failed to create customer login.');
        }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  updateRole(customer: Customer, newRole: 'admin' | 'customer') {
    if (!confirm(`Are you sure you want to change ${customer.email} 's role to ${newRole}?`)) {
      return;
    }

    const headers = this.authService.getAuthHeaders();
    this.http.patch(`/api/admin/customers/${customer.id}/role`, { role: newRole }, { headers })
      .subscribe({
        next: () => {
          // Update local state
          this.customers.update(customers =>
            customers.map(c => c.id === customer.id ? { ...c, role: newRole } : c)
          );
          this.updateCounts();
          alert(`Successfully changed role to ${newRole}`);
        },
        error: (err) => {
          console.error('Failed to update role', err);
          alert(err.error?.error || 'Failed to update role');
        }
      });
  }
}
