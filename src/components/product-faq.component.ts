import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  categoryTag?: string;
}

@Component({
  selector: 'app-product-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mt-10 md:mt-16 bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8 md:mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safs-gold/10 text-safs-gold-dark text-xs font-bold uppercase tracking-wider mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
            Frequently Asked Questions
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-safs-dark">
            Product & Ordering Help
          </h2>
          <p class="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Find answers to common questions about materials, delivery schedules, customization, and wholesale ordering.
          </p>
        </div>

        <!-- Accordion List -->
        <div class="space-y-3 sm:space-y-4">
          @for (faq of faqs; track faq.id; let i = $index) {
            <div 
              class="border border-gray-200/80 rounded-2xl overflow-hidden transition-all duration-200 bg-white hover:border-safs-gold/40"
              [class.shadow-md]="openIndex() === i"
              [class.border-safs-gold]="openIndex() === i"
            >
              <button
                type="button"
                (click)="toggle(i)"
                class="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 text-left font-semibold text-safs-dark text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-safs-gold/50 rounded-2xl"
                [attr.aria-expanded]="openIndex() === i"
                [attr.aria-controls]="'faq-answer-' + i"
              >
                <span class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0"
                        [class.bg-safs-gold]="openIndex() === i"
                        [class.text-safs-dark]="openIndex() === i">
                    0{{ i + 1 }}
                  </span>
                  <span>{{ faq.question }}</span>
                </span>
                
                <span class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 transition-transform duration-300"
                      [class.rotate-180]="openIndex() === i"
                      [class.bg-safs-gold]="openIndex() === i"
                      [class.text-safs-dark]="openIndex() === i">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>

              @if (openIndex() === i) {
                <div 
                  [id]="'faq-answer-' + i"
                  class="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-100/60 mt-1"
                >
                  <p class="pt-3">{{ faq.answer }}</p>
                </div>
              }
            </div>
          }
        </div>

        <!-- Support CTA Banner -->
        <div class="mt-8 md:mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-safs-dark via-safs-dark to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div class="text-center sm:text-left">
            <h3 class="text-lg sm:text-xl font-bold text-white mb-1">Have more questions about this product?</h3>
            <p class="text-sm text-gray-300">Our dedicated sales and customer care team is available to assist funeral directors and parlors.</p>
          </div>
          <a
            routerLink="/contact"
            class="shrink-0 inline-flex items-center gap-2 bg-safs-gold text-safs-dark font-bold px-6 py-3 rounded-xl hover:bg-safs-gold-light transition-all shadow-md active:scale-95 text-sm"
          >
            <span>Contact Support</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `
})
export class ProductFaqComponent {
  @Input() category?: string;

  openIndex = signal<number | null>(0);

  faqs: FaqItem[] = [
    {
      id: 'materials',
      question: 'What materials and wood finishes are used for SAFS products?',
      answer: 'Our caskets, coffins, and equipment are manufactured to rigorous industry standards. Solid wood ranges utilize premium hardwoods including Kiaat, Teak, Mahogany, Cherry, Redwood, and Walnut. Veneer and flatlid products feature high-grade composite cores sealed with durable, high-gloss or matte UV protective finishes.'
    },
    {
      id: 'lead-time',
      question: 'What are the estimated delivery and dispatch lead times?',
      answer: 'Standard in-stock products in major metropolitan areas are dispatched within 24 to 48 hours. Bespoke, custom glitter finishes, or large-volume wholesale orders typically require 3 to 7 business days for precision manufacturing and quality inspection before shipping.'
    },
    {
      id: 'customization',
      question: 'Can I customize colors, handles, or interior linings?',
      answer: 'Yes! SAFS offers tailored customization options. Depending on the model, you can specify custom color variations (e.g. White, Gloss Cherry, Rose Gold, Glitter Purple), choose handle styles (C-corner, bar, or swing handles), and select interior crepe or satin upholstery.'
    },
    {
      id: 'wholesale',
      question: 'How do registered funeral parlors request bulk pricing?',
      answer: 'Funeral directors and parlors can add products directly to the inquiry cart or contact our wholesale department via the Contact page. Registered trade accounts receive tiered volume pricing, dedicated logistics support, and formal tax invoices.'
    },
    {
      id: 'specifications',
      question: 'Where can I confirm product dimensions and weight capacities?',
      answer: 'Comprehensive measurements and specifications—including standard, 2-tier, and oversize dimensions—are detailed in the Specifications table on each product page. If you need custom sizing for stretchers or racking systems, our engineering team can provide technical drawings.'
    },
    {
      id: 'guarantee',
      question: 'What is your quality guarantee and transit policy?',
      answer: 'Every SAFS item undergoes strict quality checks prior to release. In the rare event of transit damage or a manufacturing variance, notify our support team within 48 hours with order details for expedited replacement or technical resolution.'
    }
  ];

  toggle(index: number): void {
    if (this.openIndex() === index) {
      this.openIndex.set(null);
    } else {
      this.openIndex.set(index);
    }
  }
}
