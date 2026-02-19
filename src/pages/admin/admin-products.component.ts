import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductsService, Product, ProductAuditLog } from '../../services/products.service';

interface ProductForm {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number | null;
  priceOnRequest: boolean;
  inStock: boolean;
  featured: boolean;
  imageFiles: File[];
  imageUrls: string[];
  features: string[];
  specifications: { key: string; value: string; }[];
  colorVariations: { color: string; imageFiles: File[]; imageUrls: string[]; }[];
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Admin Header -->
      <div class="bg-safs-dark text-white shadow-lg">
        <div class="container mx-auto px-4 py-6">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <a routerLink="/admin" class="text-white hover:text-safs-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </a>
              <div>
                <h1 class="text-2xl font-bold">Product Management</h1>
                <p class="text-sm text-gray-400">Create and manage products</p>
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

      <div class="container mx-auto px-4 py-8 max-w-6xl">
        
        <!-- Tabs -->
        <div class="flex gap-2 mb-8 border-b border-gray-200">
          <button 
            (click)="switchTab('create')"
            class="px-6 py-3 font-bold transition-colors"
            [class.text-safs-gold]="activeTab() === 'create'"
            [class.border-b-2]="activeTab() === 'create'"
            [class.border-safs-gold]="activeTab() === 'create'"
            [class.text-gray-500]="activeTab() !== 'create'">
            Create Product
          </button>
          <button 
            (click)="switchTab('list')"
            class="px-6 py-3 font-bold transition-colors"
            [class.text-safs-gold]="activeTab() === 'list'"
            [class.border-b-2]="activeTab() === 'list'"
            [class.border-safs-gold]="activeTab() === 'list'"
            [class.text-gray-500]="activeTab() !== 'list'">
            All Products ({{ productsService.products().length }})
          </button>
        </div>

