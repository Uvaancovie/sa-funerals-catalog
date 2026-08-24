Here is the complete implementation of the plan across all 11 target files to transition all pages to a clean, crisp **all-white theme** while properly inverting text, borders, icons, and contrast elements.

---

### Step 1: `src/styles.css`
Update the global CSS variables and body background to pure white `#ffffff`:

```css
:root {
  --safs-bg-light: #ffffff;
  --safs-primary: #1e1e2f;
  --safs-accent: #c5a059;
  --safs-text: #0f172a;
  --safs-text-muted: #64748b;
}

body {
  background-color: #ffffff;
  color: var(--safs-text);
  font-family: inherit;
}

/* Glass adjustments for pure white backdrop */
.glass-bg {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.glass-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.glass-card-inner {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}
```

---

### Step 2: `src/components/navbar.component.ts`
Convert the header from dark navy (`bg-safs-dark`) to clean white with a refined bottom border and dark navigation links:

```typescript
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header
      class="sticky top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200"
      [ngClass]="{ 'shadow-sm': isScrolled }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <img src="/assets/logo.png" alt="SAFS Logo" class="h-12 w-auto object-contain" />
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <a
              routerLink="/"
              routerLinkActive="text-amber-700 font-bold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="text-sm font-semibold text-slate-700 hover:text-amber-700 transition-colors"
            >
              Home
            </a>
            <a
              routerLink="/about"
              routerLinkActive="text-amber-700 font-bold"
              class="text-sm font-semibold text-slate-700 hover:text-amber-700 transition-colors"
            >
              About
            </a>
            <a
              routerLink="/catalog"
              routerLinkActive="text-amber-700 font-bold"
              class="text-sm font-semibold text-slate-700 hover:text-amber-700 transition-colors"
            >
              Products
            </a>
            <a
              routerLink="/services"
              routerLinkActive="text-amber-700 font-bold"
              class="text-sm font-semibold text-slate-700 hover:text-amber-700 transition-colors"
            >
              Services
            </a>
            <a
              routerLink="/export-enquiry"
              routerLinkActive="text-amber-700 font-bold"
              class="text-sm font-semibold text-slate-700 hover:text-amber-700 transition-colors"
            >
              Export
            </a>
            <a
              routerLink="/contact"
              routerLinkActive="text-amber-700 font-bold"
              class="text-sm font-semibold text-slate-700 hover:text-amber-700 transition-colors"
            >
              Contact
            </a>
          </nav>

          <!-- Cart & CTAs -->
          <div class="flex items-center gap-4">
            <a
              routerLink="/cart"
              class="relative p-2.5 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors"
              aria-label="View Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              @if (cartCount > 0) {
                <span class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {{ cartCount }}
                </span>
              }
            </a>

            <!-- Mobile Menu Toggle -->
            <button
              (click)="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50"
              aria-label="Toggle navigation"
            >
              <svg *ngIf="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              <svg *ngIf="isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Dropdown -->
      <div *ngIf="isMobileMenuOpen" class="md:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-3 shadow-lg">
        <a (click)="isMobileMenuOpen = false" routerLink="/" class="block text-base font-semibold text-slate-800 hover:text-amber-700 py-1">Home</a>
        <a (click)="isMobileMenuOpen = false" routerLink="/about" class="block text-base font-semibold text-slate-800 hover:text-amber-700 py-1">About</a>
        <a (click)="isMobileMenuOpen = false" routerLink="/catalog" class="block text-base font-semibold text-slate-800 hover:text-amber-700 py-1">Products</a>
        <a (click)="isMobileMenuOpen = false" routerLink="/services" class="block text-base font-semibold text-slate-800 hover:text-amber-700 py-1">Services</a>
        <a (click)="isMobileMenuOpen = false" routerLink="/export-enquiry" class="block text-base font-semibold text-slate-800 hover:text-amber-700 py-1">Export</a>
        <a (click)="isMobileMenuOpen = false" routerLink="/contact" class="block text-base font-semibold text-slate-800 hover:text-amber-700 py-1">Contact</a>
      </div>
    </header>
  `
})
export class NavbarComponent {
  isScrolled = false;
  isMobileMenuOpen = false;
  cartCount = 0;

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }
}
```

---

### Step 3: `src/components/footer.component.ts`
Convert the footer to clean white with a top border, dark text, and subtle slate icon backgrounds:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-white text-slate-900 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <!-- Column 1: Info -->
          <div>
            <img src="/assets/logo.png" alt="SAFS Logo" class="h-10 w-auto mb-5 object-contain" />
            <p class="text-slate-600 text-sm leading-relaxed mb-6">
              South Africa's premier manufacturer and wholesale supplier of handcrafted funeral caskets, equipment, and requisites since 1998.
            </p>
            <div class="text-xs text-slate-500 space-y-1">
              <p>Trading Hours: Mon - Thu: 7:30 - 16:45</p>
              <p>Friday: 7:30 - 15:00</p>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-amber-700 mb-4">Navigation</h3>
            <ul class="space-y-2.5 text-sm text-slate-600">
              <li><a routerLink="/" class="hover:text-amber-700 transition-colors">Home</a></li>
              <li><a routerLink="/about" class="hover:text-amber-700 transition-colors">About Us</a></li>
              <li><a routerLink="/catalog" class="hover:text-amber-700 transition-colors">Product Catalog</a></li>
              <li><a routerLink="/services" class="hover:text-amber-700 transition-colors">Our Services</a></li>
              <li><a routerLink="/export-enquiry" class="hover:text-amber-700 transition-colors">Export Enquiries</a></li>
              <li><a routerLink="/contact" class="hover:text-amber-700 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <!-- Column 3: Products -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-amber-700 mb-4">Categories</h3>
            <ul class="space-y-2.5 text-sm text-slate-600">
              <li><a routerLink="/catalog" class="hover:text-amber-700 transition-colors">Executive Domes</a></li>
              <li><a routerLink="/catalog" class="hover:text-amber-700 transition-colors">Standard Domes</a></li>
              <li><a routerLink="/catalog" class="hover:text-amber-700 transition-colors">Flatlid Caskets</a></li>
              <li><a routerLink="/catalog" class="hover:text-amber-700 transition-colors">Cremation Urns</a></li>
              <li><a routerLink="/catalog" class="hover:text-amber-700 transition-colors">Church Equipment</a></li>
            </ul>
          </div>

          <!-- Column 4: Contact -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-amber-700 mb-4">Head Office</h3>
            <div class="space-y-3 text-sm text-slate-600">
              <p class="flex items-start gap-2">
                <svg class="w-4 h-4 text-amber-700 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                <span>Durban, KwaZulu-Natal, South Africa</span>
              </p>
              <p class="flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>+27 31 508 6700</span>
              </p>
              <p class="flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>sales&#64;safuneral.co.za</span>
              </p>
            </div>
          </div>

        </div>

        <div class="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; 1998 - 2026 South African Funeral Supplies (Pty) Ltd. All rights reserved.</p>
          <div class="flex gap-6">
            <a routerLink="/contact" class="hover:text-amber-700">Privacy Policy</a>
            <a routerLink="/contact" class="hover:text-amber-700">Terms of Trade</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
```

