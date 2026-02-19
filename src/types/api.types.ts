/**
 * API Types and Interfaces
 * Matches the .NET API DTOs and Models
 */

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface User {
    id: number;
    email: string;
    role: 'customer' | 'admin';
    status: 'pending' | 'approved' | 'declined';
    companyName: string | null;
    contactPerson: string | null;
    phone: string | null;
    address: string | null;
}

// ============================================================================
// Customer Types (Admin only)
// ============================================================================

export interface Customer {
    id: number;
    email: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    address: string | null;
    status: 'pending' | 'approved' | 'declined';
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateCustomerRequest {
    email: string;
    password: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    address?: string;
    status?: 'pending' | 'approved' | 'declined';
}

export interface UpdateCustomerStatusRequest {
    status: 'pending' | 'approved' | 'declined';
    reason?: string;
}

export interface CustomersListResponse {
    customers: Customer[];
}

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
    productId: number;
    id: string; // slug/URL-friendly ID
    name: string;
    category: string;
    description: string | null;
    price: number | null;
    priceOnRequest: boolean;
    images: string; // JSON string array
    specifications: string | null; // JSON object as string
    features: string | null; // JSON string array
    inStock: boolean;
    featured: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateProductRequest {
    id: string; // slug
    name: string;
    category: string;
    description?: string;
    price?: number;
    priceOnRequest?: boolean;
    images?: string[];
    specifications?: Record<string, string>;
    features?: string[];
    inStock?: boolean;
    featured?: boolean;
}

export interface UpdateProductRequest {
    name?: string;
    category?: string;
    description?: string;
    price?: number;
    priceOnRequest?: boolean;
    images?: string[];
    specifications?: Record<string, string>;
    features?: string[];
    inStock?: boolean;
    featured?: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
    error: string;
    details?: string;
}

export interface SuccessResponse {
    success: boolean;
    message: string;
}

// ============================================================================
// Helper Types
// ============================================================================

export interface ProductFilters {
    category?: string;
    search?: string;
}

export interface CustomerFilters {
    status?: 'pending' | 'approved' | 'declined';
    search?: string;
}

export type UserRole = 'customer' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'declined';
export type ProductCategory = 'casket' | 'accessory' | 'child';

// ============================================================================
// Wishlist Types
// ============================================================================

export interface WishlistItem {
    id: number;
    userId: number;
    productId: string; // Product slug
    productName: string;
    category: string;
    images: string; // JSON string array
    price: number | null;
    priceOnRequest: boolean;
    createdAt: string;
    // Admin view only
    customerEmail?: string;
    customerCompanyName?: string;
    customerContactPerson?: string;
}

export interface AddToWishlistRequest {
    productId: string; // Product slug
}

export interface WishlistResponse {
    items: WishlistItem[];
}

export interface PopularProduct {
    productId: string; // Product slug
    productName: string;
    category: string;
    wishlistCount: number;
    interestedCustomers: string[];
}

export interface CustomerWishlistSummary {
    userId: number;
    email: string;
    companyName: string | null;
    contactPerson: string | null;
    wishlistItemCount: number;
    products: string[];
}

export interface WishlistAnalytics {
    popularProducts: PopularProduct[];
    customerSummaries: CustomerWishlistSummary[];
    totalWishlistItems: number;
    uniqueCustomers: number;
    uniqueProducts: number;
}
