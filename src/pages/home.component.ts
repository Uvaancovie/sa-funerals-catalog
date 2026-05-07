import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoogleReviewsComponent } from '../components/google-reviews.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, GoogleReviewsComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative h-[600px] flex items-center justify-center bg-safs-dark overflow-hidden">
      <!-- Decorative Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-safs-dark via-safs-dark/90 to-transparent z-10"></div>
      <img src="https://placehold.co/1920x1080/2a1b4e/ffffff?text=Quality+Manufacturing" alt="Factory Background" class="absolute inset-0 w-full h-full object-cover opacity-30 z-0">
      
      <div class="relative z-20 container mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
        <div class="max-w-2xl">
          <div class="inline-block border-b-2 border-safs-gold mb-6 pb-1">
            <span class="text-safs-gold font-bold tracking-[0.3em] uppercase text-sm">Since 1998</span>
          </div>
          <h1 class="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            A Trusted <span class="text-safs-gold">Funeral Brand</span>
          </h1>
          <p class="text-gray-300 text-lg mb-8 leading-relaxed">
            Africa's largest manufacturer and supplier of quality funeral related products and services. 
            Quality • Value • Service • Innovation.
          </p>
          <div class="flex flex-col md:flex-row gap-4">
            <a routerLink="/catalog" class="bg-safs-gold hover:bg-yellow-600 text-safs-dark font-bold py-3 px-8 rounded-sm transition-colors text-center">
              View Catalogue
            </a>
            <a routerLink="/contact" class="border border-white text-white hover:bg-white hover:text-safs-dark font-bold py-3 px-8 rounded-sm transition-colors text-center">
              Contact Us
            </a>
          </div>
        </div>

        <!-- Google Reviews Integration -->
        <div class="hidden lg:block transform hover:scale-105 transition-transform duration-300">
           <app-google-reviews></app-google-reviews>
        </div>
      </div>
    </section>

    <!-- Strategy / Pillars Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="font-serif text-3xl font-bold text-safs-dark mb-4">Our Corporate Strategy</h2>
          <div class="w-24 h-1 bg-safs-gold mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          @for (item of strategy; track item.title) {
            <div class="p-8 bg-gray-50 hover:bg-safs-light hover:shadow-lg transition-all border-t-4 border-transparent hover:border-safs-gold group text-center">
              <div class="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-6 group-hover:bg-safs-gold transition-colors">
                <span class="text-2xl group-hover:text-white text-safs-dark" [innerHTML]="item.icon"></span>
              </div>
              <h3 class="font-serif text-xl font-bold text-safs-dark mb-3">{{ item.title }}</h3>
              <p class="text-gray-600 text-sm leading-relaxed">{{ item.text }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Trusted Partners Section -->
    <section class="py-16 bg-safs-light border-y border-gray-200">
      <div class="container mx-auto px-4 text-center">
        <p class="text-safs-dark font-serif font-bold mb-8 uppercase tracking-widest text-sm">Trusted As A Preferred Supplier By</p>
        <div class="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <!-- Text placeholders for logos since we don't have the assets -->
           <span class="text-2xl font-bold text-gray-400 hover:text-safs-dark">AVBOB</span>
           <span class="text-2xl font-bold text-gray-400 hover:text-safs-dark">DOVES</span>
           <span class="text-2xl font-bold text-gray-400 hover:text-safs-dark">MARTINS</span>
           <span class="text-2xl font-bold text-gray-400 hover:text-safs-dark">ICEBOLETHU</span>
        </div>
      </div>
    </section>

    <!-- Featured Categories Banner -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1 relative">
             <div class="absolute -inset-4 bg-safs-gold/20 rounded-lg transform -rotate-2"></div>
             <img src="https://placehold.co/800x600/1a103c/a89f6e?text=Premium+Caskets" alt="Casket Display" class="relative rounded-lg shadow-2xl w-full">
          </div>
          <div class="order-1 md:order-2 md:pl-12">
            <h2 class="font-serif text-3xl md:text-4xl font-bold text-safs-dark mb-6">Innovative Designs & Manufacturing</h2>
            <p class="text-gray-600 mb-6 leading-relaxed text-lg">
              Since our inception in 1998, we have been at the forefront of product design and innovation. As a premier manufacturer and importer, many industry-standard designs have originated from our facility.
            </p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3 text-safs-dark font-medium">
                <span class="w-6 h-6 rounded-full bg-safs-gold/20 flex items-center justify-center text-safs-gold text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span> Premium Wood Selection
              </li>
              <li class="flex items-center gap-3 text-safs-dark font-medium">
                <span class="w-6 h-6 rounded-full bg-safs-gold/20 flex items-center justify-center text-safs-gold text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span> Superior Craftsmanship
              </li>
              <li class="flex items-center gap-3 text-safs-dark font-medium">
                <span class="w-6 h-6 rounded-full bg-safs-gold/20 flex items-center justify-center text-safs-gold text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span> Custom Finishing Options
              </li>
            </ul>
            <a routerLink="/catalog" class="inline-flex items-center gap-2 text-safs-gold font-bold hover:text-safs-dark transition-colors group">
              Explore Our Range <span class="group-hover:translate-x-1 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- National Footprint -->
    <section class="py-20 bg-safs-dark text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-safs-gold/5 pattern-grid-lg"></div>
      <div class="container mx-auto px-4 relative z-10 text-center">
        <h2 class="font-serif text-3xl font-bold mb-6">National Footprint</h2>
        <p class="max-w-2xl mx-auto text-gray-300 mb-12 text-lg">
          We distribute our products through nine provincial hubs across South Africa, also serving Eswatini, Botswana, Lesotho, and Mozambique.
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div class="p-4 border border-white/10 rounded hover:bg-white/5 transition-colors">
            <div class="text-2xl font-bold text-safs-gold mb-1">9</div>
            <div class="text-sm text-gray-400">Provincial Hubs</div>
          </div>
          <div class="p-4 border border-white/10 rounded hover:bg-white/5 transition-colors">
            <div class="text-2xl font-bold text-safs-gold mb-1">100+</div>
            <div class="text-sm text-gray-400">Employees</div>
          </div>
          <div class="p-4 border border-white/10 rounded hover:bg-white/5 transition-colors">
            <div class="text-2xl font-bold text-safs-gold mb-1">20+</div>
            <div class="text-sm text-gray-400">Years Experience</div>
          </div>
          <div class="p-4 border border-white/10 rounded hover:bg-white/5 transition-colors">
             <div class="text-2xl font-bold text-safs-gold mb-1">5</div>
             <div class="text-sm text-gray-400">Countries Served</div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  strategy = [
    { title: 'Quality', text: 'Maintaining the highest levels of quality and manufacturing excellence.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>' },
    { title: 'Value', text: 'Optimal ROI whilst maintaining competitive pricing for our partners.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"></path><path d="M11 3 8 9l4 13"></path><path d="M12 15V3"></path></svg>' },
    { title: 'Service', text: 'Vigorous community leadership and support with exceptional delivery.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
    { title: 'Innovation', text: 'Forefront of product design and technological advancements.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>' }
  ];
}
