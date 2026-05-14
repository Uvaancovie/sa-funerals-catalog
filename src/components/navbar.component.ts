import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StoreService } from '../services/store.service';
import { AuthService } from '../services/auth.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
     <header class="sticky top-0 z-50 bg-safs-dark/95 backdrop-blur border-b-2 border-safs-gold shadow-lg">
       <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
         <a routerLink="/" class="flex items-center gap-3">
           <img src="assets/logo/OIP.webp" alt="South African Funeral Supplies" class="h-16 sm:h-20 w-auto rounded-md" />
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

         <!-- Desktop menu items -->
         <nav class="hidden lg:flex items-center space-x-8">
           <a
             routerLink="/catalog"
             routerLinkActive="text-safs-gold font-bold"
             class="text-white/80 hover:text-safs-gold transition-colors font-medium"
           >
             Full Catalogue
           </a>
           <button
             type="button"
             (click)="logout()"
             class="bg-safs-gold text-safs-dark px-6 py-2 rounded-lg hover:bg-safs-gold-light transition-colors font-bold"
           >
             Logout
           </button>
         </nav>
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

             <button
               type="button"
               (click)="logout()"
               class="w-full text-left py-3 px-4 text-white/80 hover:text-safs-gold hover:bg-white/5 transition-colors rounded-lg font-medium"
             >
               Logout
             </button>
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
