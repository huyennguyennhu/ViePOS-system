import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private billItemsSubject = new BehaviorSubject<OrderItem[]>([]);
  billItems$ = this.billItemsSubject.asObservable();

  get billItems() {
    return this.billItemsSubject.value;
  }

  addToBill(product: any) {
    const currentItems = [...this.billItems];
    const existing = currentItems.find(item => item.product_id === product.product_id);
    if (existing) {
      existing.quantity += 1;
    } else {
      currentItems.push({
        product_id: product.product_id,
        product_name: product.product_name,
        price: product.price,
        quantity: 1
      });
    }
    this.billItemsSubject.next(currentItems);
  }

  removeFromBill(productId: string) {
    const updatedItems = this.billItems.filter(item => item.product_id !== productId);
    this.billItemsSubject.next(updatedItems);
  }

  updateQuantity(productId: string, delta: number) {
    const currentItems = [...this.billItems];
    const item = currentItems.find(i => i.product_id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.billItemsSubject.next(currentItems.filter(i => i.product_id !== productId));
      } else {
        this.billItemsSubject.next(currentItems);
      }
    }
  }

  get totalAmount() {
    return this.billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}
