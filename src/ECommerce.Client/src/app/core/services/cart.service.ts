import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSignal = signal<CartItem[]>(
    JSON.parse(localStorage.getItem('cart') ?? '[]')
  );

  items = computed(() => this.itemsSignal());
  total = computed(() =>
    this.itemsSignal().reduce((s, i) => s + i.price * i.quantity, 0)
  );
  count = computed(() =>
    this.itemsSignal().reduce((s, i) => s + i.quantity, 0)
  );

  private persist() {
    localStorage.setItem('cart', JSON.stringify(this.itemsSignal()));
  }

  add(productId: number, name: string, price: number, quantity: number, imageUrl?: string) {
    const items = [...this.itemsSignal()];
    const idx = items.findIndex((i) => i.productId === productId);
    if (idx >= 0) items[idx].quantity += quantity;
    else items.push({ productId, name, price, quantity, imageUrl });
    this.itemsSignal.set(items);
    this.persist();
  }

  remove(productId: number) {
    this.itemsSignal.set(this.itemsSignal().filter((i) => i.productId !== productId));
    this.persist();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    const items = this.itemsSignal().map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    this.itemsSignal.set(items);
    this.persist();
  }

  clear() {
    this.itemsSignal.set([]);
    this.persist();
  }
}
