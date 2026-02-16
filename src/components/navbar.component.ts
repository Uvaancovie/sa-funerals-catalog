import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StoreService } from '../services/store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="bg-safs-dark text-white sticky top-0 z-50 shadow-xl border-b border-safs-gold/30">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo Section -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 bg-safs-gold rounded-sm flex items-center justify-center text-safs-dark font-bold font-serif text-2xl group-hover:bg-white transition-colors duration-300">
              S
            </div>
            <div class="flex flex-col">
              <span class="font-serif font-bold text-lg tracking-wider text-safs-gold group-hover:text-white transition-colors">SOUTH AFRICAN</span>
              <span class="text-[10px] tracking-[0.2em] text-gray-300">FUNERAL SUPPLIES</span>
            </div>
          </a>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a routerLink="/" routerLinkActive="text-safs-gold" [routerLinkActiveOptions]="{exact: true}" class="text-sm uppercase tracking-widest hover:text-safs-gold transition-colors font-medium">Home</a>
            <a routerLink="/catalog" routerLinkActive="text-safs-gold" class="text-sm uppercase tracking-widest hover:text-safs-gold transition-colors font-medium">Products</a>
            <a routerLink="/about" routerLinkActive="text-safs-gold" class="text-sm uppercase tracking-widest hover:text-safs-gold transition-colors font-medium">About Us</a>
            <a routerLink="/contact" routerLinkActive="text-safs-gold" class="text-sm uppercase tracking-widest hover:text-safs-gold transition-colors font-medium">Contact Us</a>
          </div>

          <!-- Cart & Mobile Menu -->
          <div class="flex items-center gap-4">
            <a routerLink="/cart" class="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-safs-gold group-hover:text-white">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              @if (store.cartCount() > 0) {
                <span class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {{ store.cartCount() }}
                </span>
              }
            </a>
            
            <!-- Mobile Menu Button (Visual Only for now) -->
            <button class="md:hidden text-safs-gold hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  store = inject(StoreService);
}
