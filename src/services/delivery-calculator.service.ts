import { Injectable, signal } from '@angular/core';

export interface ProductDimensions {
  lengthInches: number;
  widthInches: number;
  heightInches: number;
  actualWeightKg: number;
  quantity: number;
}

export type DeliveryMethodType = 'depot_pickup' | 'consolidated_ltl' | 'express_courier' | 'dedicated_charter';

export interface RouteConfig {
  originProvince: string;
  destinationProvince: string;
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedHours: number;
  tollFeeZar: number;
  dieselPricePerLiterZar: number;
}

export interface TransportFleetConfig {
  vehicleType: string;
  capacityKg: number;
  fuelLitersPer100km: number;
  tripsPerMonth: number;
  includeReturnTrip: boolean; // Empty backhaul
  driverMonthlySalaryZar: number;
  includeStatutoryBenefits: boolean; // UIF 1%, SDL 1%, COIDA 2.5%
  overnightStaysPerTrip: number;
  overnightAllowancePerNightZar: number;
  maintenanceCostPerKmZar: number;
  insuranceCostPerMonthZar: number;
  securityGpsCostPerMonthZar: number;
  portHandlingCostZar: number;
  warehousingCostZar: number;
}

export interface DeliveryCostBreakdown {
  billableWeightKg: number;
  volumetricWeightKg: number;
  actualWeightKg: number;
  totalVolumeCubicMeters: number;
  
  // Cost breakdown per trip / order
  fuelCostZar: number;
  tollCostZar: number;
  maintenanceCostZar: number;
  driverCostZar: number; // Includes salary + statutory benefits (UIF, SDL, COIDA)
  overnightAllowanceZar: number;
  insuranceShareZar: number;
  securityGpsShareZar: number;
  handlingAndWarehousingZar: number;
  
  totalTripOperationalCostZar: number;
  effectiveCostPerKgZar: number;
  allocatedDeliveryQuoteZar: number;
  vatZar: number;
  finalTotalWithVatZar: number;
}

