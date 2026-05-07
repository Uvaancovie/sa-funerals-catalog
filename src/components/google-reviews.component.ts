import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-google-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-sm mx-auto md:mx-0">
      <!-- Header: Google Logo & Rating -->
      <div class="flex items-center gap-4 mb-4 border-b border-gray-50 pb-4">
        <div class="bg-white p-2 rounded-full shadow-sm border border-gray-100">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        </div>
        <div>
           <div class="flex items-center gap-1">
             <span class="font-bold text-safs-dark text-lg">4.4</span>
             <div class="flex text-yellow-400 text-sm">
                <span class="text-yellow-400">★</span>
                <span class="text-yellow-400">★</span>
                <span class="text-yellow-400">★</span>
                <span class="text-yellow-400">★</span>
                <span class="text-gray-300">★</span> <!-- 4.4 is roughly 4.5 stars visually, keeping strictly 4 filled and 1 empty or half if we had icon -->
             </div>
           </div>
           <p class="text-xs text-gray-600 font-medium">Based on 7 reviews</p>
        </div>
      </div>

      <!-- Featured Review -->
      <div class="space-y-4">
         <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
               S
            </div>
            <div>
               <h4 class="font-bold text-sm text-safs-dark">Siyabonga Patrick</h4>
               <p class="text-[10px] text-gray-600 uppercase tracking-wide mb-1">Local Guide • 71 reviews</p>
               <div class="flex text-yellow-400 text-xs mb-2">★★★★★</div>
               <p class="text-sm text-gray-600 italic leading-relaxed">"Friendly place to meet up with stuff. They are friendly."</p>
            </div>
         </div>
         
         <div class="flex items-start gap-3 pt-3 border-t border-gray-50 transition-colors">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
               K
            </div>
            <div>
               <h4 class="font-bold text-sm text-safs-dark">karriem simons</h4>
               <p class="text-[10px] text-gray-600 uppercase tracking-wide mb-1">1 review</p>
               <div class="flex text-gray-600 text-xs text-[10px]">(Rated without comment)</div>
            </div>
         </div>

         <div class="flex items-start gap-3 pt-3 border-t border-gray-50 transition-colors">
            <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
               P
            </div>
            <div>
               <h4 class="font-bold text-sm text-safs-dark">Phumlani Hamilton</h4>
               <p class="text-[10px] text-gray-600 uppercase tracking-wide mb-1">Local Guide • 58 reviews</p>
               <div class="flex text-gray-600 text-xs text-[10px]">(Rated without comment)</div>
            </div>
         </div>
      </div>
      
      <div class="mt-4 pt-4 border-t border-gray-50 text-center">
         <a href="https://www.google.com/search?q=South+African+Funeral+Supplies+Reviews" target="_blank" class="text-xs font-bold text-safs-gold-dark hover:text-safs-dark transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
            View all 7 reviews on Google
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
         </a>
      </div>
    </div>
  `
})
export class GoogleReviewsComponent {}
