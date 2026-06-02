import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExportEnquiryService } from '../services/export-enquiry.service';

@Component({
  selector: 'app-export-enquiry-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-safs-dark via-safs-dark to-safs-dark">
      <div class="absolute inset-0">
        <img
          src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/exports/exports.jpg"
          alt=""
          class="w-full h-full object-cover opacity-40"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-safs-dark/90 via-safs-dark/70 to-safs-dark/60"></div>
        <div class="absolute w-[600px] h-[600px] rounded-full bg-safs-gold/10 blur-[120px] -top-32 -left-32"></div>
        <div class="absolute w-[400px] h-[400px] rounded-full bg-safs-gold/5 blur-[100px] -bottom-20 right-10"></div>
      </div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
        <div class="max-w-3xl">
          <span class="inline-block text-safs-gold font-bold text-sm tracking-[0.2em] uppercase mb-6">Export Enquiries</span>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Servicing the<br>
            <span class="text-safs-gold">African Continent</span><br>
            Since 1998
          </h1>
          <p class="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mb-8">
            South African Funeral Supplies is well known for our superior product quality,
            exceptional service delivery, innovation and value for money.
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="tel:+27315086700" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-8 py-4 rounded-xl hover:bg-safs-gold-light transition-all shadow-lg hover:shadow-xl active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +27 31 508 6700
            </a>
            <a href="mailto:rovilan&#64;safuneral.co.za" class="inline-flex items-center gap-2 border-2 border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:border-safs-gold hover:text-safs-gold transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>
              Email Exports Team
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Form + Contact Sidebar -->
    <section class="bg-gray-50 py-20 sm:py-28">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-5 gap-8 lg:gap-12">

          <!-- Enquiry Form -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="px-8 pt-8 pb-6 border-b border-gray-100">
                <h2 class="text-2xl font-bold text-safs-dark">Submit Export Enquiry</h2>
                <p class="text-gray-500 mt-2">Fill in your details below and our exports team will get back to you.</p>
              </div>

              <div class="px-8 py-8">
                @if (submitted()) {
                  <div class="text-center py-12 animate-fade-in">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-safs-dark mb-3">Enquiry Sent!</h3>
                    <p class="text-gray-500 mb-8 max-w-md mx-auto">Thank you for your export enquiry. Our team will review your request and contact you regarding pricing and availability.</p>
                    <button (click)="resetForm()" class="bg-safs-gold text-black font-bold px-8 py-3 rounded-xl hover:bg-safs-gold-light transition-all">
                      Submit Another Enquiry
                    </button>
                  </div>
                } @else {
                  <form (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
                    <!-- Name + Email -->
                    <div class="grid sm:grid-cols-2 gap-6">
                      <div class="flex flex-col gap-2">
                        <label for="name" class="text-sm font-bold text-safs-dark">
                          Name <span class="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          [(ngModel)]="formData.name"
                          name="name"
                          required
                          placeholder="John Doe"
                          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                        />
                      </div>
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
                          placeholder="john&#64;doe.com"
                          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                        />
                      </div>
                    </div>

                    <!-- Company Details -->
                    <div class="flex flex-col gap-2">
                      <label for="company_details" class="text-sm font-bold text-safs-dark">Company Details</label>
                      <input
                        id="company_details"
                        type="text"
                        [(ngModel)]="formData.company_details"
                        name="company_details"
                        placeholder="Company Name: Company Website: Company Services:"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                      />
                    </div>

                    <!-- Phone -->
                    <div class="flex flex-col gap-2">
                      <label for="phone" class="text-sm font-bold text-safs-dark">
                        Phone <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        [(ngModel)]="formData.phone"
                        name="phone"
                        required
                        placeholder="+1 300 400 5000"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                      />
                    </div>

                    <!-- Street Address -->
                    <div class="flex flex-col gap-2">
                      <label for="street_address" class="text-sm font-bold text-safs-dark">Street Address</label>
                      <input
                        id="street_address"
                        type="text"
                        [(ngModel)]="formData.street_address"
                        name="street_address"
                        placeholder="42 Wallaby Way"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                      />
                    </div>

                    <!-- Apartment -->
                    <div class="flex flex-col gap-2">
                      <label for="apartment" class="text-sm font-bold text-safs-dark">Apartment, suite, etc</label>
                      <input
                        id="apartment"
                        type="text"
                        [(ngModel)]="formData.apartment"
                        name="apartment"
                        placeholder="Apartment, suite, etc"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                      />
                    </div>

                    <!-- City + State -->
                    <div class="grid sm:grid-cols-2 gap-6">
                      <div class="flex flex-col gap-2">
                        <label for="city" class="text-sm font-bold text-safs-dark">City</label>
                        <input
                          id="city"
                          type="text"
                          [(ngModel)]="formData.city"
                          name="city"
                          placeholder="Johannesburg"
                          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                        />
                      </div>
                      <div class="flex flex-col gap-2">
                        <label for="state_province" class="text-sm font-bold text-safs-dark">State/Province</label>
                        <input
                          id="state_province"
                          type="text"
                          [(ngModel)]="formData.state_province"
                          name="state_province"
                          placeholder="Gauteng"
                          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                        />
                      </div>
                    </div>

                    <!-- ZIP + Country -->
                    <div class="grid sm:grid-cols-2 gap-6">
                      <div class="flex flex-col gap-2">
                        <label for="zip_code" class="text-sm font-bold text-safs-dark">ZIP / Postal Code</label>
                        <input
                          id="zip_code"
                          type="text"
                          [(ngModel)]="formData.zip_code"
                          name="zip_code"
                          placeholder="2000"
                          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                        />
                      </div>
                      <div class="flex flex-col gap-2">
                        <label for="country" class="text-sm font-bold text-safs-dark">Country</label>
                        <input
                          id="country"
                          type="text"
                          [(ngModel)]="formData.country"
                          name="country"
                          placeholder="South Africa"
                          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20"
                        />
                      </div>
                    </div>

                    <!-- File Upload -->
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-bold text-safs-dark">
                        Company Registration Documents
                      </label>
                      <div
                        class="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-safs-gold transition-colors cursor-pointer"
                        (click)="fileInput.click()"
                        (dragover)="onDragOver($event)"
                        (drop)="onDrop($event)"
                      >
                        <input
                          #fileInput
                          id="registration_document"
                          type="file"
                          accept=".pdf"
                          (change)="onFileSelected($event)"
                          class="hidden"
                        />
                        @if (!selectedFile()) {
                          <div class="flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                            <p class="text-gray-500 text-sm">No file chosen</p>
                            <p class="text-gray-400 text-xs">Drag and Drop (or) Choose Files</p>
                            <span class="inline-block bg-safs-gold text-black font-bold px-6 py-2 rounded-lg text-sm hover:bg-safs-gold-light transition-colors mt-2">UPLOAD PDF</span>
                          </div>
                        } @else {
                          <div class="flex items-center justify-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                            <span class="text-sm font-medium text-safs-dark">{{ selectedFile()?.name }}</span>
                            <button type="button" (click)="removeFile(); $event.stopPropagation()" class="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                          </div>
                        }
                      </div>
                      <p class="text-xs text-gray-400">Accepted format: PDF (Max 10MB)</p>
                    </div>

                    <!-- Business Industry -->
                    <div class="flex flex-col gap-2">
                      <label for="business_industry" class="text-sm font-bold text-safs-dark">Business Industry</label>
                      <select
                        id="business_industry"
                        [(ngModel)]="formData.business_industry"
                        name="business_industry"
                        class="select-chevron w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select industry</option>
                        <option value="Funeral Services">Funeral Services</option>
                        <option value="Funeral Equipment">Funeral Equipment</option>
                        <option value="Casket Manufacturing">Casket Manufacturing</option>
                        <option value="Distribution">Distribution</option>
                        <option value="Government">Government</option>
                        <option value="NGO">NGO</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <!-- Message -->
                    <div class="flex flex-col gap-2">
                      <label for="message" class="text-sm font-bold text-safs-dark">
                        What Can We Do For You? <span class="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        [(ngModel)]="formData.message"
                        name="message"
                        required
                        rows="6"
                        placeholder="PLEASE PROVIDE AS MUCH DETAILS SO WE CAN ALIGN OUR BUSINESS OFFERING WITH YOUR INTENDED NEEDS"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-safs-dark placeholder-gray-400 outline-none transition-all focus:border-safs-gold focus:ring-2 focus:ring-safs-gold/20 resize-none"
                      ></textarea>
                      <p class="text-xs text-gray-400">Minimum 20 characters</p>
                    </div>

                    <!-- Submit -->
                    <div class="flex justify-end pt-2">
                      <button
                        type="submit"
                        [disabled]="!isFormValid() || sending()"
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

                    @if (errorMessage()) {
                      <div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {{ errorMessage() }}
                      </div>
                    }
                  </form>
                }
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-2 flex flex-col gap-6">

            <!-- Contact Person Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 class="text-lg font-bold text-safs-dark mb-4">Export Contact</h3>
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-full bg-safs-dark flex items-center justify-center text-white font-bold text-lg">
                  RN
                </div>
                <div>
                  <p class="font-bold text-safs-dark text-lg">ROVILAN NAICKER</p>
                  <p class="text-gray-500 text-sm">Exports Division</p>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-safs-gold mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <div>
                    <p class="text-sm text-gray-500">Tel: +27 31 508 6700</p>
                    <p class="text-sm text-gray-500">Ext: +27 31 508 6780</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-safs-gold mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>
                  <a href="mailto:rovilan&#64;safuneral.co.za" class="text-sm text-safs-gold hover:underline break-all">rovilan&#64;safuneral.co.za</a>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-safs-gold mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <a href="https://www.safuneral.co.za" target="_blank" rel="noopener noreferrer" class="text-sm text-safs-gold hover:underline">www.safuneral.co.za</a>
                </div>
              </div>
            </div>

            <!-- Head Office Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 class="text-lg font-bold text-safs-dark mb-2">Head Office & Factory 1 – 2 – 3</h3>
              <p class="text-sm font-bold text-safs-gold uppercase tracking-wider mb-4">Exports</p>
              <div class="flex items-start gap-3 mb-4">
                <svg class="w-5 h-5 text-safs-gold mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <p class="text-gray-600 text-sm leading-relaxed">
                  158-160 Aberdare Drive,<br>
                  Phoenix Industrial Park,<br>
                  Durban, 4090, Kwa-Zulu Natal,<br>
                  South Africa
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/158-160+Aberdare+Drive+Phoenix+Industrial+Park+Durban+4090"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-safs-gold font-bold text-sm hover:text-safs-gold-dark transition-colors"
              >
                Get Directions
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>

            <!-- Quick Contact Card -->
            <div class="bg-gradient-to-br from-safs-dark via-safs-dark to-safs-dark rounded-2xl p-8 text-white relative overflow-hidden">
              <div class="absolute w-[200px] h-[200px] rounded-full bg-safs-gold/15 blur-[80px] -top-20 -right-20"></div>
              <div class="relative">
                <h3 class="text-lg font-bold mb-3">Prefer to Talk?</h3>
                <p class="text-white/60 text-sm mb-6 leading-relaxed">
                  Our exports team is ready to assist with your international enquiries during business hours.
                </p>
                <a href="tel:+27315086700" class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-6 py-3 rounded-xl hover:bg-safs-gold-light transition-all w-full justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Call +27 31 508 6700
                </a>
              </div>
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
export class ExportEnquiryPageComponent {
  submitted = signal(false);
  sending = signal(false);
  errorMessage = signal('');
  selectedFile = signal<File | null>(null);

  formData = {
    name: '',
    email: '',
    company_details: '',
    phone: '',
    street_address: '',
    apartment: '',
    city: '',
    state_province: '',
    zip_code: '',
    country: '',
    business_industry: '',
    message: ''
  };

  constructor(private exportEnquiryService: ExportEnquiryService) {}

  isFormValid(): boolean {
    return (
      this.formData.name.trim().length > 0 &&
      this.formData.email.trim().length > 0 &&
      this.formData.phone.trim().length > 0 &&
      this.formData.message.trim().length >= 20
    );
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile.set(file);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile.set(input.files[0]);
    }
  }

  removeFile() {
    this.selectedFile.set(null);
  }

  async onSubmit() {
    if (!this.isFormValid() || this.sending()) return;

    this.sending.set(true);
    this.errorMessage.set('');

    try {
      const formData = new FormData();
      formData.append('name', this.formData.name);
      formData.append('email', this.formData.email);
      formData.append('phone', this.formData.phone);
      formData.append('message', this.formData.message);

      if (this.formData.company_details) formData.append('company_details', this.formData.company_details);
      if (this.formData.street_address) formData.append('street_address', this.formData.street_address);
      if (this.formData.apartment) formData.append('apartment', this.formData.apartment);
      if (this.formData.city) formData.append('city', this.formData.city);
      if (this.formData.state_province) formData.append('state_province', this.formData.state_province);
      if (this.formData.zip_code) formData.append('zip_code', this.formData.zip_code);
      if (this.formData.country) formData.append('country', this.formData.country);
      if (this.formData.business_industry) formData.append('business_industry', this.formData.business_industry);
      if (this.selectedFile()) formData.append('registration_document', this.selectedFile()!);

      await this.exportEnquiryService.submitEnquiry(formData);
      this.sending.set(false);
      this.submitted.set(true);
    } catch (error: any) {
      this.sending.set(false);
      const detail = error?.error?.errors
        ? Object.values(error.error.errors).flat().join('; ')
        : null;
      this.errorMessage.set(detail || error?.error?.message || error?.message || 'Failed to submit enquiry. Please try again.');
    }
  }

  resetForm() {
    this.submitted.set(false);
    this.selectedFile.set(null);
    this.formData = {
      name: '', email: '', company_details: '', phone: '',
      street_address: '', apartment: '', city: '', state_province: '',
      zip_code: '', country: '', business_industry: '', message: ''
    };
  }
}
