import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface BranchLocation {
  name: string;
  region: string;
  type: 'Head Office' | 'Regional Hub' | 'Distribution Branch' | 'Cross-Border Hub';
  description?: string;
  isHeadOffice?: boolean;
}

@Component({
  selector: 'app-branches-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-[60vh] sm:min-h-[70vh] flex items-center bg-safs-dark overflow-hidden" aria-label="Branches SAFS hero">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIuOC00LjMgMi4yLTUuN2wxLjQtMS40IDQuMiA0LjItMS40IDEuNGMtMS41IDEuNS0zLjYgMi4zLTUuNyAyLjMtMS4zIDAtMi41LS4zLTMuNi0uOGwxLjUtMS41Yy42LjIgMS4zLjUgMiAuNXoiLz48L2c+PC9nPjwvc3ZnPg==')] pointer-events-none"></div>

      <!-- Gradient accents -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-safs-gold/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-safs-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        <div class="max-w-3xl rounded-3xl p-6 sm:p-8 lg:p-10 bg-safs-dark/95 border border-safs-gold/20 shadow-2xl backdrop-blur-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-0.5 bg-safs-gold" aria-hidden="true"></div>
            <span class="text-safs-gold font-bold text-sm tracking-[0.2em] uppercase">Distribution Network</span>
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Our Branches &<br>
            <span class="text-safs-gold">Regional Presence</span>
          </h1>
          <p class="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
            Strategic distribution across 14 key South African locations and 4 neighbouring African nations ensures fast, reliable turnaround for funeral directors nationwide.
          </p>
          <div class="flex flex-wrap gap-4">
            <a
              routerLink="/contact"
              class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-8 py-3.5 rounded-xl hover:bg-safs-gold/80 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Contact Nearest Branch
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a
              routerLink="/export"
              class="inline-flex items-center gap-2 border-2 border-safs-gold text-white font-bold px-8 py-3.5 rounded-xl hover:bg-safs-gold hover:text-black transition-all"
            >
              International Exports
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 bg-safs-dark/95 border-y border-safs-gold/20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-safs-gold/50 transition-all">
            <div class="text-3xl sm:text-4xl font-bold text-safs-gold mb-1">14</div>
            <div class="text-xs sm:text-sm text-slate-300 font-medium">SA Branch Locations</div>
          </div>
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-safs-gold/50 transition-all">
            <div class="text-3xl sm:text-4xl font-bold text-safs-gold mb-1">4</div>
            <div class="text-xs sm:text-sm text-slate-300 font-medium">Neighbouring Countries</div>
          </div>
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-safs-gold/50 transition-all">
            <div class="text-3xl sm:text-4xl font-bold text-safs-gold mb-1">24h</div>
            <div class="text-xs sm:text-sm text-slate-300 font-medium">Rapid Fulfillment</div>
          </div>
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-safs-gold/50 transition-all">
            <div class="text-3xl sm:text-4xl font-bold text-safs-gold mb-1">100%</div>
            <div class="text-xs sm:text-sm text-slate-300 font-medium">Nationwide Coverage</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Branch Map Section -->
    <section class="py-16 sm:py-24 bg-slate-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <span class="inline-block text-safs-gold font-bold text-sm tracking-[0.2em] uppercase mb-3">Distribution Footprint</span>
          <h2 class="text-3xl sm:text-4xl font-bold text-safs-dark">
            Regional Branch Map
          </h2>
          <p class="text-slate-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Click on the map image below to inspect our full logistics and branch network view.
          </p>
        </div>

        <!-- Glass Map Frame -->
        <div class="relative rounded-2xl overflow-hidden bg-safs-dark p-3 sm:p-5 shadow-2xl border-2 border-safs-gold/40 group">
          <div class="relative overflow-hidden rounded-xl bg-slate-900 cursor-pointer" (click)="openMapModal()">
            <img
              src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/branches/nationwide-reach.png"
              alt="South African Funeral Supplies Branch Map & Locations"
              class="w-full h-auto object-contain max-h-[600px] mx-auto group-hover:scale-[1.02] transition-transform duration-500"
              loading="eager"
            />
            <div class="absolute inset-0 bg-safs-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="inline-flex items-center gap-2 bg-safs-gold text-black font-bold px-5 py-2.5 rounded-xl shadow-lg text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                Click to Enlarge Map
              </span>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-300 px-2">
            <span class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-safs-gold animate-pulse"></span>
              South Africa Head Office & Regional Hubs
            </span>
            <span class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              Cross-Border Logistics Network
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Branch Locations Lists -->
    <section class="py-16 sm:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        
        <!-- South African Branches -->
        <div class="mb-16">
          <div class="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <div>
              <span class="text-safs-gold font-bold text-xs tracking-[0.2em] uppercase">Local Distribution</span>
              <h2 class="text-2xl sm:text-3xl font-bold text-safs-dark">South Africa Branches</h2>
            </div>
            <span class="px-3 py-1 bg-safs-gold/10 text-safs-gold text-xs sm:text-sm font-semibold rounded-full border border-safs-gold/30">
              14 Locations
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @for (branch of saBranches; track branch.name) {
              <div
                class="p-5 rounded-xl border border-slate-200 bg-white hover:border-safs-gold hover:shadow-lg transition-all duration-300 group"
                [class.ring-2]="branch.isHeadOffice"
                [class.ring-safs-gold]="branch.isHeadOffice"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="p-2 rounded-lg bg-safs-dark/5 text-safs-gold group-hover:bg-safs-gold group-hover:text-black transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  @if (branch.isHeadOffice) {
                    <span class="px-2.5 py-0.5 bg-safs-gold text-black text-[10px] font-bold uppercase rounded tracking-wider">
                      Head Office
                    </span>
                  }
                </div>
                <h3 class="font-bold text-lg text-safs-dark group-hover:text-safs-gold transition-colors">
                  {{ branch.name }}
                </h3>
                <p class="text-xs text-slate-500 mt-1 font-medium">{{ branch.region }}</p>
                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Operational
                  </span>
                  <a routerLink="/contact" class="text-safs-gold font-medium hover:underline flex items-center gap-1">
                    Enquire
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Neighbouring Countries -->
        <div>
          <div class="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <div>
              <span class="text-safs-gold font-bold text-xs tracking-[0.2em] uppercase">International Supply</span>
              <h2 class="text-2xl sm:text-3xl font-bold text-safs-dark">Neighbouring & Regional Coverage</h2>
            </div>
            <span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm font-semibold rounded-full border border-blue-200">
              4 Countries
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            @for (country of internationalBranches; track country.name) {
              <div class="p-6 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-safs-gold hover:shadow-xl transition-all duration-300 group">
                <div class="w-12 h-12 rounded-xl bg-safs-dark text-safs-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <h3 class="font-bold text-xl text-safs-dark mb-1 group-hover:text-safs-gold transition-colors">
                  {{ country.name }}
                </h3>
                <p class="text-xs text-slate-500 mb-4 font-medium">Cross-Border Delivery & Export</p>
                <a routerLink="/export" class="inline-flex items-center gap-2 text-xs font-bold text-safs-gold hover:text-safs-dark transition-colors">
                  View Export Services
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>
            }
          </div>
        </div>

      </div>
    </section>

    <!-- Head Office Contact Banner -->
    <section class="py-16 bg-safs-dark text-white relative overflow-hidden">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <span class="text-safs-gold font-bold text-xs tracking-[0.2em] uppercase">Headquarters</span>
          <h2 class="text-3xl font-bold mt-1 mb-2">Need Direct Branch Assistance?</h2>
          <p class="text-slate-300 text-sm max-w-lg">
            Our Durban Head Office coordinates supply routes and inventory allocation for all 14 branches across South Africa.
          </p>
          <div class="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-300">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-safs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Phoenix Industrial Park, Durban
            </span>
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-safs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              +27 31 508 6700
            </span>
          </div>
        </div>
        <div class="flex flex-wrap gap-4 shrink-0">
          <a
            href="tel:+27315086700"
            class="bg-safs-gold text-black font-bold px-6 py-3.5 rounded-xl hover:bg-safs-gold/80 transition-all shadow-lg text-sm"
          >
            Call Durban Office
          </a>
          <a
            routerLink="/contact"
            class="border border-white/30 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-all text-sm"
          >
            Submit Enquiry
          </a>
        </div>
      </div>
    </section>

    <!-- Map Lightbox Modal -->
    @if (isMapModalOpen()) {
      <div
        class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        (click)="closeMapModal()"
      >
        <div class="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center" (click)="$event.stopPropagation()">
          <button
            type="button"
            (click)="closeMapModal()"
            class="absolute -top-12 right-0 text-white hover:text-safs-gold font-bold text-sm flex items-center gap-2 bg-safs-dark/80 px-4 py-2 rounded-lg border border-white/20"
          >
            Close Map ✕
          </button>
          <img
            src="https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/branches/nationwide-reach.png"
            alt="South African Funeral Supplies Branch Map Full View"
            class="max-w-full max-h-[85vh] object-contain rounded-xl border border-safs-gold/40 shadow-2xl"
          />
        </div>
      </div>
    }
  `
})
export class BranchesPageComponent {
  isMapModalOpen = signal(false);

  saBranches: BranchLocation[] = [
    { name: 'Durban', region: 'KwaZulu-Natal', type: 'Head Office', isHeadOffice: true },
    { name: 'Pietermaritzburg', region: 'KwaZulu-Natal', type: 'Regional Hub' },
    { name: 'Empangeni', region: 'KwaZulu-Natal', type: 'Distribution Branch' },
    { name: 'Ladysmith', region: 'KwaZulu-Natal', type: 'Distribution Branch' },
    { name: 'Johannesburg', region: 'Gauteng', type: 'Regional Hub' },
    { name: 'Pretoria', region: 'Gauteng', type: 'Distribution Branch' },
    { name: 'Springs', region: 'Gauteng', type: 'Distribution Branch' },
    { name: 'Polokwane', region: 'Limpopo', type: 'Regional Hub' },
    { name: 'Limpopo', region: 'Limpopo Region', type: 'Distribution Branch' },
    { name: 'Nelspruit', region: 'Mpumalanga', type: 'Regional Hub' },
    { name: 'Bloemfontein', region: 'Free State', type: 'Regional Hub' },
    { name: 'Capetown', region: 'Western Cape', type: 'Regional Hub' },
    { name: 'Port Elizabeth', region: 'Eastern Cape', type: 'Regional Hub' },
    { name: 'Umtata', region: 'Eastern Cape', type: 'Distribution Branch' }
  ];

  internationalBranches = [
    { name: 'Botswana', region: 'SADC Express Route' },
    { name: 'Swaziland', region: 'SADC Express Route' },
    { name: 'Namibia', region: 'SADC Express Route' },
    { name: 'Lesotho', region: 'SADC Express Route' }
  ];

  openMapModal() {
    this.isMapModalOpen.set(true);
  }

  closeMapModal() {
    this.isMapModalOpen.set(false);
  }
}
