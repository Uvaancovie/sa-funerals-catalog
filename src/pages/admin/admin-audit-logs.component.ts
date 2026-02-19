import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface AuditLog {
  id: number;
  userId: number;
  email: string;
  companyName: string | null;
  action: string;
  role: string;
  ipAddress: string | null;
  success: boolean;
  details: string | null;
  timestamp: string;
}

@Component({
  selector: 'app-admin-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-safs-dark text-white shadow-lg">
        <div class="container mx-auto px-4 py-6">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <a routerLink="/admin" class="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Back to Dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </a>
              <div>
                <h1 class="text-2xl font-bold">Audit Logs</h1>
                <p class="text-sm text-gray-400">Authentication & Compliance Trail</p>
              </div>
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
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Events</p>
                <p class="text-2xl font-black text-safs-dark">{{ totalCount() }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-bold">Logins</p>
                <p class="text-2xl font-black text-green-600">{{ loginCount() }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-bold">Logouts</p>
                <p class="text-2xl font-black text-blue-500">{{ logoutCount() }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-bold">Failed</p>
                <p class="text-2xl font-black text-red-600">{{ failedCount() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Filters</h2>
          </div>
          <div class="px-6 py-4">
            <div class="flex flex-col md:flex-row gap-4 mb-4">
              <!-- Email search -->
              <div class="flex-1">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    [(ngModel)]="emailFilter"
                    (ngModelChange)="resetAndLoad()"
                    placeholder="Search by email address..."
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm">
                </div>
              </div>
              <!-- Role filter -->
              <div class="w-full md:w-44">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                <select
                  [(ngModel)]="roleFilter"
                  (ngModelChange)="resetAndLoad()"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm">
                  <option value="">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <!-- Date from -->
              <div class="w-full md:w-44">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">From Date</label>
                <input
                  type="date"
                  [(ngModel)]="dateFrom"
                  (ngModelChange)="resetAndLoad()"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm">
              </div>
              <!-- Date to -->
              <div class="w-full md:w-44">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">To Date</label>
                <input
                  type="date"
                  [(ngModel)]="dateTo"
                  (ngModelChange)="resetAndLoad()"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm">
              </div>
            </div>

            <!-- Action filter tabs -->
            <div class="flex flex-wrap gap-2">
              <button 
                (click)="actionFilter.set(''); resetAndLoad()"
                [class.bg-safs-dark]="actionFilter() === ''"
                [class.text-white]="actionFilter() === ''"
                class="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-300 hover:bg-gray-50 transition-all">
                All Events
              </button>
              <button 
                (click)="actionFilter.set('login'); resetAndLoad()"
                [class.bg-green-600]="actionFilter() === 'login'"
                [class.text-white]="actionFilter() === 'login'"
                [class.border-green-600]="actionFilter() === 'login'"
                class="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-300 hover:bg-green-50 transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Logins
              </button>
              <button 
                (click)="actionFilter.set('logout'); resetAndLoad()"
                [class.bg-blue-500]="actionFilter() === 'logout'"
                [class.text-white]="actionFilter() === 'logout'"
                [class.border-blue-500]="actionFilter() === 'logout'"
                class="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-300 hover:bg-blue-50 transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                </svg>
                Logouts
              </button>
              <button 
                (click)="actionFilter.set('login_failed'); resetAndLoad()"
                [class.bg-red-600]="actionFilter() === 'login_failed'"
                [class.text-white]="actionFilter() === 'login_failed'"
                [class.border-red-600]="actionFilter() === 'login_failed'"
                class="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-300 hover:bg-red-50 transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Failed Attempts
              </button>
            </div>
          </div>
        </div>

        <!-- Log Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            @if (isLoading()) {
              <div class="px-6 py-16 text-center">
                <svg class="animate-spin h-10 w-10 text-safs-gold mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-sm text-gray-500 font-bold">Loading audit logs...</p>
              </div>
            } @else {
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Timestamp</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">IP Address</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  @for (log of auditLogs(); track log.id) {
                    <tr class="hover:bg-gray-50/50 transition-colors" [ngClass]="{'bg-red-50/30': !log.success}">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-safs-dark font-medium">{{ formatDate(log.timestamp) }}</div>
                        <div class="text-xs text-gray-400">{{ formatTime(log.timestamp) }}</div>
                      </td>
                      <td class="px-6 py-4">
                        @if (log.action === 'login' && log.success) {
                          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                            <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Login
                          </span>
                        } @else if (log.action === 'logout') {
                          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            Logout
                          </span>
                        } @else if (log.action === 'login_failed') {
                          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                            <span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            Failed Login
                          </span>
                        } @else {
                          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">
                            {{ log.action }}
                          </span>
                        }
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm font-bold text-safs-dark">{{ log.companyName || '—' }}</div>
                        <div class="text-xs text-gray-500">{{ log.email }}</div>
                      </td>
                      <td class="px-6 py-4">
                        @if (log.role === 'admin') {
                          <span class="px-2.5 py-1 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md uppercase tracking-wider">Admin</span>
                        } @else {
                          <span class="px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-md uppercase tracking-wider">Customer</span>
                        }
                      </td>
                      <td class="px-6 py-4">
                        <span class="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">{{ log.ipAddress || '—' }}</span>
                      </td>
                      <td class="px-6 py-4">
                        @if (log.success) {
                          <span class="text-green-600 text-xs font-bold">✓ Success</span>
                        } @else {
                          <span class="text-red-600 text-xs font-bold">✗ Failed</span>
                        }
                      </td>
                      <td class="px-6 py-4 text-xs text-gray-500 max-w-[200px] truncate" [title]="log.details || ''">{{ log.details || '—' }}</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="px-6 py-16 text-center text-gray-500">
                        <div class="flex flex-col items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-gray-300">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                          </svg>
                          <p class="font-bold text-lg">No audit logs found</p>
                          <p class="text-sm">Try adjusting your filters or wait for login activity</p>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>

          <!-- Pagination -->
          @if (totalCount() > pageSize()) {
            <div class="border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
              <div class="text-sm text-gray-600">
                Showing {{ ((currentPage() - 1) * pageSize()) + 1 }} to {{ Math.min(currentPage() * pageSize(), totalCount()) }} of <strong>{{ totalCount() }}</strong> records
              </div>
              <div class="flex items-center gap-2">
                <button 
                  (click)="goToPage(1)"
                  [disabled]="currentPage() <= 1"
                  class="px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  First
                </button>
                <button 
                  (click)="goToPage(currentPage() - 1)"
                  [disabled]="currentPage() <= 1"
                  class="px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  ← Prev
                </button>
                <span class="px-4 py-2 bg-safs-dark text-white text-xs font-bold rounded-lg">
                  {{ currentPage() }} / {{ totalPages() }}
                </span>
                <button 
                  (click)="goToPage(currentPage() + 1)"
                  [disabled]="currentPage() >= totalPages()"
                  class="px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Next →
                </button>
                <button 
                  (click)="goToPage(totalPages())"
                  [disabled]="currentPage() >= totalPages()"
                  class="px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Last
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Compliance Note -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <div>
              <p class="text-sm font-bold text-blue-800">Compliance Information</p>
              <p class="text-xs text-blue-700 mt-1">
                All authentication events (logins, logouts, and failed attempts) are automatically recorded with timestamps, IP addresses, and user details for compliance and security auditing purposes. 
                Records are stored indefinitely and cannot be modified or deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminAuditLogsComponent implements OnInit {
  authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  Math = Math;

  auditLogs = signal<AuditLog[]>([]);
  totalCount = signal(0);
  currentPage = signal(1);
  pageSize = signal(30);
  actionFilter = signal('');
  roleFilter = '';
  emailFilter = '';
  dateFrom = '';
  dateTo = '';
  isLoading = signal(false);

  // Summary counts
  loginCount = signal(0);
  logoutCount = signal(0);
  failedCount = signal(0);

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.loadAuditLogs();
    this.loadSummaryCounts();
  }

  totalPages() {
    return Math.ceil(this.totalCount() / this.pageSize());
  }

  resetAndLoad() {
    this.currentPage.set(1);
    this.loadAuditLogs();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadAuditLogs();
  }

  loadAuditLogs() {
    this.isLoading.set(true);
    const headers = this.authService.getAuthHeaders();

    let url = `/api/admin/auditlogs?page=${this.currentPage()}&pageSize=${this.pageSize()}`;

    const action = this.actionFilter();
    if (action) url += `&action=${action}`;
    if (this.emailFilter) url += `&email=${encodeURIComponent(this.emailFilter)}`;
    if (this.roleFilter) url += `&role=${this.roleFilter}`;
    if (this.dateFrom) url += `&from=${this.dateFrom}T00:00:00Z`;
    if (this.dateTo) url += `&to=${this.dateTo}T23:59:59Z`;

    this.http.get<{ logs: AuditLog[], totalCount: number }>(url, { headers })
      .subscribe({
        next: (response) => {
          this.auditLogs.set(response.logs);
          this.totalCount.set(response.totalCount);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load audit logs:', error);
          this.isLoading.set(false);
        }
      });
  }

  loadSummaryCounts() {
    const headers = this.authService.getAuthHeaders();

    // Fetch counts for each action type
    this.http.get<{ totalCount: number }>('/api/admin/auditlogs?action=login&pageSize=1', { headers })
      .subscribe({ next: (r) => this.loginCount.set(r.totalCount) });

    this.http.get<{ totalCount: number }>('/api/admin/auditlogs?action=logout&pageSize=1', { headers })
      .subscribe({ next: (r) => this.logoutCount.set(r.totalCount) });

    this.http.get<{ totalCount: number }>('/api/admin/auditlogs?action=login_failed&pageSize=1', { headers })
      .subscribe({ next: (r) => this.failedCount.set(r.totalCount) });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
