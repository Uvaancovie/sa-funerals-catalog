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
      <header class="sticky top-0 z-50 bg-white backdrop-blur-xl navbar-refined">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-[72px]">

            <!-- Logo -->
            <a routerLink="/" class="flex items-center shrink-0 logo-container">
              <div class="logo-bg">
                <img src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/logo/SAFS-Logo-Retina.png" alt="South African Funeral Supplies" class="h-10 sm:h-12 w-auto" width="128" height="64" />
              </div>
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center gap-1">
              <a routerLink="/catalog" routerLinkActive="nav-link--active" class="nav-link">Products</a>
              <a routerLink="/services" routerLinkActive="nav-link--active" class="nav-link">Services</a>
              <a routerLink="/branches" routerLinkActive="nav-link--active" class="nav-link">Branches</a>
              <a routerLink="/export" routerLinkActive="nav-link--active" class="nav-link">Export</a>
              <a routerLink="/about" routerLinkActive="nav-link--active" class="nav-link">About Us</a>
              <a routerLink="/contact" routerLinkActive="nav-link--active" class="nav-link">Contact</a>
            </nav>

            <!-- Right Actions -->
            <div class="flex items-center gap-2">
              <!-- Desktop Social -->
              <div class="hidden lg:flex items-center gap-0.5 mr-1">
                <a href="https://www.facebook.com/people/South-African-Funeral-Supplies/100069383543820/" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/south-african-funeral-supplies/posts/?feedView=all" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>

              <!-- Divider -->
              <div class="hidden lg:block w-px h-6 bg-slate-200 mx-1"></div>

              <!-- Cart Icon -->
              <a routerLink="/cart" class="relative p-2 rounded-lg text-slate-400 hover:text-safs-gold hover:bg-safs-gold/5 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="8" cy="21" r="1"></circle>
                  <circle cx="19" cy="21" r="1"></circle>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
                @if (store.cartCount() > 0) {
                  <span class="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[9px] font-bold leading-none text-white bg-safs-gold rounded-full ring-2 ring-white px-1">
                    {{ store.cartCount() }}
                  </span>
                }
              </a>

              <!-- Mobile Menu Toggle -->
              <button
                type="button"
                class="lg:hidden p-2 rounded-lg transition-all duration-200"
                [class]="isMenuOpen() ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-50'"
                (click)="toggleMenu()"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  @if (isMenuOpen()) {
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  } @else {
                    <line x1="4" y1="7" x2="20" y2="7"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="17" x2="16" y2="17"></line>
                  }
                </svg>
              </button>
            </div>

          </div>
        </div>

        <!-- Mobile Menu -->
        @if (isMenuOpen()) {
          <div class="lg:hidden animate-in border-t border-slate-100 bg-white/98 backdrop-blur-xl">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-0.5">
               <a routerLink="/catalog"  routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">Products</a>
               <a routerLink="/services" routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">Services</a>
               <a routerLink="/branches" routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">Branches</a>
               <a routerLink="/export"   routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">Exports</a>
               <a routerLink="/about"    routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">About Us</a>
               <a routerLink="/contact"  routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">Contact</a>

               <!-- Mobile Social -->
               <div class="flex items-center gap-3 pt-3 mt-2 border-t border-slate-100 px-3">
                 <a href="https://www.facebook.com/people/South-African-Funeral-Supplies/100069383543820/" target="_blank" rel="noopener noreferrer" class="social-icon" (click)="closeMenu()">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </a>
                 <a href="https://www.linkedin.com/company/south-african-funeral-supplies/posts/?feedView=all" target="_blank" rel="noopener noreferrer" class="social-icon" (click)="closeMenu()">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                 </a>
               </div>
            </nav>
          </div>
        }
    </header>
  `,
  styles: [`
    /* ── Subtle accent border (smooth navy → gold gradient) ── */
    .navbar-refined {
      position: relative;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    }
    .navbar-refined::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(to right, rgba(21, 26, 64, 0.4) 0%, rgba(21, 26, 64, 0.15) 40%, rgba(197, 160, 89, 0.35) 70%, rgba(197, 160, 89, 0.5) 100%);
    }

    /* ── Logo backdrop (organic, blended into navbar) ── */
    .logo-bg {
      display: flex;
      align-items: center;
      padding: 0.5rem 1.25rem;
      border-radius: 50px;
      background: radial-gradient(ellipse at center, #1e2348 0%, #242a52 60%, rgba(36, 42, 82, 0.85) 100%);
      box-shadow:
        0 0 0 1px rgba(21, 26, 64, 0.06),
        0 1px 6px rgba(21, 26, 64, 0.08),
        0 0 20px rgba(21, 26, 64, 0.04);
      transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .logo-container:hover .logo-bg {
      box-shadow:
        0 0 0 1px rgba(21, 26, 64, 0.08),
        0 2px 8px rgba(21, 26, 64, 0.1),
        0 0 24px rgba(21, 26, 64, 0.05);
    }

    /* ── Desktop nav links (muted slate-navy, not raw navy) ── */
    .nav-link {
      position: relative;
      padding: 0.5rem 0.875rem;
      font-size: 0.8125rem;
      font-weight: 500;
      letter-spacing: 0.01em;
      color: #4a5068;
      border-radius: 0.5rem;
      transition: all 0.2s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .nav-link:hover {
      color: #b8904e;
      background: rgba(197, 160, 89, 0.04);
    }
    .nav-link--active {
      color: #b8904e !important;
      font-weight: 600;
      background: rgba(197, 160, 89, 0.06) !important;
    }

    /* ── Social icons ── */
    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 0.5rem;
      color: rgba(74, 80, 104, 0.35);
      transition: all 0.2s ease;
    }
    .social-icon:hover {
      color: #b8904e;
      background: rgba(197, 160, 89, 0.04);
    }

    /* ── Mobile links ── */
    .mobile-link {
      display: block;
      padding: 0.75rem 1rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: rgba(74, 80, 104, 0.8);
      border-radius: 0.75rem;
      transition: all 0.15s ease;
    }
    .mobile-link:hover {
      color: #b8904e;
      background: rgba(74, 80, 104, 0.03);
    }
    .mobile-link--active {
      color: #b8904e !important;
      font-weight: 600;
      background: rgba(197, 160, 89, 0.05) !important;
    }

    /* ── Animations ── */
    .animate-in {
      animation: fadeInDown 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
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