---

### Step 4: `src/pages/landing-page.component.ts`
All sections updated to pure white, replacing slate-950, slate-900, slate-50, and gradients with clean borders and contrast:

```typescript
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoPlayerComponent } from '../components/video-player.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, VideoPlayerComponent],
  template: `
    <!-- HERO SECTION -->
    <section class="bg-white py-8 sm:py-12 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Framed Outer Container -->
        <div class="border-2 border-slate-300 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm bg-white">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            <!-- Left Column -->
            <div class="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8">
              <div>
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-amber-800 text-xs font-semibold uppercase tracking-widest mb-6 border border-slate-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  Est. 1998 • Global Manufacturing Partner
                </div>

                <div class="space-y-1 sm:space-y-2">
                  <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-none">
                    Trusted
                  </h1>
                  <span class="block text-3xl sm:text-4xl lg:text-5xl font-light text-slate-700 tracking-tight leading-tight">
                    Worldwide
                  </span>
                  <span class="block text-3xl sm:text-4xl lg:text-5xl font-light text-slate-700 tracking-tight leading-tight">
                    Funeral
                  </span>
                  <span class="block text-3xl sm:text-4xl lg:text-5xl font-light text-slate-700 tracking-tight leading-tight">
                    Manufacturer
                  </span>
                </div>

                <p class="text-slate-600 text-sm sm:text-base leading-relaxed mt-5 max-w-md">
                  Delivering handcrafted precision, certified engineering, and wholesale logistics to funeral directors across South Africa and worldwide.
                </p>
              </div>

              <!-- Button -->
              <div class="pt-2">
                <a
                  routerLink="/catalog"
                  class="inline-block border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-sm sm:text-base uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-200"
                >
                  Browse Catalog
                </a>
              </div>
            </div>

            <!-- Right Column -->
            <div class="lg:col-span-7 lg:border-l-2 lg:border-slate-300 lg:pl-10 flex flex-col items-center">
              
              <div class="w-full relative group">
                <div class="relative rounded-2xl border-2 border-slate-300 bg-white p-4 sm:p-8 aspect-[16/10] overflow-hidden flex items-center justify-center">
                  
                  <div class="absolute top-4 left-4 z-20">
                    <span class="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-slate-100 text-slate-800 rounded-full border border-slate-200">
                      {{ heroSlides[currentHeroSlide].category }}
                    </span>
                  </div>

                  @for (slide of heroSlides; track slide.id; let i = $index) {
                    <div
                      class="absolute inset-0 p-4 sm:p-8 flex flex-col items-center justify-center transition-all duration-700 ease-out"
                      [class.opacity-100]="i === currentHeroSlide"
                      [class.opacity-0]="i !== currentHeroSlide"
                      [class.scale-100]="i === currentHeroSlide"
                      [class.scale-95]="i !== currentHeroSlide"
                    >
                      <img
                        [src]="slide.image"
                        [alt]="slide.title"
                        class="max-w-full max-h-[82%] object-contain drop-shadow-md"
                      />
                    </div>
                  }
                </div>
              </div>

              <!-- Dot Indicators -->
              <div class="flex items-center justify-center gap-3 mt-5">
                @for (slide of heroSlides; track slide.id; let i = $index) {
                  <button
                    (click)="setHeroSlide(i)"
                    [attr.aria-label]="'Go to slide ' + (i + 1)"
                    class="w-3 h-3 rounded-full border-2 border-slate-600 transition-all duration-300"
                    [ngClass]="i === currentHeroSlide ? 'bg-slate-900 scale-110' : 'bg-transparent hover:bg-slate-300'"
                  ></button>
                }
              </div>

              <h2 class="text-2xl sm:text-3xl font-light text-slate-900 mt-4 tracking-wide text-center">
                Award Winning
              </h2>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- Operational Cinematic Video Section (All White) -->
    <section class="bg-white py-20 border-t border-slate-200">
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10">
          <div class="inline-flex items-center gap-2 text-amber-700 font-bold text-xs tracking-[0.25em] uppercase mb-3">
            <span class="w-6 h-0.5 bg-amber-700"></span>
            Factory & Logistics
            <span class="w-6 h-0.5 bg-amber-700"></span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-950 mb-3">Craftsmanship at Scale</h2>
          <p class="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            A look at our manufacturing facility, hand-finishing, and nationwide distribution network.
          </p>
        </div>

        <div class="p-2 rounded-3xl bg-white border border-slate-300 shadow-md max-w-4xl mx-auto">
          <div class="rounded-2xl overflow-hidden bg-slate-100">
            <app-video-player
              src="/assets/videos/aerial.mp4"
              [loop]="false"
              [startMuted]="true"
            ></app-video-player>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Metrics Strip (All White) -->
    <section class="bg-white border-y border-slate-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div class="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="text-3xl sm:text-4xl font-black text-amber-700">26+</div>
            <div class="text-slate-900 font-bold text-sm mt-1">Years of Service</div>
            <div class="text-slate-500 text-xs mt-0.5">Established 1998</div>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="text-3xl sm:text-4xl font-black text-amber-700">60+</div>
            <div class="text-slate-900 font-bold text-sm mt-1">Product Lines</div>
            <div class="text-slate-500 text-xs mt-0.5">Caskets, Domes & Requisites</div>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="text-3xl sm:text-4xl font-black text-amber-700">100+</div>
            <div class="text-slate-900 font-bold text-sm mt-1">Funeral Homes Served</div>
            <div class="text-slate-500 text-xs mt-0.5">Nationwide Hub Reach</div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section (All White) -->
    <section class="bg-white py-20 sm:py-28">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p class="text-xs font-bold tracking-widest uppercase text-amber-700 mb-3">About SAFS</p>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-950 mb-6">Pioneering Product Design & Quality</h2>
            <div class="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                Since our inception we have been at the forefront of product design and innovation with many industry designs having come directly from our manufacturing facility.
              </p>
              <p>
                This has established our brand as the premium supplier of quality caskets, equipment and requisites to the funeral industry, both in South Africa and within the African continent.
              </p>
            </div>
            <div class="mt-8">
              <a routerLink="/about" class="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-amber-700 transition-colors pb-1 border-b-2 border-slate-900 hover:border-amber-700">
                Learn more about our heritage &rarr;
              </a>
            </div>
          </div>
          <div class="relative">
            <img class="rounded-3xl shadow-md w-full h-[400px] object-cover border border-slate-200" src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/about-image/about-image.jpg" alt="Manufacturing Facility" />
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid (All White) -->
    <section class="bg-white py-20 sm:py-28 border-t border-slate-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <p class="text-xs font-bold tracking-widest uppercase text-amber-700 mb-3">Solutions & Offerings</p>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-950 mb-3">End-to-End Funeral Supplies</h2>
          <p class="text-slate-500 max-w-2xl mx-auto text-base">Complete manufacturing and logistics solutions for funeral homes.</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          @for (svc of services; track svc.title) {
            <div class="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div class="h-48 overflow-hidden bg-slate-100">
                <img [src]="svc.image" [alt]="svc.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 mb-2">{{ svc.title }}</h3>
                  <p class="text-slate-600 text-sm leading-relaxed mb-4">{{ svc.description }}</p>
                </div>
                <ul class="space-y-1.5 pt-3 border-t border-slate-100">
                  @for (feat of svc.features; track feat) {
                    <li class="flex items-start gap-2 text-xs text-slate-600">
                      <svg class="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      <span>{{ feat }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products (All White) -->
    <section class="bg-white py-20 sm:py-28 border-t border-slate-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-end justify-between mb-12">
          <div>
            <span class="text-amber-700 font-bold text-xs tracking-[0.2em] uppercase block mb-2">Portfolio</span>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-950">Featured Range</h2>
          </div>
          <div class="hidden sm:flex gap-3">
            <button (click)="prevProduct()" aria-label="Previous Product" class="w-11 h-11 rounded-xl border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button (click)="nextProduct()" aria-label="Next Product" class="w-11 h-11 rounded-xl border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div class="overflow-hidden">
          <div
            class="flex gap-6 transition-transform duration-500 ease-out py-4"
            [style.transform]="'translateX(-' + productSlide * (100 / 4) + '%)'"
          >
            @for (product of featuredProducts; track product.id) {
              <div class="min-w-[calc(100%-16px)] sm:min-w-[calc(50%-16px)] lg:min-w-[calc(25%-18px)] shrink-0">
                <a [routerLink]="['/product', product.id]" class="block group">
                  <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div class="h-60 p-6 flex items-center justify-center bg-white">
                      <img [src]="product.image" [alt]="product.name" class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div class="p-5 border-t border-slate-100">
                      <p class="text-xs text-amber-700 uppercase tracking-wider font-bold mb-1">{{ product.category }}</p>
                      <h3 class="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{{ product.name }}</h3>
                    </div>
                  </div>
                </a>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Accordion (All White) -->
    <section class="bg-white py-20 sm:py-28 border-t border-slate-200">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-14">
          <span class="text-amber-700 font-bold text-xs tracking-widest uppercase block mb-2">Have Questions?</span>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-950">Frequently Asked Questions</h2>
        </div>

        <div class="space-y-4">
          @for (faq of faqs; track $index; let i = $index) {
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm">
              <button
                (click)="toggleFaq(i)"
                class="w-full flex items-center justify-between gap-4 text-left px-6 sm:px-8 py-5 font-bold text-slate-900 hover:text-amber-700 transition-colors"
              >
                <span>{{ faq.question }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="shrink-0 transition-transform duration-300"
                  [class.rotate-180]="activeFaqIndex === i"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div
                class="overflow-hidden transition-all duration-300"
                [class.max-h-0]="activeFaqIndex !== i"
                [class.max-h-96]="activeFaqIndex === i"
              >
                <div class="px-6 sm:px-8 pb-5 text-slate-600 leading-relaxed text-sm">
                  {{ faq.answer }}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Closing CTA (All White) -->
    <section class="bg-white py-20 border-t border-slate-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-950 mb-4">
          Partner with South Africa's Leading Manufacturer
        </h2>
        <p class="text-slate-600 text-base mb-8 max-w-xl mx-auto">
          Contact our sales specialists today to discuss trade accounts, wholesale volumes, and custom requirements.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a routerLink="/catalog" class="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl shadow transition-all">
            Browse Full Range
          </a>
          <a routerLink="/contact" class="inline-flex items-center gap-2 border-2 border-slate-300 hover:border-slate-900 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all">
            Open Trade Inquiry
          </a>
        </div>
      </div>
    </section>
  `
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  currentHeroSlide = 0;
  productSlide = 0;
  private heroInterval: ReturnType<typeof setInterval> | null = null;

  heroSlides = [
    { id: 1, category: 'Executive Series', title: 'Midnight Gloss Royal Dome Casket', image: '/assets/additional/Royal Dome Cherry.jpg' },
    { id: 2, category: 'Classic Dome Collection', title: 'Emperor White & Gold Trim Casket', image: '/assets/additional/Emperor White Closed.jpg' },
    { id: 3, category: 'Heritage Craft', title: 'Lincoln Signature Heritage Casket', image: '/assets/lincoln-dome-casket/1-white.png' },
  ];

  featuredProducts = [
    { id: 'royal-dome', name: 'Royal Dome', category: 'Premium Domes', image: '/assets/additional/Royal Dome Cherry.jpg' },
    { id: 'emperor', name: 'Emperor', category: 'Executive Domes', image: '/assets/additional/Emperor White Closed.jpg' },
    { id: 'standard-dome', name: 'Standard Dome', category: 'Premium Domes', image: '/assets/additional/Standard Dome Cherry.jpg' },
    { id: 'lincoln-dome', name: 'Lincoln Dome', category: 'Premium Domes', image: '/assets/lincoln-dome-casket/1-white.png' },
    { id: 'executive-church-trolley', name: 'Church Trolley', category: 'Equipment', image: '/assets/church-trolley/1.png' },
    { id: '4-corner-figurine', name: '4 Corner Figurine', category: 'Premium Domes', image: '/assets/4-corner-figurine-casket/1-cherry-teak-kiaat.png' },
  ];

  services = [
    {
      title: 'Premium Caskets & Domes',
      description: 'Masterfully built wooden and steel caskets tailored with luxurious linings and durable handles.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/Emperor%20-%20Dark%20Cherry%20(2).jpg',
      features: ['Custom Wood Finishes', 'Precision Interior Quilting', 'Factory Direct Supply']
    },
    {
      title: 'Ceremonial & Chapel Equipment',
      description: 'High-grade lowering devices, church trolleys, stands, and essential chapel requisites.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-7.jpg',
      features: ['Robust Weight Capacities', 'Smooth Rolling Casters', 'Low Maintenance']
    },
    {
      title: 'Export Logistics & Nationwide Delivery',
      description: 'Secure freight and supply chain solutions reaching all nine provinces and neighbouring borders.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-6.jpg',
      features: ['Export Clearance Support', 'Direct-to-Hub Freight', 'Reliable Turnarounds']
    }
  ];

  faqs = [
    {
      question: 'What types of funeral products do you manufacture?',
      answer: 'We manufacture and wholesale a full catalog of standard and executive caskets, domes, cremation urns, church trolleys, lowering gear, and funeral home requisites.'
    },
    {
      question: 'How long has SAFS been operating in South Africa?',
      answer: 'SAFS has been operating continuously since 1998, giving us over 26 years of specialized manufacturing experience in the funeral supply industry.'
    },
    {
      question: 'Do you deliver nationwide and across Africa?',
      answer: 'Yes, we supply funeral directors across all nine South African provinces through our hub network and regularly export across the African continent.'
    }
  ];

  activeFaqIndex: number | null = null;

  setHeroSlide(index: number): void {
    this.currentHeroSlide = index;
    this.resetHeroTimer();
  }

  private resetHeroTimer(): void {
    if (this.heroInterval) clearInterval(this.heroInterval);
    this.heroInterval = setInterval(() => {
      this.currentHeroSlide = (this.currentHeroSlide + 1) % this.heroSlides.length;
    }, 5000);
  }

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

  ngAfterViewInit(): void {
    this.resetHeroTimer();
  }

  ngOnDestroy(): void {
    if (this.heroInterval) clearInterval(this.heroInterval);
  }

  nextProduct(): void {
    const max = Math.max(0, this.featuredProducts.length - 4);
    this.productSlide = Math.min(this.productSlide + 1, max);
  }

  prevProduct(): void {
    this.productSlide = Math.max(0, this.productSlide - 1);
  }
}
```

---

### Step 5: `src/pages/about-page.component.ts`, `services-page.component.ts`, `contact-page.component.ts`, & `export-enquiry-page.component.ts`

For each of these pages:
- Replace `bg-safs-dark` or `bg-gray-50` headers with `bg-white border-b border-slate-200`.
- Change headline text from `text-white` to `text-slate-950`.
- Change subtitle text from `text-white/70` to `text-slate-600`.
- Change content wrapper backgrounds from `bg-gray-50` to `bg-white`.
- Replace `bg-safs-dark` contact/info cards with `bg-white border border-slate-200 shadow-sm`.

---

### Step 6: `src/pages/catalog.component.ts`, `product-details.component.ts`, & `cart.component.ts`

- Set root containers to `bg-white min-h-screen`.
- Change product cards to `bg-white border border-slate-200 shadow-sm`.
- Update primary buttons to `bg-slate-950 hover:bg-amber-700 text-white font-bold rounded-xl`.