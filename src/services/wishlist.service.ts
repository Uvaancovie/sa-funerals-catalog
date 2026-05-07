import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface WishlistItem {
  id: string;
  productId: string;
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly storageKey = 'wishlist_items';

  // Called from templates/components as `wishlistService.wishlistItems()`
  readonly wishlistItems = signal<WishlistItem[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  getMyWishlist(): Observable<WishlistItem[]> {
    this.loadFromStorage();
    return of(this.wishlistItems());
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems().some((i) => i.productId === productId);
  }

  addToWishlist(productId: string): Observable<void> {
    if (this.isInWishlist(productId)) return of(void 0);

    const item: WishlistItem = {
      id: crypto.randomUUID(),
      productId,
    };

    this.wishlistItems.update((items) => [...items, item]);
    this.persistToStorage();
    return of(void 0);
  }

  removeFromWishlist(wishlistItemId: string): Observable<void> {
    this.wishlistItems.update((items) => items.filter((i) => i.id !== wishlistItemId));
    this.persistToStorage();
    return of(void 0);
  }

  private loadFromStorage(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      this.wishlistItems.set([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as WishlistItem[];
      this.wishlistItems.set(Array.isArray(parsed) ? parsed : []);
    } catch {
      this.wishlistItems.set([]);
    }
  }

  private persistToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.wishlistItems()));
  }
}

