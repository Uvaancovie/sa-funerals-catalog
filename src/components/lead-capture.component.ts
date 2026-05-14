import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lead-capture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gradient-to-r from-safs-dark via-safs-dark to-safs-gold/20 px-4 py-6 sm:px-6 lg:px-16 border-b border-safs-gold/30 shadow-md">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-center lg:justify-between">
          <!-- Content -->
          <div class="flex-1 text-white">
            <h3 class="text-xl sm:text-2xl font-bold mb-2">Get Our Latest Product Catalog</h3>
            <p class="text-gray-200 text-sm sm:text-base">Sign up to receive updates on new funeral supplies and exclusive B2B pricing.</p>
          </div>

          <!-- Brevo Form Embed -->
          <div class="w-full lg:w-[540px] flex-shrink-0">
            <iframe
              title="Brevo Newsletter Signup"
              width="540"
              height="305"
              src="https://bbbac5ba.sibforms.com/serve/MUIFADNAXkcZRb7c-OoeuIBzu2ct-avyqNA_6m8P9RNEReQEGfY70EdbMhE8lvXhA4pk7I4kJWzPg-PRuKypLnLhd-4PkKEm3YrSA0nDbxvreu3uQCk9SiDq1GsMwkrvwm6qMgUyySJppVDw3d9a6qfvU4KRbdfjFrR3Pro6-y2r0bg89fF9A89cwXtn42IuuSnznA5LDHtXDVxsew=="
              frameborder="0"
              scrolling="auto"
              allowfullscreen
              class="block w-full max-w-full border-0"
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
