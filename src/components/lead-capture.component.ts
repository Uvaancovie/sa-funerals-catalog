import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lead-capture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative bg-safs-dark border-b-2 border-safs-gold">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-1 sm:py-2">
        <div class="relative bg-white/5 border border-white/10 rounded-xl px-3 py-2 sm:px-4 sm:py-2 flex flex-col md:flex-row lg:items-center gap-2 md:gap-4 lg:gap-6 justify-between">
          <div class="text-white flex-1 min-w-0">
            <p class="text-[9px] uppercase tracking-[0.2em] text-safs-gold/80 mb-0.5">Trade Updates</p>
            <h3 class="text-sm sm:text-base font-medium leading-snug">Get new launches, pricing, and stock alerts.</h3>
            <p class="text-[11px] text-white/50 mt-0.5">Short monthly email. Unsubscribe anytime.</p>
          </div>

          <div class="w-full md:w-[260px] bg-white rounded-lg p-1 shadow-lg relative flex-shrink-0 origin-right scale-90">
            <!-- Lazy-loaded iframe: only injects after idle to reduce TBT -->
            <div class="relative z-10">
              @if (iframeLoaded()) {
                <iframe
                  title="Trade Registration Form"
                  width="100%"
                  [height]="iframeHeight"
                  src="https://bbbac5ba.sibforms.com/serve/MUIFADNAXkcZRb7c-OoeuIBzu2ct-avyqNA_6m8P9RNEReQEGfY70EdbMhE8lvXhA4pk7I4kJWzPg-PRuKypLnLhd-4PkKEm3YrSA0nDbxvreu3uQCk9SiDq1GsMwkrvwm6qMgUyySJppVDw3d9a6qfvU4KRbdfjFrR3Pro6-y2r0bg89fF9A89cwXtn42IuuSnznA5LDHtXDVxsew=="
                  frameborder="0"
                  scrolling="auto"
                  class="block w-full rounded-lg border-0"
                  loading="lazy"
                ></iframe>
              } @else {
                <!-- Placeholder skeleton while iframe defers -->
                <div class="flex flex-col items-center justify-center rounded-lg bg-gray-50 animate-pulse" [style.height.px]="iframeHeight">
                  <div class="w-10 h-10 rounded-full bg-gray-200 mb-3"></div>
                  <div class="h-3 w-36 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 w-28 bg-gray-200 rounded"></div>
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
export class LeadCaptureComponent implements OnInit {
  iframeLoaded = signal(false);
  iframeHeight = 220;

  ngOnInit() {
    this.deferIframeLoad();
    this.updateIframeHeight();
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
      this.iframeHeight = 200;
    } else if (window.innerWidth < 1024) {
      this.iframeHeight = 210;
    } else {
      this.iframeHeight = 220;
    }
  }
}
