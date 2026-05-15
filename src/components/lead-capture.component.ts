import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lead-capture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative bg-safs-dark px-4 py-16 sm:px-6 lg:px-16 overflow-hidden border-b-[3px] border-safs-gold">
      <!-- Background Graphic -->
      <div class="absolute inset-0 opacity-5 bg-[url('/assets/logo/OIP.webp')] bg-no-repeat bg-right-bottom bg-[length:500px]"></div>

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl flex flex-col lg:flex-row items-stretch gap-10">

          <!-- Carousel Side -->
          <div class="flex-1 flex flex-col gap-8 min-w-0">
            <!-- Image Carousel -->
            <div class="relative bg-safs-dark rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-96 shadow-lg border border-white/10 w-full">
              <img
                [src]="carouselImages()[currentImageIndex()]"
                [alt]="'Carousel image ' + (currentImageIndex() + 1)"
                class="w-full h-full object-contain transition-opacity duration-500 bg-black/20"
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
          <div class="w-full lg:w-[480px] bg-white rounded-2xl p-2 shadow-2xl relative">
             <div class="absolute -top-4 -right-4 w-24 h-24 bg-safs-gold rounded-full opacity-20 blur-2xl"></div>
             <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-safs-dark rounded-full opacity-20 blur-2xl"></div>
            <iframe
              title="Trade Registration Form"
              width="100%"
              height="380"
              src="https://bbbac5ba.sibforms.com/serve/MUIFADNAXkcZRb7c-OoeuIBzu2ct-avyqNA_6m8P9RNEReQEGfY70EdbMhE8lvXhA4pk7I4kJWzPg-PRuKypLnLhd-4PkKEm3YrSA0nDbxvreu3uQCk9SiDq1GsMwkrvwm6qMgUyySJppVDw3d9a6qfvU4KRbdfjFrR3Pro6-y2r0bg89fF9A89cwXtn42IuuSnznA5LDHtXDVxsew=="
              frameborder="0"
              scrolling="auto"
              class="block w-full rounded-xl border-0 relative z-10"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LeadCaptureComponent implements OnInit, OnDestroy {
  currentImageIndex = signal(0);
  carouselImages = signal([
    'assets/additional/Emperor%20White%20Closed.jpg',
    'assets/additional/4%20Corner%20Cherry.jpg',
    'assets/additional/Lapita.jpg',
    'assets/additional/Nguni%20Black.jpg'
  ]);
  private carouselInterval: any;

  ngOnInit() {
    this.startCarousel();
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
}
