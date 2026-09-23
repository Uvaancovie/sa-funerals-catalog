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
    <!-- ═══════ MAIN NAVIGATION HEADER ═══════ -->
    <header class="main-header sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-[72px]">

          <!-- Logo & Brand -->
          <a routerLink="/" class="flex items-center shrink-0 gap-3 logo-container group">
            <div class="logo-box">
              <img src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/logo/SAFS-Logo-Retina.png" alt="South African Funeral Supplies" class="h-9 sm:h-11 w-auto" width="128" height="64" />
            </div>
            <div class="hidden sm:flex flex-col justify-center brand-text">
              <span class="brand-title">SOUTH AFRICAN</span>
              <span class="brand-subtitle">FUNERAL SUPPLIES</span>
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
            <a routerLink="/cart" class="cart-icon-link" title="View Cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              @if (store.cartCount() > 0) {
                <span class="cart-count">
                  {{ store.cartCount() }}
                </span>
              }
            </a>

            <!-- Mobile Menu Toggle -->
            <button
              type="button"
              class="lg:hidden p-2 rounded-lg transition-all duration-200"
              [class]="isMenuOpen() ? 'bg-[#0F2040] text-white' : 'text-[#0F2040] hover:bg-slate-50'"
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

      <!-- Mobile Menu Dropdown -->
      @if (isMenuOpen()) {
        <div class="lg:hidden animate-in border-t border-gray-200 bg-white">
          <nav class="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-0.5">
            <a routerLink="/catalog"  routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">Products</a>
            <a routerLink="/services" routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">Services</a>
            <a routerLink="/branches" routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">Branches</a>
            <a routerLink="/export"   routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">Exports</a>
            <a routerLink="/about"    routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">About Us</a>
            <a routerLink="/contact"  routerLinkActive="mobile-link--active" (click)="closeMenu()" class="mobile-link">Contact</a>

            <!-- Mobile Social -->
            <div class="flex items-center gap-3 pt-3 mt-2 border-t border-gray-100 px-3">
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
    /* ═══════ MAIN HEADER ═══════ */
    .main-header {
      background-color: #FFFFFF;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      position: relative;
    }
    .main-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(
        to right,
        rgba(15, 32, 64, 0.35) 0%,
        rgba(15, 32, 64, 0.1) 40%,
        rgba(212, 175, 55, 0.3) 70%,
        rgba(212, 175, 55, 0.45) 100%
      );
    }

    /* ── Logo box (neat square with rounded corners) ── */
    .logo-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 10px;
      background: #0F2040;
      border: 1.5px solid rgba(212, 175, 55, 0.25);
      box-shadow:
        0 0 0 1px rgba(15, 32, 64, 0.08),
        0 2px 6px rgba(15, 32, 64, 0.12);
      transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
      overflow: hidden;
      padding: 6px;
    }
    .logo-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .logo-container:hover .logo-box {
      box-shadow:
        0 0 0 1px rgba(15, 32, 64, 0.1),
        0 3px 10px rgba(15, 32, 64, 0.16);
      transform: translateY(-1px);
    }

    /* ── Brand text ── */
    .brand-text {
      line-height: 1;
      transition: opacity 0.2s ease;
    }
    .brand-title {
      font-family: 'Poppins', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: #0F2040;
      line-height: 1.15;
    }
    .brand-subtitle {
      font-family: 'Poppins', sans-serif;
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0.22em;
      color: #1a3058;
      line-height: 1.3;
      text-transform: uppercase;
    }
    .logo-container:hover .brand-title {
      color: #142848;
    }

    /* ── Nav links ── */
    .nav-link {
      position: relative;
      padding: 0.5rem 0.875rem;
      font-size: 0.8125rem;
      font-weight: 500;
      letter-spacing: 0.01em;
      color: #0F2040;
      border-radius: 0.5rem;
      transition: all 0.2s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: 60%;
      height: 2px;
      background: #D4AF37;
      border-radius: 1px;
      transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .nav-link:hover {
      color: #D4AF37;
      background: rgba(212, 175, 55, 0.04);
    }
    .nav-link:hover::after {
      transform: translateX(-50%) scaleX(1);
    }
    .nav-link--active {
      color: #D4AF37 !important;
      font-weight: 600;
      background: rgba(212, 175, 55, 0.06) !important;
    }
    .nav-link--active::after {
      transform: translateX(-50%) scaleX(1) !important;
    }

    /* ── Cart icon ── */
    .cart-icon-link {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border-radius: 0.5rem;
      color: #0F2040;
      transition: all 0.2s ease;
    }
    .cart-icon-link:hover {
      color: #D4AF37;
      background: rgba(212, 175, 55, 0.06);
    }

    /* ── Cart count badge ── */
    .cart-count {
      position: absolute;
      top: -2px;
      right: -2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      font-size: 9px;
      font-weight: 700;
      line-height: 1;
      color: #0F2040;
      background-color: #D4AF37;
      border-radius: 9999px;
      box-shadow: 0 0 0 2px #FFFFFF;
    }

    /* ── Social icons ── */
    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 0.5rem;
      color: rgba(15, 32, 64, 0.3);
      transition: all 0.2s ease;
    }
    .social-icon:hover {
      color: #D4AF37;
      background: rgba(212, 175, 55, 0.06);
    }

    /* ── Mobile links ── */
    .mobile-link {
      display: block;
      padding: 0.75rem 1rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #0F2040;
      border-radius: 0.75rem;
      transition: all 0.15s ease;
    }
    .mobile-link:hover {
      color: #D4AF37;
      background: rgba(15, 32, 64, 0.03);
    }
    .mobile-link--active {
      color: #D4AF37 !important;
      font-weight: 600;
      background: rgba(212, 175, 55, 0.05) !important;
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
