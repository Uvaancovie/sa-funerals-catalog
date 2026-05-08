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
        *ngIf="!loaded && blurSrc"
        [src]="blurSrc"
        class="blur-placeholder"
        [alt]="alt"
        aria-hidden="true"
      >

      <!-- Main responsive image with modern format fallbacks -->
      <picture class="main-image-wrapper">
        <source
          *ngIf="hasAvif"
          [srcset]="getResponsiveSrcset('avif')"
          [sizes]="sizes"
          type="image/avif"
        >
        <source
          *ngIf="hasWebp"
          [srcset]="getResponsiveSrcset('webp')"
          [sizes]="sizes"
          type="image/webp"
        >
        <img
          [src]="fallbackSrc"
          [srcset]="getResponsiveSrcset('jpg')"
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

      <!-- Loading indicator (optional) -->
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
  @Input() src!: string; // Base image path (e.g., "Baby Caskets/2FT Minnie Mouse")
  @Input() alt!: string;
  @Input() aspectRatio = '4/3';
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() fetchpriority: 'high' | 'low' | 'auto' = 'auto';
  @Input() decoding: 'sync' | 'async' | 'auto' = 'async';
  @Input() containerClass = '';
  @Input() showLoadingIndicator = false;
  @Input() sizes = '(max-width: 640px) 400px, (max-width: 1024px) 800px, (max-width: 1280px) 1200px, 1600px';

  loaded = false;
  hasAvif = false;
  hasWebp = false;

  private intersectionObserver?: IntersectionObserver;

  ngOnInit() {
    this.checkFormatSupport();
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    this.intersectionObserver?.disconnect();
  }

  private checkFormatSupport(): void {
    // Check WebP support
    this.hasWebp = this.checkImageFormatSupport('image/webp');

    // Check AVIF support
    this.hasAvif = this.checkImageFormatSupport('image/avif');
  }

  private checkImageFormatSupport(mimeType: string): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const img = new Image();
    img.src = canvas.toDataURL(mimeType);
    return img.src.indexOf(mimeType) === 5;
  }

  private setupIntersectionObserver(): void {
    if (this.loading === 'lazy' && 'IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Image is in viewport, let it load naturally
              this.intersectionObserver?.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px' // Start loading 50px before image enters viewport
        }
      );

      // Observe the image container
      const container = document.querySelector('.image-container') as HTMLElement;
      if (container) {
        this.intersectionObserver.observe(container);
      }
    }
  }

  // 1. Helper to safely format the base path
  private getResolvedPath(): string {
    // Remove extensions if they exist
    let path = this.src.replace(/\.(jpg|jpeg|png)$/i, '');

    // Clean up any old prefixes from the database
    path = path.replace(/^\/?SAFS IMAGES\//i, '');

    // 2. Prepend the assets directory if it's a relative path
    if (!path.startsWith('/assets') && !path.startsWith('http')) {
      path = `/assets/safs-images/${path}`;
    }

    return path;
  }

  getResponsiveSrcset(format: string): string {
    const basePath = this.getResolvedPath();
    const sizes = [400, 800, 1200, 1600];

    return sizes
      .map(width => {
        // encodeURI is CRITICAL here to convert spaces ( ) to %20
        const url = encodeURI(`${basePath}-${width}w.${format}`);
        return `${url} ${width}w`;
      })
      .join(', ');
  }

  get blurSrc(): string {
    return encodeURI(`${this.getResolvedPath()}-blur.jpg`);
  }

  get fallbackSrc(): string {
    return encodeURI(`${this.getResolvedPath()}-800w.jpg`);
  }

  onImageLoad(): void {
    this.loaded = true;
  }

  onImageError(): void {
    // Fallback to original image if optimized versions fail
    console.warn(`Failed to load optimized image: ${this.src}`);
  }
}