import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private store = new Map<string, CacheEntry<any>>();
  private inflight = new Map<string, Promise<any>>();

  async get<T>(key: string, fetcher: () => Promise<T>, ttlMs = 30_000): Promise<T> {
    const now = Date.now();
    const existing = this.store.get(key);
    if (existing && now < existing.expiresAt) {
      return existing.data;
    }

    const pending = this.inflight.get(key);
    if (pending) return pending as T;

    const promise = fetcher().then(data => {
      this.store.set(key, { data, expiresAt: now + ttlMs });
      this.inflight.delete(key);
      return data;
    }).catch(err => {
      this.inflight.delete(key);
      throw err;
    });

    this.inflight.set(key, promise);
    return promise;
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidateAll(): void {
    this.store.clear();
  }

  stale<T>(key: string): T | null {
    const entry = this.store.get(key);
    return entry ? entry.data : null;
  }
}
