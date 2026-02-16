import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-safs-dark text-white pt-16 pb-8 border-t-4 border-safs-gold">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <!-- Brand -->
          <div class="col-span-1 md:col-span-1">
            <h3 class="font-serif text-2xl font-bold text-safs-gold mb-4">SA FUNERAL SUPPLIES</h3>
            <p class="text-gray-300 text-sm leading-relaxed mb-6">
              Servicing the funeral industry since 1998. Committed to quality, value, service, and innovation.
            </p>
            <div class="flex gap-4">
              <!-- Social Placeholders -->
              <div class="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-safs-gold transition-colors cursor-pointer">
                 <span class="font-bold text-xs">FB</span>
              </div>
              <div class="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-safs-gold transition-colors cursor-pointer">
                 <span class="font-bold text-xs">LI</span>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-serif text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul class="space-y-3 text-sm text-gray-400">
              <li><a routerLink="/" class="hover:text-safs-gold transition-colors">Home</a></li>
              <li><a routerLink="/catalog" class="hover:text-safs-gold transition-colors">Full Catalogue</a></li>
              <li><a routerLink="/about" class="hover:text-safs-gold transition-colors">Corporate Strategy</a></li>
              <li><a routerLink="/contact" class="hover:text-safs-gold transition-colors">Branch Locations</a></li>
            </ul>
          </div>

          <!-- Products -->
          <div>
            <h4 class="font-serif text-lg font-bold text-white mb-6">Our Products</h4>
            <ul class="space-y-3 text-sm text-gray-400">
              <li><a routerLink="/catalog" class="hover:text-safs-gold transition-colors">Adult Caskets</a></li>
              <li><a routerLink="/catalog" class="hover:text-safs-gold transition-colors">Dome Caskets</a></li>
              <li><a routerLink="/catalog" class="hover:text-safs-gold transition-colors">Child Caskets</a></li>
              <li><a routerLink="/catalog" class="hover:text-safs-gold transition-colors">Funeral Equipment</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-serif text-lg font-bold text-white mb-6">Head Office</h4>
            <ul class="space-y-4 text-sm text-gray-400">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-safs-gold mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>160 Aberdare Drive, Phoenix Industrial Park, Durban, 4090</span>
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-safs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>+27 31 508 6700</span>
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-safs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>hello&#64;safuneral.co.za</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2024 South African Funeral Supplies. All rights reserved.</p>
          <div class="flex gap-4 mt-4 md:mt-0">
            <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent { }
