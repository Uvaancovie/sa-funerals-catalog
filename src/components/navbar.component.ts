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
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <a routerLink="/" class="font-serif font-bold text-safs-dark text-xl tracking-wide">
          SA Funeral Supplies
        </a>

        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-safs-dark text-white font-bold shadow-sm hover:opacity-95 active:scale-95"
          (click)="toggleMenu()"
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      @if (isMenuOpen()) {
        <nav class="animate-in border-t border-gray-100 bg-white px-4 sm:px-6 py-4">
          <a
            routerLink="/catalog"
            routerLinkActive="text-safs-gold-dark font-bold"
            (click)="closeMenu()"
            class="block py-2 text-gray-700 hover:text-safs-dark transition-colors"
          >
            Full Catalogue
          </a>

          <button
            type="button"
            (click)="logout()"
            class="mt-2 block w-full text-left py-2 text-gray-700 hover:text-safs-dark transition-colors font-bold"
          >
            Logout
          </button>
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
