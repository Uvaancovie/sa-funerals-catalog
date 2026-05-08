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

      <!-- Main responsive image using Vercel Image Optimization -->
      <picture class="main-image-wrapper">
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
    * Gets the original image URL from the src path
    * Uses Vercel's original image storage location
    */
  private getOriginalImageUrl(): string {
    // Clean the path - remove SAFS IMAGES prefix and extension
    let cleanPath = this.src.replace(/^\/?SAFS IMAGES\//i, '');
    cleanPath = cleanPath.replace(/\.(jpg|jpeg|png)$/i, '.jpg');

    // Return path to original image in safs-images directory (deployed to /safs-images)
    return `/safs-images/${encodeURI(cleanPath)}`;
  }

  /**
   * Generates Vercel Image Optimization URL
   * Format: /_vercel/image?url=<encoded-path>&w=<width>&q=<quality>&f=<format>
   */
  getVercelImageUrl(width: number, format: string = 'auto', quality: number = 85): string {
    const imageUrl = this.getOriginalImageUrl();
    return `/_vercel/image?url=${encodeURIComponent(imageUrl)}&w=${width}&q=${quality}&f=${format}`;
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
    return this.getVercelImageUrl(20, 'jpg', 30);
  }

  onImageLoad(): void {
    this.loaded = true;
  }

  onImageError(): void {
    console.warn(`Failed to load image: ${this.src}`);
  }
}