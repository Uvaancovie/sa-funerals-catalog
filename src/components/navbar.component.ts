import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StoreService } from '../services/store.service';
import { AuthService } from '../services/auth.service';
import { WishlistService } from '../services/wishlist.service';
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

          <!-- Auth & Admin Links (Desktop) -->
          <div class="flex items-center gap-2 md:gap-4">
            @if (!authService.isAuthenticated()) {
              <div class="hidden md:flex items-center gap-2">
                <a routerLink="/login" class="px-4 py-2 text-xs font-bold uppercase tracking-wider hover:text-safs-gold transition-colors">Login</a>
                <a routerLink="/admin-signin" class="px-4 py-2 bg-safs-gold text-safs-dark text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-600 transition-colors">Admin Sign In</a>
              </div>
            } @else {
              <div class="hidden md:flex items-center gap-3">
                @if (authService.isAdmin()) {
                  <a routerLink="/admin" class="px-4 py-2 bg-safs-gold text-safs-dark text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    Admin Portal
                  </a>
                }
                <div class="text-xs">
                  <div class="font-bold text-white">{{ authService.currentUser()?.companyName }}</div>
                  @if (authService.isPending()) {
                    <div class="text-yellow-400 text-[10px]">Pending Approval</div>
                  } @else if (authService.isApproved()) {
                    <div class="text-green-400 text-[10px]">Approved</div>
                  }
                </div>
                <button (click)="logout()" class="ml-2 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5" title="Logout">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            }

            @if (authService.isAuthenticated() && !authService.isAdmin()) {
              <a routerLink=\"/wishlist\" (click)=\"closeMenu()\" class=\"relative p-2.5 hover:bg-white/5 rounded-2xl transition-all group overflow-hidden border border-transparent hover:border-white/10\">
                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"text-safs-gold group-hover:scale-110 transition-transform\">
                  <path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"></path>
                </svg>
                @if (wishlistService.wishlistCount() > 0) {
                  <span class=\"absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg\">
                    {{ wishlistService.wishlistCount() }}
                  </span>
                }
              </a>
            }
            
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

          @if (!authService.isAuthenticated()) {
            <a routerLink="/login" (click)="closeMenu()" routerLinkActive="text-safs-gold" class="block text-xl font-serif font-bold tracking-widest border-l-4 border-transparent hover:border-safs-gold pl-4 transition-all uppercase">Login</a>
            <a routerLink="/admin-signin" (click)="closeMenu()" routerLinkActive="text-safs-gold" class="block text-xl font-serif font-bold tracking-widest border-l-4 border-transparent hover:border-safs-gold pl-4 transition-all uppercase">Admin Sign In</a>
          }
          
          @if (authService.isAdmin()) {
            <a routerLink="/admin" (click)="closeMenu()" routerLinkActive="text-safs-gold" class="block text-xl font-serif font-bold tracking-widest border-l-4 border-safs-gold bg-safs-gold/10 pl-4 transition-all uppercase">Admin Portal</a>
          }

          @if (authService.isAuthenticated()) {
            <div class="pt-4 border-t border-white/10">
              <div class="flex items-center gap-3 mb-4 pl-4">
                <div class="w-8 h-8 bg-safs-gold/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-safs-gold">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-bold text-white">{{ authService.currentUser()?.companyName || authService.currentUser()?.email }}</div>
                  <div class="text-[10px] text-gray-400 uppercase">{{ authService.currentUser()?.role }}</div>
                </div>
              </div>
              <button (click)="logout(); closeMenu()" class="block w-full text-left text-lg font-serif font-bold tracking-widest border-l-4 border-red-500 bg-red-500/10 pl-4 py-3 text-red-400 hover:text-red-300 transition-all uppercase">
                Logout
              </button>
            </div>
          }
          
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
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  private router = inject(Router);
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
