import { Component, effect, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  createColumnHelper,
} from '@tanstack/angular-table';
import type { SortingState, PaginationState } from '@tanstack/angular-table';
import { Product, ProductsService } from '../services/products.service';

@Component({
  selector: 'app-product-inventory-table',
  standalone: true,
  imports: [CommonModule, FormsModule, FlexRenderDirective],
  template: `
    <div class="glass-panel p-4 sm:p-5 mb-5" style="border-radius:1.25rem">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-safs-dark">Products Inventory</h2>
          <p class="text-xs text-safs-text-muted">Track stock, featured items, and price-on-request products.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button (click)="openForm.emit()" class="btn-primary">+ Add Product</button>
          <button (click)="refresh()" class="btn-outline" style="color:var(--safs-text-muted);border-color:rgba(127,140,141,0.2);background:rgba(255,255,255,0.6)">Refresh</button>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <input [(ngModel)]="search" (input)="onFilterChange()" placeholder="Search name or description..." class="form-input">
        <select [(ngModel)]="categoryFilter" (change)="onFilterChange()" class="form-select">
          <option value="">All Categories</option>
          @for (cat of categories(); track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
        <select [(ngModel)]="stockFilter" (change)="onFilterChange()" class="form-select">
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <label class="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/40 bg-white/60 text-sm cursor-pointer hover:bg-white/80 transition-colors">
          <input type="checkbox" [(ngModel)]="featuredOnly" (change)="onFilterChange()">
          Featured only
        </label>
        <button (click)="clearFilters()" class="form-select text-safs-text-main hover:bg-white/80">Clear Filters</button>
      </div>
    </div>

    @if (inventoryCounts(); as counts) {
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div class="stat-card"><p class="stat-card-value">{{ counts.total }}</p><p class="stat-card-label">Total</p></div>
        <div class="stat-card"><p class="stat-card-value" style="color:#15803D">{{ counts.inStock }}</p><p class="stat-card-label">In Stock</p></div>
        <div class="stat-card"><p class="stat-card-value" style="color:#DC2626">{{ counts.outOfStock }}</p><p class="stat-card-label">Out of Stock</p></div>
        <div class="stat-card"><p class="stat-card-value" style="color:#B45309">{{ counts.featured }}</p><p class="stat-card-label">Featured</p></div>
        <div class="stat-card"><p class="stat-card-value">{{ counts.priceOnRequest }}</p><p class="stat-card-label">Price on Request</p></div>
      </div>
    }

    @if (loading()) {
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        @for (i of [1,2,3,4,5,6]; track i) {
          <div class="data-card p-4"><div class="skeleton-block mb-3"></div><div class="skeleton-line" style="width:40%"></div><div class="skeleton-line" style="width:70%"></div><div class="skeleton-line" style="width:50%"></div></div>
        }
      </div>
    } @else if (products().length === 0) {
      <div class="glass-panel p-12 text-center" style="border-radius:1.25rem">
        <p class="text-safs-text-muted text-sm">No products found.</p>
      </div>
    } @else {
      <div class="glass-panel overflow-hidden" style="border-radius:1.25rem">
        <div class="overflow-x-auto">
          <table class="data-table" style="min-width:800px">
            <thead>
              @for (headerGroup of table().getHeaderGroups(); track headerGroup.id) {
                <tr>
                  @for (header of headerGroup.headers; track header.id) {
                    <th
                      [class.cursor-pointer]="header.column.getCanSort()"
                      (click)="header.column.getToggleSortingHandler()"
                      [style.width]="header.getSize() + 'px'"
                    >
                      <div class="flex items-center gap-1.5">
                        <ng-template [flexRender]="header.column.columnDef.header" [flexRenderProps]="header.getContext()">{{ $implicit }}</ng-template>
                        @if (header.column.getIsSorted() === 'asc') {
                          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
                        } @else if (header.column.getIsSorted() === 'desc') {
                          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                        }
                      </div>
                    </th>
                  }
                </tr>
              }
            </thead>
            <tbody>
              @for (row of table().getRowModel().rows; track row.id) {
                <tr>
                  @for (cell of row.getVisibleCells(); track cell.id) {
                    <td>
                      @if (cell.column.id === 'actions') {
                        <div class="flex gap-2">
                          <button (click)="editProduct.emit(row.original)" class="btn-outline">Edit</button>
                          <button (click)="deleteProduct.emit(row.original.id)" class="btn-ghost">Delete</button>
                        </div>
                      } @else if (cell.column.id === 'name') {
                        {{ row.original.name }}
                      } @else if (cell.column.id === 'category') {
                        <span class="status-badge status-badge--new py-0.5 px-2 text-[0.625rem]">{{ row.original.category }}</span>
                      } @else if (cell.column.id === 'in_stock') {
                        @if (row.original.in_stock) {
                          <span class="text-xs font-medium" style="color:#15803D">In Stock</span>
                        } @else {
                          <span class="text-xs font-medium" style="color:#DC2626">Out of Stock</span>
                        }
                      } @else if (cell.column.id === 'featured') {
                        @if (row.original.featured) {
                          <span class="text-xs">&#9733; Featured</span>
                        } @else {
                          <span class="text-xs opacity-30">&#9733;</span>
                        }
                      } @else if (cell.column.id === 'price') {
                        @if (row.original.price_on_request) {
                          Request Price
                        } @else if (row.original.price === null || row.original.price === undefined) {
                          &mdash;
                        } @else {
                          R{{ row.original.price.toFixed(2) }}
                        }
                      } @else if (cell.column.id === 'updated_at') {
                        {{ formatDate(row.original.updated_at || row.original.created_at) }}
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-white/30">
          <span class="text-xs text-safs-text-muted">
            Showing {{ table().getRowModel().rows.length }} of {{ totalProducts() }} products
          </span>
          <div class="flex items-center gap-3">
            <span class="text-xs text-safs-text-muted">Rows per page:</span>
            <select
              class="form-select !w-auto !py-1 !text-xs"
              [ngModel]="pageSize()"
              (ngModelChange)="pageSize.set($event)"
            >
              <option [value]="25">25</option>
              <option [value]="50">50</option>
              <option [value]="100">100</option>
            </select>
            <div class="flex items-center gap-1">
              <button
                (click)="table().setPageIndex(0)"
                [disabled]="!table().getCanPreviousPage()"
                class="btn-ghost !px-2 !py-1"
              >&laquo;</button>
              <button
                (click)="table().previousPage()"
                [disabled]="!table().getCanPreviousPage()"
                class="btn-ghost !px-2 !py-1"
              >&lsaquo;</button>
              <span class="text-xs text-safs-text-muted px-2">
                Page {{ currentPage() }} of {{ table().getPageCount() }}
              </span>
              <button
                (click)="table().nextPage()"
                [disabled]="!table().getCanNextPage()"
                class="btn-ghost !px-2 !py-1"
              >&rsaquo;</button>
              <button
                (click)="table().setPageIndex(table().getPageCount() - 1)"
                [disabled]="!table().getCanNextPage()"
                class="btn-ghost !px-2 !py-1"
              >&raquo;</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .data-table th { user-select: none; white-space: nowrap; }
  `]
})
export class ProductInventoryTableComponent {
  private productsService = inject(ProductsService);

