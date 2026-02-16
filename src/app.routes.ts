import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { CatalogComponent } from './pages/catalog.component';
import { AboutComponent } from './pages/about.component';
import { ContactComponent } from './pages/contact.component';
import { CartComponent } from './pages/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' }
];
