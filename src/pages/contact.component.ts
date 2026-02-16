import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="container mx-auto px-4">
        
        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2">
            
            <!-- Info Side -->
            <div class="bg-safs-dark text-white p-12">
              <h1 class="font-serif text-3xl font-bold mb-8 text-safs-gold">Get in Touch</h1>
              
              <div class="space-y-8">
                <div>
                  <h3 class="font-bold text-lg mb-2 flex items-center gap-2">
                    <svg class="w-5 h-5 text-safs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Head Office
                  </h3>
                  <p class="text-gray-300 pl-7">160 Aberdare Drive,<br>Phoenix Industrial Park,<br>Durban, 4090</p>
                </div>

                <div>
                  <h3 class="font-bold text-lg mb-2 flex items-center gap-2">
                    <svg class="w-5 h-5 text-safs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    Contact
                  </h3>
                  <p class="text-gray-300 pl-7">+27 31 508 6700</p>
                </div>

                <div>
                  <h3 class="font-bold text-lg mb-2 flex items-center gap-2">
                    <svg class="w-5 h-5 text-safs-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    Email
                  </h3>
                  <p class="text-gray-300 pl-7">hello&#64;safuneral.co.za</p>
                </div>
              </div>
            </div>

            <!-- Form Side -->
            <div class="p-12">
              <h2 class="text-2xl font-bold text-safs-dark mb-6">Send us a Message</h2>
              <form class="space-y-6" (submit)="$event.preventDefault()">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows="4" class="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all"></textarea>
                </div>
                <button class="w-full bg-safs-gold text-safs-dark font-bold py-3 rounded hover:bg-yellow-600 transition-colors">
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
        
        <!-- Map Placeholder -->
        <div class="max-w-4xl mx-auto mt-12 h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 shadow-inner">
           Map Component would load here (Phoenix Industrial Park, Durban)
        </div>

      </div>
    </div>
  `
})
export class ContactComponent { }
