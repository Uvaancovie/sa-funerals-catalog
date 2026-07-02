import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-container" [style.aspect-ratio]="aspectRatio" [class]="containerClass">
      <picture class="main-image-wrapper">
        <source
          [srcset]="getSupabaseImageUrl('webp')"
          type="image/webp"
        >
        <img
          [src]="getSupabaseImageUrl('jpg')"
          [alt]="alt"
          [loading]="loading"
          [attr.fetchpriority]="fetchpriority"
          [decoding]="decoding"
          class="main-image"
          [class.loaded]="loaded"
          [class.instant]="skipTransition"
          (load)="onImageLoad()"
          (error)="onImageError()"
        >
      </picture>

      <div *ngIf="!loaded && showLoadingIndicator" class="loading-indicator">
        <div class="loading-spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .image-container {
      position: relative;
      overflow: hidden;
      background-color: #f8f9fa;
      contain: layout style;
    }

    .main-image-wrapper {
      width: 100%;
      height: 100%;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.08s ease;
    }

    .main-image.loaded {
      opacity: 1;
    }

    .main-image.instant {
      transition: none !important;
      opacity: 1 !important;
    }

    .loading-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e9ecef;
      border-top: 3px solid #8a7a3b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .image-container {
        border-radius: 0.5rem;
      }
    }

    @media (min-width: 641px) {
      .image-container {
        border-radius: 0.75rem;
      }
    }
  `]
})
export class OptimizedImageComponent implements OnInit, OnDestroy, OnChanges {
  @Input() src!: string;
  @Input() alt!: string;
  @Input() aspectRatio = '4/3';
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() fetchpriority: 'high' | 'low' | 'auto' = 'auto';
  @Input() decoding: 'sync' | 'async' | 'auto' = 'async';
  @Input() containerClass = '';
  @Input() showLoadingIndicator = false;

  @Input() prefetchUrls: string[] = [];

  loaded = false;
  skipTransition = false;
  imageFailed = false;

  private static loadedCache = new Set<string>();
  private prefetchLinks: HTMLLinkElement[] = [];

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['src'] && !changes['src'].firstChange) {
      const newSrc = changes['src'].currentValue;
      const oldSrc = changes['src'].previousValue;

      const newResolved = newSrc;
      const oldResolved = oldSrc;
      if (newResolved === oldResolved) return;

      if (OptimizedImageComponent.loadedCache.has(newResolved)) {
        this.loaded = true;
        this.skipTransition = true;
      } else {
        this.loaded = false;
        this.skipTransition = false;
      }
    }

    if (changes['prefetchUrls']) {
      this.doPrefetch();
    }
  }

  ngOnDestroy() {
    this.cleanupPrefetchLinks();
  }

  private setupIntersectionObserver(): void {
    if (this.loading === 'lazy' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '50px' }
      );

      const container = document.querySelector('.image-container') as HTMLElement;
      if (container) {
        observer.observe(container);
      }
    }
  }

  private doPrefetch(): void {
    this.cleanupPrefetchLinks();

    if (!this.prefetchUrls?.length) return;

    const schedule = (window as any).requestIdleCallback || ((cb: Function) => setTimeout(cb, 50));

    schedule(() => {
      for (const url of this.prefetchUrls) {
        if (!url) continue;

        if (OptimizedImageComponent.loadedCache.has(url)) continue;

        const webpUrl = url.replace(/\.(jpg|jpeg|png)$/i, '.webp');

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = webpUrl;
        link.type = 'image/webp';
        document.head.appendChild(link);
        this.prefetchLinks.push(link);

        const imgPreload = new Image();
        imgPreload.src = webpUrl;

        const jpgPreload = new Image();
        jpgPreload.src = url;
      }
    });
  }

  private cleanupPrefetchLinks(): void {
    for (const link of this.prefetchLinks) {
      link.remove();
    }
    this.prefetchLinks = [];
  }

  getSupabaseImageUrl(format?: 'jpg' | 'webp' | 'jpeg'): string {
    if (!this.src) return '';
    if (format === 'webp') {
      return this.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    const fallback = format === 'jpeg' ? 'jpg' : '';
    return this.src;
  }

  onImageLoad(): void {
    this.loaded = true;
    OptimizedImageComponent.loadedCache.add(this.src);
  }

  onImageError(): void {
    this.imageFailed = true;
  }
}
