import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StoreService } from '../services/store.service';
import { AuthService } from '../services/auth.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
      <header class="sticky top-0 z-50 bg-safs-dark/95 backdrop-blur border-b-2 border-safs-gold shadow-lg">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
           <a routerLink="/" class="flex items-center gap-2 sm:gap-3 shrink-0">
             <img src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/logo/SAFS-Logo-Retina.png" alt="South African Funeral Supplies" class="h-12 sm:h-16 w-auto" width="128" height="64" />
           </a>

         <div class="flex items-center gap-1 sm:gap-3">
            <!-- Desktop menu items -->
            <nav class="hidden lg:flex items-center space-x-6 mr-1">
              <a
                routerLink="/catalog"
                routerLinkActive="text-safs-gold font-bold"
                class="text-white/80 hover:text-safs-gold transition-colors font-medium text-sm"
              >
                Products
              </a>
              <a
                routerLink="/services"
                routerLinkActive="text-safs-gold font-bold"
                class="text-white/80 hover:text-safs-gold transition-colors font-medium text-sm"
              >
                Services
              </a>
              <a
                routerLink="/about"
                routerLinkActive="text-safs-gold font-bold"
                class="text-white/80 hover:text-safs-gold transition-colors font-medium text-sm"
              >
                About Us
              </a>
              <a
                routerLink="/contact"
                routerLinkActive="text-safs-gold font-bold"
                class="text-white/80 hover:text-safs-gold transition-colors font-medium text-sm"
              >
                Contact
              </a>
              <a
                routerLink="/export"
                routerLinkActive="text-safs-gold font-bold"
                class="text-white/80 hover:text-safs-gold transition-colors font-medium text-sm"
              >
                Exports
              </a>
            </nav>

            <!-- Desktop Social Links -->
            <div class="hidden lg:flex items-center gap-1 mr-1">
              <a href="https://www.facebook.com/people/South-African-Funeral-Supplies/100069383543820/" target="_blank" rel="noopener noreferrer" class="p-1.5 text-white/60 hover:text-safs-gold transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/south-african-funeral-supplies/posts/?feedView=all" target="_blank" rel="noopener noreferrer" class="p-1.5 text-white/60 hover:text-safs-gold transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>

           <!-- Cart Icon -->
           <a
             routerLink="/cart"
             class="relative p-1.5 sm:p-2 text-white hover:text-safs-gold transition-colors block"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <circle cx="8" cy="21" r="1"></circle>
               <circle cx="19" cy="21" r="1"></circle>
               <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
             </svg>
             @if (store.cartCount() > 0) {
               <span class="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-[8px] sm:text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-safs-gold rounded-full border-2 border-safs-dark">
                 {{ store.cartCount() }}
               </span>
             }
           </a>

           <button
             type="button"
             class="lg:hidden p-1.5 sm:p-2 rounded-lg bg-safs-gold/20 text-white hover:bg-safs-gold/40 transition-colors duration-200"
             (click)="toggleMenu()"
             aria-label="Toggle menu"
             [class.bg-safs-gold-dark]="isMenuOpen()"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <line x1="3" y1="12" x2="21" y2="12" [attr.class]="isMenuOpen() ? 'opacity-0' : 'opacity-100'"></line>
               <line x1="3" y1="6" x2="21" y2="6" [attr.transform]="isMenuOpen() ? 'rotate(45 12 12)' : ''" [attr.x2]="isMenuOpen() ? '21' : '21'" [attr.y2]="isMenuOpen() ? '12' : '6'"></line>
               <line x1="3" y1="18" x2="21" y2="18" [attr.transform]="isMenuOpen() ? 'rotate(-45 12 12)' : ''" [attr.x2]="isMenuOpen() ? '21' : '21'" [attr.y2]="isMenuOpen() ? '18' : '18'"></line>
             </svg>
           </button>
         </div>
        </div>

        <!-- Mobile menu -->
        @if (isMenuOpen()) {
          <nav class="lg:hidden animate-in border-t border-safs-gold/30 bg-safs-dark shadow-lg">
            <div class="px-4 py-6 space-y-4">
               <a
                 routerLink="/catalog"
                 routerLinkActive="text-safs-gold font-bold"
                 (click)="closeMenu()"
                 class="block py-3 px-4 text-white/80 hover:text-safs-gold hover:bg-white/5 transition-colors rounded-lg font-medium"
               >
                 Products
               </a>
               <a
                 routerLink="/services"
                 routerLinkActive="text-safs-gold font-bold"
                 (click)="closeMenu()"
                 class="block py-3 px-4 text-white/80 hover:text-safs-gold hover:bg-white/5 transition-colors rounded-lg font-medium"
               >
                 Services
               </a>
               <a
                 routerLink="/about"
                 routerLinkActive="text-safs-gold font-bold"
                 (click)="closeMenu()"
                 class="block py-3 px-4 text-white/80 hover:text-safs-gold hover:bg-white/5 transition-colors rounded-lg font-medium"
               >
                 About Us
               </a>
               <a
                 routerLink="/contact"
                 routerLinkActive="text-safs-gold font-bold"
                 (click)="closeMenu()"
                 class="block py-3 px-4 text-white/80 hover:text-safs-gold hover:bg-white/5 transition-colors rounded-lg font-medium"
               >
                 Contact
               </a>
               <a
                 routerLink="/export"
                 routerLinkActive="text-safs-gold font-bold"
                 (click)="closeMenu()"
                 class="block py-3 px-4 text-white/80 hover:text-safs-gold hover:bg-white/5 transition-colors rounded-lg font-medium"
               >
                 Exports
               </a>

               <!-- Mobile Social Links -->
               <div class="border-t border-safs-gold/20 pt-4 mt-4 px-4">
                 <div class="flex items-center gap-4">
                   <a href="https://www.facebook.com/people/South-African-Funeral-Supplies/100069383543820/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-white/60 hover:text-safs-gold transition-colors text-sm" (click)="closeMenu()">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                     Facebook
                   </a>
                   <a href="https://www.linkedin.com/company/south-african-funeral-supplies/posts/?feedView=all" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-white/60 hover:text-safs-gold transition-colors text-sm" (click)="closeMenu()">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                     LinkedIn
                   </a>
                 </div>
               </div>
             </div>
          </nav>
        }
    </header>
  `,
  styles: [`
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
    
    .animate-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `],
})
export class NavbarComponent {
  store = inject(StoreService);
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  private router = inject(Router);

  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
