import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MarketingService } from '../services/marketing.service';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-safs-dark text-white rounded-2xl p-5 sm:p-6 md:p-8 relative overflow-hidden my-6 max-w-4xl mx-auto shadow-xl border border-safs-gold/80 backdrop-blur-md">
      <!-- Ambient background lighting -->
      <div class="absolute -top-16 -left-16 w-60 h-60 bg-safs-gold/15 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -bottom-16 -right-16 w-60 h-60 bg-safs-gold/10 rounded-full blur-2xl pointer-events-none"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <!-- Text & Pitch -->
        <div class="lg:col-span-6 space-y-3">
          <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-safs-gold/15 border border-safs-gold/30 text-safs-gold text-[10px] font-bold uppercase tracking-wider">
          
            
          </div>
          
          <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug font-serif">
            Stay Ahead with Updates, Offers & New Products
          </h2>
          
          <p class="text-xs text-slate-300 leading-relaxed">
            Subscribe for exclusive trade promotions, seasonal volume offers, new handcrafted casket releases, and industry updates.
          </p>

          <div class="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-200 font-medium">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-safs-gold shrink-0"></span>
              <span>Trade Promotions</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-safs-gold shrink-0"></span>
              <span>Special Volume Offers</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-safs-gold shrink-0"></span>
              <span>New Caskets & Models</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-safs-gold shrink-0"></span>
              <span>Priority Bulletins</span>
            </div>
          </div>
        </div>

        <!-- Subscription Form -->
        <div class="lg:col-span-6">
          <div class="p-4 sm:p-5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg">
            @if (isSuccess()) {
              <div class="text-center py-4 space-y-3 animate-fade-in">
                <div class="w-12 h-12 bg-safs-gold/20 text-safs-gold rounded-full flex items-center justify-center mx-auto border border-safs-gold/40 shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-white font-serif">You're Subscribed!</h3>
                <p class="text-[11px] text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Thank you! Your confirmation and the latest SAFS updates & trade offers are on their way to your inbox.
                </p>
                <button
                  type="button"
                  (click)="resetForm()"
                  class="bg-safs-gold hover:bg-white text-black font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-lg transition-all shadow">
                  Subscribe Another Email
                </button>
              </div>
            } @else {
              <form [formGroup]="newsletterForm" (ngSubmit)="onSubmit()" class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-200 mb-1">First Name (Optional)</label>
                    <input
                      type="text"
                      formControlName="firstName"
                      placeholder="e.g. Sipho"
                      class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-slate-400 focus:border-safs-gold focus:ring-1 focus:ring-safs-gold outline-none text-xs transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-200 mb-1">Work Email <span class="text-safs-gold">*</span></label>
                    <input
                      type="email"
                      formControlName="email"
                      placeholder="name@funeralhome.co.za"
                      class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-slate-400 focus:border-safs-gold focus:ring-1 focus:ring-safs-gold outline-none text-xs transition-all"
                      [class.border-red-400]="isFieldInvalid('email')"
                    />
                  </div>
                </div>

                @if (isFieldInvalid('email')) {
                  <p class="text-[10px] text-red-400 font-medium animate-fade-in">
                    Please provide a valid email address.
                  </p>
                }

                <!-- POPIA / Marketing Consent -->
                <div>
                  <label class="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      formControlName="consent"
                      class="mt-0.5 rounded border-slate-600 bg-white/10 text-safs-gold focus:ring-safs-gold cursor-pointer"
                    />
                    <span class="text-[10px] text-slate-300 leading-tight">
                      I agree to receive new product announcements, trade offers, promotions, and updates from SAFS.
                    </span>
                  </label>
                  @if (isFieldInvalid('consent')) {
                    <p class="text-[10px] text-red-400 font-medium mt-0.5 animate-fade-in">
                      Consent is required to receive updates and offers.
                    </p>
                  }
                </div>

                @if (errorMessage()) {
                  <div class="p-2.5 bg-red-900/40 border border-red-500/50 text-red-200 text-[11px] rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{{ errorMessage() }}</span>
                  </div>
                }

                <!-- Submit Button -->
                <button
                  type="submit"
                  [disabled]="isLoading()"
                  class="w-full bg-safs-gold hover:bg-[#d8b265] text-black font-extrabold uppercase tracking-wider text-xs py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-safs-gold/25 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (isLoading()) {
                    <svg class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Subscribing...</span>
                  } @else {
                    <span>Get Updates & Offers</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  }
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class NewsletterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private marketingService = inject(MarketingService);
  private route = inject(ActivatedRoute);

  newsletterForm: FormGroup = this.fb.group({
    firstName: [''],
    email: ['', [Validators.required, Validators.email]],
    consent: [true, [Validators.requiredTrue]]
  });

  isLoading = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  utmSource = signal<string | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const utm = params['utm_source'] || params['source'] || params['ref'];
      if (utm) {
        this.utmSource.set(String(utm));
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.newsletterForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.newsletterForm.invalid) {
      this.newsletterForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, firstName, consent } = this.newsletterForm.value;

    this.marketingService.subscribeNewsletter(email, {
      firstName: firstName?.trim() || undefined,
      consent: Boolean(consent),
      utm: this.utmSource() || undefined
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.error || 'Failed to complete subscription. Please verify your details or try again later.'
        );
      }
    });
  }

  resetForm() {
    this.newsletterForm.reset({ consent: true });
    this.isSuccess.set(false);
    this.errorMessage.set(null);
  }
}
