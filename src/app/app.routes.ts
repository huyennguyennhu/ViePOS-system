import { Routes } from '@angular/router';
import { LandingPage } from './core/pages/landing-page/landing-page';
import { autoRedirectGuard } from './core/guards/auto-redirect.guard';

export const routes: Routes = [
  { path: 'landing', component: LandingPage, canActivate: [autoRedirectGuard] },
  { path: 'user', loadChildren: () => import('./user/user-module').then(m => m.UserModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule) },
  { path: '', redirectTo: 'landing', pathMatch: 'full' }
];
