import { Component, inject, signal } from '@angular/core';
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
          <a routerLink="/" (click)="closeMenu()" class="flex items-center gap-3 group">
            <div class="w-10 h-10 bg-safs-gold rounded-sm flex items-center justify-center text-safs-dark font-bold font-serif text-2xl group-hover:bg-white transition-colors duration-300">
              S
            </div>
            <div class="flex flex-col">
              <span class="font-serif font-bold text-lg tracking-wider text-safs-gold group-hover:text-white transition-colors uppercase">SA Funeral</span>
              <span class="text-[9px] tracking-[0.2em] text-gray-400 font-bold uppercase">Supplies Wholesale</span>
            </div>
          </a>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a routerLink="/" routerLinkActive="text-safs-gold active-nav" [routerLinkActiveOptions]="{exact: true}" class="text-xs uppercase tracking-[0.2em] hover:text-safs-gold transition-all duration-300 font-bold relative py-2">Home</a>
            <a routerLink="/catalog" routerLinkActive="text-safs-gold active-nav" class="text-xs uppercase tracking-[0.2em] hover:text-safs-gold transition-all duration-300 font-bold relative py-2">Products</a>
            <a routerLink="/about" routerLinkActive="text-safs-gold active-nav" class="text-xs uppercase tracking-[0.2em] hover:text-safs-gold transition-all duration-300 font-bold relative py-2">Our Story</a>
            <a routerLink="/contact" routerLinkActive="text-safs-gold active-nav" class="text-xs uppercase tracking-[0.2em] hover:text-safs-gold transition-all duration-300 font-bold relative py-2">Get Quote</a>
          </div>

          <!-- Cart & Mobile Menu -->
          <div class="flex items-center gap-2 md:gap-4">
            <a routerLink="/cart" (click)="closeMenu()" class="relative p-2.5 hover:bg-white/5 rounded-2xl transition-all group overflow-hidden border border-transparent hover:border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-safs-gold group-hover:scale-110 transition-transform">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              @if (store.cartCount() > 0) {
                <span class="absolute top-1.5 right-1.5 bg-safs-gold text-safs-dark text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                  {{ store.cartCount() }}
                </span>
              }
            </a>
            
            <!-- Mobile Menu Toggle -->
            <button 
              (click)="toggleMenu()"
              class="md:hidden p-2.5 text-safs-gold hover:text-white transition-colors relative z-50">
              <svg *ngIf="!isMenuOpen()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <svg *ngIf="isMenuOpen()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <div 
        *ngIf="isMenuOpen()"
        class="md:hidden absolute top-20 left-0 w-full bg-safs-dark border-b border-safs-gold/20 shadow-2xl animate-in slide-in-from-top duration-300 z-40">
        <div class="px-6 py-10 space-y-6">
          <a routerLink="/" (click)="closeMenu()" routerLinkActive="text-safs-gold" [routerLinkActiveOptions]="{exact: true}" class="block text-xl font-serif font-bold tracking-widest border-l-4 border-transparent hover:border-safs-gold pl-4 transition-all uppercase">Home</a>
          <a routerLink="/catalog" (click)="closeMenu()" routerLinkActive="text-safs-gold" class="block text-xl font-serif font-bold tracking-widest border-l-4 border-transparent hover:border-safs-gold pl-4 transition-all uppercase">Products</a>
          <a routerLink="/about" (click)="closeMenu()" routerLinkActive="text-safs-gold" class="block text-xl font-serif font-bold tracking-widest border-l-4 border-transparent hover:border-safs-gold pl-4 transition-all uppercase">Our Story</a>
          <a routerLink="/contact" (click)="closeMenu()" routerLinkActive="text-safs-gold" class="block text-xl font-serif font-bold tracking-widest border-l-4 border-transparent hover:border-safs-gold pl-4 transition-all uppercase">Get Quote</a>
          
          <div class="pt-8 border-t border-white/5">
             <p class="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Contact Assistance</p>
             <p class="text-safs-gold font-bold">+27 31 508 6700</p>
             <p class="text-xs text-gray-400 mt-1">pamg&#64;safuneral.co.za</p>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .active-nav::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #a89f6e;
      border-radius: 2px;
    }
    .animate-in {
      animation: fadeInDown 0.3s ease-out forwards;
    }
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class NavbarComponent {
  store = inject(StoreService);
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
