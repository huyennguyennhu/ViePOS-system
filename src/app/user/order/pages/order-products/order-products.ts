import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { ProductService, Product } from '../../../../core/services/product.service';
import { OrderService, OrderItem } from '../../../../core/services/order.service';

@Component({
  selector: 'app-order-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-products.html',
  styleUrl: './order-products.css',
})
export class OrderProductsComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryId: string = '';
  billItems: OrderItem[] = [];

  ngOnInit() {
    this.loadData();
    this.orderService.billItems$.subscribe(items => {
      this.billItems = items;
    });
  }

  loadData() {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
      if (this.categories.length > 0 && !this.selectedCategoryId) {
        this.selectedCategoryId = this.categories[0].category_id;
      }
    });

    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  get selectedCategoryName() {
    return this.categories.find(c => c.category_id === this.selectedCategoryId)?.category_name || '';
  }

  get filteredProducts() {
    return this.products.filter(p => p.category_id === this.selectedCategoryId);
  }

  selectCategory(id: string) {
    this.selectedCategoryId = id;
  }

  addToBill(product: Product) {
    this.orderService.addToBill(product);
  }

  updateQuantity(productId: string, delta: number) {
    this.orderService.updateQuantity(productId, delta);
  }

  get totalAmount() {
    return this.orderService.totalAmount;
  }
}
