import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog.component';
import { ProductDetailsComponent } from './pages/product-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/catalog', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: '**', redirectTo: '/catalog' }
];
