import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EnquiryService, EnquiryRecord } from '../services/enquiry.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold font-serif text-safs-dark">Enquiry Dashboard</h1>
          <p class="text-gray-500 text-sm mt-1">Manage customer enquiries</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">{{ enquiryService.enquiries().length }} total</span>
          <button (click)="logout()" class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200">
            Sign Out
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-safs-dark/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E2352" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-safs-dark">{{ newCount() }}</p>
              <p class="text-xs text-gray-500">New Enquiries</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-safs-dark">{{ contactedCount() }}</p>
              <p class="text-xs text-gray-500">Contacted</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-safs-dark">{{ closedCount() }}</p>
              <p class="text-xs text-gray-500">Closed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Enquiry List -->
      @if (enquiryService.enquiries().length === 0) {
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-4 opacity-50"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          <p class="text-lg">No enquiries yet.</p>
          <p class="text-sm mt-1">Enquiries will appear here once customers submit them.</p>
        </div>
      } @else {
        <div class="flex flex-col gap-4">
          @for (enquiry of enquiryService.enquiries(); track enquiry.id) {
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
              <!-- Enquiry Header -->
              <div class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <span [class]="getStatusBadgeClass(enquiry.status)">
                    {{ enquiry.status | uppercase }}
                  </span>
                  <div>
                    <h3 class="font-bold text-safs-dark">{{ enquiry.customer.name }}</h3>
                    <p class="text-xs text-gray-500">{{ formatDate(enquiry.date) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                  <select
                    [value]="enquiry.status"
                    (change)="changeStatus(enquiry.id, $event)"
                    class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-safs-gold"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button (click)="deleteEnquiry(enquiry.id)" class="text-xs px-3 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200">
                    Delete
                  </button>
                </div>
              </div>

              <!-- Customer Details -->
              <div class="px-5 py-4 bg-gray-50/50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm border-b border-gray-100">
                <div>
                  <span class="text-gray-500 text-xs uppercase tracking-wider">Email</span>
                  <p class="font-medium text-safs-dark">{{ enquiry.customer.email }}</p>
                </div>
                <div>
                  <span class="text-gray-500 text-xs uppercase tracking-wider">Phone</span>
                  <p class="font-medium text-safs-dark">{{ enquiry.customer.phone }}</p>
                </div>
                <div>
                  <span class="text-gray-500 text-xs uppercase tracking-wider">Items</span>
                  <p class="font-medium text-safs-dark">{{ enquiry.items.length }} product(s)</p>
                </div>
              </div>

              <!-- Items Table -->
              <div class="p-5">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-gray-500 text-xs uppercase tracking-wider">
                      <th class="pb-2">Product</th>
                      <th class="pb-2">Color / Variant</th>
                      <th class="pb-2 text-center">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of enquiry.items; track item.productName + item.variant) {
                      <tr class="border-t border-gray-100">
                        <td class="py-2 font-medium text-safs-dark">{{ item.productName }}</td>
                        <td class="py-2 text-gray-600">{{ item.variant }}</td>
                        <td class="py-2 text-center font-semibold">{{ item.quantity }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  enquiryService = inject(EnquiryService);
  private router = inject(Router);

  newCount = signal(0);
  contactedCount = signal(0);
  closedCount = signal(0);

  ngOnInit() {
    if (localStorage.getItem('safs_admin_auth') !== 'true') {
      this.router.navigate(['/admin']);
      return;
    }
    this.enquiryService.refresh();
    this.recalcCounts();
  }

  recalcCounts() {
    const all = this.enquiryService.enquiries();
    this.newCount.set(all.filter(e => e.status === 'new').length);
    this.contactedCount.set(all.filter(e => e.status === 'contacted').length);
    this.closedCount.set(all.filter(e => e.status === 'closed').length);
  }

  getStatusBadgeClass(status: string): string {
    const base = 'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full';
    switch (status) {
      case 'new': return `${base} bg-safs-dark/10 text-safs-dark`;
      case 'contacted': return `${base} bg-amber-100 text-amber-700`;
      case 'closed': return `${base} bg-green-100 text-green-700`;
      default: return `${base} bg-gray-100 text-gray-700`;
    }
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('en-ZA', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  changeStatus(id: string, event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'new' | 'contacted' | 'closed';
    this.enquiryService.updateStatus(id, value);
    this.recalcCounts();
  }

  deleteEnquiry(id: string) {
    this.enquiryService.deleteEnquiry(id);
    this.recalcCounts();
  }

  logout() {
    localStorage.removeItem('safs_admin_auth');
    this.router.navigate(['/admin']);
  }
}