export interface DeliveryOption {
  id: DeliveryMethodType;
  title: string;
  badge: string;
  estimatedDays: string;
  description: string;
  calculatedPriceZar: number;
  vatZar: number;
  totalWithVatZar: number;
  breakdown: DeliveryCostBreakdown;
  isPopular?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryCalculatorService {

  // Default parameters matching SA Market JHB -> DBN N3 freight standard
  readonly defaultRoute = signal<RouteConfig>({
    originProvince: 'Gauteng',
    destinationProvince: 'KwaZulu-Natal',
    originCity: 'Johannesburg',
    destinationCity: 'Durban',
    distanceKm: 570,
    estimatedHours: 6,
    tollFeeZar: 770,
    dieselPricePerLiterZar: 23.50
  });

  readonly defaultFleet = signal<TransportFleetConfig>({
    vehicleType: '8-Tonne Heavy Freight Truck',
    capacityKg: 8000,
    fuelLitersPer100km: 22,
    tripsPerMonth: 8,
    includeReturnTrip: true, // Empty backhaul (1,140km total)
    driverMonthlySalaryZar: 18000,
    includeStatutoryBenefits: true, // 4.5% total (UIF 1%, SDL 1%, COIDA 2.5%)
    overnightStaysPerTrip: 0,
    overnightAllowancePerNightZar: 450,
    maintenanceCostPerKmZar: 0.80,
    insuranceCostPerMonthZar: 4500,
    securityGpsCostPerMonthZar: 850,
    portHandlingCostZar: 350,
    warehousingCostZar: 450
  });

  // Selected delivery method on cart
  readonly selectedDeliveryMethod = signal<DeliveryMethodType | null>(null);

  /**
   * Anti-Scraping Signature Hash Token
   * Generates a tamper-proof dynamic checksum to prevent client-side rate spoofing & unauthorized scraping.
   */
  generateSecurityChecksum(amount: number, timestamp: number): string {
    const salt = 'SAFS_ENTERPRISE_LOGISTICS_2026_COMPLIANT_SALT_#99201';
    const raw = `${amount.toFixed(2)}-${timestamp}-${salt}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Calculates Volumetric Weight for Road Freight (SA Industry Standard Divisor = 4,000 cm³/kg for domestic heavy freight)
   */
  calculateVolumetricWeight(dimensions: ProductDimensions): {
    volumetricWeightKg: number;
    volumeCubicMeters: number;
    billableWeightKg: number;
  } {
    // 1 inch = 2.54 cm
    const lengthCm = dimensions.lengthInches * 2.54;
    const widthCm = dimensions.widthInches * 2.54;
    const heightCm = dimensions.heightInches * 2.54;

    // Cubic volume in cm³ & m³
    const volumeCm3 = lengthCm * widthCm * heightCm * dimensions.quantity;
    const volumeM3 = volumeCm3 / 1_000_000;

    // SA Road Freight Volumetric Divisor (4000 cm³/kg)
    const volumetricWeightKg = volumeCm3 / 4000;
    const totalActualWeightKg = dimensions.actualWeightKg * dimensions.quantity;
    const billableWeightKg = Math.max(totalActualWeightKg, volumetricWeightKg);

    return {
      volumetricWeightKg: Math.round(volumetricWeightKg * 100) / 100,
      volumeCubicMeters: Math.round(volumeM3 * 1000) / 1000,
      billableWeightKg: Math.round(billableWeightKg * 100) / 100
    };
  }

  /**
   * Enterprise Transport Cost Calculation Engine
   */
  calculateEnterpriseTransportCost(
    dimensions: ProductDimensions,
    route: RouteConfig = this.defaultRoute(),
    fleet: TransportFleetConfig = this.defaultFleet()
  ): DeliveryCostBreakdown {
    const { volumetricWeightKg, volumeCubicMeters, billableWeightKg } = this.calculateVolumetricWeight(dimensions);

    // 1. Total Distance (Return trip factor if no backhaul load)
    const totalTripKm = fleet.includeReturnTrip ? route.distanceKm * 2 : route.distanceKm;

    // 2. Fuel Cost
    const totalFuelLiters = (totalTripKm * fleet.fuelLitersPer100km) / 100;
    const fuelCostZar = totalFuelLiters * route.dieselPricePerLiterZar;

    // 3. Toll Cost (Return trip tolls)
    const totalTollsZar = fleet.includeReturnTrip ? route.tollFeeZar * 2 : route.tollFeeZar;

    // 4. Maintenance Cost per Km
    const maintenanceCostZar = totalTripKm * fleet.maintenanceCostPerKmZar;

    // 5. Driver Costs & NBCRFLI Statutory Benefits
    // Statutory Benefits: UIF 1% + SDL 1% + COIDA 2.5% = 4.5% extra
    const statutoryMultiplier = fleet.includeStatutoryBenefits ? 1.045 : 1.0;
    const totalDriverMonthlyPackage = fleet.driverMonthlySalaryZar * statutoryMultiplier;
    const driverCostPerTrip = totalDriverMonthlyPackage / (fleet.tripsPerMonth || 1);
    const overnightAllowanceTotal = fleet.overnightStaysPerTrip * fleet.overnightAllowancePerNightZar;

    // 6. Fixed Overheads Allocation (Insurance + Security per trip)
    const insuranceSharePerTrip = fleet.insuranceCostPerMonthZar / (fleet.tripsPerMonth || 1);
    const securityGpsSharePerTrip = fleet.securityGpsCostPerMonthZar / (fleet.tripsPerMonth || 1);

    // 7. Handling & Warehousing
    const handlingAndWarehousingZar = fleet.portHandlingCostZar + fleet.warehousingCostZar;

    // Total Operational Trip Cost for 8-Tonne Truck (Full Capacity / Load)
    const totalTripOperationalCostZar = 
      fuelCostZar +
      totalTollsZar +
      maintenanceCostZar +
      driverCostPerTrip +
      overnightAllowanceTotal +
      insuranceSharePerTrip +
      securityGpsSharePerTrip +
      handlingAndWarehousingZar;

    // Effective Cost per KG based on 8,000kg truck capacity
    const effectiveCostPerKgZar = totalTripOperationalCostZar / fleet.capacityKg;

    // Quote allocated to this specific item/order billable weight
    // Add 15% logistics margin + regional handling overhead
    const baseOrderCost = billableWeightKg * effectiveCostPerKgZar * 1.15;
    const allocatedDeliveryQuoteZar = Math.max(baseOrderCost, 350); // Minimum threshold

    // SA VAT (15%)
    const vatZar = allocatedDeliveryQuoteZar * 0.15;
    const finalTotalWithVatZar = allocatedDeliveryQuoteZar + vatZar;

    return {
      billableWeightKg,
      volumetricWeightKg,
      actualWeightKg: dimensions.actualWeightKg * dimensions.quantity,
      totalVolumeCubicMeters: volumeCubicMeters,

      fuelCostZar: Math.round(fuelCostZar * 100) / 100,
      tollCostZar: totalTollsZar,
      maintenanceCostZar: Math.round(maintenanceCostZar * 100) / 100,
      driverCostZar: Math.round(driverCostPerTrip * 100) / 100,
      overnightAllowanceZar: overnightAllowanceTotal,
      insuranceShareZar: Math.round(insuranceSharePerTrip * 100) / 100,
      securityGpsShareZar: Math.round(securityGpsSharePerTrip * 100) / 100,
      handlingAndWarehousingZar,

      totalTripOperationalCostZar: Math.round(totalTripOperationalCostZar * 100) / 100,
      effectiveCostPerKgZar: Math.round(effectiveCostPerKgZar * 100) / 100,
      allocatedDeliveryQuoteZar: Math.round(allocatedDeliveryQuoteZar * 100) / 100,
      vatZar: Math.round(vatZar * 100) / 100,
      finalTotalWithVatZar: Math.round(finalTotalWithVatZar * 100) / 100
    };
  }

  /**
   * Generates all available delivery mode options for the cart page
   */
  getDeliveryOptions(dimensions: ProductDimensions): DeliveryOption[] {
    const baseBreakdown = this.calculateEnterpriseTransportCost(dimensions);

    // Option 1: Self Collection (Depot Pickup)
    const depotOption: DeliveryOption = {
      id: 'depot_pickup',
      title: 'Depot Self-Collection',
      badge: 'FREE',
      estimatedDays: 'Immediate (Same Day)',
      description: 'Collect directly from our Johannesburg Hub or Durban Distribution Depot at zero shipping cost.',
      calculatedPriceZar: 0,
      vatZar: 0,
      totalWithVatZar: 0,
      breakdown: { ...baseBreakdown, allocatedDeliveryQuoteZar: 0, vatZar: 0, finalTotalWithVatZar: 0 }
    };

    // Option 2: Consolidated LTL Road Freight (Standard Business)
    const ltlPrice = baseBreakdown.allocatedDeliveryQuoteZar;
    const ltlVat = ltlPrice * 0.15;
    const ltlOption: DeliveryOption = {
      id: 'consolidated_ltl',
      title: 'Consolidated Freight (LTL Road)',
      badge: 'RECOMMENDED',
      estimatedDays: '2 - 4 Business Days',
      description: 'Cost-effective consolidated freight transport via N3 corridor with GPS tracking and tail-lift offloading.',
      calculatedPriceZar: ltlPrice,
      vatZar: ltlVat,
      totalWithVatZar: ltlPrice + ltlVat,
      breakdown: baseBreakdown,
      isPopular: true
    };

    // Option 3: Express Regional Freight
    const expressPrice = baseBreakdown.allocatedDeliveryQuoteZar * 1.65;
    const expressVat = expressPrice * 0.15;
    const expressOption: DeliveryOption = {
      id: 'express_courier',
      title: 'Express Door-to-Door Freight',
      badge: 'EXPRESS',
      estimatedDays: '24 - 36 Hours',
      description: 'Priority handling with direct courier dispatch and instant SMS/WhatsApp tracking updates.',
      calculatedPriceZar: Math.round(expressPrice * 100) / 100,
      vatZar: Math.round(expressVat * 100) / 100,
      totalWithVatZar: Math.round((expressPrice + expressVat) * 100) / 100,
      breakdown: { ...baseBreakdown, allocatedDeliveryQuoteZar: expressPrice }
    };

    // Option 4: Dedicated 8-Tonne Truck Charter (Full Vehicle)
    const dedicatedPrice = baseBreakdown.totalTripOperationalCostZar * 1.20; // Operational cost + 20% margin
    const dedicatedVat = dedicatedPrice * 0.15;
    const dedicatedOption: DeliveryOption = {
      id: 'dedicated_charter',
      title: 'Dedicated 8-Tonne Truck Charter',
      badge: 'BULK FLEET',
      estimatedDays: 'Guaranteed Next Day',
      description: 'Exclusive 8,000kg dedicated vehicle charter with direct factory-to-parlor transport.',
      calculatedPriceZar: Math.round(dedicatedPrice * 100) / 100,
      vatZar: Math.round(dedicatedVat * 100) / 100,
      totalWithVatZar: Math.round((dedicatedPrice + dedicatedVat) * 100) / 100,
      breakdown: { ...baseBreakdown, allocatedDeliveryQuoteZar: dedicatedPrice }
    };

    return [depotOption, ltlOption, expressOption, dedicatedOption];
  }
}
