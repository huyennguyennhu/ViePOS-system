import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-page.html',
  styleUrl: './order-page.css',
})
export class OrderPage {
  currentUser = { name: 'Nhân viên A' };
}
