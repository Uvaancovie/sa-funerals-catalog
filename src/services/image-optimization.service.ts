import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private readonly ORIGINAL_BASE_PATH = '/safs-images';

  getOptimizedImagePath(originalPath: string): string {
    if (!originalPath) return '';
    let path = originalPath.replace(/^\/+/, '');
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.toLowerCase().startsWith('assets/')) return `/${path}`;
    if (path.toUpperCase().startsWith('SAFS IMAGES/')) return `/safs-images/${path.substring(12)}`;
    if (path.toLowerCase().startsWith('safs-images/')) return `/${path}`;
    return `/safs-images/${path}`;
  }

  getSupabaseWebpUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  getLoadingStrategy(index: number, total: number, isAboveFold: boolean): {
    loading: 'lazy' | 'eager',
    fetchpriority: 'high' | 'low' | 'auto'
  } {
    if (isAboveFold || index < 3) {
      return { loading: 'eager', fetchpriority: 'high' };
    }
    if (index < 6) {
      return { loading: 'eager', fetchpriority: 'auto' };
    }
    return { loading: 'lazy', fetchpriority: 'low' };
  }

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
