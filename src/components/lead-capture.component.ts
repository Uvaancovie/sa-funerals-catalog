import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lead-capture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative bg-safs-dark px-4 py-16 sm:px-6 lg:px-16 overflow-hidden border-b-[3px] border-safs-gold">
      <!-- Background Graphic -->
      <div class="absolute inset-0 opacity-5 bg-[url('assets/logo/OIP.webp')] bg-no-repeat bg-right-bottom bg-[length:500px]"></div>
      
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl flex flex-col lg:flex-row items-center gap-10">
          
          <!-- Content Side -->
          <div class="flex-1 text-center lg:text-left">
            <span class="inline-block px-4 py-1.5 rounded-full bg-safs-gold/20 text-safs-gold font-bold text-xs tracking-widest uppercase mb-6 border border-safs-gold/30">Trade Partners</span>
            <h3 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight">Become an Official Distributor</h3>
            <p class="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Register your funeral business to gain access to wholesale pricing, premium marketing assets, and priority order fulfillment from South Africa's leading casket supplier.
            </p>
            <ul class="text-left space-y-4 mb-8 sm:max-w-md sm:mx-auto lg:mx-0">
              <li class="flex items-center gap-4 text-gray-200 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                <div class="bg-safs-gold/20 p-2 rounded-lg">
                  <svg class="w-5 h-5 text-safs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span class="font-medium">Exclusive B2B pricing catalogs</span>
              </li>
              <li class="flex items-center gap-4 text-gray-200 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                <div class="bg-safs-gold/20 p-2 rounded-lg">
                  <svg class="w-5 h-5 text-safs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span class="font-medium">Priority delivery on volume orders</span>
              </li>
              <li class="flex items-center gap-4 text-gray-200 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                <div class="bg-safs-gold/20 p-2 rounded-lg">
                  <svg class="w-5 h-5 text-safs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span class="font-medium">Dedicated account management</span>
              </li>
            </ul>
          </div>

          <!-- Form Side -->
          <div class="w-full lg:w-[480px] bg-white rounded-2xl p-2 shadow-2xl relative">
             <div class="absolute -top-4 -right-4 w-24 h-24 bg-safs-gold rounded-full opacity-20 blur-2xl"></div>
             <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-safs-dark rounded-full opacity-20 blur-2xl"></div>
            <iframe
              title="Trade Registration Form"
              width="100%"
              height="380"
              src="https://bbbac5ba.sibforms.com/serve/MUIFADNAXkcZRb7c-OoeuIBzu2ct-avyqNA_6m8P9RNEReQEGfY70EdbMhE8lvXhA4pk7I4kJWzPg-PRuKypLnLhd-4PkKEm3YrSA0nDbxvreu3uQCk9SiDq1GsMwkrvwm6qMgUyySJppVDw3d9a6qfvU4KRbdfjFrR3Pro6-y2r0bg89fF9A89cwXtn42IuuSnznA5LDHtXDVxsew=="
              frameborder="0"
              scrolling="auto"
              class="block w-full rounded-xl border-0 relative z-10"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LeadCaptureComponent {
  constructor() {}
}
