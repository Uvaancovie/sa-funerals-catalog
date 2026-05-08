import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private readonly OPTIMIZED_BASE_PATH = '/assets/safs-images';

  /**
   * Converts a legacy image path to an optimized responsive image path
   */
  getOptimizedImagePath(originalPath: string): string {
    // Remove the 'SAFS IMAGES/' prefix if present
    const cleanPath = originalPath.replace(/^\/?SAFS IMAGES\//, '');
    // Remove file extension
    return cleanPath.replace(/\.(jpg|jpeg|png)$/i, '');
  }

  /**
   * Generates responsive image URLs for different formats and sizes
   */
  getResponsiveImageUrls(basePath: string): {
    webp: { srcset: string, sizes: string },
    avif: { srcset: string, sizes: string },
    fallback: { src: string, srcset: string, sizes: string }
  } {
    const sizes = [400, 800, 1200, 1600];

    const webpSrcset = sizes
      .map(width => `${this.OPTIMIZED_BASE_PATH}/${basePath}-${width}w.webp ${width}w`)
      .join(', ');

    const avifSrcset = sizes
      .map(width => `${this.OPTIMIZED_BASE_PATH}/${basePath}-${width}w.avif ${width}w`)
      .join(', ');

    const fallbackSrcset = sizes
      .map(width => `${this.OPTIMIZED_BASE_PATH}/${basePath}-${width}w.jpg ${width}w`)
      .join(', ');

    const sizesAttr = `
      (max-width: 640px) 400px,
      (max-width: 1024px) 800px,
      (max-width: 1280px) 1200px,
      1600px
    `.trim();

    return {
      webp: {
        srcset: webpSrcset,
        sizes: sizesAttr
      },
      avif: {
        srcset: avifSrcset,
        sizes: sizesAttr
      },
      fallback: {
        src: `${this.OPTIMIZED_BASE_PATH}/${basePath}-800w.jpg`,
        srcset: fallbackSrcset,
        sizes: sizesAttr
      }
    };
  }

  /**
   * Gets blur placeholder URL
   */
  getBlurPlaceholderUrl(basePath: string): string {
    return `${this.OPTIMIZED_BASE_PATH}/${basePath}-blur.jpg`;
  }

  /**
   * Determines optimal loading strategy based on image position
   */
  getLoadingStrategy(index: number, total: number, isAboveFold: boolean): {
    loading: 'lazy' | 'eager',
    fetchpriority: 'high' | 'low' | 'auto'
  } {
    // Above-the-fold images get high priority
    if (isAboveFold || index < 3) {
      return {
        loading: 'eager',
        fetchpriority: 'high'
      };
    }

    // First few images in viewport get eager loading
    if (index < 6) {
      return {
        loading: 'eager',
        fetchpriority: 'auto'
      };
    }

    // Everything else is lazy
    return {
      loading: 'lazy',
      fetchpriority: 'low'
    };
  }

  /**
   * Gets aspect ratio for different image categories
   */
  getAspectRatioForCategory(category: string): string {
    const aspectRatios: Record<string, string> = {
      'baby-caskets': '4/3',
      'coffins': '16/9',
      'domes': '3/2',
      'executive-domes': '3/2',
      'flatlids': '4/3',
      'skinz': '16/9',
      'equipment': '1/1',
      'bespoke': '4/3'
    };

    return aspectRatios[category] || '4/3';
  }
}