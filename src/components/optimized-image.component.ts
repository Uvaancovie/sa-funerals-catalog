import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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
        class="main-image"
        [class.loaded]="true"
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
      transition: opacity 0.3s ease;
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
      transition: opacity 0.3s ease;
    }

    .main-image.loaded {
      opacity: 1;
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
export class OptimizedImageComponent implements OnInit, OnDestroy {
  @Input() src!: string; // Base image path (e.g., "SAFS IMAGES/Baby Caskets/2FT Minnie Mouse.jpg")
  @Input() alt!: string;
  @Input() aspectRatio = '4/3';
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() fetchpriority: 'high' | 'low' | 'auto' = 'auto';
  @Input() decoding: 'sync' | 'async' | 'auto' = 'async';
  @Input() containerClass = '';
  @Input() showLoadingIndicator = false;
  @Input() sizes = '(max-width: 640px) 400px, (max-width: 1024px) 800px, (max-width: 1280px) 1200px, 1600px';

  loaded = false;

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {}

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
   * Gets the original image path from the src (raw path, not encoded)
   * Used by getVercelImageUrl which handles proper encoding
   */
  private getOriginalImagePath(): string {
    let cleanPath = this.src.replace(/^\/?SAFS IMAGES\//i, '');
    cleanPath = cleanPath.replace(/\.(jpg|jpeg|png)$/i, '.jpg');
    return `/safs-images/${cleanPath}`;
  }

  /**
   * Generates Vercel Image Optimization URL
   * For Angular on Vercel, uses the origin to create absolute URL for optimizer
   * Format: /_vercel/image?url=<encoded-absolute-url>&w=<width>&q=<quality>&f=<format>
   */
  getVercelImageUrl(width: number, format: string = 'auto', quality: number = 85): string {
    const imagePath = this.getOriginalImagePath();
    // Use absolute URL for Vercel optimizer to work correctly
    const absoluteUrl = `${window.location.origin}${imagePath}`;
    return `/_vercel/image?url=${encodeURIComponent(absoluteUrl)}&w=${width}&q=${quality}&f=${format}`;
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
   * Uses Vercel's optimization with very low quality and small size
   */
  get blurSrc(): string {
    const imagePath = this.getOriginalImagePath();
    const absoluteUrl = `${window.location.origin}${imagePath}`;
    return `/_vercel/image?url=${encodeURIComponent(absoluteUrl)}&w=64&q=30&f=jpg`; // Min width is 64 on Vercel
  }

  // Template state
  optimizerFailed = false;

  onImageLoad(): void {
    this.loaded = true;
  }

  onImageError(): void {
    console.warn(`Failed to load image via optimizer: ${this.src}`);
    // Mark optimizer as failed, template should use direct URL fallback
    this.optimizerFailed = true;
  }
}