import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog.component';
import { ProductDetailsComponent } from './pages/product-details.component';
import { CartComponent } from './pages/cart.component';
import { AdminLoginComponent } from './pages/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { AboutPageComponent } from './pages/about-page.component';
import { ContactPageComponent } from './pages/contact-page.component';
import { LandingPageComponent } from './pages/landing-page.component';
import { ServicesPageComponent } from './pages/services-page.component';
import { ExportEnquiryPageComponent } from './pages/export-enquiry-page.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'services', component: ServicesPageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'export', component: ExportEnquiryPageComponent },
  { path: 'admin', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '/catalog' }
];
