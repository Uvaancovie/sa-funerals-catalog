import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lead-capture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative bg-safs-dark px-4 py-12 sm:py-16 sm:px-6 lg:px-16 overflow-hidden border-b-[3px] border-safs-gold">
      <!-- Background Graphic (moved to lazy-loaded img for LCP discoverability) -->
      <img
        src="/assets/logo/OIP.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-right-bottom object-contain opacity-5 pointer-events-none"
        width="500"
        height="500"
      />

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl flex flex-col lg:flex-row items-center lg:items-stretch gap-6 md:gap-8 lg:gap-10">

          <!-- Carousel Side -->
          <div class="hidden lg:flex flex-1 flex-col gap-6 md:gap-8 min-w-0 w-full">
            <!-- Image Carousel -->
            <div class="relative bg-safs-dark rounded-2xl overflow-hidden h-56 sm:h-72 md:h-96 shadow-lg border border-white/10 w-full">
              <img
                [src]="carouselImages()[currentImageIndex()]"
                [alt]="'Carousel image ' + (currentImageIndex() + 1)"
                class="w-full h-full object-contain transition-opacity duration-500 bg-black/20"
                [attr.fetchpriority]="currentImageIndex() === 0 ? 'high' : 'auto'"
              />
              <!-- Carousel Controls -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                @for (image of carouselImages(); track $index) {
                  <button
                    type="button"
                    (click)="goToImage($index)"
                    [ngClass]="{
                      'bg-safs-gold': currentImageIndex() === $index,
                      'bg-white/30': currentImageIndex() !== $index
                    }"
                    class="w-2 h-2 rounded-full transition-all duration-300"
                  ></button>
                }
              </div>
            </div>
          </div>

          <!-- Form Side -->
          <div class="w-full max-w-[420px] lg:max-w-[480px] lg:w-[480px] bg-white rounded-2xl p-2 shadow-2xl relative flex-shrink-0">
             <div class="absolute -top-4 -right-4 w-24 h-24 bg-safs-gold rounded-full opacity-20 blur-2xl"></div>
             <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-safs-dark rounded-full opacity-20 blur-2xl"></div>
            <!-- Lazy-loaded iframe: only injects after idle to reduce TBT -->
            <div #iframeContainer class="relative z-10">
              @if (iframeLoaded()) {
                <iframe
                  title="Trade Registration Form"
                  width="100%"
                  [height]="iframeHeight"
                  src="https://bbbac5ba.sibforms.com/serve/MUIFADNAXkcZRb7c-OoeuIBzu2ct-avyqNA_6m8P9RNEReQEGfY70EdbMhE8lvXhA4pk7I4kJWzPg-PRuKypLnLhd-4PkKEm3YrSA0nDbxvreu3uQCk9SiDq1GsMwkrvwm6qMgUyySJppVDw3d9a6qfvU4KRbdfjFrR3Pro6-y2r0bg89fF9A89cwXtn42IuuSnznA5LDHtXDVxsew=="
                  frameborder="0"
                  scrolling="auto"
                  class="block w-full rounded-xl border-0"
                  loading="lazy"
                ></iframe>
              } @else {
                <!-- Placeholder skeleton while iframe defers -->
                <div class="flex flex-col items-center justify-center rounded-xl bg-gray-50 animate-pulse" [style.height.px]="iframeHeight">
                  <div class="w-12 h-12 rounded-full bg-gray-200 mb-4"></div>
                  <div class="h-4 w-40 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LeadCaptureComponent implements OnInit, OnDestroy {
  currentImageIndex = signal(0);
  iframeLoaded = signal(false);
  iframeHeight = 380;
  carouselImages = signal([
    'assets/additional/Emperor%20White%20Closed.jpg',
    'assets/additional/4%20Corner%20Cherry.jpg',
    'assets/additional/Lapita.jpg',
    'assets/additional/Nguni%20Black.jpg'
  ]);
  private carouselInterval: any;

  ngOnInit() {
    this.startCarousel();
    this.deferIframeLoad();
    this.updateIframeHeight();
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.currentImageIndex.update((current) =>
        (current + 1) % this.carouselImages().length
      );
    }, 5000); // Change image every 5 seconds
  }

  goToImage(index: number) {
    this.currentImageIndex.set(index);
    // Reset carousel timer when user clicks
    clearInterval(this.carouselInterval);
    this.startCarousel();
  }

  /**
   * Defer iframe loading until browser is idle to reduce TBT.
   * Uses requestIdleCallback with a 1.5s fallback timeout.
   */
  private deferIframeLoad() {
    const load = () => this.iframeLoaded.set(true);
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(load, { timeout: 1500 });
    } else {
      setTimeout(load, 1000);
    }
  }

  /** Adjust iframe height for different screen sizes */
  private updateIframeHeight() {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 768) {
      this.iframeHeight = 340;
    } else if (window.innerWidth < 1024) {
      this.iframeHeight = 360;
    } else {
      this.iframeHeight = 380;
    }
  }
}
