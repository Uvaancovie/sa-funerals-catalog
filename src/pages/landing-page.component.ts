import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoPlayerComponent } from '../components/video-player.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, VideoPlayerComponent],
  template: `
    <!-- HERO SECTION: High-End Framed Architecture -->
    <section class="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 py-8 sm:py-12 lg:py-16 overflow-hidden">
      <!-- Subtle Background Ambient Glows -->
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-amber-200/20 via-slate-200/30 to-transparent blur-3xl pointer-events-none rounded-full"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Premium Outer Framed Showcase -->
        <div class="relative bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 sm:p-10 lg:p-14 overflow-hidden">
          
          <!-- Subtle Inner Frame Accent -->
          <div class="absolute inset-0 border border-slate-900/5 rounded-3xl pointer-events-none"></div>
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            <!-- LEFT COLUMN: Brand Statement & Primary CTAs (5 Columns) -->
            <div class="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8">
              
              <div>
                <!-- Trust Pill Badge -->
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6 shadow-sm">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Est. 1998 &bull; Global Manufacturing Partner
                </div>

                <!-- Structured Hierarchy Typography -->
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

                <p class="text-slate-500 text-sm sm:text-base leading-relaxed mt-5 max-w-md">
                  Delivering handcrafted precision, certified engineering, and bulk wholesale logistics to funeral homes across Africa and overseas.
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-3.5 pt-2">
                <a
                  routerLink="/catalog"
                  class="inline-flex items-center justify-center gap-2 bg-slate-950 text-white hover:bg-amber-600 hover:text-white font-bold text-sm sm:text-base uppercase tracking-wider px-7 py-4 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300 active:scale-[0.98]"
                >
                  <span>Explore Catalog</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
                
                <a
                  routerLink="/contact"
                  class="inline-flex items-center justify-center border-2 border-slate-200 hover:border-slate-900 text-slate-800 font-semibold text-sm sm:text-base px-6 py-4 rounded-xl transition-all duration-200 hover:bg-slate-50"
                >
                  Contact Sales
                </a>
              </div>

              <!-- Quick Trust Badges -->
              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <div class="flex items-center gap-1.5 font-medium">
                  <svg class="w-4 h-4 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  Direct Factory Pricing
                </div>
                <div class="flex items-center gap-1.5 font-medium">
                  <svg class="w-4 h-4 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  Nationwide &amp; Export
                </div>
              </div>

            </div>

            <!-- RIGHT COLUMN: Studio Showcase & Carousel (7 Columns) -->
            <div class="lg:col-span-7 lg:border-l lg:border-slate-200/80 lg:pl-10 flex flex-col items-center">
              
              <!-- Showcase Container with Studio Backdrop -->
              <div class="w-full relative group">
                <div class="relative rounded-2xl border border-slate-300/80 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200/70 p-4 sm:p-8 aspect-[16/10] overflow-hidden shadow-inner flex items-center justify-center">
                  
                  <!-- Radial Studio Spotlight Effect -->
                  <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/90 via-slate-100/40 to-transparent pointer-events-none"></div>

                  <!-- Badge Overlay -->
                  <div class="absolute top-4 left-4 z-20">
                    <span class="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-md text-slate-800 rounded-full border border-slate-200/80 shadow-sm">
                      {{ heroSlides[currentHeroSlide].category }}
                    </span>
                  </div>

                  <!-- Sliding Showcase Images -->
                  @for (slide of heroSlides; track slide.id; let i = $index) {
                    <div
                      class="absolute inset-0 p-4 sm:p-8 flex flex-col items-center justify-center transition-all duration-700 ease-out"
                      [class.opacity-100]="i === currentHeroSlide"
                      [class.opacity-0]="i !== currentHeroSlide"
                      [class.scale-100]="i === currentHeroSlide"
                      [class.scale-95]="i !== currentHeroSlide"
                      [class.pointer-events-none]="i !== currentHeroSlide"
                    >
                      <img
                        [src]="slide.image"
                        [alt]="slide.title"
                        class="max-w-full max-h-[82%] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.25)] transition-transform duration-500 hover:scale-105"
                      />
                      <p class="mt-3 text-xs font-semibold tracking-wide text-slate-600 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200/60">
                        {{ slide.title }}
                      </p>
                    </div>
                  }

                  <!-- Carousel Next / Prev Quick Buttons -->
                  <button 
                    (click)="prevHeroSlide()" 
                    aria-label="Previous Slide"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button 
                    (click)="nextHeroSlide()" 
                    aria-label="Next Slide"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>

              <!-- Pagination Dot Controls -->
              <div class="flex items-center justify-center gap-2.5 mt-5">
                @for (slide of heroSlides; track slide.id; let i = $index) {
                  <button
                    (click)="setHeroSlide(i)"
                    [attr.aria-label]="'Go to slide ' + (i + 1)"
                    class="transition-all duration-300 rounded-full focus:outline-none"
                    [ngClass]="i === currentHeroSlide 
                      ? 'w-7 h-2.5 bg-slate-900 ring-2 ring-slate-900/20' 
                      : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'"
                  ></button>
                }
              </div>

              <!-- Award Winning Signature Banner -->
              <div class="mt-4 flex flex-col items-center text-center">
                <div class="flex items-center gap-2 text-amber-600 font-semibold tracking-widest text-xs uppercase mb-1">
                  <span>&starf;</span>
                  <span>Excellence in Funeral Manufacturing</span>
                  <span>&starf;</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Award Winning Quality &amp; Craftsmanship
                </h2>
                <p class="text-xs text-slate-400 mt-1 max-w-sm">
                  Precision-milled hardwood, hand-tailored linings, and ISO-tested hardware.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- Operational Cinematic Video Strip -->
    <section class="bg-slate-950 py-20 relative overflow-hidden">
      <div class="absolute w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] -bottom-20 -left-20 pointer-events-none"></div>

      <div class="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10">
          <div class="inline-flex items-center gap-2 text-amber-400 font-bold text-xs tracking-[0.25em] uppercase mb-3">
            <span class="w-6 h-0.5 bg-amber-400"></span>
            Factory &amp; Logistics
            <span class="w-6 h-0.5 bg-amber-400"></span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-3">Craftsmanship at Scale</h2>
          <p class="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Take an inside look at our specialized manufacturing processes, finish detailing, and distribution capabilities.
          </p>
        </div>

        <div class="relative p-2 rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto">
          <div class="rounded-2xl overflow-hidden border border-white/10 bg-black/50">
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
    <section class="bg-slate-900 border-y border-slate-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div class="text-3xl sm:text-4xl font-black text-amber-400">26+</div>
            <div class="text-slate-300 font-medium text-sm mt-1">Years of Service</div>
            <div class="text-slate-500 text-xs mt-0.5">Established since 1998</div>
          </div>
          <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div class="text-3xl sm:text-4xl font-black text-amber-400">60+</div>
            <div class="text-slate-300 font-medium text-sm mt-1">Product Lines</div>
            <div class="text-slate-500 text-xs mt-0.5">Caskets, Domes, Hardware &amp; Requisites</div>
          </div>
          <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div class="text-3xl sm:text-4xl font-black text-amber-400">100+</div>
            <div class="text-slate-300 font-medium text-sm mt-1">Funeral Homes Partnered</div>
            <div class="text-slate-500 text-xs mt-0.5">Nationwide &amp; Export Reach</div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-slate-50 py-20 sm:py-28 relative">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p class="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">About SAFS</p>
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
              <a routerLink="/about" class="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-amber-600 transition-colors pb-1 border-b-2 border-slate-900 hover:border-amber-600">
                Learn more about our heritage &rarr;
              </a>
            </div>
          </div>
          <div class="relative">
            <div class="absolute inset-0 bg-amber-400 rounded-3xl transform translate-x-3 translate-y-3 opacity-70"></div>
            <img class="relative rounded-3xl shadow-xl w-full h-[400px] object-cover border border-slate-200" src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/about-image/about-image.jpg" alt="SAFS Manufacturing Facility" />
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="bg-white py-20 sm:py-28 relative">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <p class="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">Solutions &amp; Offerings</p>
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
                      <svg class="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
    <section class="bg-slate-50 py-20 sm:py-28 relative overflow-hidden">
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-end justify-between mb-12">
          <div>
            <span class="text-amber-600 font-bold text-xs tracking-[0.2em] uppercase block mb-2">Portfolio</span>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-950">Featured Range</h2>
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
                      <p class="text-xs text-amber-600 uppercase tracking-wider font-bold mb-1">{{ product.category }}</p>
                      <h3 class="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{{ product.name }}</h3>
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
      <div class="relative max-w-3xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-14">
          <span class="text-amber-600 font-bold text-xs tracking-widest uppercase block mb-2">Have Questions?</span>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-950">Frequently Asked Questions</h2>
        </div>

        <div class="space-y-4">
          @for (faq of faqs; track $index; let i = $index) {
            <div class="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden transition-all">
              <button
                (click)="toggleFaq(i)"
                class="w-full flex items-center justify-between gap-4 text-left px-6 sm:px-8 py-5 font-bold text-slate-900 hover:text-amber-600 transition-colors"
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
    <section class="bg-slate-950 py-20 relative overflow-hidden">
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          Partner with South Africa's Leading Manufacturer
        </h2>
        <p class="text-slate-400 text-base mb-8 max-w-xl mx-auto">
          Contact our sales specialists today to discuss trade accounts, bulk discounts, and custom orders.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a routerLink="/catalog" class="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95">
            Browse Full Range
          </a>
          <a routerLink="/contact" class="inline-flex items-center gap-2 border border-white/20 hover:border-white text-white font-bold px-8 py-4 rounded-xl transition-all hover:bg-white/5">
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
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  currentHeroSlide = 0;
  productSlide = 0;
  private heroInterval: ReturnType<typeof setInterval> | null = null;

  heroSlides = [
    { 
      id: 1, 
      category: 'Executive Series',
      title: 'Midnight Gloss Royal Dome Casket', 
      image: '/assets/additional/Royal Dome Cherry.jpg' 
    },
    { 
      id: 2, 
      category: 'Classic Dome Collection',
      title: 'Emperor White &amp; Gold Trim Casket', 
      image: '/assets/additional/Emperor White Closed.jpg' 
    },
    { 
      id: 3, 
      category: 'Heritage Craft',
      title: 'Lincoln Signature Heritage Casket', 
      image: '/assets/lincoln-dome-casket/1-white.png' 
    },
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

  nextHeroSlide(): void {
    this.currentHeroSlide = (this.currentHeroSlide + 1) % this.heroSlides.length;
    this.resetHeroTimer();
  }

  prevHeroSlide(): void {
    this.currentHeroSlide = (this.currentHeroSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
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