  categories = input<string[]>([]);
  loading = input(false);
  totalProducts = input(0);
  currentPage = input(1);
  totalPages = input(0);

  refreshTrigger = input(0);
  openForm = output<void>();
  editProduct = output<Product>();
  deleteProduct = output<number>();

  search = signal('');
  categoryFilter = signal('');
  stockFilter = signal<'all' | 'in' | 'out'>('all');
  featuredOnly = signal(false);

  sorting = signal<SortingState>([]);
  pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 25 });
  pageSize = signal(25);

  products = computed(() => this.productsService.products());

  private columnHelper = createColumnHelper<Product>();

  private columns = [
    this.columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: true,
      size: 200,
    }),
    this.columnHelper.accessor('category', {
      header: 'Category',
      enableSorting: true,
      size: 150,
    }),
    this.columnHelper.accessor('price', {
      header: 'Price',
      enableSorting: true,
      size: 120,
    }),
    this.columnHelper.accessor('in_stock', {
      header: 'Stock',
      enableSorting: true,
      size: 100,
    }),
    this.columnHelper.accessor('featured', {
      header: 'Featured',
      enableSorting: true,
      size: 100,
    }),
    this.columnHelper.accessor('updated_at', {
      header: 'Last Updated',
      enableSorting: true,
      size: 180,
    }),
    this.columnHelper.display({
      id: 'actions',
      header: 'Actions',
      size: 140,
    }),
  ];

  table = createAngularTable<Product>(() => ({
    data: this.products(),
    columns: this.columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: this.totalPages(),
    state: {
      sorting: this.sorting(),
      pagination: this.pagination(),
    },
    onSortingChange: updaterOrValue => {
      const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(this.sorting()) : updaterOrValue;
      this.sorting.set(newValue);
    },
    onPaginationChange: updaterOrValue => {
      const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(this.pagination()) : updaterOrValue;
      this.pagination.set(newValue);
      this.pageSize.set(newValue.pageSize);
    },
  }));

  constructor() {
    effect(() => {
      const sort = this.sorting();
      const page = this.pagination();
      const pgSize = this.pageSize();
      const srch = this.search();
      const cat = this.categoryFilter();
      const stock = this.stockFilter();
      const feat = this.featuredOnly();
      void this.refreshTrigger();

      const sortBy = sort.length > 0 ? sort[0].id : undefined;
      const sortDir = sort.length > 0 ? (sort[0].desc ? 'desc' : 'asc') : undefined;

      this.productsService.fetchProducts({
        search: srch || undefined,
        category: cat || undefined,
        in_stock: stock === 'all' ? undefined : stock === 'in',
        featured: feat ? true : undefined,
        page: page.pageIndex + 1,
        per_page: pgSize,
        sort_by: sortBy,
        sort_dir: sortDir as 'asc' | 'desc' | undefined,
      });
    }, { allowSignalWrites: true });
  }

  get inventoryCounts() {
    return () => {
      const products = this.products();
      const inStock = products.filter(p => p.in_stock).length;
      const featured = products.filter(p => p.featured).length;
      const priceOnRequest = products.filter(p => p.price_on_request).length;
      return {
        total: this.totalProducts(),
        inStock,
        outOfStock: this.totalProducts() - inStock,
        featured,
        priceOnRequest,
      };
    };
  }

  onFilterChange(): void {
    this.pagination.set({ pageIndex: 0, pageSize: this.pageSize() });
  }

  clearFilters(): void {
    this.search.set('');
    this.categoryFilter.set('');
    this.stockFilter.set('all');
    this.featuredOnly.set(false);
    this.pagination.set({ pageIndex: 0, pageSize: this.pageSize() });
  }

  refresh(): void {
    void this.productsService.fetchProducts();
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('en-ZA', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }
}
