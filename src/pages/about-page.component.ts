import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
      <div class="absolute inset-0 bg-gradient-to-r from-safs-dark/95 via-safs-dark/80 to-safs-dark/60"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-safs-dark/40 via-transparent to-transparent"></div>

      <div class="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-32 sm:py-40">
        <div class="max-w-3xl">
          <div class="flex items-center gap-3 mb-6 reveal fade-up">
            <div class="w-10 h-0.5 bg-safs-gold"></div>
            <span class="text-safs-gold font-bold text-sm tracking-[0.2em] uppercase">About Us</span>
          </div>
          <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6 reveal fade-up" style="transition-delay: 0.1s">
            South Africa's Trusted<br>
            <span class="text-safs-gold">Funeral Supply Partner</span>
          </h1>
          <p class="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mb-10 reveal fade-up" style="transition-delay: 0.2s">
            Servicing the funeral industry since 1998. We combine decades of experience with
            uncompromising quality to provide funeral homes across South Africa with premium
            caskets, equipment, and supplies.
          </p>
          <div class="flex flex-wrap gap-4 reveal fade-up" style="transition-delay: 0.3s">
            <a routerLink="/catalog" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-8 py-4 rounded-xl hover:bg-safs-gold-light transition-all shadow-lg hover:shadow-xl active:scale-95">
              Browse Our Range
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a href="tel:+27315086700" class="inline-flex items-center gap-2 border-2 border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:border-safs-gold hover:text-safs-gold transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +27 31 508 6700
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
          <div class="scroll-indicator w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div class="scroll-dot w-1.5 h-1.5 rounded-full bg-safs-gold"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="relative -mt-12 z-10 max-w-6xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        @for (stat of stats; track stat.label; let i = $index) {
          <div class="reveal fade-up bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow" [style.transition-delay]="i * 0.08 + 's'">
            <div class="text-3xl sm:text-4xl font-bold text-safs-dark mb-1">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 font-medium">{{ stat.label }}</div>
          </div>
        }
      </div>
    </section>

    <!-- Product Range -->
    <section class="bg-white py-20 sm:py-28 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20" style="background: radial-gradient(800px circle at 50% 50%, rgba(197, 160, 89, 0.1), transparent 60%);"></div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <div class="flex items-center justify-center gap-3 mb-4 reveal fade-up">
            <div class="w-8 h-0.5 bg-safs-gold"></div>
            <span class="text-safs-gold font-bold text-sm tracking-[0.2em] uppercase">Our Product Range</span>
            <div class="w-8 h-0.5 bg-safs-gold"></div>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark mb-4 reveal fade-up" style="transition-delay: 0.1s">Premium Caskets & Funeral Equipment</h2>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg reveal fade-up" style="transition-delay: 0.15s">
            From handcrafted domes and coffins to essential equipment — we manufacture and supply the finest funeral products in South Africa.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (product of casketImages; track product.name; let i = $index) {
            <div class="group relative rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden hover:border-safs-gold/30 hover:shadow-lg transition-all reveal fade-up" [style.transition-delay]="i * 0.08 + 's'">
              <div class="absolute inset-x-0 top-0 h-1 bg-safs-gold/0 group-hover:bg-safs-gold transition-colors z-10"></div>
              <div class="h-56 p-4 flex items-center justify-center bg-white">
                <img [src]="product.image" [alt]="product.name" class="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="p-5">
                <h3 class="font-bold text-safs-dark mb-1">{{ product.name }}</h3>
                <p class="text-xs text-gray-400 uppercase tracking-wider">{{ product.category }}</p>
              </div>
            </div>
          }
        </div>

        <div class="text-center mt-12 reveal fade-up">
          <a routerLink="/catalog" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-8 py-4 rounded-xl hover:bg-safs-gold-light transition-all shadow-lg hover:shadow-xl active:scale-95">
            View Full Catalog
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="bg-white py-20 sm:py-28">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div class="flex items-center gap-3 mb-4 reveal fade-up">
              <div class="w-8 h-0.5 bg-safs-gold"></div>
              <span class="text-safs-gold font-bold text-sm tracking-[0.2em] uppercase">Our Mission</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark leading-tight mb-6 reveal fade-up" style="transition-delay: 0.1s">
              Delivering Dignity Through<br>
              <span class="text-safs-gold">Quality & Compassion</span>
            </h2>
            <p class="text-gray-600 leading-relaxed mb-6 text-lg reveal fade-up" style="transition-delay: 0.15s">
              At South African Funeral Supplies, we understand that every family deserves to
              say goodbye with dignity. Our mission is to provide funeral professionals with
              products that honour that belief — from handcrafted caskets to essential equipment
              and supplies.
            </p>
            <p class="text-gray-500 leading-relaxed mb-8 reveal fade-up" style="transition-delay: 0.2s">
              We work closely with manufacturers across South Africa and internationally to
              source the finest materials, ensuring every product that leaves our warehouse
              meets the highest standards of quality and craftsmanship.
            </p>
          </div>

          <div class="relative reveal slide-right">
            <div class="absolute inset-0 bg-safs-gold rounded-2xl transform translate-x-4 translate-y-4"></div>
            <img
              src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/about-image/about-3.jpg"
              alt="About our facility"
              class="relative rounded-2xl shadow-xl w-full h-[450px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="bg-gray-50 py-20 sm:py-28 relative overflow-hidden">
      <div class="absolute inset-0 opacity-30" style="background: radial-gradient(800px circle at 20% 50%, rgba(197, 160, 89, 0.12), transparent 60%);"></div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <div class="flex items-center justify-center gap-3 mb-4 reveal fade-up">
            <div class="w-8 h-0.5 bg-safs-gold"></div>
            <span class="text-safs-gold font-bold text-sm tracking-[0.2em] uppercase">Our Values</span>
            <div class="w-8 h-0.5 bg-safs-gold"></div>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark reveal fade-up" style="transition-delay: 0.1s">What Guides Everything We Do</h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (value of values; track value.title; let i = $index) {
            <div class="bg-white rounded-2xl p-6 border border-gray-100 hover:border-safs-gold/30 hover:shadow-lg transition-all group reveal fade-up" [style.transition-delay]="i * 0.08 + 's'">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-8 h-0.5 bg-safs-gold rounded-full group-hover:w-12 transition-all duration-300"></div>
              </div>
              <h3 class="font-bold text-safs-dark mb-2">{{ value.title }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed">{{ value.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Timeline / History -->
    <section class="bg-white py-20 sm:py-28 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20" style="background: radial-gradient(800px circle at 80% 50%, rgba(197, 160, 89, 0.12), transparent 60%);"></div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <div class="flex items-center justify-center gap-3 mb-4 reveal fade-up">
            <div class="w-8 h-0.5 bg-safs-gold"></div>
            <span class="text-safs-gold font-bold text-sm tracking-[0.2em] uppercase">Our Journey</span>
            <div class="w-8 h-0.5 bg-safs-gold"></div>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark reveal fade-up" style="transition-delay: 0.1s">Decades of Dedicated Service</h2>
        </div>

        <div class="relative">
          <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-safs-gold/50 via-safs-gold/20 to-transparent -translate-x-1/2"></div>

          @for (milestone of milestones; track milestone.year; let i = $index) {
            <div class="relative mb-12 md:mb-16 last:mb-0 reveal fade-up" [style.transition-delay]="i * 0.1 + 's'">
              <div class="hidden md:block absolute left-1/2 top-6 w-3 h-3 rounded-full bg-safs-gold border-2 border-white shadow -translate-x-1/2 z-10"></div>

              <div class="md:w-[calc(50%-2rem)]" [class.md:ml-auto]="$even" [class.md:mr-auto]="$odd" [class.md:text-right]="$odd" [class.md:pl-8]="$even" [class.md:pr-8]="$odd">
                <div class="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-safs-gold/30 hover:shadow-lg transition-all">
                  <div class="flex items-center gap-3 mb-3" [class.md:flex-row-reverse]="$odd">
                    <span class="inline-block bg-safs-dark text-safs-gold font-bold text-sm px-4 py-1 rounded-full">{{ milestone.year }}</span>
                  </div>
                  <h3 class="text-xl font-bold text-safs-dark mb-2">{{ milestone.title }}</h3>
                  <p class="text-gray-500 leading-relaxed">{{ milestone.description }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="bg-gray-50 py-20 sm:py-28">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <div class="flex items-center justify-center gap-3 mb-4 reveal fade-up">
            <div class="w-8 h-0.5 bg-safs-gold"></div>
            <span class="text-safs-gold font-bold text-sm tracking-[0.2em] uppercase">Why Choose Us</span>
            <div class="w-8 h-0.5 bg-safs-gold"></div>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark mb-4 reveal fade-up" style="transition-delay: 0.1s">What Sets Us Apart</h2>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg reveal fade-up" style="transition-delay: 0.15s">
            We don't just supply products — we build lasting partnerships with funeral homes
            across South Africa.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          @for (item of differentiators; track item.title; let i = $index) {
            <div class="bg-white rounded-2xl p-8 border border-gray-100 hover:border-safs-gold/30 hover:shadow-lg transition-all group reveal fade-up" [style.transition-delay]="i * 0.08 + 's'">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-8 h-0.5 bg-safs-gold rounded-full group-hover:w-12 transition-all duration-300"></div>
              </div>
              <h3 class="text-lg font-bold text-safs-dark mb-3">{{ item.title }}</h3>
              <p class="text-gray-500 leading-relaxed">{{ item.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-safs-dark via-[#252B5A] to-safs-dark py-20">
      <div class="absolute w-[600px] h-[600px] rounded-full bg-safs-gold/10 blur-[150px] -top-40 -right-40"></div>
      <div class="absolute w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px] -bottom-20 left-10"></div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
          Ready to Partner with<br>
          <span class="text-safs-gold">South Africa's Finest</span>
        </h2>
        <p class="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
          Browse our full catalog of premium funeral supplies, or get in touch with our
          team for personalised assistance.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a routerLink="/catalog" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-10 py-4 rounded-xl hover:bg-safs-gold-light transition-all shadow-lg hover:shadow-xl active:scale-95">
            View Full Catalog
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a href="tel:+27315086700" class="inline-flex items-center gap-2 border-2 border-white/20 text-white font-bold px-10 py-4 rounded-xl hover:border-safs-gold hover:text-safs-gold transition-all">
            Contact Sales
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
    .reveal.slide-right {
      transform: translateX(30px);
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
export class AboutPageComponent implements AfterViewInit, OnDestroy {
  heroSlide = 0;
  private heroInterval: ReturnType<typeof setInterval> | null = null;

  heroBgImages = [
    { id: 1, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/about-image/about-image.jpg' },
    { id: 2, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/about-image/about-3.jpg' },
    { id: 3, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-1.jpg' },
    { id: 4, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-3.jpg' },
    { id: 5, src: 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/services/services-7.jpg' },
  ];

  casketImages = [
    { name: 'Royal Dome Casket', category: 'Premium Dome', image: 'assets/additional/Royal Dome Cherry.jpg' },
    { name: 'Emperor White Casket', category: 'Classic Collection', image: 'assets/additional/Emperor White Closed.jpg' },
    { name: 'Standard Dome Casket', category: 'Premium Dome', image: 'assets/additional/Standard Dome Cherry.jpg' },
    { name: 'Lincoln Dome Casket', category: 'Premium Dome', image: 'assets/lincoln-dome-casket/1-white.png' },
    { name: 'Church Trolley', category: 'Equipment', image: 'assets/church-trolley/1.png' },
    { name: 'Four Corner Figurine', category: 'Classic Collection', image: 'assets/4-corner-figurine-casket/1-cherry-teak-kiaat.png' },
    { name: 'Oxford Casket', category: 'Classic Collection', image: 'assets/oxford-casket/1-cherry.png' },
    { name: 'Porthole Casket', category: 'Classic Collection', image: 'assets/porthole-casket/1-walnut-cherry-kiaat.png' },
  ];

  stats = [
    { value: '26+', label: 'Years of Service' },
    { value: '60+', label: 'Products Available' },
    { value: '1000+', label: 'Funeral Homes Served' },
    { value: '98%', label: 'Client Satisfaction' },
  ];

  values = [
    {
      title: 'Uncompromising Quality',
      description: 'Every product is carefully sourced and inspected to meet our rigorous quality standards before reaching your funeral home.'
    },
    {
      title: 'Nationwide Reach',
      description: 'We deliver to funeral homes across all nine provinces of South Africa with reliable logistics and timely service.'
    },
    {
      title: 'Industry Expertise',
      description: 'With over two decades in the industry, our team understands the unique needs and sensitivities of funeral professionals.'
    },
    {
      title: 'Competitive Pricing',
      description: 'We leverage strong manufacturer relationships to offer premium products at fair, transparent prices.'
    }
  ];

  milestones = [
    {
      year: '1998',
      title: 'Founded in Durban',
      description: 'South African Funeral Supplies was established with a vision to provide quality funeral products to the growing industry in KwaZulu-Natal.'
    },
    {
      year: '2005',
      title: 'Expanded Product Range',
      description: 'We expanded beyond basic caskets to offer a comprehensive range including domes, equipment, and specialist funeral supplies.'
    },
    {
      year: '2012',
      title: 'Nationwide Distribution',
      description: 'Our distribution network grew to cover all nine provinces, bringing reliable delivery and consistent quality to funeral homes countrywide.'
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched our online catalog and ordering platform, making it easier for funeral professionals to browse and order from anywhere.'
    },
    {
      year: '2024',
      title: 'Continued Growth & Innovation',
      description: 'Today we serve over a thousand funeral homes, continuously expanding our range and improving our service with modern technology and deeper expertise.'
    }
  ];

  differentiators = [
    {
      title: 'Quality Assurance',
      description: 'Rigorous quality control on every product. We personally inspect and approve each item before it reaches our clients.'
    },
    {
      title: 'Fast & Reliable Delivery',
      description: 'Nationwide delivery network ensuring your supplies arrive on time, every time, with real-time order tracking.'
    },
    {
      title: 'Personalised Service',
      description: 'Dedicated account managers who understand your business and work with you to find the right products for every family.'
    },
    {
      title: 'Extensive Range',
      description: 'From premium handcrafted caskets to essential equipment — we stock everything a funeral home needs under one roof.'
    },
    {
      title: 'Value for Money',
      description: 'Competitive pricing without compromising on quality. We help funeral homes maintain healthy margins while offering dignity.'
    },
    {
      title: 'Industry Partnerships',
      description: 'Strong relationships with top manufacturers in South Africa and abroad, giving you access to the best products in the market.'
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
}
