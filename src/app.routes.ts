import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { CatalogComponent } from './pages/catalog.component';
import { AboutComponent } from './pages/about.component';
import { ContactComponent } from './pages/contact.component';
import { CartComponent } from './pages/cart.component';
import { AuthService } from './services/auth.service';

const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  if (!authService.isAdmin()) {
    return router.parseUrl('/');
  }

  return true;
};

const customerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  return true;
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent) },
  { path: 'admin-signin', loadComponent: () => import('./pages/admin/admin-signin.component').then(m => m.AdminSignInComponent) },
  { path: 'wishlist', canActivate: [customerGuard], loadComponent: () => import('./pages/wishlist.component').then(m => m.WishlistComponent) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'admin/products', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin-products.component').then(m => m.AdminProductsComponent) },
  { path: 'admin/audit-logs', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin-audit-logs.component').then(m => m.AdminAuditLogsComponent) },
  { path: 'admin/wishlist', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin-wishlist.component').then(m => m.AdminWishlistComponent) },
  { path: '**', redirectTo: '' }
];
