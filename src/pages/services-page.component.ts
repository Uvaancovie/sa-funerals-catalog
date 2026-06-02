import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section with Carousel -->
    <section class="relative overflow-hidden bg-gradient-to-br from-safs-dark via-[#252B5A] to-safs-dark">
      <div class="absolute inset-0">
        <div class="absolute w-[500px] h-[500px] rounded-full bg-safs-gold/10 blur-[120px] -top-32 -left-32"></div>
        <div class="absolute w-[400px] h-[400px] rounded-full bg-safs-gold/5 blur-[100px] -bottom-20 right-10"></div>
      </div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="max-w-xl">
            <span class="inline-block text-safs-gold font-bold text-sm tracking-[0.2em] uppercase mb-6">Our Services</span>
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Comprehensive Funeral<br>
              <span class="text-safs-gold">Supply Solutions</span>
            </h1>
            <p class="text-lg sm:text-xl text-white/70 leading-relaxed mb-10">
              From casket supply to equipment rental and nationwide distribution, we provide everything
              your funeral service needs to serve families with dignity and professionalism.
            </p>
            <div class="flex flex-wrap gap-4">
              <a routerLink="/contact" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-8 py-4 rounded-xl hover:bg-safs-gold-light transition-all shadow-lg hover:shadow-xl active:scale-95">
                Get in Touch
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a routerLink="/catalog" class="inline-flex items-center gap-2 border-2 border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:border-safs-gold hover:text-safs-gold transition-all">
                Browse Catalog
              </a>
            </div>
          </div>

          <!-- Interactive Carousel -->
          <div class="relative">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl bg-safs-dark/50 border border-white/10">
              <div class="relative h-72 sm:h-80 md:h-96 overflow-hidden">
                @for (item of carouselItems; track item.id; let i = $index) {
                  <div
                    class="absolute inset-0 transition-all duration-700 ease-in-out"
                    [class.opacity-100]="i === currentSlide"
                    [class.opacity-0]="i !== currentSlide"
                    [class.-translate-x-0]="i === currentSlide"
                    [class.translate-x-full]="i > currentSlide"
                    [class.-translate-x-full]="i < currentSlide"
                  >
                    <img [src]="item.image" [alt]="item.label" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-safs-dark/80 via-safs-dark/10 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <span class="text-safs-gold text-xs tracking-[0.2em] uppercase font-bold">{{ item.tag }}</span>
                      <h3 class="text-white text-xl sm:text-2xl font-bold mt-1">{{ item.label }}</h3>
                    </div>
                  </div>
                }
              </div>

              <!-- Navigation Arrows -->
              <button (click)="prevSlide()" aria-label="Previous slide" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-safs-gold hover:border-safs-gold transition-all group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:text-black transition-colors"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button (click)="nextSlide()" aria-label="Next slide" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-safs-gold hover:border-safs-gold transition-all group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:text-black transition-colors"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              <!-- Dot Indicators -->
              <div class="absolute bottom-4 right-4 flex gap-2">
                @for (item of carouselItems; track item.id; let idx = $index) {
                  <span (click)="goToSlide(idx)" class="inline-block h-2 rounded-full transition-all duration-300 cursor-pointer" [ngClass]="idx === currentSlide ? 'w-6 bg-safs-gold' : 'w-2 bg-white/40'"></span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-20 sm:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <span class="inline-block text-safs-gold font-bold text-sm tracking-[0.2em] uppercase mb-4">What We Offer</span>
          <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark">
            Complete Funeral Supply<br class="sm:hidden">
            <span class="text-safs-gold">Services</span>
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          @for (service of services; track service.id) {
            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-safs-gold/30 hover:shadow-lg transition-all group">
              <div class="relative h-56 overflow-hidden bg-gray-100">
                <div class="absolute inset-x-0 top-0 h-1 bg-safs-gold/0 group-hover:bg-safs-gold transition-colors z-10"></div>
                <img
                  [src]="service.image"
                  [alt]="service.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div class="p-6 lg:p-8">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-1 h-6 bg-safs-gold rounded-full"></div>
                  <h3 class="text-xl font-bold text-safs-dark">{{ service.title }}</h3>
                </div>
                <p class="text-gray-500 leading-relaxed text-sm mb-5">{{ service.description }}</p>
                <ul class="space-y-2.5 border-t border-gray-100 pt-5">
                  @for (feature of service.features; track feature) {
                    <li class="flex items-start gap-3 text-sm text-gray-600">
                      <svg class="w-4 h-4 text-safs-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      <span>{{ feature }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Distribution Network -->
    <section class="py-20 sm:py-28 bg-gray-50 relative overflow-hidden">
      <div class="absolute inset-0 opacity-30" style="background: radial-gradient(800px circle at 20% 50%, rgba(197, 160, 89, 0.12), transparent 60%);"></div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span class="inline-block text-safs-gold font-bold text-sm tracking-[0.2em] uppercase mb-4">Nationwide Coverage</span>
            <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark leading-tight mb-6">
              Fast & Efficient<br>
              <span class="text-safs-gold">Distribution Network</span>
            </h2>
            <p class="text-gray-600 leading-relaxed mb-8 text-lg">
              Our customer network is vast, containing large corporates as well as SMEs. We leverage
              an extensive branch (hub) network that allows our products to be delivered quickly and
              efficiently throughout South Africa, our neighbouring countries, and the African continent
              as well as abroad.
            </p>
            <div class="space-y-5">
              @for (item of distributionPoints; track item.label) {
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-lg bg-safs-dark flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-safs-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-safs-dark mb-1">{{ item.label }}</h4>
                    <p class="text-gray-500 text-sm leading-relaxed">{{ item.description }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="h-64 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-5.jpg"
                alt="Distribution Services"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="grid grid-cols-1 gap-4 pt-8">
              <div class="h-32 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-6.jpg"
                  alt="Delivery Services"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="h-32 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-7.jpg"
                  alt="Regional Coverage"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Benefits -->
    <section class="py-20 sm:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <span class="inline-block text-safs-gold font-bold text-sm tracking-[0.2em] uppercase mb-4">Why Choose Us</span>
          <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark">
            Industry-Leading<br class="sm:hidden">
            <span class="text-safs-gold">Service Standards</span>
          </h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          @for (benefit of benefits; track benefit.title) {
            <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-safs-gold/30 hover:shadow-lg transition-all group">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-8 h-0.5 bg-safs-gold rounded-full group-hover:w-12 transition-all duration-300"></div>
              </div>
              <h3 class="text-lg font-bold text-safs-dark mb-3">{{ benefit.title }}</h3>
              <p class="text-gray-500 leading-relaxed">{{ benefit.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-safs-dark via-[#252B5A] to-safs-dark py-16 sm:py-24">
      <div class="absolute inset-0">
        <div class="absolute w-[400px] h-[400px] rounded-full bg-safs-gold/10 blur-[120px] -top-32 right-32"></div>
        <div class="absolute w-[600px] h-[600px] rounded-full bg-white/5 blur-[150px] -bottom-40 -left-40"></div>
      </div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
          Ready to Partner with<br>
          <span class="text-safs-gold">South Africa's Finest</span>
        </h2>
        <p class="text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          Contact our team today to discuss your funeral supply needs and discover how our comprehensive
          services can support your business.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            routerLink="/contact"
            class="inline-flex items-center justify-center gap-2 bg-safs-gold text-black font-bold px-8 py-4 rounded-xl hover:bg-safs-gold-light transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Get in Touch
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a
            routerLink="/catalog"
            class="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:border-safs-gold hover:text-safs-gold transition-all"
          >
            Browse Catalog
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ServicesPageComponent {
  currentSlide = 0;

  carouselItems = [
    { id: 1, image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-1.jpg', label: 'Premium Caskets & Coffins', tag: 'Quality Craftsmanship' },
    { id: 2, image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-2.jpg', label: 'Memorial & Cremation Urns', tag: 'Dignified Tributes' },
    { id: 3, image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-3.jpg', label: 'Funeral Equipment Rental', tag: 'Complete Solutions' },
    { id: 4, image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-4.jpg', label: 'Essential Funeral Supplies', tag: 'Comprehensive Range' },
    { id: 5, image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-7.jpg', label: 'Nationwide Distribution', tag: 'Reliable Logistics' },
  ];

  services = [
    {
      id: 1,
      title: 'Premium Caskets',
      description: 'Handcrafted wooden and metal caskets in various styles and finishes to honour every life with dignity.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-1.jpg',
      features: ['Custom finishes', 'Eco-friendly options', 'Rapid fulfillment']
    },
    {
      id: 2,
      title: 'Cremation Urns',
      description: 'Beautiful and respectful urns designed to preserve and honour the memories of the departed.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-2.jpg',
      features: ['Personalization', 'Quality materials', 'Affordable pricing']
    },
    {
      id: 3,
      title: 'Equipment Rental',
      description: 'Complete funeral service equipment including stands, frames, and ceremonial accessories for rent or purchase.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-3.jpg',
      features: ['Flexible terms', 'Maintenance included', 'Delivery available']
    },
    {
      id: 4,
      title: 'Funeral Supplies',
      description: 'Complete range of essentials including memorial items, decorative accessories, and more.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-4.jpg',
      features: ['Bulk ordering', 'Wholesale pricing', 'Custom arrangements']
    },
    {
      id: 5,
      title: 'Nationwide Delivery',
      description: 'Fast and reliable delivery throughout South Africa with our extensive distribution network.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-5.jpg',
      features: ['24-hour turnaround', 'Safe handling', 'Tracking available']
    },
    {
      id: 6,
      title: 'International Shipping',
      description: 'We deliver to neighbouring countries, across Africa, and beyond with full logistics support.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-6.jpg',
      features: ['Export expertise', 'Documentation', 'Customs assistance']
    }
  ];

  distributionPoints = [
    {
      label: 'South Africa Coverage',
      description: 'Extensive branch network ensuring quick delivery to all provinces.'
    },
    {
      label: 'Regional Expansion',
      description: 'Neighbouring countries served through established partnerships.'
    },
    {
      label: 'Continental Reach',
      description: 'African continent and international destinations with full support.'
    },
    {
      label: 'Enterprise Scale',
      description: 'Serving large corporates, SMEs, and independent funeral homes.'
    }
  ];

  benefits = [
    {
      title: 'Quality Assurance',
      description: 'Every product meets strict quality standards before delivery to ensure families receive the best.'
    },
    {
      title: 'Industry Experience',
      description: 'Over 25 years serving the funeral industry with trusted products and reliable service.'
    },
    {
      title: 'Fast Fulfillment',
      description: 'Quick response times and efficient delivery to ensure you meet family needs promptly.'
    },
    {
      title: 'Dedicated Support',
      description: 'Expert team ready to assist with product selection, custom orders, and logistics.'
    },
    {
      title: 'Secure Partnerships',
      description: 'Long-term relationships built on trust, reliability, and mutual respect.'
    },
    {
      title: '24/7 Availability',
      description: 'Round-the-clock support for urgent orders and emergency deliveries when families need us most.'
    }
  ];

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.carouselItems.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.carouselItems.length) % this.carouselItems.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
