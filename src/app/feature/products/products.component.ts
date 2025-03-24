import { Component, computed, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/interfaces/product.interface';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogueComponent } from '../../shared/components/confirmation-dialogue/confirmation-dialogue.component';
import { AlertService } from '../../core/services/alert.service';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  cart = signal<CartItem[]>([]);
  loading = signal<boolean>(true);
  wallet = 100000;

  currentPage = signal<number>(1);
  pageSize = 10;

  paginatedProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.products().slice(startIndex, startIndex + this.pageSize);
  });

  totalPages = computed(() =>
    Math.ceil(this.products().length / this.pageSize)
  );

  totalDeduction = computed(() =>
    this.cart().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  constructor(
    private productService: ProductsService,
    private dialog: MatDialog,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.loading.set(false);
        this.products.set(data.products);
      },
      error: (err: any) => {
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  addToCart(product: Product): void {
    this.cart.update((cartItems) => {
      const index = cartItems.findIndex(
        (item) => item.product.id === product.id
      );
      if (index !== -1) {
        return cartItems.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...cartItems, { product, quantity: 1 }];
      }
    });
  }

  increaseQuantity(item: CartItem): void {
    this.cart.update((cartItems) =>
      cartItems.map((cartItem) =>
        cartItem.product.id === item.product.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  }

  decreaseQuantity(item: CartItem): void {
    this.cart.update((cartItems) =>
      cartItems
        .map((cartItem) =>
          cartItem.product.id === item.product.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  }

  updateQuantity(item: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = Number(inputElement.value);

    if (!isNaN(newValue) && newValue > 0) {
      item.quantity = newValue;
    }
  }
  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  deductAmount(): void {
    const total = this.totalDeduction();
    if (total > this.wallet) {
      this.alertService.error(`Insufficient funds in wallet.`);
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      width: '350px',
      data: total,
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.wallet = this.wallet - total;
        this.cart.set([]);
        this.alertService.success(
          `Deduction successful! New wallet balance is KES ${this.wallet}.`
        );
        this.router.navigate(['/app/products']);
      }
    });
  }
}
