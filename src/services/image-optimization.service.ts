import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private readonly ORIGINAL_BASE_PATH = '/safs-images';

  /**
   * Gets the original image path for Vercel optimization
   * This is used by OptimizedImageComponent which handles Vercel URL construction
   */
  getOptimizedImagePath(originalPath: string): string {
    return originalPath;
  }

  /**
   * Generates Vercel Image Optimization URL
   */
  getVercelImageUrl(imagePath: string, width: number, format: string = 'auto', quality: number = 85): string {
    return `/_vercel/image?url=${encodeURIComponent(imagePath)}&w=${width}&q=${quality}&f=${format}`;
  }

  /**
   * Generates responsive image URLs using Vercel Image Optimization
   */
  getResponsiveImageUrls(originalPath: string): {
    webp: { srcset: string, sizes: string },
    avif: { srcset: string, sizes: string },
    fallback: { src: string, srcset: string, sizes: string }
  } {
    const sizes = [400, 800, 1200, 1600];
    const cleanPath = originalPath.replace(/^\/?SAFS IMAGES\//, '');
    const imagePath = `${this.ORIGINAL_BASE_PATH}/${encodeURI(cleanPath)}`;

    const webpSrcset = sizes
      .map(width => `${this.getVercelImageUrl(imagePath, width, 'webp')} ${width}w`)
      .join(', ');

    const avifSrcset = sizes
      .map(width => `${this.getVercelImageUrl(imagePath, width, 'avif')} ${width}w`)
      .join(', ');

    const fallbackSrcset = sizes
      .map(width => `${this.getVercelImageUrl(imagePath, width, 'jpg')} ${width}w`)
      .join(', ');

    const sizesAttr = `(max-width: 640px) 400px, (max-width: 1024px) 800px, (max-width: 1280px) 1200px, 1600px`;

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
        src: this.getVercelImageUrl(imagePath, 800, 'jpg'),
        srcset: fallbackSrcset,
        sizes: sizesAttr
      }
    };
  }

  /**
   * Gets blur placeholder URL using Vercel's low-quality optimization
   */
  getBlurPlaceholderUrl(originalPath: string): string {
    const cleanPath = originalPath.replace(/^\/?SAFS IMAGES\//, '');
    const imagePath = `${this.ORIGINAL_BASE_PATH}/${encodeURI(cleanPath)}`;
    return this.getVercelImageUrl(imagePath, 20, 'jpg', 30);
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