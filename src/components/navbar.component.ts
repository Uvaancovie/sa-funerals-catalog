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
       <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
         <a routerLink="/" class="flex items-center gap-3">
           <img src="assets/logo/OIP.webp" alt="South African Funeral Supplies" class="h-24 sm:h-32 w-auto rounded-md" width="128" height="128" />
         </a>

         <div class="flex items-center gap-2 sm:gap-4">
           <!-- Desktop menu items -->
           <nav class="hidden lg:flex items-center space-x-8 mr-2">
             <a
               routerLink="/catalog"
               routerLinkActive="text-safs-gold font-bold"
               class="text-white/80 hover:text-safs-gold transition-colors font-medium"
             >
               Full Catalogue
             </a>
           </nav>

           <!-- Cart Icon -->
           <a
             routerLink="/cart"
             class="relative p-2 text-white hover:text-safs-gold transition-colors block"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <circle cx="8" cy="21" r="1"></circle>
               <circle cx="19" cy="21" r="1"></circle>
               <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
             </svg>
             @if (store.cartCount() > 0) {
               <span class="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-safs-gold rounded-full border-2 border-safs-dark">
                 {{ store.cartCount() }}
               </span>
             }
           </a>

           <button
             type="button"
             class="lg:hidden p-2 rounded-lg bg-safs-gold/20 text-white hover:bg-safs-gold/40 transition-colors duration-200"
             (click)="toggleMenu()"
             aria-label="Toggle menu"
             [class.bg-safs-gold-dark]="isMenuOpen()"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
               Full Catalogue
             </a>
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
