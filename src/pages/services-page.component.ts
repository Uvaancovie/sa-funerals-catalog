import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section with Background Carousel (Matches About Page) -->
    <section class="relative min-h-screen flex items-center overflow-hidden" aria-label="Services SAFS hero">
      <!-- Decorative texture overlay -->
      <div class="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIuOC00LjMgMi4yLTUuN2wxLjQtMS40IDQuMiA0LjItMS40IDEuNGMtMS41IDEuNS0zLjYgMi4zLTUuNyAyLjMtMS4zIDAtMi41LS4zLTMuNi0uOGwxLjUtMS41Yy42LjIgMS4zLjUgMiAuNXoiLz48L2c+PC9nPjwvc3ZnPg==')] pointer-events-none"></div>

      @for (img of heroCarouselImages; track img.id; let i = $index) {
        <div
          class="absolute inset-0 transition-all duration-1000 ease-in-out"
          [class.opacity-100]="i === heroSlide"
          [class.opacity-0]="i !== heroSlide"
          [style.transform]="'scale(' + (i === heroSlide ? 1.05 : 1) + ')'"
          [attr.aria-hidden]="i !== heroSlide"
        >
          <img
            [src]="img.src"
            alt=""
            class="w-full h-full object-cover"
            [attr.fetchpriority]="i === 0 ? 'high' : null"
            [loading]="i === 0 ? 'eager' : 'lazy'"
          />
        </div>
      }
      <div class="absolute inset-0 bg-black/30"></div>

      <div class="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-32 sm:py-40">
        <div class="max-w-3xl rounded-3xl p-6 sm:p-8 lg:p-10 bg-safs-dark/90 shadow-2xl backdrop-blur-sm">
          <div class="flex items-center gap-3 mb-6 reveal fade-up" style="transition-delay: 0.1s">
            <div class="w-10 h-0.5 bg-safs-gold" aria-hidden="true"></div>
            <span class="text-safs-gold font-bold text-sm tracking-[0.2em] uppercase">Our Services</span>
          </div>
          <h1 class="text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6 reveal fade-up" style="transition-delay: 0.2s">
            Comprehensive Funeral<br>
            <span class="text-safs-gold"> Solutions</span>
          </h1>
          <p class="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mb-10 reveal fade-up" style="transition-delay: 0.3s">
            From casket supply to equipment rental and nationwide distribution, we provide everything
            your funeral service needs to serve families with dignity and professionalism.
          </p>
          <div class="flex flex-wrap gap-4 reveal fade-up" style="transition-delay: 0.4s">
            <a
              routerLink="/contact"
              class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-8 py-4 rounded-xl hover:bg-safs-gold/80 transition-all shadow-lg hover:shadow-xl active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-safs-gold"
            >
              Get in Touch
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a
              routerLink="/catalog"
              class="inline-flex items-center gap-2 border-2 border-safs-gold text-white font-bold px-8 py-4 rounded-xl hover:bg-safs-gold hover:text-black transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-safs-gold"
            >
              Browse Catalog
            </a>
          </div>
        </div>
      </div>

      <!-- Slide Controls -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
        <nav class="flex gap-2" aria-label="Hero slide navigation">
          @for (img of heroCarouselImages; track img.id; let i = $index) {
            <button
              (click)="heroSlide = i"
              [attr.aria-label]="'Go to slide ' + (i + 1)"
              [attr.aria-current]="i === heroSlide ? 'true' : null"
              class="h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-safs-gold"
              [ngClass]="i === heroSlide ? 'w-6 bg-safs-gold' : 'w-2 bg-white/60 hover:bg-white/90'"
            ></button>
          }
        </nav>
        <div class="flex flex-col items-center gap-2 text-white/80" aria-hidden="true">
          <span class="text-xs tracking-[0.2em] uppercase font-medium drop-shadow">Scroll</span>
          <div class="scroll-indicator w-6 h-10 rounded-full border-2 border-white/70 flex items-start justify-center pt-2">
            <div class="scroll-dot w-1.5 h-1.5 rounded-full bg-safs-gold"></div>
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
            <span class="text-safs-gold">&nbsp;Services</span>
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
    <section class="py-20 sm:py-28 bg-white relative overflow-hidden">
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
                src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/funeral-supplies.png"
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
            <span class="text-safs-gold">&nbsp;Service Standards</span>
          </h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          @for (benefit of benefits; track benefit.title) {
            <div class="bg-white rounded-2xl p-8 border border-gray-100 hover:border-safs-gold/30 hover:shadow-lg transition-all group">
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
    <section class="relative overflow-hidden bg-white py-16 sm:py-24 border-t border-slate-100">
      <div class="absolute inset-0">
        <div class="absolute w-[400px] h-[400px] rounded-full bg-safs-gold/10 blur-[120px] -top-32 right-32"></div>
        <div class="absolute w-[600px] h-[600px] rounded-full bg-slate-200/30 blur-[150px] -bottom-40 -left-40"></div>
      </div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
          Ready to Partner with<br>
          <span class="text-safs-gold">South Africa's Finest</span>
        </h2>
        <p class="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Contact our team today to discuss your funeral supply needs and discover how our comprehensive
          services can support your business.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            routerLink="/contact"
            class="inline-flex items-center justify-center gap-2 bg-safs-gold text-black font-bold px-8 py-4 rounded-xl hover:bg-safs-gold/80 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Get in Touch
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a
            routerLink="/catalog"
            class="inline-flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-900 font-bold px-8 py-4 rounded-xl hover:border-safs-gold hover:text-safs-gold transition-all"
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

    .reveal {
      opacity: 0;
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .reveal.fade-up {
      transform: translateY(30px);
    }
    .reveal.revealed {
      opacity: 1;
      transform: translate(0, 0);
    }

    .scroll-indicator {
      animation: scroll-bounce 2s ease-in-out infinite;
    }
    .scroll-dot {
      animation: scroll-dot 2s ease-in-out infinite;
    }
    @keyframes scroll-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(4px); }
    }
    @keyframes scroll-dot {
      0%, 100% { transform: translateY(0); opacity: 1; }
      50% { transform: translateY(8px); opacity: 0.4; }
    }
  `]
})
export class ServicesPageComponent implements AfterViewInit, OnDestroy {
  heroSlide = 0;
  private heroInterval: ReturnType<typeof setInterval> | null = null;

  heroCarouselImages = [
    { id: 1, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/funeral-supplies.png' },
    { id: 2, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-6.jpg' },
    { id: 3, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-7.jpg' },
  ];

  currentSlide = 0;
  carouselItems = [
    { id: 1, image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/Emperor%20-%20Dark%20Cherry%20(2).jpg', label: 'Premium Caskets & Coffin', tag: 'Quality Craftsmanship' },
    { id: 2, image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/pexels-cottonbro-10496221.jpg', label: 'Memorial & Cremation Urns', tag: 'Dignified Tributes' },
    { id: 3, image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-7.jpg', label: 'Funeral Equipment Rental', tag: 'Complete Solutions' },
    { id: 4, image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-4.jpg', label: 'Essential Funeral Supplies', tag: 'Comprehensive Range' },
    { id: 5, image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/nationwide-delivery.jpg', label: 'Nationwide Distribution', tag: 'Reliable Logistics' },
  ];

  services = [
    {
      id: 1,
      title: 'Premium Caskets',
      description: 'Handcrafted wooden and metal caskets in various styles and finishes to honour every life with dignity.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/Emperor%20-%20Dark%20Cherry%20(2).jpg',
      features: ['Custom finishes', 'Eco-friendly options', 'Rapid fulfillment']
    },
    {
      id: 2,
      title: 'Cremation Urns',
      description: 'Beautiful and respectful urns designed to preserve and honour the memories of the departed.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/pexels-cottonbro-10496221.jpg',
      features: ['Personalization', 'Quality materials', 'Affordable pricing']
    },
    {
      id: 3,
      title: 'Equipment Rental',
      description: 'Complete funeral service equipment including stands, frames, and ceremonial accessories for rent or purchase.',
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-7.jpg',
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
      image: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/nationwide-delivery.jpg',
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

  ngAfterViewInit(): void {
    this.heroInterval = setInterval(() => {
      this.heroSlide = (this.heroSlide + 1) % this.heroCarouselImages.length;
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
}