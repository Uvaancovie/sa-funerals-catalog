import { Injectable, signal } from '@angular/core';

export interface EnquiryRecord {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    productName: string;
    variant: string;
    quantity: number;
  }[];
  status: 'new' | 'contacted' | 'closed';
}

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private readonly storageKey = 'safs_enquiries';

  readonly enquiries = signal<EnquiryRecord[]>(this.loadFromStorage());

  private loadFromStorage(): EnquiryRecord[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(records: EnquiryRecord[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(records));
    this.enquiries.set(records);
  }

  addEnquiry(customer: { name: string; email: string; phone: string }, items: { productName: string; variant: string; quantity: number }[]) {
    const record: EnquiryRecord = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      customer,
      items,
      status: 'new'
    };
    const current = this.loadFromStorage();
    current.unshift(record);
    this.saveToStorage(current);
  }

  updateStatus(id: string, status: 'new' | 'contacted' | 'closed') {
    const current = this.loadFromStorage();
    const idx = current.findIndex(e => e.id === id);
    if (idx !== -1) {
      current[idx].status = status;
      this.saveToStorage(current);
    }
  }

  deleteEnquiry(id: string) {
    const current = this.loadFromStorage().filter(e => e.id !== id);
    this.saveToStorage(current);
  }

  refresh() {
    this.enquiries.set(this.loadFromStorage());
  }
}
