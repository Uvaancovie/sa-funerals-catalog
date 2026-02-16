import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  category: 'casket' | 'accessory' | 'child';
  image: string;
  variants: string[];
  description?: string;
  price?: number; // Simulated price
}

export interface CartItem {
  product: Product;
  variant: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  // Data derived from the PDF content
  private readonly _products: Product[] = [
    {
      "id": "4-corner-figurine-casket",
      "name": "4 Corner Figurine Casket",
      "category": "casket",
      "image": "assets/4-corner-figurine-casket/1-cherry-teak-kiaat.png",
      "variants": ["Cherry", "Teak", "Kiaat"],
      "price": 9500
    },
    {
      "id": "4-corner-woodturning-casket",
      "name": "4 Corner Woodturning Casket",
      "category": "casket",
      "image": "assets/4-corner-woodturning-casket/1-cherry-teak-kiaat.png",
      "variants": ["Cherry", "Teak", "Kiaat"],
      "price": 9200
    },
    {
      "id": "4-ft-casket",
      "name": "4 Ft Casket",
      "category": "child",
      "image": "assets/4-ft-casket/1-minniemouse-batman-spiderman.png",
      "variants": ["Minniemouse", "Batman", "Spiderman"],
      "price": 4500
    },
    {
      "id": "5-ft-casket",
      "name": "5 Ft Casket",
      "category": "child",
      "image": "assets/5-ft-casket/1-walnut.png",
      "variants": ["Walnut"],
      "price": 5000
    },
    {
      "id": "alligator-casket",
      "name": "Alligator Casket",
      "category": "casket",
      "image": "assets/alligator-casket/1-dark-cherry.png",
      "variants": ["Dark Cherry"],
      "price": 12000
    },
    {
      "id": "balmoral-casket",
      "name": "Balmoral Casket",
      "category": "casket",
      "image": "assets/balmoral-casket/1-cherry.png",
      "variants": ["Cherry"],
      "price": 6500
    },
    {
      "id": "body-box",
      "name": "Body Box",
      "category": "accessory",
      "image": "assets/body-box/1.png",
      "variants": ["Standard"],
      "price": 1500
    },
    {
      "id": "casket-racking-system",
      "name": "Casket Racking System",
      "category": "accessory",
      "image": "assets/casket-racking-system/1.png",
      "variants": ["Standard"],
      "price": 8500
    },
    {
      "id": "church-trolley",
      "name": "Church Trolley",
      "category": "accessory",
      "image": "assets/church-trolley/1.png",
      "variants": ["Standard"],
      "price": 3500
    },
    {
      "id": "coffin-stand",
      "name": "Coffin Stand",
      "category": "accessory",
      "image": "assets/coffin-stand/1.png",
      "variants": ["Standard"],
      "price": 1200
    },
    {
      "id": "emperor-casket",
      "name": "Emperor Casket",
      "category": "casket",
      "image": "assets/emperor-casket/1-dark-cherry.png",
      "variants": ["Dark Cherry"],
      "price": 18000
    },
    {
      "id": "fibre-glass-wash-table",
      "name": "Fibre Glass Wash Table",
      "category": "accessory",
      "image": "assets/fibre-glass-wash-table/1.png",
      "variants": ["Standard"],
      "price": 4500
    },
    {
      "id": "grass-matts",
      "name": "Grass Matts",
      "category": "accessory",
      "image": "assets/grass-matts/1.png",
      "variants": ["Standard"],
      "price": 800
    },
    {
      "id": "harvard-casket",
      "name": "Harvard Casket",
      "category": "casket",
      "image": "assets/harvard-casket/1-white-ash.png",
      "variants": ["White", "Ash"],
      "price": 13500
    },
    {
      "id": "high-stand",
      "name": "High Stand",
      "category": "accessory",
      "image": "assets/high-stand/1.png",
      "variants": ["Standard"],
      "price": 1800
    },
    {
      "id": "lapita-casket",
      "name": "Lapita Casket",
      "category": "casket",
      "image": "assets/lapita-casket/1-cherry.png",
      "variants": ["Cherry"],
      "price": 7200
    },
    {
      "id": "lincoln-dome-casket",
      "name": "Lincoln Dome Casket",
      "category": "casket",
      "image": "assets/lincoln-dome-casket/1-white.png",
      "variants": ["White"],
      "price": 11000
    },
    {
      "id": "lowering-device",
      "name": "Lowering Device",
      "category": "accessory",
      "image": "assets/lowering-device/1.png",
      "variants": ["Standard"],
      "price": 12000
    },
    {
      "id": "maroon-tent",
      "name": "Maroon Tent",
      "category": "accessory",
      "image": "assets/maroon-tent/1.png",
      "variants": ["Standard"],
      "price": 3500
    },
    {
      "id": "nguni-casket",
      "name": "Nguni Casket",
      "category": "casket",
      "image": "assets/nguni-casket/1-black-brown-white.png",
      "variants": ["Black", "Brown", "White"],
      "price": 14000
    },
    {
      "id": "ostrich-casket",
      "name": "Ostrich Casket",
      "category": "casket",
      "image": "assets/ostrich-casket/1-brown.png",
      "variants": ["Brown"],
      "price": 12500
    },
    {
      "id": "oxford-casket",
      "name": "Oxford Casket",
      "category": "casket",
      "image": "assets/oxford-casket/1-cherry.png",
      "variants": ["Cherry"],
      "price": 8500
    },
    {
      "id": "porthole-casket",
      "name": "Porthole Casket",
      "category": "casket",
      "image": "assets/porthole-casket/1-walnut-cherry-kiaat.png",
      "variants": ["Walnut", "Cherry", "Kiaat"],
      "price": 6500
    },
    {
      "id": "princeton-dome-casket",
      "name": "Princeton Dome Casket",
      "category": "casket",
      "image": "assets/princeton-dome-casket/1-cherry-white-walnut-kiaat.png",
      "variants": ["Cherry", "White", "Walnut", "Kiaat"],
      "price": 8500
    },
    {
      "id": "raised-halfview-casket",
      "name": "Raised Halfview Casket",
      "category": "casket",
      "image": "assets/raised-halfview-casket/1-cherry-white-walnut-kiaat.png",
      "variants": ["Cherry", "White", "Walnut", "Kiaat"],
      "price": 6800
    },
    {
      "id": "royal-dome-casket",
      "name": "Royal Dome Casket",
      "category": "casket",
      "image": "assets/royal-dome-casket/1-kiaat-cherry-hemlock.png",
      "variants": ["Kiaat", "Cherry", "Hemlock"],
      "price": 10500
    },
    {
      "id": "senator-casket",
      "name": "Senator Casket",
      "category": "casket",
      "image": "assets/senator-casket/1-dark-cherry-green.png",
      "variants": ["Dark Cherry", "Green"],
      "price": 15000
    },
    {
      "id": "south-african-stretcher",
      "name": "South African Stretcher",
      "category": "accessory",
      "image": "assets/south-african-stretcher/1.png",
      "variants": ["Standard"],
      "price": 2800
    },
    {
      "id": "standard-dome-casket",
      "name": "Standard Dome Casket",
      "category": "casket",
      "image": "assets/standard-dome-casket/1-hemlock-cherry-kiaat.png",
      "variants": ["Hemlock", "Cherry", "Kiaat"],
      "price": 8200
    }
  ];

