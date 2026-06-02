import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-safs-dark via-[#252B5A] to-safs-dark">
      <div class="absolute inset-0">
        <div class="absolute w-[500px] h-[500px] rounded-full bg-safs-gold/10 blur-[120px] -top-32 -left-32"></div>
        <div class="absolute w-[400px] h-[400px] rounded-full bg-safs-gold/5 blur-[100px] -bottom-20 right-10"></div>
      </div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
        <div class="max-w-3xl">
          <span class="inline-block text-safs-gold font-bold text-sm tracking-[0.2em] uppercase mb-6">Contact Us</span>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Let's Talk About<br>
            <span class="text-safs-gold">Your Requirements</span>
          </h1>
          <p class="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mb-10">
            Whether you're looking for a specific product, need a custom quote, or want 
            to discuss a partnership — our team is here to help.
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="tel:+27315086700" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-8 py-4 rounded-xl hover:bg-safs-gold-light transition-all shadow-lg hover:shadow-xl active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +27 31 508 6700
            </a>
            <a href="mailto:sales&#64;safuneral.co.za" class="inline-flex items-center gap-2 border-2 border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:border-safs-gold hover:text-safs-gold transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>
              Email Sales Team
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Info Cards -->
    <section class="relative -mt-12 z-10 max-w-6xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (info of contactInfo; track info.label) {
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow group">
            <div class="w-12 h-12 rounded-xl bg-safs-dark flex items-center justify-center mb-4 group-hover:bg-safs-gold transition-colors">
              <span [innerHTML]="info.icon" class="text-safs-gold group-hover:text-white transition-colors"></span>
            </div>
            <h3 class="font-bold text-safs-dark mb-1">{{ info.label }}</h3>
            @if (info.href) {
              <a [href]="info.href" class="text-gray-500 text-sm hover:text-safs-gold transition-colors">{{ info.value }}</a>
            } @else {
              <p class="text-gray-500 text-sm">{{ info.value }}</p>
            }
          </div>
        }
      </div>
    </section>

    <!-- Form + Map Section -->
    <section class="bg-gray-50 py-20 sm:py-28">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-5 gap-8 lg:gap-12">

          <!-- Contact Form (Card) -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <!-- Card Header -->
              <div class="px-8 pt-8 pb-6 border-b border-gray-100">
                <h2 class="text-2xl font-bold text-safs-dark">Send Us a Message</h2>
                <p class="text-gray-500 mt-2">Fill in the form below and our team will get back to you within one business day.</p>
              </div>

              <!-- Card Content -->
              <div class="px-8 py-8">
                @if (submitted()) {
                  <div class="text-center py-12 animate-fade-in">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-safs-dark mb-3">Message Sent!</h3>
                    <p class="text-gray-500 mb-8 max-w-md mx-auto">Thank you for reaching out. Our team will review your message and get back to you shortly.</p>
                    <button (click)="resetForm()" class="bg-safs-gold text-black font-bold px-8 py-3 rounded-xl hover:bg-safs-gold-light transition-all">
                      Send Another Message
                    </button>
                  </div>
                } @else {
                  <form (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
                    <!-- Name + Email row -->
                    <div class="grid sm:grid-cols-2 gap-6">
                      <!-- Name Field (Field pattern) -->
                      <div class="flex flex-col gap-2">
                        <label for="name" class="text-sm font-bold text-safs-dark">
                          Full Name <span class="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          [(ngModel)]="formData.name"
                          name="name"
                          required
                          placeholder="John Smith"
                          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                        />
                      </div>

                      <!-- Email Field -->
                      <div class="flex flex-col gap-2">
                        <label for="email" class="text-sm font-bold text-safs-dark">
                          Email Address <span class="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          [(ngModel)]="formData.email"
                          name="email"
                          required
                          placeholder="john&#64;funeralhome.co.za"
                          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                        />
                      </div>
                    </div>

                    <!-- Phone + Company row -->
                    <div class="grid sm:grid-cols-2 gap-6">
                      <!-- Phone Field -->
                      <div class="flex flex-col gap-2">
                        <label for="phone" class="text-sm font-bold text-safs-dark">Phone Number</label>
                        <input
                          id="phone"
                          type="tel"
                          [(ngModel)]="formData.phone"
                          name="phone"
                          placeholder="+27 82 123 4567"
                          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                        />
                      </div>

                      <!-- Company Field -->
                      <div class="flex flex-col gap-2">
                        <label for="company" class="text-sm font-bold text-safs-dark">Funeral Home / Company</label>
                        <input
                          id="company"
                          type="text"
                          [(ngModel)]="formData.company"
                          name="company"
                          placeholder="Your company name"
                          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                        />
                      </div>
                    </div>

                    <!-- Subject Field -->
                    <div class="flex flex-col gap-2">
                      <label for="subject" class="text-sm font-bold text-safs-dark">
                        Subject <span class="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        [(ngModel)]="formData.subject"
                        name="subject"
                        required
                        class="select-chevron w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select a subject</option>
                        <option value="product-enquiry">Product Enquiry</option>
                        <option value="quote-request">Quote Request</option>
                        <option value="bulk-order">Bulk Order</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="support">Customer Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <!-- Message Field (Textarea) -->
                    <div class="flex flex-col gap-2">
                      <label for="message" class="text-sm font-bold text-safs-dark">
                        Message <span class="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        [(ngModel)]="formData.message"
                        name="message"
                        required
                        rows="5"
                        placeholder="Tell us how we can help you..."
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20 resize-none"
                      ></textarea>
                      <p class="text-xs text-gray-400">Minimum 20 characters</p>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-end pt-2">
                      <button
                        type="submit"
                        [disabled]="!isFormValid()"
                        class="inline-flex items-center gap-2 bg-safs-dark text-white font-bold px-8 py-4 rounded-xl hover:bg-safs-gold hover:text-black transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-safs-dark disabled:hover:text-white disabled:active:scale-100"
                      >
                        @if (sending()) {
                          <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                          Sending...
                        } @else {
                          Send Message
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>
                        }
                      </button>
                    </div>
                  </form>
                }
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-2 flex flex-col gap-6">

            <!-- Business Hours Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 class="text-lg font-bold text-safs-dark mb-6">Business Hours</h3>
              <div class="flex flex-col gap-4">
                @for (hour of businessHours; track hour.day) {
                  <div class="flex items-center justify-between">
                    <span class="text-gray-600 text-sm">{{ hour.day }}</span>
                    <span class="font-medium text-sm" [class.text-safs-dark]="hour.isOpen" [class.text-gray-400]="!hour.isOpen">
                      {{ hour.isOpen ? hour.time : 'Closed' }}
                    </span>
                  </div>
                }
              </div>
            </div>

            <!-- Quick Contact Card -->
            <div class="bg-gradient-to-br from-safs-dark via-[#252B5A] to-safs-dark rounded-2xl p-8 text-white relative overflow-hidden">
              <div class="absolute w-[200px] h-[200px] rounded-full bg-safs-gold/15 blur-[80px] -top-20 -right-20"></div>
              <div class="relative">
                <h3 class="text-lg font-bold mb-3">Prefer to Talk?</h3>
                <p class="text-white/60 text-sm mb-6 leading-relaxed">
                  Our sales team is available during business hours to assist with product enquiries, quotes, and orders.
                </p>
                <a href="tel:+27315086700" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-6 py-3 rounded-xl hover:bg-safs-gold-light transition-all w-full justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Call +27 31 508 6700
                </a>
              </div>
            </div>

            <!-- Location Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 class="text-lg font-bold text-safs-dark mb-4">Head Office</h3>
              <div class="flex items-start gap-3 mb-4">
                <svg class="w-5 h-5 text-safs-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <p class="text-gray-600 text-sm leading-relaxed">
                  160 Aberdare Drive<br>
                  Phoenix Industrial Park<br>
                  Durban, 4090<br>
                  South Africa
                </p>
              </div>
              <a
                href="https://www.google.com/maps/place/160+Aberdare+Drive,+Phoenix+Industrial+Park,+Durban+4090"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-safs-gold font-bold text-sm hover:text-safs-gold-dark transition-colors"
              >
                View on Google Maps
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    .select-chevron {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
    }
  `]
})
export class ContactPageComponent {
  submitted = signal(false);
  sending = signal(false);

  formData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  };

  contactInfo = [
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      label: 'Phone',
      value: '+27 31 508 6700',
      href: 'tel:+27315086700'
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>',
      label: 'Email',
      value: 'sales@safuneral.co.za',
      href: 'mailto:sales@safuneral.co.za'
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      label: 'Location',
      value: 'Durban, KwaZulu-Natal',
      href: null
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      label: 'Response Time',
      value: 'Within 1 business day',
      href: null
    }
  ];

  businessHours = [
    { day: 'Monday', time: '08:00 – 17:00', isOpen: true },
    { day: 'Tuesday', time: '08:00 – 17:00', isOpen: true },
    { day: 'Wednesday', time: '08:00 – 17:00', isOpen: true },
    { day: 'Thursday', time: '08:00 – 17:00', isOpen: true },
    { day: 'Friday', time: '08:00 – 16:00', isOpen: true },
    { day: 'Saturday', time: '09:00 – 13:00', isOpen: true },
    { day: 'Sunday', time: 'Closed', isOpen: false },
  ];

  isFormValid(): boolean {
    return (
      this.formData.name.trim().length > 0 &&
      this.formData.email.trim().length > 0 &&
      this.formData.subject.length > 0 &&
      this.formData.message.trim().length >= 20
    );
  }

  onSubmit() {
    if (!this.isFormValid()) return;

    this.sending.set(true);

    // Simulate API call
    setTimeout(() => {
      this.sending.set(false);
      this.submitted.set(true);
    }, 1500);
  }

  resetForm() {
    this.submitted.set(false);
    this.formData = {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    };
  }
}
