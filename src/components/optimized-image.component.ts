import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule],
template: `
    <div class="image-container" [style.aspect-ratio]="aspectRatio" [class]="containerClass">
      <!-- Blur placeholder (shown while main image loads) -->
      <img
        *ngIf="!loaded && blurSrc && !optimizerFailed"
        [src]="blurSrc"
        class="blur-placeholder"
        [alt]="alt"
        aria-hidden="true"
      >

      <!-- Main responsive image using Vercel Image Optimization -->
      <picture class="main-image-wrapper" *ngIf="!optimizerFailed">
        <source
          [srcset]="getVercelSrcset('avif')"
          [sizes]="sizes"
          type="image/avif"
        >
        <source
          [srcset]="getVercelSrcset('webp')"
          [sizes]="sizes"
          type="image/webp"
        >
        <img
          [src]="getVercelImageUrl(800)"
          [srcset]="getVercelSrcset('jpg')"
          [sizes]="sizes"
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

      <!-- Fallback direct image (when optimizer fails) -->
      <img
        *ngIf="optimizerFailed"
        [src]="getDirectImageUrl()"
        [alt]="alt"
        [loading]="loading"
        [attr.fetchpriority]="fetchpriority"
        [decoding]="decoding"
        class="main-image loaded"
      >

      <!-- Loading indicator (optional) -->
      <div *ngIf="!loaded && showLoadingIndicator && !optimizerFailed" class="loading-indicator">
        <div class="loading-spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .image-container {
      position: relative;
      overflow: hidden;
      background-color: #f8f9fa;
    }

    .blur-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: blur(10px);
      transform: scale(1.1);
      transition: opacity 0.15s ease;
      object-fit: cover;
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
      transition: opacity 0.15s ease;
    }

    .main-image.loaded {
      opacity: 1;
    }

    /* Skip transition entirely for pre-cached images */
    .main-image.instant {
      transition: none !important;
      opacity: 1 !important;
    }

    .main-image.loaded ~ .blur-placeholder {
      opacity: 0;
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

    /* Responsive container adjustments */
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
  @Input() sizes = '(max-width: 640px) 400px, (max-width: 1024px) 800px, (max-width: 1280px) 1200px, 1600px';

  /** URLs to prefetch in the background (e.g., other color variant images) */
  @Input() prefetchUrls: string[] = [];

  loaded = false;
  /** When true, skip the opacity transition (image was already cached) */
  skipTransition = false;
  /** When true, the Vercel optimizer has failed and we use direct URLs */
  optimizerFailed = false;

  /** Cache of resolved image paths that have been fully loaded */
  private static loadedCache = new Set<string>();
  /** Prefetch link elements we've added to <head> */
  private prefetchLinks: HTMLLinkElement[] = [];

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['src'] && !changes['src'].firstChange) {
      const newSrc = changes['src'].currentValue;
      const oldSrc = changes['src'].previousValue;

      // If the resolved path hasn't actually changed, do nothing
      const newResolved = this.resolvePathForSrc(newSrc);
      const oldResolved = this.resolvePathForSrc(oldSrc);
      if (newResolved === oldResolved) return;

      // If optimizer already failed, keep using direct URLs — don't reset and re-try
      // This prevents the flash caused by destroying/recreating the <picture> element
      if (this.optimizerFailed) {
        // The fallback <img [src]="getDirectImageUrl()"> will auto-update
        // because Angular re-evaluates the binding. No state reset needed.
        return;
      }

      // Check if this image was already loaded/cached
      if (OptimizedImageComponent.loadedCache.has(newResolved)) {
        // Image is cached — show instantly, no transition
        this.loaded = true;
        this.skipTransition = true;
      } else {
        // New image — reset for fresh load with fast transition
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

  /**
   * Prefetch alternate images using <link rel="prefetch"> for instant switching.
   * This tells the browser to fetch images at low priority during idle time.
   */
  private doPrefetch(): void {
    this.cleanupPrefetchLinks();

    if (!this.prefetchUrls?.length) return;

    // Use requestIdleCallback to avoid blocking the main thread
    const schedule = (window as any).requestIdleCallback || ((cb: Function) => setTimeout(cb, 50));

    schedule(() => {
      for (const url of this.prefetchUrls) {
        if (!url) continue;

        const resolvedPath = this.resolvePathForSrc(url);

        // Skip if already loaded/cached
        if (OptimizedImageComponent.loadedCache.has(resolvedPath)) continue;

        // If optimizer is working, prefetch via Vercel optimization
        if (!this.optimizerFailed) {
          // Prefetch the webp version at 800w (the most common display size)
          const prefetchUrl = this.buildVercelUrl(resolvedPath, 800, 'webp');
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.as = 'image';
          link.href = prefetchUrl;
          link.type = 'image/webp';
          document.head.appendChild(link);
          this.prefetchLinks.push(link);
        }

        // Always prefetch the direct image as well (works on both localhost and Vercel)
        const directLink = document.createElement('link');
        directLink.rel = 'prefetch';
        directLink.as = 'image';
        directLink.href = resolvedPath;
        document.head.appendChild(directLink);
        this.prefetchLinks.push(directLink);
      }
    });
  }

  private cleanupPrefetchLinks(): void {
    for (const link of this.prefetchLinks) {
      link.remove();
    }
    this.prefetchLinks = [];
  }

  /**
   * Resolve a src path to the canonical path (for cache key and URL building).
   */
  private resolvePathForSrc(src: string): string {
    if (!src) return '';
    let path = src;
    if (path.startsWith('http')) return path;
    path = path.replace(/^\/+/, '');
    if (path.toLowerCase().startsWith('assets/')) return `/${path}`;
    if (path.toUpperCase().startsWith('SAFS IMAGES/')) return `/safs-images/${path.substring(12)}`;
    if (path.toLowerCase().startsWith('safs-images/')) return `/${path}`;
    return `/safs-images/${path}`;
  }

  /**
   * Build a Vercel Image Optimization URL from a resolved path.
   */
  private buildVercelUrl(resolvedPath: string, width: number, format: string = 'auto', quality: number = 85): string {
    return `/_vercel/image?url=${encodeURIComponent(resolvedPath)}&w=${width}&q=${quality}&f=${format}`;
  }

  /**
   * Gets the original image path from the src (raw path, not encoded)
   */
  private getOriginalImagePath(): string {
    return this.getResolvedPath(true);
  }

  private getResolvedPath(keepExtension = false): string {
    if (!this.src) return '';
    
    let path = this.src;
    
    // 1. Remove file extension if we are generating optimized versions
    if (!keepExtension) {
      path = path.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
    }
    
    // 2. If it's already an external HTTP URL, use it as-is
    if (path.startsWith('http')) {
      return path;
    }

    // 3. Clean up any accidental leading slashes
    path = path.replace(/^\/+/, '');

    // Format A: The NEW dynamic .NET Database format (e.g., "assets/product-id/image.jpg")
    if (path.toLowerCase().startsWith('assets/')) {
      return `/${path}`; 
    }

    // Format B: The OLD legacy JSON format (e.g., "SAFS IMAGES/Category/image.jpg")
    if (path.toUpperCase().startsWith('SAFS IMAGES/')) {
      return `/safs-images/${path.substring(12)}`;
    }

    // Format C: Already correctly formatted for the output folder
    if (path.toLowerCase().startsWith('safs-images/')) {
      return `/${path}`;
    }

    // Format D: Fallback for raw paths
    return `/safs-images/${path}`;
  }

  /**
   * Generates Vercel Image Optimization URL
   */
  getVercelImageUrl(width: number, format: string = 'auto', quality: number = 85): string {
    const imagePath = this.getOriginalImagePath();
    return `/_vercel/image?url=${encodeURIComponent(imagePath)}&w=${width}&q=${quality}&f=${format}`;
  }

  /**
   * Gets the direct image URL (fallback when optimizer fails)
   */
  getDirectImageUrl(): string {
    return this.getOriginalImagePath();
  }

  /**
   * Generates srcset using Vercel Image Optimization
   */
  getVercelSrcset(format: string): string {
    const sizes = [400, 800, 1200, 1600];
    return sizes
      .map(width => `${this.getVercelImageUrl(width, format)} ${width}w`)
      .join(', ');
  }

  /**
   * Gets blur placeholder URL (low-quality image for blur-up effect)
   */
  get blurSrc(): string {
    const imagePath = this.getOriginalImagePath();
    return `/_vercel/image?url=${encodeURIComponent(imagePath)}&w=64&q=30&f=jpg`;
  }

  onImageLoad(): void {
    this.loaded = true;
    // Remember this image in the cache for instant future switches
    const resolvedPath = this.resolvePathForSrc(this.src);
    OptimizedImageComponent.loadedCache.add(resolvedPath);
  }

  onImageError(): void {
    console.warn(`Failed to load image via optimizer: ${this.src}`);
    // Mark optimizer as failed — once failed, stay in fallback mode permanently
    // to avoid flashing on every color/image switch
    this.optimizerFailed = true;
  }
}