  // Signals
  readonly products = signal<Product[]>(this._products);
  readonly cart = signal<CartItem[]>([]);

  // Toast notification
  readonly toastItem = signal<CartItem | null>(null);
  private toastTimeout: any = null;

  // Computed
  readonly cartCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0));
  readonly cartTotal = computed(() => this.cart().reduce((acc, item) => acc + ((item.product.price || 0) * item.quantity), 0));

  addToCart(product: Product, variant: string) {
    let addedItem: CartItem | null = null;
    this.cart.update(items => {
      const existing = items.find(i => i.product.id === product.id && i.variant === variant);
      if (existing) {
        const updated = items.map(i => i.product.id === product.id && i.variant === variant
          ? { ...i, quantity: i.quantity + 1 }
          : i);
        addedItem = updated.find(i => i.product.id === product.id && i.variant === variant) || null;
        return updated;
      }
      addedItem = { product, variant, quantity: 1 };
      return [...items, addedItem];
    });

    // Show toast
    if (addedItem) {
      this.showToast(addedItem);
    }
  }

  private showToast(item: CartItem) {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastItem.set({ ...item });
    this.toastTimeout = setTimeout(() => {
      this.toastItem.set(null);
    }, 4000);
  }

  dismissToast() {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastItem.set(null);
  }

  removeFromCart(productId: string, variant: string) {
    this.cart.update(items => items.filter(i => !(i.product.id === productId && i.variant === variant)));
  }

  updateQuantity(productId: string, variant: string, delta: number) {
    this.cart.update(items => {
      return items.map(item => {
        if (item.product.id === productId && item.variant === variant) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  }

  clearCart() {
    this.cart.set([]);
  }
}
