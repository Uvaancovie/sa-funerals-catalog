import { Component, inject, OnInit, signal } from '@angular/core';
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

type TabId = 'stats' | 'enquiries' | 'orders' | 'products' | 'users' | 'cms' | 'banners' | 'audit';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        <div class="glass-panel mt-4 mx-4 rounded-2xl px-2 sm:px-4 overflow-x-auto">
          <div class="flex gap-1 min-w-max py-2">
            <button *ngFor="let tab of tabs" (click)="activeTab.set(tab.id)" [class]="getTabClass(tab.id)">
              <span [innerHTML]="tab.icon"></span>
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        <!-- ===== DASHBOARD STATS ===== -->
        @if (activeTab() === 'stats') {
          <div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="glass-card rounded-xl p-5 border border-white/40">
                <p class="text-3xl font-bold text-safs-dark">{{ enquiryService.enquiries().length }}</p>
                <p class="text-xs text-gray-500 mt-1">Total Enquiries</p>
              </div>
              <div class="glass-card rounded-xl p-5 border border-white/40">
                <p class="text-3xl font-bold text-safs-dark">{{ ordersService.orders().length }}</p>
                <p class="text-xs text-gray-500 mt-1">Total Orders</p>
              </div>
              <div class="glass-card rounded-xl p-5 border border-white/40">
                <p class="text-3xl font-bold text-safs-dark">{{ productsService.products().length }}</p>
                <p class="text-xs text-gray-500 mt-1">Products</p>
              </div>
              <div class="glass-card rounded-xl p-5 border border-white/40">
                <p class="text-3xl font-bold text-safs-dark">{{ userService.users().length }}</p>
                <p class="text-xs text-gray-500 mt-1">Users</p>
              </div>
            </div>

            @if (auditSummary(); as summary) {
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div class="glass-card rounded-xl p-5 border border-white/40">
                  <p class="text-2xl font-bold text-safs-dark">{{ summary.total_logins }}</p>
                  <p class="text-xs text-gray-500 mt-1">Total Logins</p>
                </div>
                <div class="glass-card rounded-xl p-5 border border-white/40">
                  <p class="text-2xl font-bold text-red-600">{{ summary.failed_logins }}</p>
                  <p class="text-xs text-gray-500 mt-1">Failed Logins</p>
                </div>
                <div class="glass-card rounded-xl p-5 border border-white/40">
                  <p class="text-2xl font-bold text-safs-dark">{{ summary.today_actions }}</p>
                  <p class="text-xs text-gray-500 mt-1">Today's Actions</p>
                </div>
              </div>
            }

            <div class="glass-panel rounded-xl border border-white/40 p-6">
              <h3 class="font-bold text-safs-dark mb-4">Recent Activity</h3>
              @if (auditLogService.summary()?.recent_actions; as recent) {
                <div class="space-y-2">
                  @for (log of recent; track log.id) {
                    <div class="flex items-center gap-3 text-sm py-1.5 border-b border-gray-50 last:border-0">
                      <span [class]="getActionBadge(log.action)">{{ log.action }}</span>
                      <span class="text-gray-700">{{ log.description }}</span>
                      <span class="text-gray-400 ml-auto text-xs">{{ formatDate(log.created_at) }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }

        <!-- ===== ENQUIRIES ===== -->
        @if (activeTab() === 'enquiries') {
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">Enquiries ({{ enquiryService.enquiries().length }})</h2>
              <div class="flex gap-2">
                <select (change)="enquiryFilter.set($any($event.target).value)" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white">
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            @if (filteredEnquiries().length === 0) {
              <div class="glass-panel rounded-2xl border border-white/40 p-16 text-center text-gray-400">
                <p class="text-lg">No enquiries found.</p>
              </div>
            } @else {
              <div class="flex flex-col gap-4">
                @for (enquiry of filteredEnquiries(); track enquiry.id) {
                  <div class="glass-card rounded-2xl border border-white/40 overflow-hidden">
                    <div class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                      <div class="flex items-center gap-3">
                        <span [class]="getStatusBadge(enquiry.status)">{{ enquiry.status }}</span>
                        <div>
                          <h3 class="font-bold text-safs-dark">{{ enquiry.customer_name }}</h3>
                          <p class="text-xs text-gray-500">{{ formatDate(enquiry.created_at) }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <select [value]="enquiry.status" (change)="updateEnquiryStatus(enquiry.id, $any($event.target).value)" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white">
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button (click)="deleteEnquiry(enquiry.id)" class="text-xs px-3 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200">Delete</button>
                      </div>
                    </div>
                    <div class="px-5 py-3 bg-white/50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div><span class="text-gray-500 text-xs uppercase">Email</span><p class="font-medium">{{ enquiry.customer_email }}</p></div>
                      <div><span class="text-gray-500 text-xs uppercase">Phone</span><p class="font-medium">{{ enquiry.customer_phone }}</p></div>
                      <div><span class="text-gray-500 text-xs uppercase">Items</span><p class="font-medium">{{ enquiry.items?.length || 0 }} product(s)</p></div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- ===== ORDERS ===== -->
        @if (activeTab() === 'orders') {
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">Orders ({{ ordersService.orders().length }})</h2>
              <div class="flex gap-2">
                <select (change)="orderFilter.set($any($event.target).value)" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            @if (filteredOrders().length === 0) {
              <div class="glass-panel rounded-2xl border border-white/40 p-16 text-center text-gray-400">
                <p class="text-lg">No orders found.</p>
              </div>
            } @else {
              <div class="flex flex-col gap-4">
                @for (order of filteredOrders(); track order.id) {
                  <div class="glass-card rounded-2xl border border-white/40 overflow-hidden">
                    <div class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                      <div class="flex items-center gap-3">
                        <span [class]="getStatusBadge(order.status)">{{ order.status }}</span>
                        <div>
                          <h3 class="font-bold text-safs-dark">{{ order.customer_name }}</h3>
                          <p class="text-xs text-gray-500">#{{ order.id }} - {{ formatDate(order.created_at) }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-safs-dark">R{{ order.total }}</span>
                        <select [value]="order.status" (change)="updateOrderStatus(order.id, $any($event.target).value)" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white">
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button (click)="deleteOrder(order.id)" class="text-xs px-3 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200">Delete</button>
                      </div>
                    </div>
                    <div class="px-5 py-3 bg-white/50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div><span class="text-gray-500 text-xs uppercase">Email</span><p class="font-medium">{{ order.customer_email }}</p></div>
                      <div><span class="text-gray-500 text-xs uppercase">Phone</span><p class="font-medium">{{ order.customer_phone }}</p></div>
                      <div><span class="text-gray-500 text-xs uppercase">Items</span><p class="font-medium">{{ order.items?.length || 0 }} item(s)</p></div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- ===== PRODUCTS (CMS) ===== -->
        @if (activeTab() === 'products') {
          <div>
            <div class="glass-panel rounded-2xl p-4 sm:p-5 mb-5 border border-white/40">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 class="text-lg font-bold text-safs-dark">Products Inventory</h2>
                  <p class="text-xs text-safs-dark/60">Track stock, featured items, and price-on-request products.</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button (click)="openProductForm()" class="text-xs px-4 py-2 rounded-lg bg-safs-dark text-white hover:bg-safs-gold transition-colors font-medium">+ Add Product</button>
                  <button (click)="applyProductFilters()" class="text-xs px-4 py-2 rounded-lg bg-white/70 text-safs-dark hover:bg-white border border-white/60">Refresh</button>
                </div>
              </div>
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <input
                  [(ngModel)]="productSearch"
                  (input)="applyProductFilters()"
                  placeholder="Search name or description..."
                  class="w-full px-4 py-2 rounded-lg border border-white/60 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold"
                >
                <select
                  [(ngModel)]="productCategoryFilter"
                  (change)="applyProductFilters()"
                  class="w-full px-3 py-2 rounded-lg border border-white/60 bg-white/70 text-sm"
                >
                  <option value="">All Categories</option>
                  @for (category of productsService.categories(); track category) {
                    <option [value]="category">{{ category }}</option>
                  }
                </select>
                <select
                  [(ngModel)]="productStockFilter"
                  (change)="applyProductFilters()"
                  class="w-full px-3 py-2 rounded-lg border border-white/60 bg-white/70 text-sm"
                >
                  <option value="all">All Stock</option>
                  <option value="in">In Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
                <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/60 bg-white/70 text-sm">
                  <input type="checkbox" [(ngModel)]="productFeaturedOnly" (change)="applyProductFilters()">
                  Featured only
                </label>
                <button (click)="clearProductFilters()" class="w-full px-3 py-2 rounded-lg border border-white/60 bg-white/70 text-sm text-safs-dark hover:bg-white">Clear Filters</button>
              </div>
            </div>

            @if (inventoryCounts(); as counts) {
              <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                <div class="glass-card rounded-xl p-4 border border-white/40">
                  <p class="text-xs text-gray-500">Total</p>
                  <p class="text-xl font-bold text-safs-dark">{{ counts.total }}</p>
                </div>
                <div class="glass-card rounded-xl p-4 border border-white/40">
                  <p class="text-xs text-gray-500">In Stock</p>
                  <p class="text-xl font-bold text-green-700">{{ counts.inStock }}</p>
                </div>
                <div class="glass-card rounded-xl p-4 border border-white/40">
                  <p class="text-xs text-gray-500">Out of Stock</p>
                  <p class="text-xl font-bold text-red-500">{{ counts.outOfStock }}</p>
                </div>
                <div class="glass-card rounded-xl p-4 border border-white/40">
                  <p class="text-xs text-gray-500">Featured</p>
                  <p class="text-xl font-bold text-amber-700">{{ counts.featured }}</p>
                </div>
                <div class="glass-card rounded-xl p-4 border border-white/40">
                  <p class="text-xs text-gray-500">Price on Request</p>
                  <p class="text-xl font-bold text-safs-dark">{{ counts.priceOnRequest }}</p>
                </div>
              </div>
            }

            @if (productFormOpen()) {
              <div class="glass-panel rounded-2xl border border-white/40 p-6 mb-6">
                <h3 class="font-bold text-safs-dark mb-4">{{ editingProduct() ? 'Edit Product' : 'New Product' }}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input [(ngModel)]="productForm.name" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                    <input [(ngModel)]="productForm.slug" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Category</label>
                    <input [(ngModel)]="productForm.category" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Price</label>
                    <input type="number" [(ngModel)]="productForm.price" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Images (JSON array)</label>
                    <input [(ngModel)]="productForm.images" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div class="flex items-center gap-4">
                    <label class="flex items-center gap-2 text-sm">
                      <input type="checkbox" [(ngModel)]="productForm.in_stock"> In Stock
                    </label>
                    <label class="flex items-center gap-2 text-sm">
                      <input type="checkbox" [(ngModel)]="productForm.featured"> Featured
                    </label>
                    <label class="flex items-center gap-2 text-sm">
                      <input type="checkbox" [(ngModel)]="productForm.price_on_request"> Price on Request
                    </label>
                  </div>
                </div>
                <div class="mt-4">
                  <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea [(ngModel)]="productForm.description" rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold"></textarea>
                </div>
                <div class="flex gap-2 mt-4">
                  <button (click)="saveProduct()" class="px-4 py-2 text-sm font-medium rounded-lg bg-safs-dark text-white hover:bg-safs-gold transition-colors">Save</button>
                  <button (click)="productFormOpen.set(false)" class="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
                </div>
              </div>
            }

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              @for (product of productsService.products(); track product.id) {
                <div class="glass-card rounded-2xl border border-white/40 overflow-hidden">
                  <div class="h-28 bg-gradient-to-br from-white/60 to-white/10 flex items-center justify-center text-xs text-gray-400">
                    @if (resolveImageUrl(product.images?.[0])) {
                      <img [src]="resolveImageUrl(product.images?.[0])" [alt]="product.name" class="h-full w-full object-cover">
                    } @else {
                      No image
                    }
                  </div>
                  <div class="p-4">
                    <div class="flex items-start justify-between mb-2">
                      <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/70 text-gray-600 border border-white/70">{{ product.category }}</span>
                      @if (product.featured) { <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span> }
                    </div>
                    <h3 class="font-bold text-safs-dark text-sm">{{ product.name }}</h3>
                    <p class="text-xs text-gray-500 mt-1 truncate">{{ product.description || 'No description yet.' }}</p>
                    <div class="flex items-center justify-between mt-3">
                      <span class="font-bold text-safs-dark">{{ product.price ? 'R' + product.price : 'Request Price' }}</span>
                      <span class="text-xs" [class.text-green-600]="product.in_stock" [class.text-red-500]="!product.in_stock">{{ product.in_stock ? 'In Stock' : 'Out of Stock' }}</span>
                    </div>
                    <div class="flex items-center justify-between text-[10px] text-gray-500 mt-2">
                      <span>Last updated</span>
                      <span>{{ formatDate(product.updated_at || product.created_at) }}</span>
                    </div>
                    <div class="flex gap-2 mt-3 pt-3 border-t border-white/40">
                      <button (click)="editProduct(product)" class="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">Edit</button>
                      <button (click)="deleteProduct(product.id)" class="text-xs px-3 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200">Delete</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ===== USERS ===== -->
        @if (activeTab() === 'users') {
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">Users ({{ userService.users().length }})</h2>
              <button (click)="openUserForm()" class="text-xs px-4 py-2 rounded-lg bg-safs-dark text-white hover:bg-safs-gold transition-colors font-medium">+ Add User</button>
            </div>

            @if (userFormOpen()) {
              <div class="glass-panel rounded-2xl border border-white/40 p-6 mb-6">
                <h3 class="font-bold text-safs-dark mb-4">{{ editingUser() ? 'Edit User' : 'New User' }}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input [(ngModel)]="userForm.name" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input type="email" [(ngModel)]="userForm.email" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Password{{ editingUser() ? ' (leave blank to keep)' : '' }}</label>
                    <input type="password" [(ngModel)]="userForm.password" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Role</label>
                    <select [(ngModel)]="userForm.role" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label class="flex items-center gap-2 text-sm">
                      <input type="checkbox" [(ngModel)]="userForm.is_active"> Active
                    </label>
                  </div>
                </div>
                <div class="flex gap-2 mt-4">
                  <button (click)="saveUser()" class="px-4 py-2 text-sm font-medium rounded-lg bg-safs-dark text-white hover:bg-safs-gold transition-colors">Save</button>
                  <button (click)="userFormOpen.set(false)" class="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
                </div>
              </div>
            }

            <div class="glass-panel rounded-xl border border-white/40 overflow-hidden">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <th class="px-4 py-3">Name</th>
                    <th class="px-4 py-3">Email</th>
                    <th class="px-4 py-3">Role</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (user of userService.users(); track user.id) {
                    <tr class="border-t border-gray-100 hover:bg-gray-50">
                      <td class="px-4 py-3 font-medium text-safs-dark">{{ user.name }}</td>
                      <td class="px-4 py-3 text-gray-600">{{ user.email }}</td>
                      <td class="px-4 py-3">
                        <span [class]="user.role === 'admin' ? 'text-xs font-bold px-2 py-0.5 rounded-full bg-safs-dark/10 text-safs-dark' : 'text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600'">{{ user.role }}</span>
                      </td>
                      <td class="px-4 py-3">
                        <span [class]="user.is_active ? 'text-green-600' : 'text-red-500'">{{ user.is_active ? 'Active' : 'Inactive' }}</span>
                      </td>
                      <td class="px-4 py-3">
                        <button (click)="editUser(user)" class="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 mr-1">Edit</button>
                        <button (click)="deleteUser(user.id)" class="text-xs px-2 py-1 rounded text-red-600 bg-red-50 hover:bg-red-100">Delete</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- ===== CMS PAGES ===== -->
        @if (activeTab() === 'cms') {
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">CMS Pages ({{ cmsService.pages().length }})</h2>
              <button (click)="openCmsForm()" class="text-xs px-4 py-2 rounded-lg bg-safs-dark text-white hover:bg-safs-gold transition-colors font-medium">+ Add Page</button>
            </div>

            @if (cmsFormOpen()) {
              <div class="glass-panel rounded-2xl border border-white/40 p-6 mb-6">
                <h3 class="font-bold text-safs-dark mb-4">{{ editingCmsPage() ? 'Edit Page' : 'New Page' }}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input [(ngModel)]="cmsForm.title" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                    <input [(ngModel)]="cmsForm.slug" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                    <input [(ngModel)]="cmsForm.meta_title" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                    <input [(ngModel)]="cmsForm.meta_description" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" [(ngModel)]="cmsForm.published"> Published
                  </label>
                </div>
                <div class="mt-4">
                  <label class="block text-xs font-medium text-gray-600 mb-1">Content</label>
                  <textarea [(ngModel)]="cmsForm.content" rows="6" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-safs-gold"></textarea>
                </div>
                <div class="flex gap-2 mt-4">
                  <button (click)="saveCmsPage()" class="px-4 py-2 text-sm font-medium rounded-lg bg-safs-dark text-white hover:bg-safs-gold transition-colors">Save</button>
                  <button (click)="cmsFormOpen.set(false)" class="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
                </div>
              </div>
            }

            <div class="glass-panel rounded-xl border border-white/40 overflow-hidden">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <th class="px-4 py-3">Title</th>
                    <th class="px-4 py-3">Slug</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Updated</th>
                    <th class="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (page of cmsService.pages(); track page.id) {
                    <tr class="border-t border-gray-100 hover:bg-gray-50">
                      <td class="px-4 py-3 font-medium text-safs-dark">{{ page.title }}</td>
                      <td class="px-4 py-3 text-gray-500 text-xs">{{ page.slug }}</td>
                      <td class="px-4 py-3">
                        <span [class]="page.published ? 'text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700' : 'text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600'">{{ page.published ? 'Published' : 'Draft' }}</span>
                      </td>
                      <td class="px-4 py-3 text-xs text-gray-500">{{ formatDate(page.updated_at) }}</td>
                      <td class="px-4 py-3">
                        <button (click)="editCmsPage(page)" class="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 mr-1">Edit</button>
                        <button (click)="deleteCmsPage(page.id)" class="text-xs px-2 py-1 rounded text-red-600 bg-red-50 hover:bg-red-100">Delete</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- ===== BANNERS ===== -->
        @if (activeTab() === 'banners') {
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-safs-dark">Banners ({{ bannerService.banners().length }})</h2>
              <button (click)="openBannerForm()" class="text-xs px-4 py-2 rounded-lg bg-safs-dark text-white hover:bg-safs-gold transition-colors font-medium">+ Add Banner</button>
            </div>

            @if (bannerFormOpen()) {
              <div class="glass-panel rounded-2xl border border-white/40 p-6 mb-6">
                <h3 class="font-bold text-safs-dark mb-4">{{ editingBanner() ? 'Edit Banner' : 'New Banner' }}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input [(ngModel)]="bannerForm.title" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
                    <input [(ngModel)]="bannerForm.subtitle" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                    <input [(ngModel)]="bannerForm.image_url" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Link URL</label>
                    <input [(ngModel)]="bannerForm.link_url" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                    <input type="number" [(ngModel)]="bannerForm.sort_order" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-safs-gold">
                  </div>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" [(ngModel)]="bannerForm.active"> Active
                  </label>
                </div>
                <div class="flex gap-2 mt-4">
                  <button (click)="saveBanner()" class="px-4 py-2 text-sm font-medium rounded-lg bg-safs-dark text-white hover:bg-safs-gold transition-colors">Save</button>
                  <button (click)="bannerFormOpen.set(false)" class="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
                </div>
              </div>
            }

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (banner of bannerService.banners(); track banner.id) {
                <div class="glass-card rounded-xl border border-white/40 overflow-hidden">
                  <div class="h-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                    @if (banner.image_url) {
                      <span class="px-2 text-center">{{ banner.image_url.length > 50 ? banner.image_url.substring(0, 50) + '...' : banner.image_url }}</span>
                    } @else { No Image }
                  </div>
                  <div class="p-4">
                    <div class="flex items-center justify-between mb-1">
                      <h3 class="font-bold text-safs-dark text-sm">{{ banner.title }}</h3>
                      <span [class]="banner.active ? 'text-xs text-green-600 font-medium' : 'text-xs text-gray-400'">{{ banner.active ? 'Active' : 'Inactive' }}</span>
                    </div>
                    @if (banner.subtitle) { <p class="text-xs text-gray-500">{{ banner.subtitle }}</p> }
                    <p class="text-xs text-gray-400 mt-1">Order: {{ banner.sort_order }}</p>
                    <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button (click)="editBanner(banner)" class="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
                      <button (click)="deleteBanner(banner.id)" class="text-xs px-2 py-1 rounded text-red-600 bg-red-50 hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ===== AUDIT LOGS ===== -->
        @if (activeTab() === 'audit') {
          <div>
            <h2 class="text-lg font-bold text-safs-dark mb-4">Audit Logs</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div class="glass-card rounded-lg p-4 border border-white/40">
                <input [(ngModel)]="auditFilters.search" (input)="loadAuditLogs()" placeholder="Search..." class="w-full px-3 py-1.5 rounded border border-gray-200 text-xs">
              </div>
              <div class="glass-card rounded-lg p-4 border border-white/40">
                <select [(ngModel)]="auditFilters.action" (change)="loadAuditLogs()" class="w-full px-3 py-1.5 rounded border border-gray-200 text-xs">
                  <option value="">All Actions</option>
                  <option value="login">Login</option>
                  <option value="login_failed">Failed Login</option>
                  <option value="logout">Logout</option>
                  <option value="created">Created</option>
                  <option value="updated">Updated</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
              <div class="glass-card rounded-lg p-4 border border-white/40">
                <select [(ngModel)]="auditFilters.resource_type" (change)="loadAuditLogs()" class="w-full px-3 py-1.5 rounded border border-gray-200 text-xs">
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
              <div class="glass-card rounded-lg p-4 border border-white/40">
                <button (click)="refreshAuditLogs()" class="w-full px-3 py-1.5 rounded bg-safs-dark text-white text-xs font-medium">Refresh</button>
              </div>
            </div>

            <div class="glass-panel rounded-xl border border-white/40 overflow-hidden">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <th class="px-4 py-3">Time</th>
                    <th class="px-4 py-3">User</th>
                    <th class="px-4 py-3">Action</th>
                    <th class="px-4 py-3">Resource</th>
                    <th class="px-4 py-3">Description</th>
                    <th class="px-4 py-3">IP</th>
                  </tr>
                </thead>
                <tbody>
                  @for (log of auditLogService.logs(); track log.id) {
                    <tr class="border-t border-gray-100 hover:bg-gray-50 text-xs">
                      <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatDate(log.created_at) }}</td>
                      <td class="px-4 py-3">
                        <span class="font-medium text-safs-dark">{{ log.user_name || 'System' }}</span>
                        <span class="text-gray-400 block">{{ log.user_email }}</span>
                      </td>
                      <td class="px-4 py-3"><span [class]="getActionBadge(log.action)">{{ log.action }}</span></td>
                      <td class="px-4 py-3 text-gray-600">{{ log.resource_type }} {{ log.resource_id ? '#' + log.resource_id : '' }}</td>
                      <td class="px-4 py-3 text-gray-700 max-w-xs truncate">{{ log.description }}</td>
                      <td class="px-4 py-3 text-gray-400 font-mono">{{ log.ip_address }}</td>
                    </tr>
                  }
                </tbody>
              </table>
              @if (auditLogService.logs().length === 0) {
                <div class="p-8 text-center text-gray-400">No audit logs found.</div>
              }
            </div>
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
  private productsService = inject(ProductsService);
  private cmsService = inject(CmsService);
  private bannerService = inject(BannerService);
  private auditLogService = inject(AuditLogService);
  private userService = inject(UserService);
  private auth = inject(AuthService);
  private router = inject(Router);

  activeTab = signal<TabId>('stats');
  enquiryFilter = signal('');
  orderFilter = signal('');
  productSearch = signal('');
  productCategoryFilter = signal('');
  productStockFilter = signal<'all' | 'in' | 'out'>('all');
  productFeaturedOnly = signal(false);
  productFormOpen = signal(false);
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
    { id: 'audit' as TabId, label: 'Audit Logs', icon: '&#9881;' },
  ];

  productForm: any = {};
  userForm: any = {};
  cmsForm: any = {};
  bannerForm: any = {};

  ngOnInit() {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/admin']);
      return;
    }
    this.loadAll();
  }

  async loadAll() {
    await Promise.all([
      this.enquiryService.fetchEnquiries(),
      this.ordersService.fetchOrders(),
      this.productsService.fetchProducts(),
      this.productsService.fetchCategories(),
      this.userService.fetchUsers(),
      this.cmsService.fetchPages(),
      this.bannerService.fetchBanners(),
      this.loadAuditLogs(),
    ]);
    await this.auditLogService.fetchSummary();
  }

  get activeTabLabel(): () => string {
    return () => this.tabs.find(t => t.id === this.activeTab())?.label || '';
  }

  getTabClass(tab: TabId): string {
    const base = 'px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap';
    return this.activeTab() === tab
      ? `${base} bg-safs-dark text-white shadow-sm`
      : `${base} text-safs-dark/70 hover:text-safs-dark hover:bg-white/70`;
  }

  getActionBadge(action: string): string {
    const base = 'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full';
    switch (action) {
      case 'login': return `${base} bg-green-100 text-green-700`;
      case 'login_failed': return `${base} bg-red-100 text-red-700`;
      case 'logout': return `${base} bg-gray-100 text-gray-700`;
      case 'created': return `${base} bg-blue-100 text-blue-700`;
      case 'updated': return `${base} bg-amber-100 text-amber-700`;
      case 'deleted': return `${base} bg-red-100 text-red-700`;
      default: return `${base} bg-gray-100 text-gray-700`;
    }
  }

  getStatusBadge(status: string): string {
    const base = 'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full';
    const map: Record<string, string> = {
      new: 'bg-safs-dark/10 text-safs-dark',
      contacted: 'bg-amber-100 text-amber-700',
      closed: 'bg-green-100 text-green-700',
      pending: 'bg-gray-100 text-gray-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return `${base} ${map[status] || 'bg-gray-100 text-gray-700'}`;
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

  async searchProducts() {
    await this.applyProductFilters();
  }

  async applyProductFilters() {
    const stock = this.productStockFilter();
    await this.productsService.fetchProducts({
      search: this.productSearch() || undefined,
      category: this.productCategoryFilter() || undefined,
      in_stock: stock === 'all' ? undefined : stock === 'in',
      featured: this.productFeaturedOnly() ? true : undefined,
    });
  }

  clearProductFilters() {
    this.productSearch.set('');
    this.productCategoryFilter.set('');
    this.productStockFilter.set('all');
    this.productFeaturedOnly.set(false);
    void this.applyProductFilters();
  }

  get inventoryCounts() {
    return () => {
      const products = this.productsService.products();
      const inStock = products.filter(p => p.in_stock).length;
      const featured = products.filter(p => p.featured).length;
      const priceOnRequest = products.filter(p => p.price_on_request).length;
      return {
        total: products.length,
        inStock,
        outOfStock: products.length - inStock,
        featured,
        priceOnRequest,
      };
    };
  }

  // === Enquiries ===
  get filteredEnquiries() {
    return () => {
      const all = this.enquiryService.enquiries();
      const filter = this.enquiryFilter();
      return filter ? all.filter(e => e.status === filter) : all;
    };
  }

  async updateEnquiryStatus(id: number, status: string) {
    await this.enquiryService.updateStatus(id, status as any);
  }

  async deleteEnquiry(id: number) {
    if (!confirm('Delete this enquiry?')) return;
    await this.enquiryService.deleteEnquiry(id);
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
  }

  async deleteOrder(id: number) {
    if (!confirm('Delete this order?')) return;
    await this.ordersService.deleteOrder(id);
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
    this.productFormOpen.set(false);
  }

  async deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;
    await this.productsService.deleteProduct(id);
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
    this.userFormOpen.set(false);
  }

  async deleteUser(id: number) {
    if (!confirm('Delete this user?')) return;
    await this.userService.deleteUser(id);
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
    this.cmsFormOpen.set(false);
  }

  async deleteCmsPage(id: number) {
    if (!confirm('Delete this page?')) return;
    await this.cmsService.deletePage(id);
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
    this.bannerFormOpen.set(false);
  }

  async deleteBanner(id: number) {
    if (!confirm('Delete this banner?')) return;
    await this.bannerService.deleteBanner(id);
  }

  get auditSummary() {
    return this.auditLogService.summary.asReadonly();
  }

  // === Audit Logs ===
  async loadAuditLogs() {
    await this.auditLogService.fetchLogs({
      search: this.auditFilters.search || undefined,
      action: this.auditFilters.action || undefined,
      resource_type: this.auditFilters.resource_type || undefined,
    });
  }

  async refreshAuditLogs() {
    await this.loadAuditLogs();
    await this.auditLogService.fetchSummary();
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/admin']);
  }
}
