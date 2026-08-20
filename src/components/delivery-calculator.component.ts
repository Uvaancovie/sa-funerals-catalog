import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  DeliveryCalculatorService, 
  DeliveryMethodType, 
  DeliveryOption, 
  ProductDimensions 
} from '../services/delivery-calculator.service';

@Component({
  selector: 'app-delivery-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-panel rounded-3xl border border-white/50 shadow-xl overflow-hidden mb-8 backdrop-blur-md">
      
      <!-- Header Banner with Compliance Badge -->
      <div class="bg-white p-6 relative overflow-hidden border-b border-slate-200">
        <div class="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-safs-gold/10 rounded-full blur-2xl"></div>
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div class="flex items-center gap-2 text-xs font-semibold text-safs-gold-dark tracking-widest uppercase mb-1">
              <span class="inline-block w-2 h-2 rounded-full bg-safs-gold animate-pulse"></span>
              SA Market Compliant Engine
            </div>
            <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Delivery Cost Calculator</h2>
            <p class="text-xs text-slate-500 mt-1 max-w-xl">
              Calculated using standard NBCRFLI statutory wages, SANRAL N3 heavy vehicle tolls, and 4,000 cm³/kg volumetric road freight rules.
            </p>
          </div>

          <div class="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-xs font-mono text-safs-gold-dark">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-600">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>Secured & Anti-Scrape Protected</span>
          </div>
        </div>
      </div>

      <div class="p-6 md:p-8 space-y-8">
        
        <!-- STEP 1: DELIVERY OPTION SELECTION (REQUIRED BEFORE ORDERING) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-full bg-safs-gold text-safs-dark font-black flex items-center justify-center text-sm shadow-md">1</span>
              <div>
                <h3 class="text-lg font-bold text-safs-primary">Step 1: Select Preferred Delivery Mode</h3>
                <p class="text-xs text-safs-text-muted">How would you like your order dispatched?</p>
              </div>
            </div>
            @if (selectedOptionId()) {
              <span class="bg-emerald-500/10 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                ✓ Option Selected
              </span>
            } @else {
              <span class="bg-amber-500/10 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20 animate-pulse">
                Selection Required
              </span>
            }
          </div>

          <!-- Options Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (opt of deliveryOptions(); track opt.id) {
              <div 
                (click)="selectOption(opt)"
                [class.ring-2]="selectedOptionId() === opt.id"
                [class.ring-safs-gold]="selectedOptionId() === opt.id"
                [class.bg-white]="selectedOptionId() === opt.id"
                [class.bg-white-60]="selectedOptionId() !== opt.id"
                class="relative rounded-2xl p-5 border border-white/60 hover:border-safs-gold/50 transition-all cursor-pointer shadow-sm hover:shadow-md backdrop-blur-sm group"
              >
                @if (opt.isPopular) {
                  <span class="absolute top-3 right-3 bg-safs-dark text-safs-gold text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-safs-gold/30">
                    {{ opt.badge }}
                  </span>
                } @else {
                  <span class="absolute top-3 right-3 bg-slate-200/80 text-slate-700 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                    {{ opt.badge }}
                  </span>
                }

                <div class="flex items-start gap-3">
                  <div class="mt-1">
                    <input 
                      type="radio" 
                      name="delivery_mode" 
                      [value]="opt.id" 
                      [checked]="selectedOptionId() === opt.id"
                      class="w-4 h-4 text-safs-gold border-gray-300 focus:ring-safs-gold"
                    >
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-safs-primary text-base group-hover:text-safs-gold transition-colors">{{ opt.title }}</h4>
                    <p class="text-xs text-safs-text-muted mt-1 leading-relaxed">{{ opt.description }}</p>
                    
                    <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span class="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {{ opt.estimatedDays }}
                      </span>
                      <div class="text-right">
                        @if (opt.calculatedPriceZar === 0) {
                          <span class="text-lg font-black text-emerald-600">FREE</span>
                        } @else {
                          <span class="text-lg font-black text-safs-primary">R{{ opt.totalWithVatZar | number:'1.2-2' }}</span>
                          <span class="block text-[10px] text-slate-400 font-semibold">(incl. 15% VAT)</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- STEP 2: PHYSICAL & VOLUMETRIC METRICS -->
        <div class="bg-white/40 border border-white/60 rounded-2xl p-5 space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/60 pb-3">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-safs-gold">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <h3 class="font-bold text-safs-primary text-sm uppercase tracking-wider">Product Cargo Dimensions & Volumetric Analysis</h3>
            </div>
            <span class="text-xs bg-safs-dark/5 text-safs-dark font-mono px-2.5 py-1 rounded-lg">Divisor: 4,000 cm³/kg</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div class="bg-white/70 p-3 rounded-xl border border-white/60">
              <span class="block text-[11px] text-slate-400 uppercase font-semibold">Dimensions (LxWxH)</span>
              <span class="text-sm font-bold text-safs-primary mt-1 block">{{ dimensions.lengthInches }}" × {{ dimensions.widthInches }}" × {{ dimensions.heightInches }}"</span>
              <span class="text-[10px] text-slate-400 font-mono">213.4 x 71.1 x 58.4 cm</span>
            </div>

            <div class="bg-white/70 p-3 rounded-xl border border-white/60">
              <span class="block text-[11px] text-slate-400 uppercase font-semibold">Actual Weight</span>
              <span class="text-sm font-bold text-safs-primary mt-1 block">{{ dimensions.actualWeightKg | number:'1.2-2' }} kg</span>
              <span class="text-[10px] text-slate-400">Scale Measured</span>
            </div>

            <div class="bg-white/70 p-3 rounded-xl border border-white/60">
              <span class="block text-[11px] text-slate-400 uppercase font-semibold">Volumetric Weight</span>
              <span class="text-sm font-bold text-amber-700 mt-1 block">{{ activeBreakdown().volumetricWeightKg | number:'1.2-2' }} kg</span>
              <span class="text-[10px] text-amber-600 font-semibold">{{ activeBreakdown().totalVolumeCubicMeters }} m³ Volume</span>
            </div>

            <div class="bg-safs-dark text-white p-3 rounded-xl shadow-inner">
              <span class="block text-[10px] text-safs-gold uppercase font-bold tracking-wider">Billable Freight Weight</span>
              <span class="text-base font-black text-white mt-1 block">{{ activeBreakdown().billableWeightKg | number:'1.2-2' }} kg</span>
              <span class="text-[9px] text-slate-300 font-medium">Max(Actual, Volumetric)</span>
            </div>
          </div>
        </div>

        <!-- STEP 3: ADVANCED ROUTE & FLEET COST BREAKDOWN TOGGLE -->
        <div class="border border-white/50 rounded-2xl bg-white/30 overflow-hidden">
          <button 
            (click)="toggleAdvancedDetails()" 
            class="w-full px-5 py-3.5 bg-slate-100/70 hover:bg-slate-200/70 transition-colors flex items-center justify-between text-left"
          >
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-safs-gold">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <span class="text-xs font-bold text-safs-primary uppercase tracking-wider">View 8-Tonne N3 Route Financial Breakdown (Audit Compliance)</span>
            </div>
            <span class="text-xs font-bold text-safs-gold hover:underline">
              {{ showAdvancedDetails() ? 'Hide Technical Parameters ▲' : 'Show Financial Parameters ▼' }}
            </span>
          </button>

          @if (showAdvancedDetails()) {
            <div class="p-5 space-y-6">
              
              <!-- Route & Vehicle Summary Bar -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/80 p-4 rounded-xl border border-white/60">
                <div>
                  <span class="text-slate-400 block font-semibold">Corridor Route:</span>
                  <strong class="text-safs-primary">{{ routeConfig.originCity }} → {{ routeConfig.destinationCity }} (N3)</strong>
                  <span class="block text-slate-400 text-[10px]">{{ routeConfig.distanceKm }} km (One Way) | Est. {{ routeConfig.estimatedHours }} hrs</span>
                </div>

                <div>
                  <span class="text-slate-400 block font-semibold">Fleet Configuration:</span>
                  <strong class="text-safs-primary">{{ fleetConfig.vehicleType }}</strong>
                  <span class="block text-slate-400 text-[10px]">Cap: {{ fleetConfig.capacityKg }} kg | {{ fleetConfig.fuelLitersPer100km }}L/100km</span>
                </div>

                <div>
                  <span class="text-slate-400 block font-semibold">Fuel & Toll Rates:</span>
                  <strong class="text-safs-primary">Diesel R{{ routeConfig.dieselPricePerLiterZar }}/L (Gauteng)</strong>
                  <span class="block text-slate-400 text-[10px]">SANRAL N3 Toll: R{{ routeConfig.tollFeeZar }} (R{{ routeConfig.tollFeeZar * 2 }} Return)</span>
                </div>
              </div>

              <!-- Cost Allocation Table -->
              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr class="bg-safs-dark text-white text-[11px]">
                      <th class="p-2.5 rounded-l-lg">Component</th>
                      <th class="p-2.5">Basis of Calculation</th>
                      <th class="p-2.5 text-right">Trip Cost (ZAR)</th>
                      <th class="p-2.5 text-right rounded-r-lg">Compliance & Source</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200/60 font-mono text-[11px]">
                    <tr>
                      <td class="p-2 font-bold text-slate-700">Diesel Fuel Cost</td>
                      <td class="p-2 text-slate-500">1,140km return × 22L/100km &#64; R23.50/L</td>
                      <td class="p-2 text-right font-semibold">R{{ activeBreakdown().fuelCostZar | number:'1.2-2' }}</td>
                      <td class="p-2 text-right text-slate-400">Department of Mineral Resources</td>
                    </tr>
                    <tr>
                      <td class="p-2 font-bold text-slate-700">SANRAL N3 Toll Fees</td>
                      <td class="p-2 text-slate-500">De Hoek + Wilge + Tugela + Mooi + Mariannhill (Return)</td>
                      <td class="p-2 text-right font-semibold">R{{ activeBreakdown().tollCostZar | number:'1.2-2' }}</td>
                      <td class="p-2 text-right text-slate-400">SANRAL Gazette 2026 Class 3</td>
                    </tr>
                    <tr>
                      <td class="p-2 font-bold text-slate-700">Driver Package (Per Trip)</td>
                      <td class="p-2 text-slate-500">Salary R18k + Statutory 4.5% (UIF 1%, SDL 1%, COIDA 2.5%) / 8 trips</td>
                      <td class="p-2 text-right font-semibold">R{{ activeBreakdown().driverCostZar | number:'1.2-2' }}</td>
                      <td class="p-2 text-right text-slate-400">NBCRFLI Bargaining Council</td>
                    </tr>
                    <tr>
                      <td class="p-2 font-bold text-slate-700">Fleet Maintenance</td>
                      <td class="p-2 text-slate-500">1,140km × R0.80/km (Tyres, Wear & Tear)</td>
                      <td class="p-2 text-right font-semibold">R{{ activeBreakdown().maintenanceCostZar | number:'1.2-2' }}</td>
                      <td class="p-2 text-right text-slate-400">RFA Index 2026</td>
                    </tr>
                    <tr>
                      <td class="p-2 font-bold text-slate-700">Insurance & GPS Security</td>
                      <td class="p-2 text-slate-500">(R4,500 Insurance + R850 Tracking) / 8 trips</td>
                      <td class="p-2 text-right font-semibold">R{{ (activeBreakdown().insuranceShareZar + activeBreakdown().securityGpsShareZar) | number:'1.2-2' }}</td>
                      <td class="p-2 text-right text-slate-400">Commercial Cargo Insurance</td>
                    </tr>
                    <tr>
                      <td class="p-2 font-bold text-slate-700">Handling & Warehousing</td>
                      <td class="p-2 text-slate-500">Port handling (R350) + Hub warehousing (R450)</td>
                      <td class="p-2 text-right font-semibold">R{{ activeBreakdown().handlingAndWarehousingZar | number:'1.2-2' }}</td>
                      <td class="p-2 text-right text-slate-400">Logistics Depot Handling</td>
                    </tr>
                    <tr class="bg-slate-100 font-bold border-t-2 border-slate-300">
                      <td class="p-2 text-safs-primary">Total 8-Tonne Trip Operational Cost</td>
                      <td class="p-2 text-slate-600">8,000 kg Payload capacity</td>
                      <td class="p-2 text-right text-safs-primary">R{{ activeBreakdown().totalTripOperationalCostZar | number:'1.2-2' }}</td>
                      <td class="p-2 text-right text-emerald-700">R{{ activeBreakdown().effectiveCostPerKgZar }}/kg Payload Rate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Anti-Scraping Token Info -->
              <div class="bg-slate-900 text-slate-300 p-3 rounded-xl text-[11px] font-mono flex items-center justify-between">
                <span>Security Token: <code class="text-safs-gold">{{ securityToken() }}</code></span>
                <span>Anti-Scraping Enforcement: <strong class="text-emerald-400">ACTIVE</strong></span>
              </div>

            </div>
          }
        </div>

      </div>
    </div>
  `
})
export class DeliveryCalculatorComponent {
  private calcService = inject(DeliveryCalculatorService);

  @Input() dimensions: ProductDimensions = {
    lengthInches: 84,
    widthInches: 28,
    heightInches: 23,
    actualWeightKg: 68.0388555,
    quantity: 1
  };

  @Output() optionSelected = new EventEmitter<DeliveryOption>();

  showAdvancedDetails = signal(false);
  selectedOptionId = signal<DeliveryMethodType | null>(null);

  routeConfig = this.calcService.defaultRoute();
  fleetConfig = this.calcService.defaultFleet();

  deliveryOptions = computed(() => this.calcService.getDeliveryOptions(this.dimensions));

  activeBreakdown = computed(() => {
    return this.calcService.calculateEnterpriseTransportCost(this.dimensions);
  });

  securityToken = computed(() => {
    const active = this.activeBreakdown();
    return this.calcService.generateSecurityChecksum(active.finalTotalWithVatZar, Date.now());
  });

  selectOption(option: DeliveryOption) {
    this.selectedOptionId.set(option.id);
    this.calcService.selectedDeliveryMethod.set(option.id);
    this.optionSelected.emit(option);
  }

  toggleAdvancedDetails() {
    this.showAdvancedDetails.update(v => !v);
  }
}
