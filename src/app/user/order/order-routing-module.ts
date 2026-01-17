import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderPage } from './pages/order-page/order-page';
import { OrderProductsComponent } from './pages/order-products/order-products';
import { OrderTablesComponent } from './pages/order-tables/order-tables';

const routes: Routes = [
  { 
    path: '', 
    component: OrderPage,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: OrderProductsComponent },
      { path: 'tables', component: OrderTablesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
