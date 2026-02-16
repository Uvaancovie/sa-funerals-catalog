import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <!-- Header -->
    <div class="bg-safs-dark text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="font-serif text-4xl md:text-5xl font-bold mb-4">Company Profile</h1>
        <p class="text-xl text-safs-gold max-w-3xl mx-auto">
          Servicing the funeral industry since 1998 with superior product quality and exceptional service.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-16">
      
      <!-- Profile Section -->
      <div class="flex flex-col md:flex-row gap-12 mb-20">
        <div class="md:w-1/2">
          <h2 class="font-serif text-3xl font-bold text-safs-dark mb-6 border-l-4 border-safs-gold pl-4">Who We Are</h2>
          <p class="text-gray-600 mb-4 leading-relaxed">
            South African Funeral Supplies is well known for our superior product quality, exceptional service delivery and value for money pricing. Since our inception we have been at the forefront of product design and innovation with many industry designs having come from our manufacturing facility.
          </p>
          <p class="text-gray-600 mb-4 leading-relaxed">
            This has established our brand as the premium supplier of quality caskets, equipment, and requisites to the funeral industry, both in South African and within the African continent.
          </p>
        </div>
        <div class="md:w-1/2">
           <img src="https://placehold.co/800x600/1a103c/ffffff?text=Our+Team" class="rounded-lg shadow-lg w-full h-full object-cover">
        </div>
      </div>

      <!-- Mission & Vision -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div class="bg-safs-light p-8 rounded-lg border-t-4 border-safs-dark">
          <h3 class="font-serif text-2xl font-bold text-safs-dark mb-4">Our Vision</h3>
          <p class="text-gray-700 italic">
            "To be Africa's largest manufacturer and supplier of quality funeral related products and services that will assist our clients to meet their organizational objectives."
          </p>
        </div>
        <div class="bg-safs-light p-8 rounded-lg border-t-4 border-safs-gold">
          <h3 class="font-serif text-2xl font-bold text-safs-dark mb-4">Our Mission</h3>
          <p class="text-gray-700">
            We are committed to fighting poverty by creating local employment and investing in workforce skills. We intend to build strong relations with all stakeholders and generate sufficient profits to finance continued growth and innovation.
          </p>
        </div>
      </div>

      <!-- Corporate Strategy -->
      <div class="mb-20">
        <h2 class="font-serif text-3xl font-bold text-safs-dark mb-8 text-center">Corporate Strategy</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           @for (strat of strategies; track strat.word) {
             <div class="bg-white p-6 shadow-sm border border-gray-100 rounded hover:shadow-md transition-shadow">
               <span class="font-bold text-safs-gold text-lg block mb-2">{{ strat.word }}</span>
               <p class="text-gray-600 text-sm">{{ strat.desc }}</p>
             </div>
           }
        </div>
      </div>

      <!-- Branches -->
      <div class="bg-safs-dark text-white rounded-2xl p-12 text-center relative overflow-hidden">
        <div class="relative z-10">
          <h2 class="font-serif text-3xl font-bold mb-8">Our Extensive Branch Network</h2>
          <div class="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            @for (branch of branches; track branch) {
              <span class="bg-white/10 px-4 py-2 rounded-full hover:bg-safs-gold hover:text-safs-dark transition-colors cursor-default">
                {{ branch }}
              </span>
            }
          </div>
        </div>
      </div>

    </div>
  `
})
export class AboutComponent {
  strategies = [
    { word: 'ACHIEVE', desc: 'Optimal ROI whilst maintaining highest levels of quality.' },
    { word: 'ASSIST', desc: 'With the effectiveness and profitability of our customers business.' },
    { word: 'EMPOWER', desc: 'And recognize each employee’s unique contribution.' },
    { word: 'MOTIVATE', desc: 'Our staff with training, mentoring, and support.' },
    { word: 'PROVIDE', desc: 'Vigorous community leadership and support.' },
    { word: 'INSTIL', desc: 'An environment of service excellence.' },
    { word: 'EXPAND', desc: 'Our customer base.' }
  ];

  branches = [
    'Limpopo', 'Polokwane', 'Nelspruit', 'Pretoria', 'Springs', 'Johannesburg', 
    'Ladysmith', 'Empangeni', 'Pietermaritzburg', 'Durban', 'Umtata', 
    'Port Elizabeth', 'Bloemfontein', 'Capetown', 'Botswana', 'Swaziland', 'Namibia', 'Lesotho'
  ];
}