        <!-- Create Product Tab -->
        @if (activeTab() === 'create') {
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-safs-dark">
                @if (isEditMode()) {
                  <span>Edit Product</span>
                } @else {
                  <span>Create New Product</span>
                }
              </h2>
              @if (isEditMode()) {
                <button 
                  type="button"
                  (click)="cancelEdit()"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-bold">
                  Cancel Edit
                </button>
              }
            </div>

            @if (successMessage()) {
              <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {{ successMessage() }}
              </div>
            }

            @if (errorMessage()) {
              <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {{ errorMessage() }}
              </div>
            }

            <form (ngSubmit)="submitProduct()" class="space-y-6">
              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Product ID (Slug)*</label>
                  <input 
                    type="text" 
                    [(ngModel)]="form.id" 
                    name="id"
                    placeholder="e.g., oxford-casket"
                    [readonly]="isEditMode()"
                    [class.bg-gray-100]="isEditMode()"
                    [class.cursor-not-allowed]="isEditMode()"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent"
                    required>
                  <p class="text-xs text-gray-500 mt-1">
                    @if (isEditMode()) {
                      <span>ID cannot be changed when editing</span>
                    } @else {
                      <span>Must be unique, lowercase, use hyphens</span>
                    }
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Product Name*</label>
                  <input 
                    type="text" 
                    [(ngModel)]="form.name" 
                    name="name"
                    placeholder="e.g., Oxford Casket"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent"
                    required>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Category*</label>
                  <select 
                    [(ngModel)]="form.category" 
                    name="category"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent"
                    required>
                    <option value="">Select Category</option>
                    <option value="casket">Casket</option>
                    <option value="child">Child Casket</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Price</label>
                  <input 
                    type="number" 
                    [(ngModel)]="form.price" 
                    name="price"
                    step="0.01"
                    placeholder="Leave empty for 'Price on Request'"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent">
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea 
                  [(ngModel)]="form.description" 
                  name="description"
                  rows="4"
                  placeholder="Detailed product description"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent"></textarea>
              </div>

              <!-- Image Upload -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Product Images*</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-safs-gold transition-colors">
                  <input 
                    type="file" 
                    (change)="onImageSelect($event)"
                    accept="image/*"
                    multiple
                    class="hidden"
                    #fileInput>
                  <button 
                    type="button"
                    (click)="fileInput.click()"
                    class="px-6 py-3 bg-safs-gold text-white rounded-lg hover:bg-opacity-90 transition-colors font-bold">
                    Choose Images
                  </button>
                  <p class="text-sm text-gray-500 mt-2">Upload multiple images (PNG, JPG)</p>
                </div>

                <!-- Image Preview -->
                @if (form.imageUrls.length > 0) {
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    @for (url of form.imageUrls; track $index) {
                      <div class="relative group">
                        <img [src]="url" class="w-full h-32 object-cover rounded-lg border border-gray-200">
                        <button 
                          type="button"
                          (click)="removeImage($index)"
                          class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Features/Variants -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Features/Variants</label>
                <div class="space-y-2">
                  @for (feature of form.features; track $index) {
                    <div class="flex gap-2">
                      <input 
                        type="text" 
                        [(ngModel)]="form.features[$index]"
                        [name]="'feature' + $index"
                        placeholder="e.g., Cherry, Kiaat, Teak"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent">
                      <button 
                        type="button"
                        (click)="removeFeature($index)"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Remove
                      </button>
                    </div>
                  }
                </div>
                <button 
                  type="button"
                  (click)="addFeature()"
                  class="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-bold">
                  + Add Feature
                </button>
              </div>

              <!-- Color Variations -->
              <div class="border-t border-gray-200 pt-6">
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  Color Variations
                  <span class="text-xs font-normal text-gray-500 ml-2">(Each color can have multiple images)</span>
                </label>
                
                @for (variation of form.colorVariations; track $index) {
                  <div class="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                    <div class="flex justify-between items-center mb-3">
                      <h4 class="font-bold text-safs-dark">Variation {{ $index + 1 }}</h4>
                      <button 
                        type="button"
                        (click)="removeColorVariation($index)"
                        class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                        Remove Variation
                      </button>
                    </div>
                    
                    <div class="space-y-3">
                      <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Color Name*</label>
                        <input 
                          type="text" 
                          [(ngModel)]="variation.color"
                          [name]="'colorName' + $index"
                          placeholder="e.g., Brown, Cherry, White"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent text-sm">
                      </div>
                      
                      <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">Images for this color*</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-safs-gold transition-colors">
                          <input 
                            type="file" 
                            (change)="onColorVariationImageSelect($event, $index)"
                            accept="image/*"
                            multiple
                            class="hidden"
                            [id]="'colorFileInput' + $index">
                          <button 
                            type="button"
                            (click)="triggerColorImageUpload($index)"
                            class="px-4 py-2 bg-safs-dark text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-bold">
                            Choose Images
                          </button>
                          <p class="text-xs text-gray-500 mt-1">Upload images for {{ variation.color || 'this color' }}</p>
                        </div>
                        
                        <!-- Color Variation Image Preview -->
                        @if (variation.imageUrls.length > 0) {
                          <div class="grid grid-cols-3 md:grid-cols-5 gap-2 mt-3">
                            @for (url of variation.imageUrls; track imgIdx) {
                              <div class="relative group">
                                <img [src]="url" class="w-full h-20 object-cover rounded border border-gray-300">
                                <button 
                                  type="button"
                                  (click)="removeColorVariationImage($index, imgIdx)"
                                  class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs w-5 h-5 flex items-center justify-center">
                                  ×
                                </button>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }
                
                <button 
                  type="button"
                  (click)="addColorVariation()"
                  class="mt-2 px-4 py-2 bg-safs-gold text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-bold">
                  + Add Color Variation
                </button>
              </div>

              <!-- Specifications -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Specifications</label>
                <div class="space-y-2">
                  @for (spec of form.specifications; track $index) {
                    <div class="flex gap-2">
                      <input 
                        type="text" 
                        [(ngModel)]="spec.key"
                        [name]="'specKey' + $index"
                        placeholder="Key (e.g., Material)"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent">
                      <input 
                        type="text" 
                        [(ngModel)]="spec.value"
                        [name]="'specValue' + $index"
                        placeholder="Value (e.g., Solid Wood)"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safs-gold focus:border-transparent">
                      <button 
                        type="button"
                        (click)="removeSpecification($index)"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Remove
                      </button>
                    </div>
                  }
                </div>
                <button 
                  type="button"
                  (click)="addSpecification()"
                  class="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-bold">
                  + Add Specification
                </button>
              </div>

              <!-- Checkboxes -->
              <div class="flex gap-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="form.priceOnRequest"
                    name="priceOnRequest"
                    class="w-5 h-5 text-safs-gold rounded focus:ring-2 focus:ring-safs-gold">
                  <span class="text-sm font-bold text-gray-700">Price on Request</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="form.inStock"
                    name="inStock"
                    class="w-5 h-5 text-safs-gold rounded focus:ring-2 focus:ring-safs-gold">
                  <span class="text-sm font-bold text-gray-700">In Stock</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="form.featured"
                    name="featured"
                    class="w-5 h-5 text-safs-gold rounded focus:ring-2 focus:ring-safs-gold">
                  <span class="text-sm font-bold text-gray-700">Featured</span>
                </label>
              </div>

              <!-- Submit Button -->
              <div class="flex gap-4 pt-6 border-t border-gray-200">
                <button 
                  type="submit"
                  [disabled]="submitting()"
                  class="px-8 py-3 bg-safs-gold text-white rounded-lg hover:bg-opacity-90 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (submitting()) {
                    @if (isEditMode()) {
                      <span>Updating...</span>
                    } @else {
                      <span>Creating...</span>
                    }
                  } @else {
                    @if (isEditMode()) {
                      <span>Update Product</span>
                    } @else {
                      <span>Create Product</span>
                    }
                  }
                </button>
                <button 
                  type="button"
                  (click)="resetForm()"
                  class="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold">
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        }

        <!-- List Products Tab -->
        @if (activeTab() === 'list') {
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-safs-dark">All Products</h2>
                <button 
                  (click)="loadProducts()"
                  class="px-4 py-2 bg-safs-gold text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-bold">
                  Refresh
                </button>
              </div>
            </div>

            @if (productsService.loading()) {
              <div class="p-12 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-safs-gold border-t-transparent mx-auto"></div>
                <p class="text-gray-500 mt-4">Loading products...</p>
              </div>
            } @else if (productsService.products().length === 0) {
              <div class="p-12 text-center">
                <p class="text-gray-500">No products found</p>
              </div>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Image</th>
                      <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Product</th>
                      <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                      <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    @for (product of productsService.products(); track product.id) {
                      <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4">
                          <img 
                            [src]="productsService.parseImages(product)[0] || ''" 
                            [alt]="product.name"
                            class="w-16 h-16 object-cover rounded-lg border border-gray-200">
                        </td>
                        <td class="px-6 py-4">
                          <div class="font-bold text-gray-900">{{ product.name }}</div>
                          <div class="text-xs text-gray-500">{{ product.id }}</div>
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase">
                            {{ product.category }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex flex-col gap-1">
                            @if (product.inStock) {
                              <span class="text-xs text-green-600 font-bold">In Stock</span>
                            } @else {
                              <span class="text-xs text-red-600 font-bold">Out of Stock</span>
                            }
                            @if (product.featured) {
                              <span class="text-xs text-safs-gold font-bold">Featured</span>
                            }
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex gap-2">
                            <a 
                              [routerLink]="['/product', product.id]"
                              target="_blank"
                              class="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors">
                              View
                            </a>
                            <button 
                              (click)="editProduct(product)"
                              class="px-3 py-1 bg-safs-gold text-white rounded text-xs font-bold hover:bg-opacity-90 transition-colors">
                              Edit
                            </button>
                            <button 
                              (click)="viewHistory(product)"
                              class="px-3 py-1 bg-gray-600 text-white rounded text-xs font-bold hover:bg-gray-700 transition-colors">
                              History
                            </button>
                            <button 
                              (click)="deleteProduct(product)"
                              class="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-colors">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>

        }

        <!-- History Modal -->
        @if (viewingHistory()) {
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto" (click)="closeHistory()">
            <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
              <div class="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 class="text-xl font-bold text-safs-dark">Product History</h2>
                  <p class="text-sm text-gray-500">{{ viewingHistory()?.name }}</p>
                </div>
                <button (click)="closeHistory()" class="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div class="p-6 overflow-y-auto">
                @if (loadingHistory()) {
                  <div class="flex justify-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-4 border-safs-gold border-t-transparent"></div>
                  </div>
                } @else if (auditLogs().length === 0) {
                  <p class="text-center text-gray-500 py-12">No history found for this product.</p>
                } @else {
                  <div class="relative pl-6 border-l-2 border-gray-200 space-y-8">
                    @for (log of auditLogs(); track log.id) {
                      <div class="relative">
                        <div class="absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 border-white"
                             [class.bg-green-500]="log.action === 'Create'"
                             [class.bg-blue-500]="log.action === 'Update'"
                             [class.bg-red-500]="log.action === 'Delete'"></div>
                        
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div class="flex justify-between items-start mb-2">
                            <div>
                              <span class="font-bold text-sm uppercase tracking-wider"
                                    [class.text-green-600]="log.action === 'Create'"
                                    [class.text-blue-600]="log.action === 'Update'"
                                    [class.text-red-600]="log.action === 'Delete'">{{ log.action }}</span>
                              <span class="text-gray-400 text-xs mx-2">•</span>
                              <span class="text-xs font-bold text-gray-700">{{ formatDate(log.timestamp) }}</span>
                            </div>
                            <span class="text-xs text-gray-500">{{ log.changedBy }}</span>
                          </div>
                          
                          @if (log.changes) {
                            <div class="text-xs bg-white rounded border border-gray-200 p-2 mt-2 font-mono overflow-x-auto">
                              @if (log.action === 'Create') {
                                <p class="text-gray-500">Item created</p>
                              } @else {
                                <div class="space-y-1">
                                  @for (change of parseChanges(log.changes); track change.key) {
                                    <div class="grid grid-cols-[120px_1fr] gap-2">
                                      <span class="font-bold text-gray-600">{{ change.key }}:</span>
                                      <div class="flex gap-2 items-center">
                                        <span class="text-red-500 line-through opacity-70">{{ formatValue(change.old) }}</span>
                                        <span class="text-gray-400">→</span>
                                        <span class="text-green-600 font-bold">{{ formatValue(change.new) }}</span>
                                      </div>
                                    </div>
                                  }
                                </div>
                              }
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        }
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdminProductsComponent implements OnInit {
  authService = inject(AuthService);
  productsService = inject(ProductsService);
  router = inject(Router);

  activeTab = signal<'create' | 'list'>('create');
  submitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  editingProduct = signal<Product | null>(null);
  isEditMode = signal(false);

  // History viewing
  viewingHistory = signal<Product | null>(null);
  loadingHistory = signal(false);
  auditLogs = signal<ProductAuditLog[]>([]);

  form: ProductForm = {
    id: '',
    name: '',
    category: '',
    description: '',
    price: null,
    priceOnRequest: true,
    inStock: true,
    featured: false,
    imageFiles: [],
    imageUrls: [],
    features: [''],
    specifications: [{ key: '', value: '' }],
    colorVariations: []
  };

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe();
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.form.imageFiles = [...this.form.imageFiles, ...files];

      // Create preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.imageUrls.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.form.imageFiles.splice(index, 1);
    this.form.imageUrls.splice(index, 1);
  }

  addFeature() {
    this.form.features.push('');
  }

  removeFeature(index: number) {
    this.form.features.splice(index, 1);
  }

  addSpecification() {
    this.form.specifications.push({ key: '', value: '' });
  }

  removeSpecification(index: number) {
    this.form.specifications.splice(index, 1);
  }

  addColorVariation() {
    this.form.colorVariations.push({
      color: '',
      imageFiles: [],
      imageUrls: []
    });
  }

  removeColorVariation(index: number) {
    this.form.colorVariations.splice(index, 1);
  }

  triggerColorImageUpload(index: number) {
    const fileInput = document.getElementById('colorFileInput' + index) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onColorVariationImageSelect(event: Event, variationIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const variation = this.form.colorVariations[variationIndex];

      variation.imageFiles = [...variation.imageFiles, ...files];

      // Create preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          variation.imageUrls.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeColorVariationImage(variationIndex: number, imageIndex: number) {
    const variation = this.form.colorVariations[variationIndex];
    variation.imageFiles.splice(imageIndex, 1);
    variation.imageUrls.splice(imageIndex, 1);
  }

  editProduct(product: Product) {
    this.editingProduct.set(product);
    this.isEditMode.set(true);

    // Load product data into form
    const images = this.productsService.parseImages(product);
    const features = this.productsService.parseFeatures(product);
    const specs = this.productsService.parseSpecifications(product);
    const colorVars = this.productsService.parseColorVariations(product);

    this.form = {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description || '',
      price: product.price,
      priceOnRequest: product.priceOnRequest,
      inStock: product.inStock,
      featured: product.featured,
      imageFiles: [],
      imageUrls: images,
      features: features.length > 0 ? features : [''],
      specifications: Object.keys(specs).length > 0
        ? Object.entries(specs).map(([key, value]) => ({ key, value }))
        : [{ key: '', value: '' }],
      colorVariations: colorVars.map(v => ({
        color: v.color,
        imageFiles: [],
        imageUrls: v.images
      }))
    };

    // Switch to create tab
    this.activeTab.set('create');

    // Clear messages
    this.successMessage.set(null);
    this.errorMessage.set(null);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditMode.set(false);
    this.editingProduct.set(null);
    this.resetForm();
  }

  async submitProduct() {
    // Validation
    if (!this.form.id || !this.form.name || !this.form.category) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    if (this.form.imageUrls.length === 0) {
      this.errorMessage.set('Please upload at least one image');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    try {
      // Prepare product data
      const productData: Partial<Product> = {
        id: this.form.id,
        name: this.form.name,
        category: this.form.category,
        description: this.form.description || null,
        price: this.form.price,
        priceOnRequest: this.form.priceOnRequest,
        inStock: this.form.inStock,
        featured: this.form.featured,
        // Store image URLs as JSON string
        images: JSON.stringify(this.form.imageUrls),
        // Store features as JSON string
        features: JSON.stringify(this.form.features.filter(f => f.trim() !== '')),
        // Store specifications as JSON string
        specifications: JSON.stringify(
          this.form.specifications
            .filter(s => s.key.trim() !== '' && s.value.trim() !== '')
            .reduce((acc, spec) => ({ ...acc, [spec.key]: spec.value }), {})
        ),
        // Store color variations as JSON string
        colorVariations: JSON.stringify(
          this.form.colorVariations
            .filter(v => v.color.trim() !== '' && v.imageUrls.length > 0)
            .map(v => ({ color: v.color, images: v.imageUrls }))
        )
      };

      if (this.isEditMode()) {
        // Update existing product
        this.productsService.updateProduct(this.form.id, productData).subscribe({
          next: (product) => {
            this.successMessage.set(`Product "${product.name}" updated successfully!`);
            this.isEditMode.set(false);
            this.editingProduct.set(null);
            this.resetForm();
            this.loadProducts();

            // Clear success message after 5 seconds
            setTimeout(() => this.successMessage.set(null), 5000);

            this.submitting.set(false);
          },
          error: (err) => {
            this.errorMessage.set(err.error?.error || 'Failed to update product');
            this.submitting.set(false);
          }
        });
      } else {
        // Create new product
        this.productsService.createProduct(productData).subscribe({
          next: (product) => {
            this.successMessage.set(`Product "${product.name}" created successfully!`);
            this.resetForm();
            this.loadProducts();

            // Clear success message after 5 seconds
            setTimeout(() => this.successMessage.set(null), 5000);

            this.submitting.set(false);
          },
          error: (err) => {
            this.errorMessage.set(err.error?.error || 'Failed to create product');
            this.submitting.set(false);
          }
        });
      }
    } catch (error) {
      this.errorMessage.set('An unexpected error occurred');
      this.submitting.set(false);
    }
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productsService.deleteProduct(product.id).subscribe({
        next: () => {
          this.successMessage.set(`Product "${product.name}" deleted successfully!`);
          this.loadProducts();
          setTimeout(() => this.successMessage.set(null), 5000);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.error || 'Failed to delete product');
        }
      });
    }
  }

  // History methods
  viewHistory(product: Product) {
    this.viewingHistory.set(product);
    this.loadingHistory.set(true);
    this.auditLogs.set([]); // Clear previous logs

    this.productsService.getProductHistory(product.id).subscribe({
      next: (logs) => {
        this.auditLogs.set(logs);
        this.loadingHistory.set(false);
      },
      error: (err) => {
        console.error('Failed to load history', err);
        this.loadingHistory.set(false);
      }
    });
  }

  closeHistory() {
    this.viewingHistory.set(null);
  }

  switchTab(tab: 'create' | 'list') {
    this.activeTab.set(tab);
    if (tab === 'create' && !this.isEditMode()) {
      this.resetForm();
    }
  }

  resetForm() {
    this.form = {
      id: '',
      name: '',
      category: '',
      description: '',
      price: null,
      priceOnRequest: true,
      inStock: true,
      featured: false,
      imageFiles: [],
      imageUrls: [],
      features: [''],
      specifications: [{ key: '', value: '' }],
      colorVariations: []
    };
    // If we were editing, stop editing mode
    if (this.isEditMode()) {
      this.isEditMode.set(false);
      this.editingProduct.set(null);
      this.activeTab.set('list');
    }
  }

  // Helpers for template
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-ZA');
  }

  parseChanges(changesJson: string): { key: string, old: any, new: any }[] {
    try {
      const changes = JSON.parse(changesJson);
      // Handle the dictionary structure { "Price": { "old": ..., "new": ... } }
      return Object.entries(changes).map(([key, value]: [string, any]) => ({
        key,
        old: value?.old,
        new: value?.new || value?.['new'] // handle @new mapping if needed
      }));
    } catch {
      return [];
    }
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin-signin']);
  }
}
