import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoPlayerComponent } from '../components/video-player.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, VideoPlayerComponent],
  template: `
    <!-- Hero Section with Background Carousel -->
    <section class="relative min-h-screen flex items-center overflow-hidden">
      @for (img of heroBgImages; track img.id; let i = $index) {
        <div
          class="absolute inset-0 transition-all duration-1000 ease-in-out"
          [class.opacity-100]="i === heroSlide"
          [class.opacity-0]="i !== heroSlide"
          [style.transform]="'scale(' + (i === heroSlide ? 1.05 : 1) + ')'"
        >
          <img [src]="img.src" alt="" class="w-full h-full object-cover" />
        </div>
      }
      <div class="absolute inset-0 bg-gradient-to-r from-safs-dark/90 via-safs-dark/75 to-safs-dark/60"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-safs-dark/30 via-transparent to-transparent"></div>

      <div class="absolute w-[600px] h-[600px] rounded-full bg-safs-gold/8 blur-[150px] -top-40 -right-40"></div>

      <div class="relative w-full max-w-6xl mx-auto px-6 sm:px-8 py-32 sm:py-40 text-center">
        <div class="max-w-4xl mx-auto">
          <p class="text-sm font-bold tracking-[0.25em] uppercase mb-8 reveal fade-up">
            <span class="text-safs-gold">South Africa's Trusted Funeral Supply Partner</span>
          </p>
          <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.15] sm:leading-[1.1] mb-8 reveal fade-up" style="transition-delay: 0.1s">
            Premium Funeral Supplies<br>
            <span class="text-safs-gold">For Dignified Farewells</span>
          </h1>
          <p class="text-lg sm:text-xl text-white/70 leading-[1.8] max-w-2xl mx-auto mb-12 reveal fade-up" style="transition-delay: 0.2s">
            From handcrafted caskets to essential equipment, we provide everything your funeral home needs
            to serve families with dignity and professionalism.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-5 reveal fade-up" style="transition-delay: 0.3s">
            <a routerLink="/catalog" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-8 py-4 rounded-xl hover:bg-safs-gold-light transition-all shadow-lg hover:shadow-xl active:scale-95">
              Browse Our Range
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a routerLink="/contact" class="inline-flex items-center gap-2 border-2 border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:border-safs-gold hover:text-safs-gold transition-all">
              Talk to Sales
            </a>
          </div>
        </div>
      </div>

      <!-- Slide Indicators -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div class="flex gap-2">
          @for (img of heroBgImages; track img.id; let i = $index) {
            <span (click)="heroSlide = i" class="inline-block h-2 rounded-full transition-all duration-300 cursor-pointer" [ngClass]="i === heroSlide ? 'w-6 bg-safs-gold' : 'w-2 bg-white/30'"></span>
          }
        </div>
        <div class="flex flex-col items-center gap-2 text-white/40">
          <span class="text-xs tracking-[0.2em] uppercase font-medium">Scroll</span>
          <div class="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div class="w-1.5 h-1.5 rounded-full bg-safs-gold animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Aerial Brand Video -->
    <section class="bg-safs-dark py-20 sm:py-28 relative overflow-hidden">

      <div class="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="w-8 h-0.5 bg-safs-gold"></div>
            <span class="text-safs-gold font-bold text-sm tracking-[0.2em] uppercase">Brand Film</span>
          </div>
          <p class="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
            A cinematic look at our manufacturing, craft, and nationwide distribution network.
          </p>
        </div>

        <div class="relative">
          <app-video-player
            src="/assets/videos/aerial.mp4"
            [loop]="false"
            [startMuted]="true"
          ></app-video-player>
        </div>
      </div>
    </section>

    <!-- Stats Strip -->
    <section class="bg-safs-dark border-t border-safs-gold/20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-3xl font-bold text-safs-gold">26+</div>
            <div class="text-white/60 text-sm mt-1">Years of Service</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-safs-gold">60+</div>
            <div class="text-white/60 text-sm mt-1">Products</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-safs-gold">1000+</div>
            <div class="text-white/60 text-sm mt-1">Funeral Homes</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-safs-gold">Nationwide</div>
            <div class="text-white/60 text-sm mt-1">Delivery</div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-gray-50 py-20 sm:py-28">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p class="text-sm font-normal tracking-widest uppercase text-safs-gold mb-4">About</p>
            <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark mb-6">Who we are</h2>
            <div class="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Since our inception we have been at the forefront of product design and innovation with many industry designs having come from our manufacturing facility.
              </p>
              <p>
                This has established our brand as the premium supplier of quality caskets, equipment and requisites to the funeral industry, both in South Africa and within the African continent.
              </p>
            </div>
            <div class="mt-10">
              <a routerLink="/about" class="inline-flex items-center gap-2 text-safs-gold font-bold hover:text-safs-dark transition-colors pb-1 border-b-2 border-safs-gold hover:border-safs-dark">
                Learn more about our history &rarr;
              </a>
            </div>
          </div>
          <div class="relative">
            <div class="absolute inset-0 bg-safs-gold rounded-2xl transform translate-x-4 translate-y-4"></div>
            <img class="relative rounded-2xl shadow-xl w-full h-[400px] object-cover" src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/about-image/about-image.jpg" alt="About us manufacturing facility" />
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="bg-white py-20 sm:py-28">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <p class="text-sm font-normal tracking-widest uppercase text-safs-gold mb-4">Our Services</p>
          <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark mb-4">End-to-End Funeral Supply Solutions</h2>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg">From premium caskets to nationwide logistics, we provide everything your funeral home needs under one roof.</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          @for (svc of services; track svc.title) {
            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-safs-gold/30 hover:shadow-lg transition-all group">
              <div class="relative h-48 overflow-hidden bg-gray-100">
                <div class="absolute inset-x-0 top-0 h-1 bg-safs-gold/0 group-hover:bg-safs-gold transition-colors z-10"></div>
                <img [src]="svc.image" [alt]="svc.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="p-6">
                <h3 class="text-lg font-bold text-safs-dark mb-2">{{ svc.title }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed mb-4">{{ svc.description }}</p>
                <ul class="space-y-1.5 mb-5">
                  @for (feat of svc.features; track feat) {
                    <li class="flex items-start gap-2 text-xs text-gray-400">
                      <svg class="w-3.5 h-3.5 text-safs-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

        <div class="text-center mt-12">
          <a routerLink="/services" class="inline-flex items-center gap-2 text-safs-gold font-bold hover:text-safs-dark transition-colors pb-1 border-b-2 border-safs-gold hover:border-safs-dark">
            View All Services &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Products Carousel -->
    <section class="bg-white py-20 sm:py-28 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20" style="background: radial-gradient(800px circle at 50% 50%, rgba(197, 160, 89, 0.08), transparent 60%);"></div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-end justify-between mb-12">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-0.5 bg-safs-gold"></div>
              <span class="text-safs-gold font-bold text-sm tracking-[0.2em] uppercase">Featured Products</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark">Premium Funeral Products</h2>
          </div>
          <div class="hidden sm:flex gap-3">
            <button (click)="prevProduct()" class="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-safs-gold hover:text-safs-gold hover:bg-safs-gold/5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button (click)="nextProduct()" class="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-safs-gold hover:text-safs-gold hover:bg-safs-gold/5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <!-- Product Carousel Track -->
        <div class="overflow-hidden">
          <div
            class="flex gap-6 transition-transform duration-500 ease-out"
            [style.transform]="'translateX(-' + productSlide * (100 / 4) + '%)'"
          >
            @for (product of featuredProducts; track product.id) {
              <div class="min-w-[calc(25%-18px)] shrink-0">
                <a [routerLink]="['/product', product.id]" class="block group">
                  <div class="relative bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:border-safs-gold/30 hover:shadow-lg transition-all">
                    <div class="absolute inset-x-0 top-0 h-1 bg-safs-gold/0 group-hover:bg-safs-gold transition-colors z-10"></div>
                    <div class="h-64 p-6 flex items-center justify-center bg-white">
                      <img [src]="product.image" [alt]="product.name" class="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div class="p-5 border-t border-gray-100">
                      <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">{{ product.category }}</p>
                      <h3 class="text-lg font-bold text-safs-dark group-hover:text-safs-gold transition-colors">{{ product.name }}</h3>
                      <span class="inline-flex items-center gap-1 text-safs-gold text-sm font-semibold mt-2 group-hover:gap-2 transition-all">
                        View Product
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            }
          </div>
        </div>

        <!-- Mobile Arrow Controls -->
        <div class="flex sm:hidden justify-center gap-3 mt-8">
          <button (click)="prevProduct()" class="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-safs-gold hover:text-safs-gold transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button (click)="nextProduct()" class="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-safs-gold hover:text-safs-gold transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        <div class="text-center mt-12">
          <a routerLink="/catalog" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-8 py-4 rounded-xl hover:bg-safs-gold-light transition-all shadow-lg hover:shadow-xl active:scale-95">
            View Full Catalog
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gradient-to-br from-safs-dark via-safs-dark to-safs-dark py-20 relative overflow-hidden">
      <div class="absolute w-[400px] h-[400px] rounded-full bg-safs-gold/10 blur-[120px] -top-20 -right-20"></div>
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">Servicing the Funeral Industry <span class="text-safs-gold">Since 1998</span></h2>
        <p class="text-white/60 text-lg mb-10 max-w-2xl mx-auto">Browse our full catalog or get in touch for personalised assistance.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a routerLink="/catalog" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-10 py-4 rounded-xl hover:bg-safs-gold-light transition-all shadow-lg hover:shadow-xl active:scale-95">
            View Full Catalog
          </a>
          <a routerLink="/contact" class="inline-flex items-center gap-2 border-2 border-white/20 text-white font-bold px-10 py-4 rounded-xl hover:border-safs-gold hover:text-safs-gold transition-all">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `]
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  heroSlide = 0;
  productSlide = 0;
  private heroInterval: ReturnType<typeof setInterval> | null = null;

  heroBgImages = [
    { id: 1, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-1.jpg' },
    { id: 2, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-5.jpg' },
    { id: 3, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-3.jpg' },
    { id: 4, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/about-image/about-image.jpg' },
    { id: 5, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-7.jpg' },
  ];

  featuredProducts = [
    { id: 'royal-dome', name: 'Royal Dome', category: 'Premium Domes', image: '/assets/additional/Royal Dome Cherry.jpg' },
    { id: 'emperor', name: 'Emperor', category: 'Executive Domes', image: '/assets/additional/Emperor White Closed.jpg' },
    { id: 'standard-dome', name: 'Standard Dome', category: 'Premium Domes', image: '/assets/additional/Standard Dome Cherry.jpg' },
    { id: 'lincoln-dome', name: 'Lincoln Dome', category: 'Premium Domes', image: '/assets/lincoln-dome-casket/1-white.png' },
    { id: 'executive-church-trolley', name: 'Church Trolley', category: 'Equipment', image: '/assets/church-trolley/1.png' },
    { id: '4-corner-figurine', name: '4 Corner Figurine', category: 'Premium Domes', image: '/assets/4-corner-figurine-casket/1-cherry-teak-kiaat.png' },
    { id: 'oxford', name: 'Oxford', category: 'Classic Collection', image: '/assets/oxford-casket/1-cherry.png' },
    { id: 'porthole', name: 'Porthole', category: 'Flatlids', image: '/assets/porthole-casket/1-walnut-cherry-kiaat.png' },
    { id: 'lowering-device-set', name: 'Lowering Device Set', category: 'Equipment', image: '/assets/lowering-device/1.png' },
  ];

  services = [
    {
      title: 'Premium Caskets',
      description: 'Handcrafted wooden and metal caskets in various styles and finishes to honour every life with dignity.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-1.jpg',
      features: ['Custom finishes', 'Eco-friendly options', 'Rapid fulfillment']
    },
    {
      title: 'Cremation Urns',
      description: 'Beautiful and respectful urns designed to preserve and honour the memories of the departed.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-2.jpg',
      features: ['Personalization', 'Quality materials', 'Affordable pricing']
    },
    {
      title: 'Equipment Rental',
      description: 'Complete funeral service equipment including stands, frames, and ceremonial accessories.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-3.jpg',
      features: ['Flexible terms', 'Maintenance included', 'Delivery available']
    },
    {
      title: 'Funeral Supplies',
      description: 'Complete range of essentials including memorial items, decorative accessories, and more.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-4.jpg',
      features: ['Bulk ordering', 'Wholesale pricing', 'Custom arrangements']
    },
    {
      title: 'Nationwide Delivery',
      description: 'Fast and reliable delivery throughout South Africa with our extensive distribution network.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-5.jpg',
      features: ['24-hour turnaround', 'Safe handling', 'Tracking available']
    },
    {
      title: 'International Shipping',
      description: 'We deliver to neighbouring countries, across Africa, and beyond with full logistics support.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-6.jpg',
      features: ['Export expertise', 'Documentation', 'Customs assistance']
    }
  ];

  ngAfterViewInit(): void {
    this.heroInterval = setInterval(() => {
      this.heroSlide = (this.heroSlide + 1) % this.heroBgImages.length;
    }, 5000);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    });
  }

  ngOnDestroy(): void {
    if (this.heroInterval) {
      clearInterval(this.heroInterval);
    }
  }

  nextProduct(): void {
    const max = Math.max(0, this.featuredProducts.length - 4);
    this.productSlide = Math.min(this.productSlide + 1, max);
  }

  prevProduct(): void {
    this.productSlide = Math.max(0, this.productSlide - 1);
  }
}
