import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoPlayerComponent } from '../components/video-player.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, VideoPlayerComponent],
  template: `
    <!-- Classy, Uncropped Hero Section -->
    <section class="relative w-full overflow-hidden bg-slate-950 flex items-end min-h-[540px] sm:min-h-[620px] lg:min-h-[720px] xl:min-h-[780px]" aria-label="SAFS Hero">
      
      <!-- Crystal-Clear Full-Frame Background Image -->
      <div class="absolute inset-0 w-full h-full">
        <img
          src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/store-front/FRONT%20IMAGE%20.jpeg"
          alt="South African Funeral Supplies Storefront"
          class="w-full h-full object-cover object-center select-none"
          fetchpriority="high"
          loading="eager"
        />
      </div>

      <!-- Subtle Scrim (Light feathering on the bottom only so the image remains bright and clear) -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none"></div>

      <!-- Content Container -->
      <div class="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 sm:pb-16 lg:pb-20 pt-28 sm:pt-36">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12">
          
          <!-- Headline & Description (Bottom Left) -->
          <div class="max-w-2xl space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-safs-gold text-xs font-semibold uppercase tracking-[0.2em]">
              <span class="w-1.5 h-1.5 rounded-full bg-safs-gold"></span>
              Est. 1998 • Trusted Manufacturer
            </div>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] drop-shadow-md">
              South African<br>
              <span class="font-light text-slate-100">Funeral Supplies</span>
            </h1>

            <p class="text-sm sm:text-base lg:text-lg text-white/90 font-normal leading-relaxed max-w-lg drop-shadow-sm">
              Handcrafted caskets, premium domes, and certified mortuary equipment engineered for dignified farewells.
            </p>
          </div>

          <!-- Refined Pill CTA Buttons (Bottom Right) -->
          <div class="flex flex-wrap items-center gap-3.5 shrink-0">
            <a
              routerLink="/catalog"
              class="inline-flex items-center justify-center bg-white text-slate-950 hover:bg-safs-gold hover:text-black font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-2xl transition-all duration-300 active:scale-95"
            >
              Explore Catalog
            </a>
            <a
              routerLink="/contact"
              class="inline-flex items-center justify-center border border-white/40 hover:border-white text-white font-medium text-sm sm:text-base px-7 py-3.5 rounded-full bg-black/30 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- Operational Cinematic Video Strip -->
    <section class="bg-white py-20 relative overflow-hidden">
      <div class="absolute w-[500px] h-[500px] rounded-full bg-safs-gold/10 blur-[120px] -bottom-20 -left-20 pointer-events-none"></div>

      <div class="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10">
          <div class="inline-flex items-center gap-2 text-safs-gold font-bold text-xs tracking-[0.25em] uppercase mb-3">
            <span class="w-6 h-0.5 bg-safs-gold"></span>
            Factory &amp; Logistics
            <span class="w-6 h-0.5 bg-safs-gold"></span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-950 mb-3">Craftsmanship at Scale</h2>
          <p class="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Take an inside look at our specialized manufacturing processes, finish detailing, and distribution capabilities.
          </p>
        </div>

        <div class="relative p-2 rounded-3xl bg-slate-50 border border-slate-200 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto">
          <div class="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <app-video-player
              src="/assets/videos/aerial.mp4"
              [loop]="false"
              [startMuted]="true"
            ></app-video-player>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Metrics Strip -->
    <section class="bg-white border-y border-slate-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-3xl sm:text-4xl font-black text-safs-gold">26+</div>
            <div class="text-slate-800 font-medium text-sm mt-1">Years of Service</div>
            <div class="text-slate-500 text-xs mt-0.5">Established since 1998</div>
          </div>
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-3xl sm:text-4xl font-black text-safs-gold">60+</div>
            <div class="text-slate-800 font-medium text-sm mt-1">Product Lines</div>
            <div class="text-slate-500 text-xs mt-0.5">Caskets, Domes, Hardware &amp; Requisites</div>
          </div>
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-3xl sm:text-4xl font-black text-safs-gold">100+</div>
            <div class="text-slate-800 font-medium text-sm mt-1">Funeral Homes Partnered</div>
            <div class="text-slate-500 text-xs mt-0.5">Nationwide &amp; Export Reach</div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-white py-20 sm:py-28 relative">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p class="text-xs font-bold tracking-widest uppercase text-safs-gold mb-3">About SAFS</p>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-950 mb-6">Pioneering Product Design &amp; Quality Since Inception</h2>
            <div class="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                Since our inception we have been at the forefront of product design and innovation with many industry designs having originated directly from our state-of-the-art facility.
              </p>
              <p>
                This has established our brand as the premium supplier of quality caskets, equipment, and requisites to funeral directors across South Africa and the wider continent.
              </p>
            </div>
            <div class="mt-8">
              <a routerLink="/about" class="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-safs-gold transition-colors pb-1 border-b-2 border-slate-900 hover:border-safs-gold">
                Learn more about our heritage &rarr;
              </a>
            </div>
          </div>
          <div class="relative">
            <div class="absolute inset-0 bg-safs-gold rounded-3xl transform translate-x-3 translate-y-3 opacity-70"></div>
            <img class="relative rounded-3xl shadow-xl w-full h-[400px] object-cover border border-slate-200" src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/about-image/about-image.jpg" alt="SAFS Manufacturing Facility" />
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="bg-white py-20 sm:py-28 relative">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <p class="text-xs font-bold tracking-widest uppercase text-safs-gold mb-3">Solutions &amp; Offerings</p>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-950 mb-3">End-to-End Funeral Supplies</h2>
          <p class="text-slate-500 max-w-2xl mx-auto text-base">Comprehensive manufacturing and supply chain solutions tailored for professional funeral homes.</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          @for (svc of services; track svc.title) {
            <div class="rounded-2xl overflow-hidden group border border-slate-200 bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
              <div class="relative h-48 overflow-hidden bg-slate-100">
                <img [src]="svc.image" [alt]="svc.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
              </div>
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 mb-2">{{ svc.title }}</h3>
                  <p class="text-slate-600 text-sm leading-relaxed mb-4">{{ svc.description }}</p>
                </div>
                <ul class="space-y-1.5 pt-3 border-t border-slate-100">
                  @for (feat of svc.features; track feat) {
                    <li class="flex items-start gap-2 text-xs text-slate-500">
                      <svg class="w-3.5 h-3.5 text-safs-gold mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

    <!-- Featured Products Carousel -->
    <section class="bg-white py-20 sm:py-28 relative overflow-hidden">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-end justify-between mb-12">
          <div>
            <span class="text-safs-gold font-bold text-xs tracking-[0.2em] uppercase block mb-2">Portfolio</span>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-950">Featured Products</h2>
          </div>
          <div class="hidden sm:flex gap-3">
            <button (click)="prevProduct()" aria-label="Previous Product" class="w-11 h-11 rounded-xl border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button (click)="nextProduct()" aria-label="Next Product" class="w-11 h-11 rounded-xl border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
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
                  <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <div class="h-60 p-6 flex items-center justify-center bg-slate-50/50">
                      <img [src]="product.image" [alt]="product.name" class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div class="p-5 border-t border-slate-100">
                      <p class="text-xs text-safs-gold uppercase tracking-wider font-bold mb-1">{{ product.category }}</p>
                      <h3 class="text-base font-bold text-slate-900 group-hover:text-safs-gold transition-colors">{{ product.name }}</h3>
                    </div>
                  </div>
                </a>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Accordion -->
    <section class="bg-white py-20 sm:py-28 relative">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-14">
          <span class="text-safs-gold font-bold text-xs tracking-widest uppercase block mb-2">Have Questions?</span>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-950">Frequently Asked Questions</h2>
        </div>

        <div class="space-y-4">
          @for (faq of faqs; track $index; let i = $index) {
            <div class="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden transition-all">
              <button
                (click)="toggleFaq(i)"
                class="w-full flex items-center justify-between gap-4 text-left px-6 sm:px-8 py-5 font-bold text-slate-900 hover:text-safs-gold transition-colors"
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

    <!-- B2B Closing CTA -->
    <section class="bg-white py-20 relative overflow-hidden">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-950 mb-4">
          Partner with South Africa's Leading Manufacturer
        </h2>
        <p class="text-slate-600 text-base mb-8 max-w-xl mx-auto">
          Contact our sales specialists today to discuss trade accounts, bulk discounts, and custom orders.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a routerLink="/catalog" class="inline-flex items-center gap-2 bg-safs-gold hover:bg-safs-gold/80 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95">
            Browse Full Range
          </a>
          <a routerLink="/contact" class="inline-flex items-center gap-2 border-2 border-slate-300 hover:border-slate-900 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all hover:bg-slate-50">
            Open Trade Inquiry
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class LandingPageComponent {
  productSlide = 0;

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

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

  nextProduct(): void {
    const max = Math.max(0, this.featuredProducts.length - 4);
    this.productSlide = Math.min(this.productSlide + 1, max);
  }

  prevProduct(): void {
    this.productSlide = Math.max(0, this.productSlide - 1);
  }
}