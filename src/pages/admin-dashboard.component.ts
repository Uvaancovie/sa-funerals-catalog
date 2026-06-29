import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EnquiryService, EnquiryRecord } from '../services/enquiry.service';
import { OrdersService, Order } from '../services/orders.service';
import { ProductsService, Product } from '../services/products.service';
import { CmsService, CmsPage } from '../services/cms.service';
import { BannerService, Banner } from '../services/banner.service';
import { AuditLogService, AuditLog, AuditLogSummary } from '../services/audit-log.service';
import { UserService, User } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ExportEnquiryService, ExportEnquiryRecord } from '../services/export-enquiry.service';
import { CacheService } from '../services/cache.service';
import { environment } from '../environments/environment';
import { ProductInventoryTableComponent } from '../components/product-inventory-table.component';

type TabId = 'stats' | 'enquiries' | 'export-enquiries' | 'orders' | 'products' | 'users' | 'cms' | 'banners' | 'audit';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductInventoryTableComponent],
  template: `
    <div class="min-h-screen glass-bg text-slate-900 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="glass-orb glass-orb--one"></div>
        <div class="glass-orb glass-orb--two"></div>
        <div class="glass-orb glass-orb--three"></div>
      </div>

      <div class="relative z-10">
        <!-- Header -->
        <div class="glass-panel px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold font-serif text-safs-dark">Admin Dashboard</h1>
            <p class="text-safs-dark/60 text-xs">{{ activeTabLabel() }}</p>
          </div>
          <button (click)="logout()" class="text-xs px-3 py-1.5 rounded-lg bg-safs-dark/10 text-safs-dark hover:bg-safs-dark/20 transition-colors">Sign Out</button>
        </div>

        <!-- Tab Navigation -->
        <div class="glass-panel mt-4 mx-4 px-2 sm:px-4 overflow-x-auto">
          <div class="flex gap-1 min-w-max py-2">
            <button *ngFor="let tab of tabs" (click)="activeTab.set(tab.id)" [class]="getTabClass(tab.id)">
              <span [innerHTML]="tab.icon" class="text-[10px]"></span>
              <span class="hidden sm:inline">{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <!-- Loading indicator -->
        @if (tabLoading()) {
          <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
            <div class="flex items-center gap-2 text-xs text-safs-text-muted/60">
              <span class="inline-block w-3 h-3 rounded-full border-2 border-safs-accent border-t-transparent animate-spin"></span>
              Loading {{ getTabLabel(tabLoading()) }}...
            </div>
          </div>
        }

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        <!-- ===== DASHBOARD STATS ===== -->
        @if (activeTab() === 'stats') {
          <div class="tab-content">
            @if (tabLoading() === 'stats') {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                @for (i of [1,2,3,4]; track i) {
                  <div class="stat-card"><div class="skeleton-line" style="width:40%"></div><div class="skeleton-line" style="width:60%"></div></div>
                }
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="stat-card">
                  <p class="stat-card-value">{{ enquiryService.enquiries().length }}</p>
                  <p class="stat-card-label">Total Enquiries</p>
                </div>
                <div class="stat-card">
                  <p class="stat-card-value">{{ ordersService.orders().length }}</p>
                  <p class="stat-card-label">Total Orders</p>
                </div>
                <div class="stat-card">
                  <p class="stat-card-value">{{ productsService.products().length }}</p>
                  <p class="stat-card-label">Products</p>
                </div>
                <div class="stat-card">
                  <p class="stat-card-value">{{ userService.users().length }}</p>
                  <p class="stat-card-label">Users</p>
                </div>
              </div>

              @if (auditSummary(); as summary) {
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div class="stat-card">
                    <p class="stat-card-value">{{ summary.total_logins }}</p>
                    <p class="stat-card-label">Total Logins</p>
                  </div>
                  <div class="stat-card">
                    <p class="stat-card-value" style="color:#DC2626">{{ summary.failed_logins }}</p>
                    <p class="stat-card-label">Failed Logins</p>
                  </div>
                  <div class="stat-card">
                    <p class="stat-card-value">{{ summary.today_actions }}</p>
                    <p class="stat-card-label">Today's Actions</p>
                  </div>
                </div>
              }

              <div class="glass-panel p-6" style="border-radius:1.25rem">
                <h3 class="font-bold text-safs-dark mb-4">Recent Activity</h3>
                @if (auditLogService.summary()?.recent_actions; as recent) {
                  <div class="space-y-1">
                    @for (log of recent; track log.id) {
                      <div class="flex items-center gap-3 text-sm py-2 border-b border-white/20 last:border-0">
                        <span [class]="getActionBadge(log.action)">{{ log.action }}</span>
                        <span class="text-safs-text-main">{{ log.description }}</span>
                        <span class="text-safs-text-muted ml-auto text-xs">{{ formatDate(log.created_at) }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- ===== ENQUIRIES ===== -->
        @if (activeTab() === 'enquiries') {
          <div class="tab-content">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">Enquiries ({{ enquiryService.enquiries().length }})</h2>
              <div class="flex gap-2">
                <select (change)="enquiryFilter.set($any($event.target).value)" class="form-select" style="width:auto">
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            @if (tabLoading() === 'enquiries') {
              <div class="flex flex-col gap-4">
                @for (i of [1,2,3]; track i) {
                  <div class="data-card p-5"><div class="skeleton-line" style="width:50%"></div><div class="skeleton-line" style="width:80%"></div><div class="skeleton-line" style="width:30%"></div></div>
                }
              </div>
            } @else if (filteredEnquiries().length === 0) {
              <div class="empty-state">
                <div class="empty-state-icon">&#9993;</div>
                <p class="empty-state-title">No enquiries found</p>
                <p class="empty-state-desc">Enquiries from customers will appear here once submitted.</p>
              </div>
            } @else {
              <div class="flex flex-col gap-3">
                @for (enquiry of filteredEnquiries(); track enquiry.id) {
                  <div class="data-card">
                    <div class="data-card-header">
                      <div class="flex items-center gap-3">
                        <span [class]="'status-badge ' + 'status-badge--' + enquiry.status">{{ enquiry.status }}</span>
                        <div>
                          <h3 class="font-bold text-safs-dark text-sm">{{ enquiry.customer_name }}</h3>
                          <p class="text-xs text-safs-text-muted">{{ formatDate(enquiry.created_at) }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <select [value]="enquiry.status" (change)="updateEnquiryStatus(enquiry.id, $any($event.target).value)" class="form-select" style="width:auto;padding:0.375rem 0.625rem">
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button (click)="deleteEnquiry(enquiry.id)" class="btn-ghost">Delete</button>
                      </div>
                    </div>
                    <div class="data-card-body">
                      <div><span class="data-card-field-label">Email</span><p class="font-medium text-safs-text-main">{{ enquiry.customer_email }}</p></div>
                      <div><span class="data-card-field-label">Phone</span><p class="font-medium text-safs-text-main">{{ enquiry.customer_phone }}</p></div>
                      <div class="col-span-full">
                        <span class="data-card-field-label">Items</span>
                        <div class="mt-2 space-y-1">
                          @for (item of enquiry.items; track $index) {
                            <div class="flex items-center gap-2 bg-white/40 rounded-lg px-3 py-1.5 text-sm">
                              <span class="font-medium text-safs-dark flex-1">{{ item.name }}</span>
                              <span class="text-xs text-safs-text-muted">Qty: {{ item.quantity }}</span>
                              @if (item.price) {
                                <span class="font-semibold text-safs-dark">R{{ item.price.toFixed(2) }}</span>
                              }
                            </div>
                          }
                        </div>
                        @if (enquiry.notes) {
                          <div class="mt-2">
                            <span class="data-card-field-label">Message</span>
                            <p class="text-sm text-safs-text-main mt-1 bg-white/30 rounded-lg px-3 py-2">{{ enquiry.notes }}</p>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- ===== EXPORT ENQUIRIES ===== -->
        @if (activeTab() === 'export-enquiries') {
          <div class="tab-content">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">Export Enquiries ({{ exportEnquiryService.enquiries().length }})</h2>
              <div class="flex gap-2">
                <select (change)="exportEnquiryFilter.set($any($event.target).value)" class="form-select" style="width:auto">
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            @if (tabLoading() === 'export-enquiries') {
              <div class="flex flex-col gap-4">
                @for (i of [1,2,3]; track i) {
                  <div class="data-card p-5"><div class="skeleton-line" style="width:50%"></div><div class="skeleton-line" style="width:80%"></div><div class="skeleton-line" style="width:30%"></div></div>
                }
              </div>
            } @else if (filteredExportEnquiries().length === 0) {
              <div class="empty-state">
                <div class="empty-state-icon">&#10144;</div>
                <p class="empty-state-title">No export enquiries found</p>
                <p class="empty-state-desc">Export enquiries submitted through the public form will appear here.</p>
              </div>
            } @else {
              <div class="flex flex-col gap-3">
                @for (enquiry of filteredExportEnquiries(); track enquiry.id) {
                  <div class="data-card">
                    <div class="data-card-header">
                      <div class="flex items-center gap-3">
                        <span [class]="'status-badge ' + 'status-badge--' + enquiry.status">{{ enquiry.status }}</span>
                        <div>
                          <h3 class="font-bold text-safs-dark text-sm">{{ enquiry.name }}</h3>
                          <p class="text-xs text-safs-text-muted">{{ formatDate(enquiry.created_at) }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <select [value]="enquiry.status" (change)="updateExportEnquiryStatus(enquiry.id, $any($event.target).value)" class="form-select" style="width:auto;padding:0.375rem 0.625rem">
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button (click)="deleteExportEnquiry(enquiry.id)" class="btn-ghost">Delete</button>
                      </div>
                    </div>
                    <div class="data-card-body">
                      <div><span class="data-card-field-label">Email</span><p class="font-medium text-safs-text-main">{{ enquiry.email }}</p></div>
                      <div><span class="data-card-field-label">Phone</span><p class="font-medium text-safs-text-main">{{ enquiry.phone }}</p></div>
                      <div><span class="data-card-field-label">Country</span><p class="font-medium text-safs-text-main">{{ enquiry.country || 'N/A' }}</p></div>
                    </div>
                    @if (enquiry.company_details) {
                      <div class="data-card-section">
                        <span class="data-card-field-label">Company</span>
                        <p class="text-sm font-medium text-safs-text-main">{{ enquiry.company_details }}</p>
                      </div>
                    }
                    @if (enquiry.message) {
                      <div class="data-card-section">
                        <span class="data-card-field-label">Message</span>
                        <p class="text-sm text-safs-text-main">{{ enquiry.message }}</p>
                      </div>
                    }
                    @if (enquiry.registration_document) {
                      <div class="data-card-section">
                        <a [href]="getStorageUrl(enquiry.registration_document)" target="_blank" class="text-sm font-bold text-safs-accent hover:underline">View Registration Document</a>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- ===== ORDERS ===== -->
        @if (activeTab() === 'orders') {
          <div class="tab-content">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">Orders ({{ ordersService.orders().length }})</h2>
              <div class="flex gap-2">
                <select (change)="orderFilter.set($any($event.target).value)" class="form-select" style="width:auto">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            @if (tabLoading() === 'orders') {
              <div class="flex flex-col gap-4">
                @for (i of [1,2,3]; track i) {
                  <div class="data-card p-5"><div class="skeleton-line" style="width:50%"></div><div class="skeleton-line" style="width:80%"></div><div class="skeleton-line" style="width:30%"></div></div>
                }
              </div>
            } @else if (filteredOrders().length === 0) {
              <div class="empty-state">
                <div class="empty-state-icon">&#9776;</div>
                <p class="empty-state-title">No orders found</p>
                <p class="empty-state-desc">Customer orders will appear here once placed.</p>
              </div>
            } @else {
              <div class="flex flex-col gap-3">
                @for (order of filteredOrders(); track order.id) {
                  <div class="data-card">
                    <div class="data-card-header">
                      <div class="flex items-center gap-3">
                        <span [class]="'status-badge ' + 'status-badge--' + order.status">{{ order.status }}</span>
                        <div>
                          <h3 class="font-bold text-safs-dark text-sm">{{ order.customer_name }}</h3>
                          <p class="text-xs text-safs-text-muted">#{{ order.id }} — {{ formatDate(order.created_at) }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-safs-dark">R{{ order.total }}</span>
                        <select [value]="order.status" (change)="updateOrderStatus(order.id, $any($event.target).value)" class="form-select" style="width:auto;padding:0.375rem 0.625rem">
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button (click)="deleteOrder(order.id)" class="btn-ghost">Delete</button>
                      </div>
                    </div>
                    <div class="data-card-body">
                      <div><span class="data-card-field-label">Email</span><p class="font-medium text-safs-text-main">{{ order.customer_email }}</p></div>
                      <div><span class="data-card-field-label">Phone</span><p class="font-medium text-safs-text-main">{{ order.customer_phone }}</p></div>
                      <div class="col-span-full">
                        <span class="data-card-field-label">Items</span>
                        <div class="mt-2 space-y-2">
                          @for (item of order.items; track $index) {
                            <div class="flex items-center gap-3 bg-white/40 rounded-lg px-3 py-2 text-sm">
                              <span class="status-badge status-badge--new" style="font-size:0.625rem;padding:0.0625rem 0.5rem">{{ item.category || 'General' }}</span>
                              <span class="font-medium text-safs-dark flex-1">{{ item.productName || item.name }}</span>
                              @if (item.variant) {
                                <span class="text-xs text-safs-text-muted">Color: {{ item.variant }}</span>
                              }
                              <span class="text-xs text-safs-text-muted">Qty: {{ item.quantity }}</span>
                              @if (item.price) {
                                <span class="font-semibold text-safs-dark">R{{ (item.price * item.quantity).toFixed(2) }}</span>
                              }
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- ===== PRODUCTS (CMS) ===== -->
        @if (activeTab() === 'products') {
          <div class="tab-content">
            @if (productFormOpen()) {
              <div class="glass-panel p-6 mb-6" style="border-radius:1.25rem">
                <h3 class="font-bold text-safs-dark mb-4">{{ editingProduct() ? 'Edit Product' : 'New Product' }}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label class="data-card-field-label mb-1">Name</label><input [(ngModel)]="productForm.name" class="form-input"></div>
                  <div><label class="data-card-field-label mb-1">Slug</label><input [(ngModel)]="productForm.slug" class="form-input"></div>
                  <div><label class="data-card-field-label mb-1">Category</label><input [(ngModel)]="productForm.category" class="form-input"></div>
                  <div><label class="data-card-field-label mb-1">Price</label><input type="number" [(ngModel)]="productForm.price" class="form-input"></div>
                  <div><label class="data-card-field-label mb-1">Images (JSON array)</label><input [(ngModel)]="productForm.images" class="form-input"></div>
                  <div class="flex items-center gap-4">
                    <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" [(ngModel)]="productForm.in_stock"> In Stock</label>
                    <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" [(ngModel)]="productForm.featured"> Featured</label>
                    <label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" [(ngModel)]="productForm.price_on_request"> Price on Request</label>
                  </div>
                </div>
                <div class="mt-4">
                  <label class="data-card-field-label mb-1">Description</label>
                  <textarea [(ngModel)]="productForm.description" rows="3" class="form-input"></textarea>
                </div>
                <div class="flex gap-2 mt-4">
                  <button (click)="saveProduct()" class="btn-primary">Save</button>
                  <button (click)="productFormOpen.set(false)" class="px-4 py-2 rounded-xl text-sm font-medium bg-white/60 text-safs-text-muted hover:bg-white/80 transition-colors border border-white/40">Cancel</button>
                </div>
              </div>
            }

            <app-product-inventory-table
              [categories]="productsService.categories()"
              [loading]="productsService.loading()"
              [totalProducts]="productsService.totalProducts()"
              [currentPage]="productsService.currentPage()"
              [totalPages]="productsService.totalPages()"
              [refreshTrigger]="productRefreshKey()"
              (openForm)="openProductForm()"
              (editProduct)="editProduct($event)"
              (deleteProduct)="deleteProduct($event)"
            />
          </div>
        }

        <!-- ===== USERS ===== -->
        @if (activeTab() === 'users') {
          <div class="tab-content">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">Users ({{ userService.users().length }})</h2>
              <button (click)="openUserForm()" class="btn-primary">+ Add User</button>
            </div>

            @if (tabLoading() === 'users') {
              <div class="glass-panel overflow-hidden" style="border-radius:1rem">
                <div class="p-4 space-y-3">
                  @for (i of [1,2,3,4,5]; track i) {
                    <div class="flex items-center gap-4"><div class="skeleton" style="width:2rem;height:2rem;border-radius:9999px"></div><div style="flex:1"><div class="skeleton-line" style="width:40%"></div><div class="skeleton-line" style="width:60%"></div></div></div>
                  }
                </div>
              </div>
            } @else {
              @if (userFormOpen()) {
                <div class="glass-panel p-6 mb-6" style="border-radius:1.25rem">
                  <h3 class="font-bold text-safs-dark mb-4">{{ editingUser() ? 'Edit User' : 'New User' }}</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="data-card-field-label mb-1">Name</label><input [(ngModel)]="userForm.name" class="form-input"></div>
                    <div><label class="data-card-field-label mb-1">Email</label><input type="email" [(ngModel)]="userForm.email" class="form-input"></div>
                    <div><label class="data-card-field-label mb-1">Password{{ editingUser() ? ' (leave blank to keep)' : '' }}</label><input type="password" [(ngModel)]="userForm.password" class="form-input"></div>
                    <div><label class="data-card-field-label mb-1">Role</label>
                      <select [(ngModel)]="userForm.role" class="form-select">
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div><label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" [(ngModel)]="userForm.is_active"> Active</label></div>
                  </div>
                  <div class="flex gap-2 mt-4">
                    <button (click)="saveUser()" class="btn-primary">Save</button>
                    <button (click)="userFormOpen.set(false)" class="px-4 py-2 rounded-xl text-sm font-medium bg-white/60 text-safs-text-muted hover:bg-white/80 transition-colors border border-white/40">Cancel</button>
                  </div>
                </div>
              }

              <div class="glass-panel overflow-hidden" style="border-radius:1rem">
                <table class="data-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    @for (user of userService.users(); track user.id) {
                      <tr>
                        <td class="font-medium text-safs-dark">{{ user.name }}</td>
                        <td class="text-safs-text-muted">{{ user.email }}</td>
                        <td>
                          <span [class]="user.role === 'admin' ? 'status-badge status-badge--new' : 'status-badge'"
                                [style]="user.role === 'admin' ? '' : 'background:rgba(100,116,139,0.08);color:#475569;border-color:rgba(100,116,139,0.12)'">{{ user.role }}</span>
                        </td>
                        <td>
                          <span class="text-xs font-medium" [style.color]="user.is_active ? '#15803D' : '#DC2626'">{{ user.is_active ? 'Active' : 'Inactive' }}</span>
                        </td>
                        <td>
                          <button (click)="editUser(user)" class="btn-outline mr-1">Edit</button>
                          <button (click)="deleteUser(user.id)" class="btn-ghost">Delete</button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
                @if (userService.users().length === 0) {
                  <div class="empty-state">
                    <div class="empty-state-icon">&#9787;</div>
                    <p class="empty-state-title">No users found</p>
                    <p class="empty-state-desc">Add your first user to get started.</p>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- ===== CMS PAGES ===== -->
        @if (activeTab() === 'cms') {
          <div class="tab-content">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">CMS Pages ({{ cmsService.pages().length }})</h2>
              <button (click)="openCmsForm()" class="btn-primary">+ Add Page</button>
            </div>

            @if (tabLoading() === 'cms') {
              <div class="glass-panel overflow-hidden" style="border-radius:1rem">
                <div class="p-4 space-y-3">
                  @for (i of [1,2,3,4]; track i) {
                    <div class="flex items-center gap-4"><div style="flex:1"><div class="skeleton-line" style="width:40%"></div><div class="skeleton-line" style="width:25%"></div></div></div>
                  }
                </div>
              </div>
            } @else {
              @if (cmsFormOpen()) {
                <div class="glass-panel p-6 mb-6" style="border-radius:1.25rem">
                  <h3 class="font-bold text-safs-dark mb-4">{{ editingCmsPage() ? 'Edit Page' : 'New Page' }}</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="data-card-field-label mb-1">Title</label><input [(ngModel)]="cmsForm.title" class="form-input"></div>
                    <div><label class="data-card-field-label mb-1">Slug</label><input [(ngModel)]="cmsForm.slug" class="form-input"></div>
                    <div><label class="data-card-field-label mb-1">Meta Title</label><input [(ngModel)]="cmsForm.meta_title" class="form-input"></div>
                    <div><label class="data-card-field-label mb-1">Meta Description</label><input [(ngModel)]="cmsForm.meta_description" class="form-input"></div>
                    <div><label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" [(ngModel)]="cmsForm.published"> Published</label></div>
                  </div>
                  <div class="mt-4">
                    <label class="data-card-field-label mb-1">Content</label>
                    <textarea [(ngModel)]="cmsForm.content" rows="6" class="form-input font-mono"></textarea>
                  </div>
                  <div class="flex gap-2 mt-4">
                    <button (click)="saveCmsPage()" class="btn-primary">Save</button>
                    <button (click)="cmsFormOpen.set(false)" class="px-4 py-2 rounded-xl text-sm font-medium bg-white/60 text-safs-text-muted hover:bg-white/80 transition-colors border border-white/40">Cancel</button>
                  </div>
                </div>
              }

              <div class="glass-panel overflow-hidden" style="border-radius:1rem">
                <table class="data-table">
                  <thead>
                    <tr><th>Title</th><th>Slug</th><th>Status</th><th>Updated</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    @for (page of cmsService.pages(); track page.id) {
                      <tr>
                        <td class="font-medium text-safs-dark">{{ page.title }}</td>
                        <td class="text-safs-text-muted text-xs">{{ page.slug }}</td>
                        <td>
                          <span [class]="page.published ? 'status-badge' : 'status-badge'"
                                [style]="page.published ? 'background:rgba(22,163,74,0.1);color:#15803D;border-color:rgba(22,163,74,0.15);font-size:0.625rem;padding:0.0625rem 0.5rem' : 'background:rgba(100,116,139,0.08);color:#475569;border-color:rgba(100,116,139,0.12);font-size:0.625rem;padding:0.0625rem 0.5rem'">{{ page.published ? 'Published' : 'Draft' }}</span>
                        </td>
                        <td class="text-xs text-safs-text-muted">{{ formatDate(page.updated_at) }}</td>
                        <td>
                          <button (click)="editCmsPage(page)" class="btn-outline mr-1">Edit</button>
                          <button (click)="deleteCmsPage(page.id)" class="btn-ghost">Delete</button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
                @if (cmsService.pages().length === 0) {
                  <div class="empty-state">
                    <div class="empty-state-icon">&#9998;</div>
                    <p class="empty-state-title">No pages found</p>
                    <p class="empty-state-desc">Create your first CMS page to populate your site.</p>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- ===== BANNERS ===== -->
        @if (activeTab() === 'banners') {
          <div class="tab-content">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">Banners ({{ bannerService.banners().length }})</h2>
              <button (click)="openBannerForm()" class="btn-primary">+ Add Banner</button>
            </div>

            @if (tabLoading() === 'banners') {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (i of [1,2,3]; track i) {
                  <div class="data-card p-4"><div class="skeleton-block mb-3"></div><div class="skeleton-line" style="width:50%"></div><div class="skeleton-line" style="width:30%"></div></div>
                }
              </div>
            } @else {
              @if (bannerFormOpen()) {
                <div class="glass-panel p-6 mb-6" style="border-radius:1.25rem">
                  <h3 class="font-bold text-safs-dark mb-4">{{ editingBanner() ? 'Edit Banner' : 'New Banner' }}</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="data-card-field-label mb-1">Title</label><input [(ngModel)]="bannerForm.title" class="form-input"></div>
                    <div><label class="data-card-field-label mb-1">Subtitle</label><input [(ngModel)]="bannerForm.subtitle" class="form-input"></div>
                    <div><label class="data-card-field-label mb-1">Image URL</label><input [(ngModel)]="bannerForm.image_url" class="form-input"></div>
                    <div><label class="data-card-field-label mb-1">Link URL</label><input [(ngModel)]="bannerForm.link_url" class="form-input"></div>
                    <div><label class="data-card-field-label mb-1">Sort Order</label><input type="number" [(ngModel)]="bannerForm.sort_order" class="form-input"></div>
                    <div><label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" [(ngModel)]="bannerForm.active"> Active</label></div>
                  </div>
                  <div class="flex gap-2 mt-4">
                    <button (click)="saveBanner()" class="btn-primary">Save</button>
                    <button (click)="bannerFormOpen.set(false)" class="px-4 py-2 rounded-xl text-sm font-medium bg-white/60 text-safs-text-muted hover:bg-white/80 transition-colors border border-white/40">Cancel</button>
                  </div>
                </div>
              }

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (banner of bannerService.banners(); track banner.id) {
                  <div class="data-card">
                    <div class="h-32 bg-gradient-to-br from-white/50 to-white/5 flex items-center justify-center text-xs text-safs-text-muted overflow-hidden">
                      @if (banner.image_url) {
                        <span class="px-2 text-center opacity-60">{{ banner.image_url.length > 50 ? banner.image_url.substring(0, 50) + '...' : banner.image_url }}</span>
                      } @else { <span class="opacity-40">No Image</span> }
                    </div>
                    <div class="p-4">
                      <div class="flex items-center justify-between mb-1">
                        <h3 class="font-bold text-safs-dark text-sm">{{ banner.title }}</h3>
                        <span class="text-xs font-medium" [style.color]="banner.active ? '#15803D' : '#94A3B8'">{{ banner.active ? 'Active' : 'Inactive' }}</span>
                      </div>
                      @if (banner.subtitle) { <p class="text-xs text-safs-text-muted">{{ banner.subtitle }}</p> }
                      <p class="text-xs text-safs-text-muted mt-1 opacity-60">Order: {{ banner.sort_order }}</p>
                      <div class="flex gap-2 mt-3 pt-3 border-t border-white/30">
                        <button (click)="editBanner(banner)" class="btn-outline">Edit</button>
                        <button (click)="deleteBanner(banner.id)" class="btn-ghost">Delete</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- ===== AUDIT LOGS ===== -->
        @if (activeTab() === 'audit') {
          <div class="tab-content">
            <h2 class="text-lg font-bold text-safs-dark mb-4">Audit Logs</h2>

            @if (tabLoading() === 'audit') {
              <div class="glass-panel overflow-hidden" style="border-radius:1rem">
                <div class="p-4 space-y-3">
                  @for (i of [1,2,3,4,5]; track i) {
                    <div style="flex:1"><div class="skeleton-line" style="width:100%"></div><div class="skeleton-line" style="width:60%"></div></div>
                  }
                </div>
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div class="glass-card-inner p-3" style="border-radius:0.75rem">
                  <input [(ngModel)]="auditFilters.search" (input)="loadAuditLogs()" placeholder="Search..." class="form-input" style="font-size:0.75rem">
                </div>
                <div class="glass-card-inner p-3" style="border-radius:0.75rem">
                  <select [(ngModel)]="auditFilters.action" (change)="loadAuditLogs()" class="form-select" style="font-size:0.75rem">
                    <option value="">All Actions</option>
                    <option value="login">Login</option>
                    <option value="login_failed">Failed Login</option>
                    <option value="logout">Logout</option>
                    <option value="created">Created</option>
                    <option value="updated">Updated</option>
                    <option value="deleted">Deleted</option>
                  </select>
                </div>
                <div class="glass-card-inner p-3" style="border-radius:0.75rem">
                  <select [(ngModel)]="auditFilters.resource_type" (change)="loadAuditLogs()" class="form-select" style="font-size:0.75rem">
                    <option value="">All Resources</option>
                    <option value="auth">Auth</option>
                    <option value="enquiry">Enquiry</option>
                    <option value="order">Order</option>
                    <option value="product">Product</option>
                    <option value="user">User</option>
                    <option value="cms_page">CMS Page</option>
                    <option value="banner">Banner</option>
                  </select>
                </div>
                <div class="glass-card-inner p-3" style="border-radius:0.75rem">
                  <button (click)="refreshAuditLogs()" class="btn-primary w-full justify-center" style="font-size:0.75rem">Refresh</button>
                </div>
              </div>

              <div class="glass-panel overflow-hidden" style="border-radius:1rem">
                <table class="data-table">
                  <thead>
                    <tr><th>Time</th><th>User</th><th>Action</th><th>Resource</th><th>Description</th><th>IP</th></tr>
                  </thead>
                  <tbody>
                    @for (log of auditLogService.logs(); track log.id) {
                      <tr class="text-xs">
                        <td class="text-safs-text-muted whitespace-nowrap">{{ formatDate(log.created_at) }}</td>
                        <td>
                          <span class="font-medium text-safs-dark">{{ log.user_name || 'System' }}</span>
                          @if (log.user_email) { <span class="text-safs-text-muted block text-[0.625rem]">{{ log.user_email }}</span> }
                        </td>
                        <td><span [class]="getActionBadge(log.action)">{{ log.action }}</span></td>
                        <td class="text-safs-text-muted">{{ log.resource_type }} {{ log.resource_id ? '#' + log.resource_id : '' }}</td>
                        <td class="text-safs-text-main max-w-xs truncate">{{ log.description }}</td>
                        <td class="text-safs-text-muted font-mono text-[0.625rem]">{{ log.ip_address }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
                @if (auditLogService.logs().length === 0) {
                  <div class="empty-state">
                    <div class="empty-state-icon">&#9881;</div>
                    <p class="empty-state-title">No audit logs found</p>
                    <p class="empty-state-desc">System events will appear here as they occur.</p>
                  </div>
                }
              </div>
            }
          </div>
        }

      </div>
    </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private enquiryService = inject(EnquiryService);
  private ordersService = inject(OrdersService);
  private exportEnquiryService = inject(ExportEnquiryService);
  private productsService = inject(ProductsService);
  private cmsService = inject(CmsService);
  private bannerService = inject(BannerService);
  private auditLogService = inject(AuditLogService);
  private userService = inject(UserService);
  private auth = inject(AuthService);
  private cache = inject(CacheService);
  private router = inject(Router);

  activeTab = signal<TabId>('stats');
  loadedTabs = new Set<TabId>();
  tabLoading = signal<TabId | null>(null);

  enquiryFilter = signal('');
  orderFilter = signal('');
  productFormOpen = signal(false);
  productRefreshKey = signal(0);
  editingProduct = signal<Product | null>(null);
  userFormOpen = signal(false);
  editingUser = signal<User | null>(null);
  cmsFormOpen = signal(false);
  editingCmsPage = signal<CmsPage | null>(null);
  bannerFormOpen = signal(false);
  editingBanner = signal<Banner | null>(null);

  auditFilters: { search: string; action: string; resource_type: string; user_id: string; from: string; to: string } = {
    search: '', action: '', resource_type: '', user_id: '', from: '', to: ''
  };
  auditSummarySig = signal<AuditLogSummary | null>(null);

  tabs = [
    { id: 'stats' as TabId, label: 'Dashboard', icon: '&#9632;' },
    { id: 'enquiries' as TabId, label: 'Enquiries', icon: '&#9993;' },
    { id: 'orders' as TabId, label: 'Orders', icon: '&#9776;' },
    { id: 'products' as TabId, label: 'Products', icon: '&#9733;' },
    { id: 'users' as TabId, label: 'Users', icon: '&#9787;' },
    { id: 'cms' as TabId, label: 'CMS Pages', icon: '&#9998;' },
    { id: 'banners' as TabId, label: 'Banners', icon: '&#9638;' },
    { id: 'export-enquiries' as TabId, label: 'Export Enquiries', icon: '&#10144;' },
    { id: 'audit' as TabId, label: 'Audit Logs', icon: '&#9881;' },
  ];

  productForm: any = {};
  userForm: any = {};
  cmsForm: any = {};
  bannerForm: any = {};

  constructor() {
    effect(() => {
      const tab = this.activeTab();
      if (!this.loadedTabs.has(tab)) {
        this.loadTab(tab);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/admin']);
      return;
    }
  }

  async loadTab(tab: TabId) {
    this.tabLoading.set(tab);
    try {
      switch (tab) {
        case 'stats':
          await Promise.all([
            this.cache.get('audit-summary', () => this.auditLogService.fetchSummary()),
            this.cache.get('enquiries', () => this.enquiryService.fetchEnquiries()),
            this.cache.get('orders', () => this.ordersService.fetchOrders()),
            this.cache.get('products', () => this.productsService.fetchProducts()),
            this.cache.get('users', () => this.userService.fetchUsers()),
          ]);
          this.loadedTabs.add('stats');
          break;
        case 'enquiries':
          await this.cache.get('enquiries', () => this.enquiryService.fetchEnquiries());
          this.loadedTabs.add('enquiries');
          break;
        case 'export-enquiries':
          await this.cache.get('export-enquiries', () => this.exportEnquiryService.fetchEnquiries());
          this.loadedTabs.add('export-enquiries');
          break;
        case 'orders':
          await this.cache.get('orders', () => this.ordersService.fetchOrders());
          this.loadedTabs.add('orders');
          break;
        case 'products':
          await Promise.all([
            this.cache.get('products', () => this.productsService.fetchProducts()),
            this.cache.get('categories', () => this.productsService.fetchCategories()),
          ]);
          this.loadedTabs.add('products');
          break;
        case 'users':
          await this.cache.get('users', () => this.userService.fetchUsers());
          this.loadedTabs.add('users');
          break;
        case 'cms':
          await this.cache.get('cms-pages', () => this.cmsService.fetchPages());
          this.loadedTabs.add('cms');
          break;
        case 'banners':
          await this.cache.get('banners', () => this.bannerService.fetchBanners());
          this.loadedTabs.add('banners');
          break;
        case 'audit':
          await Promise.all([
            this.cache.get('audit-logs', () => this.auditLogService.fetchLogs()),
            this.cache.get('audit-summary', () => this.auditLogService.fetchSummary()),
          ]);
          this.loadedTabs.add('audit');
          break;
      }
    } finally {
      this.tabLoading.set(null);
    }
  }

  get activeTabLabel(): () => string {
    return () => this.tabs.find(t => t.id === this.activeTab())?.label || '';
  }

  getTabLabel(tab: TabId | null): string {
    return this.tabs.find(t => t.id === tab)?.label || '';
  }

  getTabClass(tab: TabId): string {
    return this.activeTab() === tab
      ? 'tab-pill tab-pill--active'
      : 'tab-pill';
  }

  getActionBadge(action: string): string {
    const map: Record<string, string> = {
      login: 'action-badge action-badge--login',
      login_failed: 'action-badge action-badge--login_failed',
      logout: 'action-badge action-badge--logout',
      created: 'action-badge action-badge--created',
      updated: 'action-badge action-badge--updated',
      deleted: 'action-badge action-badge--deleted',
    };
    return map[action] || 'action-badge';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  resolveImageUrl(image?: string | null): string | null {
    if (!image) return null;
    const trimmed = image.trim();
    if (!trimmed) return null;

    if (/^(https?:\/\/|data:)/i.test(trimmed)) {
      return trimmed;
    }

    const normalized = trimmed.replace(/^\/+/, '');
    if (normalized.startsWith('assets/')) {
      return `/${normalized}`;
    }

    const safsPrefix = normalized.replace(/^SAFS IMAGES\//i, 'safs-images/');
    if (safsPrefix !== normalized) {
      return `/assets/${safsPrefix}`;
    }

    if (normalized.startsWith('safs-images/')) {
      return `/assets/${normalized}`;
    }

    if (normalized.startsWith('Ricardo Caskets/') || normalized.startsWith('Ricardo Equipment/')) {
      return `/assets/${normalized}`;
    }

    return `/assets/${normalized}`;
  }

  // === Enquiries ===
  get filteredExportEnquiries() {
    return () => {
      const all = this.exportEnquiryService.enquiries();
      const filter = this.exportEnquiryFilter();
      return filter ? all.filter(e => e.status === filter) : all;
    };
  }

  exportEnquiryFilter = signal('');

  get filteredEnquiries() {
    return () => {
      const all = this.enquiryService.enquiries();
      const filter = this.enquiryFilter();
      return filter ? all.filter(e => e.status === filter) : all;
    };
  }

  async updateEnquiryStatus(id: number, status: string) {
    await this.enquiryService.updateStatus(id, status as any);
    this.cache.invalidate('enquiries');
  }

  async deleteEnquiry(id: number) {
    if (!confirm('Delete this enquiry?')) return;
    await this.enquiryService.deleteEnquiry(id);
    this.cache.invalidate('enquiries');
  }

  // === Orders ===
  get filteredOrders() {
    return () => {
      const all = this.ordersService.orders();
      const filter = this.orderFilter();
      return filter ? all.filter(o => o.status === filter) : all;
    };
  }

  async updateOrderStatus(id: number, status: string) {
    await this.ordersService.updateStatus(id, status);
    this.cache.invalidate('orders');
  }

  async deleteOrder(id: number) {
    if (!confirm('Delete this order?')) return;
    await this.ordersService.deleteOrder(id);
    this.cache.invalidate('orders');
  }

  // === Products ===
  openProductForm() {
    this.editingProduct.set(null);
    this.productForm = { name: '', slug: '', category: '', description: '', price: null, images: '', in_stock: true, featured: false, price_on_request: false };
    this.productFormOpen.set(true);
  }

  editProduct(product: Product) {
    this.editingProduct.set(product);
    this.productForm = {
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description || '',
      price: product.price,
      images: product.images ? JSON.stringify(product.images) : '',
      in_stock: product.in_stock,
      featured: product.featured,
      price_on_request: product.price_on_request,
    };
    this.productFormOpen.set(true);
  }

  async saveProduct() {
    const data: any = { ...this.productForm };
    if (data.images) {
      try { data.images = JSON.parse(data.images); } catch { data.images = [data.images]; }
    }
    if (this.editingProduct()) {
      await this.productsService.updateProduct(this.editingProduct()!.id, data);
    } else {
      await this.productsService.createProduct(data);
    }
    this.cache.invalidate('products');
    this.productFormOpen.set(false);
    this.productRefreshKey.update(v => v + 1);
  }

  async deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;
    await this.productsService.deleteProduct(id);
    this.cache.invalidate('products');
    this.productRefreshKey.update(v => v + 1);
  }

  // === Users ===
  openUserForm() {
    this.editingUser.set(null);
    this.userForm = { name: '', email: '', password: '', role: 'customer', is_active: true };
    this.userFormOpen.set(true);
  }

  editUser(user: User) {
    this.editingUser.set(user);
    this.userForm = { name: user.name, email: user.email, password: '', role: user.role, is_active: user.is_active };
    this.userFormOpen.set(true);
  }

  async saveUser() {
    if (this.editingUser()) {
      const data: any = { name: this.userForm.name, email: this.userForm.email, role: this.userForm.role, is_active: this.userForm.is_active };
      if (this.userForm.password) data.password = this.userForm.password;
      await this.userService.updateUser(this.editingUser()!.id, data);
    } else {
      await this.userService.createUser(this.userForm);
    }
    this.cache.invalidate('users');
    this.userFormOpen.set(false);
  }

  async deleteUser(id: number) {
    if (!confirm('Delete this user?')) return;
    await this.userService.deleteUser(id);
    this.cache.invalidate('users');
  }

  // === CMS Pages ===
  openCmsForm() {
    this.editingCmsPage.set(null);
    this.cmsForm = { title: '', slug: '', content: '', meta_title: '', meta_description: '', published: false };
    this.cmsFormOpen.set(true);
  }

  editCmsPage(page: CmsPage) {
    this.editingCmsPage.set(page);
    this.cmsForm = {
      title: page.title, slug: page.slug, content: page.content,
      meta_title: page.meta_title || '', meta_description: page.meta_description || '',
      published: page.published,
    };
    this.cmsFormOpen.set(true);
  }

  async saveCmsPage() {
    if (this.editingCmsPage()) {
      await this.cmsService.updatePage(this.editingCmsPage()!.id, this.cmsForm);
    } else {
      await this.cmsService.createPage(this.cmsForm);
    }
    this.cache.invalidate('cms-pages');
    this.cmsFormOpen.set(false);
  }

  async deleteCmsPage(id: number) {
    if (!confirm('Delete this page?')) return;
    await this.cmsService.deletePage(id);
    this.cache.invalidate('cms-pages');
  }

  // === Banners ===
  openBannerForm() {
    this.editingBanner.set(null);
    this.bannerForm = { title: '', subtitle: '', image_url: '', link_url: '', sort_order: 0, active: true };
    this.bannerFormOpen.set(true);
  }

  editBanner(banner: Banner) {
    this.editingBanner.set(banner);
    this.bannerForm = {
      title: banner.title, subtitle: banner.subtitle || '', image_url: banner.image_url,
      link_url: banner.link_url || '', sort_order: banner.sort_order, active: banner.active,
    };
    this.bannerFormOpen.set(true);
  }

  async saveBanner() {
    if (this.editingBanner()) {
      await this.bannerService.updateBanner(this.editingBanner()!.id, this.bannerForm);
    } else {
      await this.bannerService.createBanner(this.bannerForm);
    }
    this.cache.invalidate('banners');
    this.bannerFormOpen.set(false);
  }

  async deleteBanner(id: number) {
    if (!confirm('Delete this banner?')) return;
    await this.bannerService.deleteBanner(id);
    this.cache.invalidate('banners');
  }

  get auditSummary() {
    return this.auditLogService.summary.asReadonly();
  }

  // === Audit Logs ===
  async loadAuditLogs() {
    this.cache.invalidate('audit-logs');
    await this.auditLogService.fetchLogs({
      search: this.auditFilters.search || undefined,
      action: this.auditFilters.action || undefined,
      resource_type: this.auditFilters.resource_type || undefined,
    });
  }

  async refreshAuditLogs() {
    this.cache.invalidate('audit-logs');
    this.cache.invalidate('audit-summary');
    await this.loadAuditLogs();
    await this.auditLogService.fetchSummary();
  }

  async updateExportEnquiryStatus(id: number, status: string) {
    await this.exportEnquiryService.updateStatus(id, status as any);
    this.cache.invalidate('export-enquiries');
  }

  async deleteExportEnquiry(id: number) {
    if (!confirm('Delete this export enquiry?')) return;
    await this.exportEnquiryService.deleteEnquiry(id);
    this.cache.invalidate('export-enquiries');
  }

  getStorageUrl(path: string): string {
    return `${environment.apiUrl}/storage/${path}`;
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/admin']);
  }
}









