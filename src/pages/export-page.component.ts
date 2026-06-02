import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-export-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-safs-dark via-[#252B5A] to-safs-dark">
      <div class="absolute inset-0">
        <div class="absolute w-[500px] h-[500px] rounded-full bg-safs-gold/10 blur-[120px] -top-32 -left-32"></div>
        <div class="absolute w-[400px] h-[400px] rounded-full bg-safs-gold/5 blur-[100px] -bottom-20 right-10"></div>
      </div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
        <div class="max-w-3xl">
          <span class="inline-block text-safs-gold font-bold text-sm tracking-[0.2em] uppercase mb-6">Admin Tools</span>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Data Export<br>
            <span class="text-safs-gold">& Reporting</span>
          </h1>
          <p class="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
            Export comprehensive reports on orders, enquiries, audit logs, and more for analysis and record-keeping.
          </p>
        </div>
      </div>
    </section>

    <!-- Export Section -->
    <section class="py-20 sm:py-28 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        
        <!-- Status Messages -->
        @if (successMessage) {
          <div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-3">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div>
              <p class="font-bold">{{ successMessage }}</p>
            </div>
          </div>
        }

        @if (errorMessage) {
          <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <div>
              <p class="font-bold">{{ errorMessage }}</p>
            </div>
          </div>
        }

        <!-- Export Grid -->
        <div class="grid md:grid-cols-2 gap-8">
          @for (exportOption of exportOptions; track exportOption.id) {
            <div class="border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
              <h3 class="text-2xl font-bold text-safs-dark mb-3">{{ exportOption.title }}</h3>
              <p class="text-gray-600 mb-6 h-12">{{ exportOption.description }}</p>
              
              <div class="space-y-4 mb-8">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Date Range Optional
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <input 
                      type="date" 
                      [(ngModel)]="filters[exportOption.id].fromDate"
                      class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-safs-gold focus:border-transparent"
                      placeholder="From"
                    />
                    <input 
                      type="date" 
                      [(ngModel)]="filters[exportOption.id].toDate"
                      class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-safs-gold focus:border-transparent"
                      placeholder="To"
                    />
                  </div>
                </div>

                @if (exportOption.id === 'audit-logs') {
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by Action
                    </label>
                    <select 
                      [(ngModel)]="filters[exportOption.id].action"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-safs-gold focus:border-transparent"
                    >
                      <option value="">All Actions</option>
                      <option value="created">Created</option>
                      <option value="updated">Updated</option>
                      <option value="deleted">Deleted</option>
                      <option value="login">Login</option>
                      <option value="logout">Logout</option>
                    </select>
                  </div>
                }

                @if (exportOption.id === 'orders') {
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by Status
                    </label>
                    <select 
                      [(ngModel)]="filters[exportOption.id].status"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-safs-gold focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                }

                @if (exportOption.id === 'enquiries') {
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by Status
                    </label>
                    <select 
                      [(ngModel)]="filters[exportOption.id].status"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-safs-gold focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                }
              </div>

              <button
                (click)="exportData(exportOption.id)"
                [disabled]="isLoading"
                class="w-full bg-safs-gold text-black font-bold px-6 py-3 rounded-xl hover:bg-safs-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                @if (isLoading && currentExport === exportOption.id) {
                  <svg class="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                }
                @if (isLoading && currentExport === exportOption.id) {
                  Exporting...
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export to CSV
                }
              </button>
            </div>
          }
        </div>

        <!-- Info Box -->
        <div class="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-200">
          <h4 class="font-bold text-blue-900 mb-2">ℹ️ Export Information</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• All exports are in CSV format for easy analysis in spreadsheets</li>
            <li>• Leave date fields empty to export all records</li>
            <li>• Sensitive information (passwords, tokens) is never included</li>
            <li>• Files are generated on demand and downloaded directly to your computer</li>
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ExportPageComponent implements OnInit {
  isLoading = false;
  currentExport: string | null = null;
  successMessage = '';
  errorMessage = '';

  exportOptions = [
    {
      id: 'products',
      title: 'Products',
      description: 'Export all products with details, pricing, and inventory status.'
    },
    {
      id: 'orders',
      title: 'Orders',
      description: 'Export customer orders with contact details and order totals.'
    },
    {
      id: 'enquiries',
      title: 'Enquiries',
      description: 'Export customer enquiries with contact information and notes.'
    },
    {
      id: 'users',
      title: 'Users',
      description: 'Export user accounts with roles and activity status.'
    },
    {
      id: 'audit-logs',
      title: 'Audit Logs',
      description: 'Export detailed audit trail of all system actions and changes.'
    },
    {
      id: 'cms-pages',
      title: 'CMS Pages',
      description: 'Export all CMS pages with content and publish status.'
    }
  ];

  filters: Record<string, any> = {};

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.exportOptions.forEach(option => {
      this.filters[option.id] = {
        fromDate: '',
        toDate: '',
        status: '',
        action: ''
      };
    });
  }

  ngOnInit() {
    // Check authentication
    if (!this.auth.isAdmin()) {
      this.errorMessage = 'You do not have permission to access this page.';
    }
  }

  exportData(type: string) {
    this.isLoading = true;
    this.currentExport = type;
    this.successMessage = '';
    this.errorMessage = '';

    const filter = this.filters[type];
    const params: any = {};

    if (filter.fromDate) params.from = filter.fromDate;
    if (filter.toDate) params.to = filter.toDate;
    if (filter.status) params.status = filter.status;
    if (filter.action) params.action = filter.action;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.errorMessage = 'Authentication token not found. Please log in again.';
      this.isLoading = false;
      return;
    }

    // Build query string
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${this.getBaseUrl()}/api/${type}?${queryString}`
      : `${this.getBaseUrl()}/api/${type}`;

    this.http.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).subscribe({
      next: (data: any) => {
        this.convertToCSVAndDownload(data, type);
        this.successMessage = `✓ ${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`;
        this.isLoading = false;
        this.currentExport = null;
      },
      error: (error) => {
        console.error('Export error:', error);
        this.errorMessage = `Failed to export ${type}. Please try again.`;
        this.isLoading = false;
        this.currentExport = null;
      }
    });
  }

  convertToCSVAndDownload(data: any, type: string) {
    let csv = '';
    const records = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

    if (records.length === 0) {
      this.errorMessage = 'No records found to export.';
      return;
    }

    // Get all unique keys
    const headers = new Set<string>();
    records.forEach((record: any) => {
      Object.keys(record).forEach(key => headers.add(key));
    });

    const headerArray = Array.from(headers);
    csv = headerArray.join(',') + '\n';

    // Add rows
    records.forEach((record: any) => {
      const row = headerArray.map(header => {
        const value = record[header];
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value || '');
        // Escape quotes and wrap in quotes if contains comma
        return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
      });
      csv += row.join(',') + '\n';
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getBaseUrl(): string {
    return window.location.origin;
  }
}
