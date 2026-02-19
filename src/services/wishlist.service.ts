import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { WishlistItem, WishlistResponse, AddToWishlistRequest, WishlistAnalytics } from '../types/api.types';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = '/api/wishlist';

    // Signals
    wishlistItems = signal<WishlistItem[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    // Computed
    wishlistCount = computed(() => this.wishlistItems().length);
    wishlistProductIds = computed(() =>
        new Set(this.wishlistItems().map(item => item.productId))
    );

    /**
     * Get current user's wishlist
     */
    getMyWishlist(): Observable<WishlistResponse> {
        this.loading.set(true);
        this.error.set(null);

        const headers = this.authService.getAuthHeaders();

        return this.http.get<WishlistResponse>(this.apiUrl, { headers }).pipe(
            tap({
                next: (response) => {
                    this.wishlistItems.set(response.items);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err.error?.error || 'Failed to load wishlist');
                    this.loading.set(false);
                }
            })
        );
    }

    /**
     * Add product to wishlist
     */
    addToWishlist(productId: string): Observable<WishlistItem> {
        const headers = this.authService.getAuthHeaders();
        const request: AddToWishlistRequest = { productId };

        return this.http.post<WishlistItem>(this.apiUrl, request, { headers }).pipe(
            tap({
                next: (item) => {
                    this.wishlistItems.update(items => [item, ...items]);
                },
                error: (err) => {
                    this.error.set(err.error?.error || 'Failed to add to wishlist');
                }
            })
        );
    }

    /**
     * Remove product from wishlist
     */
    removeFromWishlist(id: number): Observable<{ success: boolean; message: string }> {
        const headers = this.authService.getAuthHeaders();

        return this.http.delete<{ success: boolean; message: string }>(
            `${this.apiUrl}/${id}`,
            { headers }
        ).pipe(
            tap({
                next: () => {
                    this.wishlistItems.update(items => items.filter(item => item.id !== id));
                },
                error: (err) => {
                    this.error.set(err.error?.error || 'Failed to remove from wishlist');
                }
            })
        );
    }

    /**
     * Check if a product is in the wishlist
     */
    isInWishlist(productId: string): boolean {
        return this.wishlistProductIds().has(productId);
    }

    /**
     * Check if product is in wishlist via API
     */
    checkWishlist(productId: string): Observable<{ inWishlist: boolean }> {
        const headers = this.authService.getAuthHeaders();
        return this.http.get<{ inWishlist: boolean }>(
            `${this.apiUrl}/check/${productId}`,
            { headers }
        );
    }

    /**
     * Get wishlist analytics (Admin only)
     */
    getWishlistAnalytics(): Observable<WishlistAnalytics> {
        const headers = this.authService.getAuthHeaders();
        return this.http.get<WishlistAnalytics>(`${this.apiUrl}/admin/analytics`, { headers });
    }

    /**
     * Get all customer wishlists (Admin only)
     */
    getAllWishlists(): Observable<WishlistResponse> {
        const headers = this.authService.getAuthHeaders();
        return this.http.get<WishlistResponse>(`${this.apiUrl}/admin/all`, { headers });
    }

    /**
     * Clear wishlist state
     */
    clearWishlist() {
        this.wishlistItems.set([]);
        this.error.set(null);
    }
}
