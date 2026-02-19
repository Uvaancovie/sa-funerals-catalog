/**
 * Example Component demonstrating API integration
 * This component shows how to use the services to interact with the backend API
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../services/auth.service';
import { ProductsService, Product } from '../services/products.service';
import { CustomersService, Customer } from '../services/customers.service';

@Component({
  selector: 'app-api-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">API Integration Example</h1>

      <!-- Authentication Section -->
      <section class="mb-8 p-4 border rounded">
        <h2 class="text-2xl font-semibold mb-4">Authentication</h2>
        
        @if (!authService.isAuthenticated()) {
          <div class="space-y-4">
            <input 
              [(ngModel)]="loginEmail" 
              type="email" 
              placeholder="Email"
              class="block w-full px-4 py-2 border rounded"
            />
            <input 
              [(ngModel)]="loginPassword" 
              type="password" 
              placeholder="Password"
              class="block w-full px-4 py-2 border rounded"
            />
            <button 
              (click)="login()"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        } @else {
          <div>
            <p class="mb-2">
              <strong>Logged in as:</strong> {{ authService.currentUser()?.email }}
            </p>
            <p class="mb-2">
              <strong>Role:</strong> {{ authService.currentUser()?.role }}
            </p>
            <p class="mb-4">
              <strong>Status:</strong> {{ authService.currentUser()?.status }}
            </p>
            <button 
              (click)="logout()"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        }

        @if (authError()) {
          <p class="mt-4 text-red-600">{{ authError() }}</p>
        }
      </section>

      <!-- Products Section -->
      <section class="mb-8 p-4 border rounded">
        <h2 class="text-2xl font-semibold mb-4">Products</h2>
        
        <div class="mb-4 space-x-4">
          <button 
            (click)="loadProducts()"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Load Products
          </button>
          
          @if (authService.isAdmin()) {
            <button 
              (click)="createSampleProduct()"
              class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Create Sample Product (Admin)
            </button>
          }
        </div>

        @if (productsService.loading()) {
          <p>Loading products...</p>
        }

        @if (productsService.error()) {
          <p class="text-red-600">{{ productsService.error() }}</p>
        }

        <div class="space-y-2">
          @for (product of productsService.products(); track product.productId) {
            <div class="p-3 bg-gray-50 rounded">
              <p><strong>{{ product.name }}</strong> ({{ product.category }})</p>
              <p class="text-sm text-gray-600">{{ product.id }}</p>
              @if (product.price) {
                <p class="text-sm">Price: R{{ product.price }}</p>
              } @else if (product.priceOnRequest) {
                <p class="text-sm">Price on request</p>
              }
            </div>
          }
        </div>
      </section>

      <!-- Customers Section (Admin Only) -->
      @if (authService.isAdmin()) {
        <section class="mb-8 p-4 border rounded">
          <h2 class="text-2xl font-semibold mb-4">Customers (Admin Only)</h2>
          
          <div class="mb-4">
            <button 
              (click)="loadCustomers()"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Load Customers
            </button>
          </div>

          @if (customersService.loading()) {
            <p>Loading customers...</p>
          }

          @if (customersService.error()) {
            <p class="text-red-600">{{ customersService.error() }}</p>
          }

          <div class="space-y-2">
            @for (customer of customersService.customers(); track customer.id) {
              <div class="p-3 bg-gray-50 rounded">
                <p><strong>{{ customer.companyName }}</strong></p>
                <p class="text-sm">{{ customer.email }} - {{ customer.contactPerson }}</p>
                <p class="text-sm">
                  Status: 
                  <span 
                    [class.text-yellow-600]="customer.status === 'pending'"
                    [class.text-green-600]="customer.status === 'approved'"
                    [class.text-red-600]="customer.status === 'declined'"
                  >
                    {{ customer.status }}
                  </span>
                </p>
                
                @if (customer.status === 'pending') {
                  <div class="mt-2 space-x-2">
                    <button 
                      (click)="approveCustomer(customer.id)"
                      class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button 
                      (click)="declineCustomer(customer.id)"
                      class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        </section>
      }
    </div>
  `
})
export class ApiExampleComponent implements OnInit {
  authService = inject(AuthService);
  productsService = inject(ProductsService);
  customersService = inject(CustomersService);

  // Login form
  loginEmail = '';
  loginPassword = '';
  authError = signal<string | null>(null);

  ngOnInit() {
    // Load products on init
    this.loadProducts();
  }

  login() {
    this.authError.set(null);
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loginEmail = '';
        this.loginPassword = '';
        
        // If admin, load customers
        if (this.authService.isAdmin()) {
          this.loadCustomers();
        }
      },
      error: (err) => {
        this.authError.set(err.error?.error || 'Login failed');
        console.error('Login error:', err);
      }
    });
  }

  logout() {
    this.authService.logout();
    console.log('Logged out');
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        console.log('Loaded products:', products);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
      }
    });
  }

  createSampleProduct() {
    const sampleProduct = {
      id: 'sample-casket-' + Date.now(),
      name: 'Sample Casket',
      category: 'casket',
      description: 'This is a sample casket created via API',
      price: 4500,
      priceOnRequest: false,
      inStock: true,
      featured: false
    };

    this.productsService.createProduct(sampleProduct).subscribe({
      next: (product) => {
        console.log('Created product:', product);
        this.loadProducts(); // Reload to show new product
      },
      error: (err) => {
        console.error('Failed to create product:', err);
      }
    });
  }

  loadCustomers() {
    this.customersService.getCustomers().subscribe({
      next: (response) => {
        console.log('Loaded customers:', response.customers);
      },
      error: (err) => {
        console.error('Failed to load customers:', err);
      }
    });
  }

  approveCustomer(customerId: number) {
    this.customersService.updateCustomerStatus(customerId, {
      status: 'approved'
    }).subscribe({
      next: (response) => {
        console.log('Customer approved:', response);
      },
      error: (err) => {
        console.error('Failed to approve customer:', err);
      }
    });
  }

  declineCustomer(customerId: number) {
    this.customersService.updateCustomerStatus(customerId, {
      status: 'declined',
      reason: 'Manual decline from admin panel'
    }).subscribe({
      next: (response) => {
        console.log('Customer declined:', response);
      },
      error: (err) => {
        console.error('Failed to decline customer:', err);
      }
    });
  }
}
